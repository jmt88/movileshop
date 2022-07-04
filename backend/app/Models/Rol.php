<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'rol';

    protected $fillable = ['perfil'];

    public function views() {
        return $this->hasMany(PermisoRol::class);
    }

    public function users() {
        return $this->hasMany(User::class);
    }
}
