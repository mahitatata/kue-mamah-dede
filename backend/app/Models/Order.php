<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'order_number',
    'customer_name',
    'customer_email',
    'phone',
    'address',
    'subtotal',
    'shipping_cost',
    'total_amount',
    'payment_method',
    'payment_status',
    'order_status',
    'midtrans_transaction_id',
    'midtrans_status',
    'midtrans_payment_type',
    'midtrans_redirect_url',
    'midtrans_snap_token',
    'paid_at',
])]
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'subtotal' => 'integer',
            'shipping_cost' => 'integer',
            'total_amount' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentNotifications(): HasMany
    {
        return $this->hasMany(PaymentNotification::class);
    }
}
