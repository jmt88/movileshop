<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PerfilService;
use Illuminate\Http\Request;

class PerfilController extends Controller
{
    public function __construct(PerfilService $perfilService)
    {
        $this->perfilService = $perfilService;
    }

    public function listarPerfiles()
    {
        try {
            return response()->json($this->perfilService->ListarPerfiles(), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarPerfil(Request $request)
    {
        try {
            return response()->json($this->perfilService->SalvarPerfil($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function editarPerfil(Request $request)
    {
        try {
            return response()->json($this->perfilService->EditarPerfil($request), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarPerfil(Request $request)
    {
        $id = $request->get('id');
        try {
            return response()->json($this->perfilService->EliminarPerfil($id), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function cargarDatosPerfil(Request $request)
    {
        try {
            return response()->json($this->perfilService->CargarDatos($request->get('id')), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
}
