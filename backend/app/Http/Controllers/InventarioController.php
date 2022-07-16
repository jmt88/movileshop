<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\InventarioService;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function __construct(InventarioService $inventarioService)
    {
        $this->inventarioService = $inventarioService;
    }


    public function listarInventarios(Request $request) {
        try{
            return response()->json($this->inventarioService->ListarInventarios($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarInventario(Request $request) {
        try{
            return response()->json($this->inventarioService->SalvarInventario($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function editarInventario(Request $request) {
        try{
            return response()->json($this->inventarioService->EditarInventario($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function cargarDatosInventario(Request $request) {
        try{
            return response()->json($this->inventarioService->CargarDatos($request->get('id')), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function listarInformacionRequerida() {
        try{
            return response()->json($this->inventarioService->ListarInformacionRequeridaInventarios(), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarInventario(Request $request) {
        $id = $request->get('id');
        try{
            return response()->json($this->inventarioService->EliminarInventario($id), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

}
