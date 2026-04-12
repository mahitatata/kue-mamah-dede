<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Strawberry Shortcake',
                'slug' => 'portion-cake',
                'category' => 'Portion Cake',
                'description' => 'Kue lembut dengan krim halus dan stroberi segar, menghadirkan perpaduan rasa manis dan segar yang sempurna.',
                'price' => 41000,
                'preorder_estimate' => '1-2 hari',
                'max_order' => 4,
                'source_image' => base_path('../src/assets/strawberry-shortcake.jpeg'),
                'image_name' => 'portion-cake.jpeg',
            ],
            [
                'name' => 'Cupcake',
                'slug' => 'cupcake',
                'category' => 'Cupcake',
                'description' => 'Kue mini lembut dengan topping cantik dan rasa lezat, cocok untuk segala suasana.',
                'price' => 35000,
                'preorder_estimate' => '1-2 hari',
                'max_order' => 4,
                'source_image' => base_path('../src/assets/cupcake2.jpeg'),
                'image_name' => 'cupcake.jpeg',
            ],
            [
                'name' => 'Whole Cake',
                'slug' => 'whole-cake',
                'category' => 'Whole Cake',
                'description' => 'Kue utuh dengan rasa lezat dan tampilan menarik, cocok untuk momen spesial.',
                'price' => 250000,
                'preorder_estimate' => '4-5 hari',
                'max_order' => 2,
                'source_image' => base_path('../src/assets/whole-cake2.jpeg'),
                'image_name' => 'whole-cake.jpeg',
            ],
            [
                'name' => 'Strawberry Pancake',
                'slug' => 'pancake',
                'category' => 'Strawberry Pancake',
                'description' => 'Pancake lembut dengan topping stroberi segar dan rasa manis yang menyegarkan.',
                'price' => 25000,
                'preorder_estimate' => '1-2 hari',
                'max_order' => 10,
                'source_image' => base_path('../src/assets/pancake.jpeg'),
                'image_name' => 'pancake.jpeg',
            ],
            [
                'name' => 'Tiramisu Cake',
                'slug' => 'tiramisu-cake',
                'category' => 'Tiramisu Cake',
                'description' => 'Kue lembut dengan rasa kopi dan krim yang creamy serta cita rasa khas.',
                'price' => 50000,
                'preorder_estimate' => '3-4 hari',
                'max_order' => 10,
                'source_image' => base_path('../src/assets/tiramisu-cake.jpeg'),
                'image_name' => 'tiramisu-cake.jpeg',
            ],
            [
                'name' => 'Cheesecake',
                'slug' => 'cheesecake',
                'category' => 'Cheesecake',
                'description' => 'Kue lembut dengan rasa keju yang kaya dan tekstur halus.',
                'price' => 270000,
                'preorder_estimate' => '3-4 hari',
                'max_order' => 5,
                'source_image' => base_path('../src/assets/cheesecake2.jpeg'),
                'image_name' => 'cheesecake.jpeg',
            ],
        ];

        foreach ($products as $product) {
            $imagePath = null;

            if (File::exists($product['source_image'])) {
                $storedPath = 'products/'.$product['image_name'];
                Storage::disk('public')->put($storedPath, File::get($product['source_image']));
                $imagePath = $storedPath;
            }

            Product::updateOrCreate(
                ['slug' => $product['slug']],
                [
                    'name' => $product['name'],
                    'category' => $product['category'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'preorder_estimate' => $product['preorder_estimate'],
                    'max_order' => $product['max_order'],
                    'image_path' => $imagePath,
                    'is_active' => true,
                ],
            );
        }
    }
}
