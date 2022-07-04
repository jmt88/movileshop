<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Views extends Model
{
    use HasFactory;

    protected $table = 'views';

    protected $fillable = ['nombre', 'grupo', 'descripcion', 'link'];

    public function users() {
        return $this->belongsToMany(User::class)->using(PermisoUsuario::class)->withPivot(['ver', 'crear', 'modificar', 'eliminar']);
    }

    public function rol() {
        return $this->belongsToMany(Rol::class)->using(PermisoRol::class)->withPivot(['ver', 'crear', 'modificar', 'eliminar']);
    }

}
