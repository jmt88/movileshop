<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\VentaService;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function __construct(VentaService $ventaService)
    {
        $this->ventaService = $ventaService;
    }


    public function listarVentas(Request $request)
    {
        try {
            return response()->json($this->ventaService->ListarVentas($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function cancelarVenta(Request $request)
    {
        try {
            return response()->json($this->ventaService->CancelarVenta($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function aprobarVenta(Request $request)
    {
        try {
            return response()->json($this->ventaService->AprobarVenta($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarVenta(Request $request)
    {
        try {
            return response()->json($this->ventaService->EliminarVenta($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

}
