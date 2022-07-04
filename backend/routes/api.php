<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LdapController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\NetworkController;
use App\Http\Controllers\CuotasController;
use App\Http\Controllers\DashboarController;
use App\Http\Controllers\DenegadosController;
use App\Http\Controllers\ReportesController;
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

//Ldap Routes
Route::post('/listarUnidadesOrganizativas', [LdapController::class, 'listarUnidadesOrganizativas'])->middleware('auth:api');

//Configuracion Routes
Route::post('/probarCadenaConeccion', [ConfiguracionController::class, 'probarCadenaConeccion'])->middleware('auth:api');
Route::post('/establecerComoRealizada', [ConfiguracionController::class, 'establecerComoRealizada'])->middleware('auth:api');
Route::post('/salvarConfiguracion', [ConfiguracionController::class, 'salvarConfiguracion'])->middleware('auth:api');

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

//NetworksRoutes
Route::post('/listarNetworks', [NetworkController::class, 'listarNetwork'])->middleware('auth:api');
Route::post('/salvarNetwork', [NetworkController::class, 'salvarNetwork'])->middleware('auth:api');
Route::post('/cargarDatosNetwork', [NetworkController::class, 'cargarDatosNetwork'])->middleware('auth:api');
Route::post('/editarNetwork', [NetworkController::class, 'editarNetwork'])->middleware('auth:api');
Route::post('/eliminarNetwork', [NetworkController::class, 'eliminarNetwork'])->middleware('auth:api');

//DenegadosRoutes
Route::post('/listarDenegados', [DenegadosController::class, 'listarDenegado'])->middleware('auth:api');
Route::post('/salvarDenegado', [DenegadosController::class, 'salvarDenegado'])->middleware('auth:api');
Route::post('/cargarDatosDenegado', [DenegadosController::class, 'cargarDatosDenegado'])->middleware('auth:api');
Route::post('/editarDenegado', [DenegadosController::class, 'editarDenegado'])->middleware('auth:api');
Route::post('/eliminarDenegado', [DenegadosController::class, 'eliminarDenegado'])->middleware('auth:api');

//CuotasRoutes
Route::post('/listarCuotas', [CuotasController::class, 'listarCuotas'])->middleware('auth:api');
Route::post('/salvarCuotas', [CuotasController::class, 'salvarCuotas'])->middleware('auth:api');

//DashboarRoutes
Route::post('/listarResumenConsumo', [DashboarController::class, 'listarResumenConsumo'])->middleware('auth:api');

//ReportesRoutes
Route::post('/reporteGeneral', [ReportesController::class, 'reporteGeneral'])->middleware('auth:api');

