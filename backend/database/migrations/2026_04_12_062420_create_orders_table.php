<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('phone');
            $table->text('address');
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('shipping_cost')->default(15000);
            $table->unsignedInteger('total_amount');
            $table->enum('payment_method', ['cod', 'midtrans']);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'expired', 'cancelled'])->default('pending');
            $table->enum('order_status', ['processing', 'completed', 'cancelled'])->default('processing');
            $table->string('midtrans_transaction_id')->nullable();
            $table->text('midtrans_redirect_url')->nullable();
            $table->text('midtrans_snap_token')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
