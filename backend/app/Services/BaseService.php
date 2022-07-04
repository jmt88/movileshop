<?php


namespace App\Services;

use App\Models\Consumo;
use App\Models\Cuotas;
use App\Models\Denegados;
use App\Models\HistorialCuota;
use App\Models\Network;
use App\Models\Views;
use Illuminate\Support\Facades\Auth;
use LdapRecord\Connection;
use LdapRecord\Container;

use App\Models\Configuracion;
use App\Models\Ldap;
use App\Models\User;
use App\Models\Rol;

class BaseService
{
    public function getDatosUsuario()
    {
        $usuario = Auth::user();

        if ($usuario) {
            return [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'username' => $usuario->username,
                'email' => $usuario->email,
                'tienda_id' => $usuario->tienda_id,
            ];
        }
        return null;
    }

    public function getPermisosUsuario($user_id)
    {
        $resultado = array();
        $usuario = User::find($user_id);
        $resultado['usuario_id'] = $usuario->id;
        $resultado['nombre'] = $usuario->nombre;
        $resultado['username'] = $usuario->username;
        $resultado['email'] = $usuario->email;
        $resultado['perfil_id'] = $usuario->rol_id;
        $resultado['perfil'] = $usuario->rol->perfil;

        $permisos = array();

        $funciones = Views::all();

        foreach ($funciones as $view) {
            $default = new \stdClass();
            $default->ver = 0;
            $default->crear = 0;
            $default->modificar = 0;
            $default->eliminar = 0;

            $usuario_permisos_rol = $usuario->rol->views->where('views_id', $view->id)->first();
            $usuario_permiso = $usuario->views->where('views_id', $view->id)->first();

            if ($usuario_permisos_rol || $usuario_permiso) {
                $usuario_permisos_rol = $usuario_permisos_rol ? $usuario_permisos_rol : $default;
                $usuario_permiso = $usuario_permiso ? $usuario_permiso : $default;
                $permiso = $this->getPermiso($usuario_permisos_rol, $usuario_permiso);

                array_push($permisos, [
                    'nombre' => $view->nombre,
                    'grupo' => $view->grupo,
                    'metodo' => $view->metodo,
                    'descripcion' => $view->descripcion,
                    'link' => $view->link,
                    'ver' => $permiso['ver'],
                    'crear' => $permiso['crear'],
                    'modificar' => $permiso['modificar'],
                    'eliminar' => $permiso['eliminar']
                ]);
            }
        }
        $resultado['permisos'] = $permisos;

        return $resultado;
    }

    public function getPermiso($usuario_permisos_rol, $usuario_permiso)
    {
        $resultado = [
            'ver' => false,
            'crear' => false,
            'modificar' => false,
            'eliminar' => false
        ];

        $resultado['ver'] = $usuario_permisos_rol->ver || $usuario_permiso->ver ? true : false;
        $resultado['crear'] = $usuario_permisos_rol->crear || $usuario_permiso->crear ? true : false;
        $resultado['modificar'] = $usuario_permisos_rol->modificar || $usuario_permiso->modificar ? true : false;
        $resultado['eliminar'] = $usuario_permisos_rol->eliminar || $usuario_permiso->eliminar ? true : false;

        return $resultado;
    }

    public function isAdmnistrador($user_id)
    {
        $user = User::find($user_id);

        return $user->rol_id == 1 ? true : false;
    }

    public function isConsultor($user_id)
    {
        $user = User::find($user_id);

        return $user->rol_id == 2 ? true : false;
    }

    public function ListarInformacionRequeridaUsuarios()
    {
        $perfiles = Rol::all();

        $permisos = Views::all();
        $array_permiso = array();
        foreach ($permisos as $key => $permiso) {
            $array_permiso [] = [
                'id' => $permiso->id,
                'nombre' => $permiso->nombre,
                'ver' => false,
                'crear' => false,
                'modificar' => false,
                'eliminar' => false,
                'posicion' => $key
            ];
        }

        return ['success' => true, 'perfiles' => $perfiles, 'permiso' => $array_permiso];
    }
}
