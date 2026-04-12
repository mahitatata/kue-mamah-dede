<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'CakeTime Admin',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);

        User::updateOrCreate([
            'email' => 'customer@caketime.test',
        ], [
            'name' => 'CakeTime Customer',
            'password' => Hash::make('customer12345'),
            'role' => 'customer',
        ]);

        $this->call(ProductSeeder::class);
    }
}
