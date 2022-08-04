<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CategoriaService;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function __construct(CategoriaService $categoriaService)
    {
        $this->categoriaService = $categoriaService;
    }

    public function listarCategorias(Request $request)
    {
        try {
            return response()->json($this->categoriaService->ListarCategorias($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarCategoria(Request $request)
    {
        try {
            return response()->json($this->categoriaService->SalvarCategoria($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function editarCategoria(Request $request)
    {
        try {
            return response()->json($this->categoriaService->EditarCategoria($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarCategoria(Request $request)
    {
        $id = $request->get('id');
        try {
            return response()->json($this->categoriaService->EliminarCategoria($id), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function cargarDatosCategoria(Request $request)
    {
        try {
            return response()->json($this->categoriaService->CargarDatos($request->get('id')), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function listarTodosCategorias(Request $request)
    {
        try {
            return response()->json($this->categoriaService->ListarTodosCategorias($request->get('id')), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
}
