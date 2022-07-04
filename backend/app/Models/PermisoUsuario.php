<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermisoUsuario extends Model
{
    use HasFactory;

    protected $table = 'user_views';

    protected $fillable = ['ver', 'crear', 'modificar', 'eliminar', 'views_id', 'user_id'];

    public function views() {
        return $this->belongsTo(Views::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }

}
