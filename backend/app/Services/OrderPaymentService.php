<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PaymentNotification;
use Throwable;

class OrderPaymentService
{
    public function recordNotification(Order $order, array $payload): void
    {
        PaymentNotification::create([
            'order_id' => $order->id,
            'transaction_status' => $payload['transaction_status'] ?? null,
            'payment_type' => $payload['payment_type'] ?? null,
            'payload' => $payload,
        ]);
    }

    public function syncFromMidtrans(Order $order, MidtransService $midtrans): Order
    {
        try {
            $payload = json_decode(json_encode($midtrans->getStatus($order)), true);
        } catch (Throwable) {
            return $order->fresh('items.product');
        }

        $this->syncWithPayload($order, $payload);

        return $order->fresh('items.product');
    }

    public function syncWithPayload(Order $order, array $payload): Order
    {
        $this->recordNotification($order, $payload);
        $this->applyMidtransPayload($order, $payload);

        return $order->fresh('items.product');
    }

    public function applyMidtransPayload(Order $order, array $payload): void
    {
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        $paymentStatus = $order->payment_status;
        $orderStatus = $order->order_status;

        if (in_array($transactionStatus, ['capture', 'settlement'], true)) {
            $paymentStatus = $fraudStatus === 'challenge' ? 'pending' : 'paid';
            $orderStatus = 'processing';
        } elseif ($transactionStatus === 'pending') {
            $paymentStatus = 'pending';
            $orderStatus = 'processing';
        } elseif ($transactionStatus === 'expire') {
            $paymentStatus = 'expired';
            $orderStatus = 'cancelled';
        } elseif ($transactionStatus === 'cancel') {
            $paymentStatus = 'cancelled';
            $orderStatus = 'cancelled';
        } elseif ($transactionStatus === 'deny') {
            $paymentStatus = 'failed';
            $orderStatus = 'cancelled';
        }

        $order->update([
            'payment_status' => $paymentStatus,
            'order_status' => $orderStatus,
            'midtrans_transaction_id' => $payload['transaction_id'] ?? $order->midtrans_transaction_id,
            'midtrans_status' => $transactionStatus,
            'midtrans_payment_type' => $payload['payment_type'] ?? $order->midtrans_payment_type,
            'paid_at' => $paymentStatus === 'paid' ? now() : $order->paid_at,
        ]);
    }
}
