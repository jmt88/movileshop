<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function listarUsuarios(Request $request) {
        try{
            return response()->json($this->userService->ListarUsuarios($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function salvarUsuario(Request $request) {
        try{
            return response()->json($this->userService->SalvarUsuario($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function editarUsuario(Request $request) {
        try{
            return response()->json($this->userService->EditarUsuario($request), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function cargarDatosUsuario(Request $request) {
        try{
            return response()->json($this->userService->CargarDatos($request->get('id')), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function listarInformacionRequerida() {
        try{
            return response()->json($this->userService->ListarInformacionRequeridaUsuarios(), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function eliminarUsuario(Request $request) {
        $id = $request->get('id');
        try{
            return response()->json($this->userService->EliminarUsuario($id), 200);
        }
        catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }

}
