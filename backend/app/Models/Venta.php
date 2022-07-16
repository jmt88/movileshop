<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'venta';
    protected $fillable = [
        'fecha',
        'cantidad',
        'inventario_id',
        'usuario_id'
    ];

    public function inventario() {
        return $this->belongsTo(Inventario::class);
    }

    public function usuario() {
        return $this->belongsTo(User::class);
    }
}
