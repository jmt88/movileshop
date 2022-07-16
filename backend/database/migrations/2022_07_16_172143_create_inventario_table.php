<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventario', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('cantidad')->default(0);
            $table->integer('existencia')->default(0);
            $table->integer('tienda_id')->unsigned();
            $table->foreign('tienda_id')->references('id')->on('tienda')->onDelete('restrict');
            $table->integer('producto_id')->unsigned();
            $table->foreign('producto_id')->references('id')->on('producto')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventario');
    }
}
