<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tienda extends Model
{
    use HasFactory;

    protected $table = 'tienda';

    protected $fillable = ['nombre', 'estado'];

    public function users() {
        return $this->hasMany(User::class);
    }
}
