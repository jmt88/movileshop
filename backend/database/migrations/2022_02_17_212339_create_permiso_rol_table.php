<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermisoRolTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rol_views', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('ver');
            $table->boolean('crear');
            $table->boolean('modificar');
            $table->boolean('eliminar');
            $table->integer('rol_id')->unsigned();
            $table->foreign('rol_id')->references('id')->on('rol')->onDelete('cascade');
            $table->integer('views_id')->unsigned();
            $table->foreign('views_id')->references('id')->on('views')->onDelete('cascade');
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
        Schema::dropIfExists('permiso_rol');
    }
}
