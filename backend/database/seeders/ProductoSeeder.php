<?php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Producto::create([
            'codigo' => '123',
            'nombre' => 'Laptop',
            'descripcion' => 'descrip',
            'precio_venta' => '200',
            'precio_compra' => '100',
            'cantidad' => '50',
            'existencia' => '50',
            'categoria_id' => '1',
            'estado' => true,
        ]);
    }
}
