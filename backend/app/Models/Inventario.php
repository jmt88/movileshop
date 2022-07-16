<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventario';
    protected $fillable = [
        'cantidad',
        'existencia',
        'tienda_id',
        'producto_id',
    ];

    public function tienda() {
        return $this->belongsTo(Tienda::class);
    }

    public function producto() {
        return $this->belongsTo(Producto::class);
    }
}
