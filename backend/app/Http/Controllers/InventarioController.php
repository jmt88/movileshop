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


    public function listarInventarios(Request $request)
    {
        try {
            return response()->json($this->inventarioService->ListarInventarios($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function ventaInventario(Request $request)
    {
        try {
            return response()->json($this->inventarioService->VentaInventario($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

}
