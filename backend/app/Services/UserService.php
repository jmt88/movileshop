<?php


namespace App\Services;


use App\Models\Cuotas;
use App\Models\PermisoUsuario;
use App\Models\Views;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use LdapRecord\Container;
use App\Models\User;
use function Symfony\Component\Translation\t;

class UserService extends BaseService
{
    public function ListarUsuarios($request)
    {
        $resultado = array();

        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $usuarios = array();
        $query = User::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%");
        }
        $total = $query->count();

        $usuarios = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        foreach ($usuarios as $usuario) {
            $resultado [] = [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'username' => $usuario->username,
                'email' => $usuario->email,
                'perfil' => $usuario->rol->perfil,
                'tienda' => $usuario->tienda != null ? $usuario->tienda->nombre : "",
                'active' => $usuario->active,
            ];
        }
        return ["success" => true, "usuarios" => $resultado, 'pagination' => $pagination];
    }

    public function CargarDatos($id)
    {
        $entity = User::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['nombre'] = $entity->nombre;
            $resultado ['usuario'] = $entity->username;
            $resultado ['email'] = $entity->email;
            $resultado ['perfil'] = $entity->rol_id;
            $resultado ['tienda'] = $entity->tienda_id;

            $resultado ['active'] = $entity->active;
            $resultado['permisos'] = $this->getPermisosUser($entity->id);

            $array_resultado['success'] = true;
            $array_resultado['usuario'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el usuario solicitado';
        }
        return $array_resultado;
    }

    public function getPermisosUser($userId)
    {
        $view = Views::all();

        $resultado = array();
        foreach ($view as $key => $ruta) {
            $permiso = PermisoUsuario::where('user_id', $userId)->where('views_id', $ruta->id)->first();
            if ($permiso) {
                $resultado [] = [
                    'id' => $ruta->id,
                    'nombre' => $ruta->nombre,
                    'ver' => $permiso->ver ? true : false,
                    'crear' => $permiso->crear ? true : false,
                    'modificar' => $permiso->modificar ? true : false,
                    'eliminar' => $permiso->eliminar ? true : false,
                    'posicion' => $key
                ];
            } else {
                $resultado [] = [
                    'id' => $ruta->id,
                    'nombre' => $ruta->nombre,
                    'ver' => false,
                    'crear' => false,
                    'modificar' => false,
                    'eliminar' => false,
                    'posicion' => $key
                ];
            }
        }
        return $resultado;
    }

    public function SalvarUsuario($request)
    {
        $validador = Validator::make($request->all(), [
            'usuario' => 'unique:users,username',
            'email' => 'unique:users,email',
        ]);

        if (count($validador->errors()) > 0) {
            if ($validador->errors()->has('email')) {
                return ['success' => false, 'message' => 'El correo proporcionado ya se encuentra asignado'];
            }
            if ($validador->errors()->has('usuario')) {
                return ['success' => false, 'message' => 'El usuario proporcionado ya se encuentra asignado'];
            }
        }
        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = new User();

        $entity->nombre = $request->get('nombre');
        $entity->username = $request->get('usuario');
        $entity->password = Hash::make(base64_decode($request->get('password')));
        $entity->email = $request->get('email');
        $entity->active = true;
        $entity->rol_id = $request->get('perfil');
        $entity->tienda_id = $request->get('tienda');
        $entity->save();

        foreach ($permisos as $permiso) {
            $permiso_usuario = new PermisoUsuario();
            $permiso_usuario->user_id = $entity->id;
            $permiso_usuario->views_id = $permiso->id;
            $permiso_usuario->ver = $permiso->ver;
            $permiso_usuario->crear = $permiso->crear;
            $permiso_usuario->modificar = $permiso->modificar;
            $permiso_usuario->eliminar = $permiso->eliminar;
            $permiso_usuario->save();
        }

        return ['success' => true, 'message' => 'La operación se realizo correctamente'];
    }

    public function EditarUsuario($request)
    {
        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = User::find($request->get('id'));
        if ($entity != null) {
            if ($request->get('password') != "" && !$entity->guid) {
                $entity->password = Hash::make(base64_decode($request->get('password')));
            }
            $entity->nombre = $request->get('nombre');
            $entity->username = $request->get('usuario');
            $entity->email = $request->get('email');
            $entity->rol_id = $request->get('perfil');
            $entity->tienda_id = $request->get('tienda');
            $entity->save();

            foreach ($permisos as $permiso) {
                $permiso_usuario = PermisoUsuario::where('user_id', $entity->id)->where('views_id', $permiso->id)->first();
                if (!$permiso_usuario) {

                    $permiso_usuario = new PermisoUsuario();
                    $permiso_usuario->user_id = $entity->id;
                    $permiso_usuario->views_id = $permiso->id;
                }

                $permiso_usuario->ver = $permiso->ver ? true : false;
                $permiso_usuario->crear = $permiso->crear ? true : false;
                $permiso_usuario->modificar = $permiso->modificar ? true : false;
                $permiso_usuario->eliminar = $permiso->eliminar ? true : false;
                $permiso_usuario->save();
            }

            return ['success' => true, 'message' => 'La operación se realizo correctamente'];
        }
        return ['success' => false, 'message' => 'El usuario solicitado no se encuentra registrado en el sistema'];
    }

    public function EliminarUsuario($id) {

        $usuario = User::find($id);
        if($usuario) {

            $usuario->delete();
            return ["success"=>true, "message"=> "La operación se realizó correctamente"];
        }
        return ["success"=>false, "message"=> "El usuario proporcionado no existe"];
    }
}
