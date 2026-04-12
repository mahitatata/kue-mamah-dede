<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = (string) config('midtrans.server_key');
        Config::$isProduction = (bool) config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createTransaction(Order $order): object
    {
        $items = $order->items
            ->map(fn ($item) => [
                'id' => $item->product_id ?: $item->id,
                'price' => $item->product_price,
                'quantity' => $item->quantity,
                'name' => $item->product_name,
            ])
            ->values()
            ->all();

        if ($order->shipping_cost > 0) {
            $items[] = [
                'id' => 'shipping',
                'price' => $order->shipping_cost,
                'quantity' => 1,
                'name' => 'Biaya Pengiriman',
            ];
        }

        $backendUrl = rtrim((string) config('app.url'), '/');

        return Snap::createTransaction([
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $order->customer_name,
                'email' => $order->customer_email,
                'phone' => $order->phone,
                'billing_address' => [
                    'first_name' => $order->customer_name,
                    'phone' => $order->phone,
                    'address' => $order->address,
                ],
                'shipping_address' => [
                    'first_name' => $order->customer_name,
                    'phone' => $order->phone,
                    'address' => $order->address,
                ],
            ],
            'item_details' => $items,
            'callbacks' => [
                'finish' => $backendUrl.'/payment/success?order='.$order->order_number.'&id='.$order->id,
                'error' => $backendUrl.'/payment/error?order='.$order->order_number.'&id='.$order->id,
                'pending' => $backendUrl.'/payment/pending?order='.$order->order_number.'&id='.$order->id,
            ],
        ]);
    }

    public function getStatus(Order $order): object
    {
        return Transaction::status($order->order_number);
    }

    public function validSignature(array $payload): bool
    {
        $expectedSignature = hash(
            'sha512',
            (string) ($payload['order_id'] ?? '')
            .(string) ($payload['status_code'] ?? '')
            .(string) ($payload['gross_amount'] ?? '')
            .(string) config('midtrans.server_key'),
        );

        return hash_equals($expectedSignature, (string) ($payload['signature_key'] ?? ''));
    }
}
