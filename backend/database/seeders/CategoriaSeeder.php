<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Tienda;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Categoria::create([
            'nombre' => 'Categoría 1',
            'descripcion' => 'Descrip',
            'estado' => true,
        ]);
    }
}
