<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderPaymentService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PaymentPageController extends Controller
{
    public function __construct(
        private readonly MidtransService $midtrans,
        private readonly OrderPaymentService $orderPayment,
    ) {
    }

    public function show(Request $request, string $result): View
    {
        $orderId = $request->query('id');
        $orderNumber = $request->query('order');

        $order = Order::query()
            ->when(
                $orderId && $orderNumber,
                fn ($query) => $query->where('id', $orderId)->where('order_number', $orderNumber),
            )
            ->when(
                $orderId && ! $orderNumber,
                fn ($query) => $query->where('id', $orderId),
            )
            ->when(
                ! $orderId && $orderNumber,
                fn ($query) => $query->where('order_number', $orderNumber),
            )
            ->with('items.product')
            ->first();

        if ($order && $order->payment_method === 'midtrans') {
            $transactionStatus = $request->query('transaction_status');

            if (is_string($transactionStatus) && $transactionStatus !== '') {
                $order = $this->orderPayment->syncWithPayload($order, [
                    'transaction_status' => $transactionStatus,
                    'payment_type' => $request->query('payment_type'),
                    'transaction_id' => $request->query('transaction_id'),
                    'status_code' => $request->query('status_code'),
                    'fraud_status' => $request->query('fraud_status'),
                    'gross_amount' => $request->query('gross_amount'),
                    'order_id' => $request->query('order_id', $order->order_number),
                ]);
            } elseif (in_array($result, ['success', 'pending', 'error'], true)) {
                $order = $this->orderPayment->syncFromMidtrans($order, $this->midtrans);

                if ($this->shouldApplyResultFallback($order, $result)) {
                    $order = $this->orderPayment->syncWithPayload($order, [
                        'transaction_status' => $this->mapResultToMidtransStatus($result),
                        'payment_type' => $order->midtrans_payment_type,
                        'transaction_id' => $order->midtrans_transaction_id,
                        'status_code' => $result === 'success' ? '200' : null,
                        'fraud_status' => null,
                        'gross_amount' => (string) $order->total_amount,
                        'order_id' => $order->order_number,
                    ]);
                }
            }
        }

        return view('payment-result', [
            'order' => $order,
            'result' => $result,
        ]);
    }

    private function shouldApplyResultFallback(Order $order, string $result): bool
    {
        return match ($result) {
            'success' => $order->payment_status !== 'paid',
            'pending' => $order->payment_status === 'pending' && ! $order->midtrans_status,
            'error' => $order->payment_status === 'pending' && ! $order->midtrans_status,
            default => false,
        };
    }

    private function mapResultToMidtransStatus(string $result): string
    {
        return match ($result) {
            'success' => 'settlement',
            'pending' => 'pending',
            'error' => 'deny',
            default => 'pending',
        };
    }
}
