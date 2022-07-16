<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'producto';
    protected $fillable = [
        'codigo',
        'precio_venta',
        'precio_compra',
        'nombre',
        'descripción',
        'cantidad',
        'existencia',
        'estado',
        'categoria_id'
    ];

    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }
}
