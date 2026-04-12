<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function index()
    {
        return Order::query()
            ->with(['user', 'items.product'])
            ->latest()
            ->get();
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => ['required', 'in:processing,completed,cancelled'],
        ]);

        $order->update([
            'order_status' => $validated['order_status'],
        ]);

        if ($validated['order_status'] === 'cancelled' && $order->payment_status === 'pending') {
            $order->update([
                'payment_status' => 'cancelled',
            ]);
        }

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui.',
            'order' => $order->fresh('items.product'),
        ], Response::HTTP_OK);
    }
}
