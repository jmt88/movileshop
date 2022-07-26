<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProductoService;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function __construct(ProductoService $productoService)
    {
        $this->productoService = $productoService;
    }


    public function listarProductos(Request $request) {
        try{
            return response()->json($this->productoService->ListarProductos($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarProducto(Request $request) {
        try{
            return response()->json($this->productoService->SalvarProducto($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function editarProducto(Request $request) {
        try{
            return response()->json($this->productoService->EditarProducto($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function cargarDatosProducto(Request $request) {
        try{
            return response()->json($this->productoService->CargarDatos($request->get('id')), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function listarInformacionRequerida() {
        try{
            return response()->json($this->productoService->ListarInformacionRequeridaProductos(), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarProducto(Request $request) {
        $id = $request->get('id');
        try{
            return response()->json($this->productoService->EliminarProducto($id), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function distribuirProductos(Request $request)
    {
        try {
            return response()->json($this->productoService->DistribuirProductos($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function recogerProductos(Request $request)
    {
        try {
            return response()->json($this->productoService->RecogerProductos($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }


}
