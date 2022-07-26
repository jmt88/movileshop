<?php

namespace Database\Seeders;

use App\Models\PermisoRol;
use App\Models\Views;
use Illuminate\Database\Seeder;

class PermisosRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $views = Views::all();
        foreach ($views as $view) {
            PermisoRol::create([
                'views_id' => $view->id,
                'rol_id' => 1,
                'ver' => 1,
                'crear' => 1,
                'modificar' => 1,
                'eliminar' => 1,
            ]);
        }
        PermisoRol::create([
            'views_id' => 6,
            'rol_id' => 2,
            'ver' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
        ]);

        PermisoRol::create([
            'views_id' => 7,
            'rol_id' => 2,
            'ver' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
        ]);
    }
}
