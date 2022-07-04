<?php

namespace App\Http\Controllers;

use App\Services\LoginService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    public function login(Request $request) {
        $username = $request->get('username');
        $password = $request->get('password');

        try {
            return response()->json($this->loginService->Login($username, $password), 200);
        }catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 200);
        }
    }

    public function test() {
        return response()->json($this->loginService->test(), 200);
    }

    public function logout(Request $request)
    {
        try {
            return response()->json($this->loginService->logout(Auth('api')->user()->id), 200);
        }catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage(), 'success' => false], 200);
        }
    }
}
