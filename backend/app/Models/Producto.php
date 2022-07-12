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
        'estado',
        'categoria_id',
        'tienda_id'
    ];

    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }
    public function tienda() {
        return $this->belongsTo(Tienda::class);
    }
}
