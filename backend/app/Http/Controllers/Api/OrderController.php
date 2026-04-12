<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\MidtransService;
use App\Services\OrderPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly MidtransService $midtrans,
        private readonly OrderPaymentService $orderPayment,
    )
    {
    }

    public function index(Request $request)
    {
        $filter = $request->string('status')->toString();

        return response()->json(
            $request->user()
                ->orders()
                ->with('items.product')
                ->when(
                    $filter && $filter !== 'all',
                    fn ($query) => $query->where('order_status', $filter),
                )
                ->latest()
                ->get()
        );
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        return response()->json($order->load('items.product'));
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:cod,midtrans'],
        ]);

        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Keranjang masih kosong.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $shippingCost = 15000;
        $subtotal = $cartItems->sum(fn (CartItem $item) => $item->product->price * $item->quantity);
        $totalAmount = $subtotal + $shippingCost;

        $order = DB::transaction(function () use ($user, $cartItems, $validated, $subtotal, $shippingCost, $totalAmount) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'CKT-'.now()->format('YmdHis').'-'.$user->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $user->email,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'order_status' => 'processing',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'line_total' => $item->product->price * $item->quantity,
                ]);
            }

            $user->cartItems()->delete();

            return $order->load('items.product');
        });

        if ($order->payment_method === 'midtrans') {
            $transaction = $this->midtrans->createTransaction($order);

            $order->update([
                'midtrans_snap_token' => $transaction->token ?? null,
                'midtrans_redirect_url' => $transaction->redirect_url ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Pesanan berhasil dibuat.',
            'order' => $order->fresh('items.product'),
            'payment' => [
                'snap_token' => $order->fresh()->midtrans_snap_token,
                'redirect_url' => $order->fresh()->midtrans_redirect_url,
                'client_key' => config('midtrans.client_key'),
            ],
        ], Response::HTTP_CREATED);
    }

    public function refreshPaymentStatus(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        if ($order->payment_method !== 'midtrans') {
            return response()->json($order->load('items.product'));
        }

        return response()->json(
            $this->orderPayment->syncFromMidtrans($order, $this->midtrans),
        );
    }

    public function syncClientResult(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        if ($order->payment_method !== 'midtrans') {
            return response()->json($order->load('items.product'));
        }

        $validated = $request->validate([
            'transaction_status' => ['required', 'string', 'max:50'],
            'payment_type' => ['nullable', 'string', 'max:50'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'status_code' => ['nullable', 'string', 'max:10'],
            'fraud_status' => ['nullable', 'string', 'max:50'],
            'gross_amount' => ['nullable', 'string', 'max:50'],
            'order_id' => ['nullable', 'string', 'max:255'],
        ]);

        $payload = [
            'transaction_status' => $validated['transaction_status'],
            'payment_type' => $validated['payment_type'] ?? null,
            'transaction_id' => $validated['transaction_id'] ?? null,
            'status_code' => $validated['status_code'] ?? null,
            'fraud_status' => $validated['fraud_status'] ?? null,
            'gross_amount' => $validated['gross_amount'] ?? (string) $order->total_amount,
            'order_id' => $validated['order_id'] ?? $order->order_number,
        ];

        return response()->json(
            $this->orderPayment->syncWithPayload($order, $payload),
        );
    }

    public function handleNotification(Request $request)
    {
        $payload = $request->all();

        if (! $this->midtrans->validSignature($payload)) {
            return response()->json([
                'message' => 'Signature Midtrans tidak valid.',
            ], Response::HTTP_FORBIDDEN);
        }

        $order = Order::where('order_number', $payload['order_id'] ?? '')->firstOrFail();

        $this->orderPayment->syncWithPayload($order, $payload);

        return response()->json(['message' => 'OK']);
    }
}
