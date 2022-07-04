<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRol;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'nombre' => 'Administrador del sistema',
            'username' => 'admin',
            'rol_id' => 1,
            'email' => 'admin@tienda.cu',
            'password' => Hash::make('admin')
        ]);
    }
}
