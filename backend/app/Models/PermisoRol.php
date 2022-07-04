<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermisoRol extends Model
{
    use HasFactory;

    protected $table = 'rol_views';

    protected $fillable = ['ver', 'crear', 'modificar', 'eliminar', 'views_id', 'rol_id'];

    public function views() {
        return $this->belongsTo(Views::class);
    }

    public function rol() {
        return $this->belongsTo(Rol::class);
    }
}
