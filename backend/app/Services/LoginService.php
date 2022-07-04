<?php


namespace App\Services;


use App\Models\Configuracion;
use App\Models\Cuotas;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoginService extends BaseService
{

    public function Login($username, $password)
    {

        $usuario = null;
        $result = null;
        $password = base64_decode($password);
        $navegacion_usuario = false;
        $success = false;
        $message = '';

        if (Auth::attempt(['username' => $username, 'password' => $password])) {
            $data = Auth::user();
            $usuario = $this->getPermisosUsuario($data->id);
            $usuario['token'] = $data->createToken('authToken')->accessToken;
            $success = true;
            $message = "Se ha autenticado correctamente";
        } else {
            $message = "Usuario o contraseña incorrecta";
        }
        $result['datos'] = base64_encode(json_encode($usuario));
        $result['success'] = $success;
        $result['message'] = $message;

        return $result;
    }

    public function logout($user_id)
    {
            DB::table('oauth_access_tokens')->where('user_id', $user_id)->update([
                'revoked' => true,
            ]);

            return $user_id;
    }

}
