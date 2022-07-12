<?php


namespace App\Services;

use App\Models\PermisoRol;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class PerfilService extends BaseService
{
    public function ListarPerfiles()
    {
        $perfiles = Rol::all();
        $resultado = array();
        foreach ($perfiles as $perfil) {

            $resultado [] = [
                'id' => $perfil->id,
                'perfil' => $perfil->perfil,
                'active' => $perfil->active
            ];
        }
        return ["success" => true, "perfiles" => $resultado];
    }

    public function CargarDatos($id)
    {
        $entity = Rol::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['perfil'] = $entity->perfil;
            $resultado['permisos'] = $this->getPermisosPerfil($entity->id);

            $array_resultado['success'] = true;
            $array_resultado['perfil'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el perfil solicitado';
        }
        return $array_resultado;
    }

    public function getPermisosPerfil($rolId)
    {
        $permisos = PermisoRol::where('rol_id', $rolId)->get();
        $resultado = array();
        foreach ($permisos as $key => $permiso) {
            $resultado [] = [
                'id' => $permiso->views->id,
                'nombre' => $permiso->views->nombre,
                'ver' => $permiso->ver ? true : false,
                'crear' => $permiso->crear ? true : false,
                'modificar' => $permiso->modificar ? true : false,
                'eliminar' => $permiso->eliminar ? true : false,
                'posicion' => $key
            ];
        }

        return $resultado;
    }

    public function SalvarPerfil($request)
    {
        $validador = Validator::make($request->all(), [
            'perfil' => 'unique:rol,perfil',
        ]);

        if (count($validador->errors()) > 0 && $validador->errors()->has('perfil')) {
            return ['success' => false, 'message' => 'El perfil proporcionado ya se encuentra asignado'];
        }

        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = new Rol();

        $entity->perfil = $request->get('perfil');

        $entity->save();

        foreach ($permisos as $permiso) {
            $permiso_perfil = new PermisoRol();
            $permiso_perfil->rol_id = $entity->id;
            $permiso_perfil->views_id = $permiso->id;
            $permiso_perfil->ver = $permiso->ver;
            $permiso_perfil->crear = $permiso->crear;
            $permiso_perfil->modificar = $permiso->modificar;
            $permiso_perfil->eliminar = $permiso->eliminar;
            $permiso_perfil->save();
        }

        return ['success' => true, 'message' => 'La operación se realizo correctamente'];
    }

    public function EditarPerfil($request)
    {
        $rol = Rol::where('perfil', $request->get('perfil'))->first();

        if (!empty($rol) && $rol->id != $request->get('id')) {
            return ['success' => false, 'message' => 'El perfil proporcionado ya se encuentra registrado'];
        }

        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = Rol::find($request->get('id'));
        if ($entity != null) {
            $entity->perfil = $request->get('perfil');
            $entity->save();

            foreach ($permisos as $permiso) {
                $permiso_perfil = PermisoRol::where('rol_id', $entity->id)->where('views_id', $permiso->id)->first();
                if (!$permiso_perfil) {
                    $permiso_perfil = new PermisoRol();
                    $permiso_perfil->rol_id = $entity->id;
                    $permiso_perfil->views_id = $permiso->id;
                }

                $permiso_perfil->ver = $permiso->ver ? true : false;
                $permiso_perfil->crear = $permiso->crear ? true : false;
                $permiso_perfil->modificar = $permiso->modificar ? true : false;
                $permiso_perfil->eliminar = $permiso->eliminar ? true : false;
                $permiso_perfil->save();
            }

            return ['success' => true, 'message' => 'La operación se realizo correctamente'];
        }
        return ['success' => false, 'message' => 'El perfil solicitado no se encuentra registrado en el sistema'];
    }

    public function EliminarPerfil($id)
    {
        $entity = Rol::find($id);
        $usuarios = User::firstWhere('rol_id', $id);

        if (!$usuarios && $entity) {
            $entity->delete();
            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que el perfil posee usuarios asociados"];
    }
}
