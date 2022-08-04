<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\DashboarController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\VentaController;
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
Route::get('/listarTodosTiendas', [TiendaController::class, 'listarTodosTiendas'])->middleware('auth:api');

//CategoriasRoutes
Route::post('/listarCategorias', [CategoriaController::class, 'listarCategorias'])->middleware('auth:api');
Route::post('/salvarCategoria', [CategoriaController::class, 'salvarCategoria'])->middleware('auth:api');
Route::post('/cargarDatosCategoria', [CategoriaController::class, 'cargarDatosCategoria'])->middleware('auth:api');
Route::post('/editarCategoria', [CategoriaController::class, 'editarCategoria'])->middleware('auth:api');
Route::post('/eliminarCategoria', [CategoriaController::class, 'eliminarCategoria'])->middleware('auth:api');
Route::get('/listarTodosCategorias', [CategoriaController::class, 'listarTodosCategorias'])->middleware('auth:api');

//ProductosRoutes
Route::post('/listarProductos', [ProductoController::class, 'listarProductos'])->middleware('auth:api');
Route::post('/salvarProducto', [ProductoController::class, 'salvarProducto'])->middleware('auth:api');
Route::post('/cargarDatosProducto', [ProductoController::class, 'cargarDatosProducto'])->middleware('auth:api');
Route::post('/editarProducto', [ProductoController::class, 'editarProducto'])->middleware('auth:api');
Route::post('/eliminarProducto', [ProductoController::class, 'eliminarProducto'])->middleware('auth:api');
Route::get('/listarTodosProductos', [ProductoController::class, 'listarTodosProductos'])->middleware('auth:api');

//Distribuir Productos por tiendas
Route::post('/distribuirProductos', [ProductoController::class, 'distribuirProductos'])->middleware('auth:api');
Route::post('/recogerProductos', [ProductoController::class, 'recogerProductos'])->middleware('auth:api');


//Inventario por tienda
Route::post('/listarInventarios', [InventarioController::class, 'listarInventarios'])->middleware('auth:api');
Route::post('/ventaInventario', [InventarioController::class, 'ventaInventario'])->middleware('auth:api');

//Ventas por tienda
Route::post('/listarVentas', [VentaController::class, 'listarVentas'])->middleware('auth:api');
Route::post('/cancelarVenta', [VentaController::class, 'cancelarVenta'])->middleware('auth:api');
Route::post('/aprobarVenta', [VentaController::class, 'aprobarVenta'])->middleware('auth:api');
Route::post('/eliminarVenta', [VentaController::class, 'eliminarVenta'])->middleware('auth:api');
