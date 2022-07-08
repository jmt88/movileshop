<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\DashboarController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);
Route::post('/test', [LoginController::class, 'test'])->middleware('auth:api');

//UsuariosRoutes
Route::post('/listarUsuarios', [UsuarioController::class, 'listarUsuarios'])->middleware('auth:api');
Route::post('/salvarUsuario', [UsuarioController::class, 'salvarUsuario'])->middleware('auth:api');
Route::post('/cargarDatosUsuario', [UsuarioController::class, 'cargarDatosUsuario'])->middleware('auth:api');
Route::post('/listarInformacionRequerida', [UsuarioController::class, 'listarInformacionRequerida'])->middleware('auth:api');
Route::post('/editarUsuario', [UsuarioController::class, 'editarUsuario'])->middleware('auth:api');
Route::post('/eliminarUsuario', [UsuarioController::class, 'eliminarUsuario'])->middleware('auth:api');

//PerfilesRoutes
Route::post('/listarPerfiles', [PerfilController::class, 'listarPerfiles'])->middleware('auth:api');
Route::post('/salvarPerfil', [PerfilController::class, 'salvarPerfil'])->middleware('auth:api');
Route::post('/cargarDatosPerfil', [PerfilController::class, 'cargarDatosPerfil'])->middleware('auth:api');
Route::post('/editarPerfil', [PerfilController::class, 'editarPerfil'])->middleware('auth:api');
Route::post('/eliminarPerfil', [PerfilController::class, 'eliminarPerfil'])->middleware('auth:api');

//DashboarRoutes
Route::post('/listarResumenConsumo', [DashboarController::class, 'listarResumenConsumo'])->middleware('auth:api');

//TiendasRoutes
Route::post('/listarTiendas', [TiendaController::class, 'listarTiendas'])->middleware('auth:api');
Route::post('/salvarTienda', [TiendaController::class, 'salvarTienda'])->middleware('auth:api');
Route::post('/cargarDatosTienda', [TiendaController::class, 'cargarDatosTienda'])->middleware('auth:api');
Route::post('/editarTienda', [TiendaController::class, 'editarTienda'])->middleware('auth:api');
Route::post('/eliminarTienda', [TiendaController::class, 'eliminarTienda'])->middleware('auth:api');

