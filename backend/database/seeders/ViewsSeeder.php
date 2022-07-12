<?php

namespace Database\Seeders;

use App\Models\PermisoRol;
use App\Models\Views;
use Illuminate\Database\Seeder;

class ViewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Views::create([
            'nombre' => 'Usuarios',
            'grupo' => 1,
            'descripcion' => 'Administrar usuarios',
            'link' => '/usuarios'
        ]);

        Views::create([
            'nombre' => 'Perfiles',
            'grupo' => 1,
            'descripcion' => 'Administrar perfiles',
            'link' => '/perfiles'
        ]);

        Views::create([
            'nombre' => 'Tiendas',
            'grupo' => 2,
            'descripcion' => 'Administrar tiendas del sistema',
            'link' => '/tiendas'
        ]);

        Views::create([
            'nombre' => 'Categorías',
            'grupo' => 2,
            'descripcion' => 'Administrar categorías del sistema',
            'link' => '/categorias'
        ]);

        Views::create([
            'nombre' => 'Productos',
            'grupo' => 2,
            'descripcion' => 'Administrar productos del sistema',
            'link' => '/productos'
        ]);

    }
}
