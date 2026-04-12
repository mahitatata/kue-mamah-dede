<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CartController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($this->cartResponse(
            $request->user()->cartItems()->with('product')->latest()->get(),
        ));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($validated['quantity'] > $product->max_order) {
            return response()->json([
                'message' => 'Jumlah melebihi batas maksimal pemesanan.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cartItem = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        $cartItem->quantity = min(
            $product->max_order,
            ($cartItem->exists ? $cartItem->quantity : 0) + $validated['quantity'],
        );
        $cartItem->save();

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang.',
            'cart' => $this->cartResponse(
                $request->user()->cartItems()->with('product')->latest()->get(),
            ),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        abort_unless($cartItem->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        if ($validated['quantity'] > $cartItem->product->max_order) {
            return response()->json([
                'message' => 'Jumlah melebihi batas maksimal pemesanan.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Keranjang berhasil diperbarui.',
            'cart' => $this->cartResponse(
                $request->user()->cartItems()->with('product')->latest()->get(),
            ),
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        abort_unless($cartItem->user_id === $request->user()->id, 403);

        $cartItem->delete();

        return response()->json([
            'message' => 'Produk dihapus dari keranjang.',
            'cart' => $this->cartResponse(
                $request->user()->cartItems()->with('product')->latest()->get(),
            ),
        ]);
    }

    private function cartResponse($items): array
    {
        $serializedItems = $items->map(function (CartItem $item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'line_total' => $item->product->price * $item->quantity,
                'product' => $item->product,
            ];
        })->values();

        return [
            'items' => $serializedItems,
            'count' => $serializedItems->sum('quantity'),
            'subtotal' => $serializedItems->sum('line_total'),
        ];
    }
}
