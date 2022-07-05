<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TiendaService;
use Illuminate\Http\Request;

class TiendaController extends Controller
{
    public function __construct(TiendaService $tiendaService)
    {
        $this->tiendaService = $tiendaService;
    }

    public function listarTiendas()
    {
        try {
            return response()->json($this->tiendaService->ListarTiendas(), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarTienda(Request $request)
    {
        try {
            return response()->json($this->tiendaService->SalvarTienda($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function editarTienda(Request $request)
    {
        try {
            return response()->json($this->tiendaService->EditarTienda($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarTienda(Request $request)
    {
        $id = $request->get('id');
        try {
            return response()->json($this->tiendaService->EliminarTienda($id), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function cargarDatosTienda(Request $request)
    {
        try {
            return response()->json($this->tiendaService->CargarDatos($request->get('id')), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
}
