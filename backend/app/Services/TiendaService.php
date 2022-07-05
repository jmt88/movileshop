<?php


namespace App\Services;

use App\Models\PermisoRol;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class TiendaService extends BaseService
{
    public function ListarTiendas()
    {
        $tiendas = Rol::all();
        $resultado = array();
        foreach ($tiendas as $tienda) {

            $resultado [] = [
                'id' => $tienda->id,
                'tienda' => $tienda->tienda,
                'active' => $tienda->active
            ];
        }
        return ["success" => true, "tiendas" => $resultado];
    }

    public function CargarDatos($id)
    {
        $entity = Rol::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['tienda'] = $entity->tienda;
            $resultado['permisos'] = $this->getPermisosTienda($entity->id);

            $array_resultado['success'] = true;
            $array_resultado['tienda'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el tienda solicitado';
        }
        return $array_resultado;
    }

    public function getPermisosTienda($rolId)
    {
        $permisos = PermisoRol::where('rol_id', $rolId)->get();
        $resultado = array();
        foreach ($permisos as $key => $permiso) {
            $resultado [] = [
                'id' => $permiso->views->id,
                'nombre' => $permiso->views->nombre,
                'ver' => $permiso->ver ? true: false,
                'crear' => $permiso->crear ? true: false,
                'modificar' => $permiso->modificar ? true: false,
                'eliminar' => $permiso->eliminar ? true: false,
                'posicion' => $key
            ];
        }

        return $resultado;
    }

    public function SalvarTienda($request)
    {
        $validador = Validator::make($request->all(), [
            'tienda' => 'unique:rol,tienda',
         ]);

        if(count($validador->errors()) > 0 && $validador->errors()->has('tienda')) {
               return ['success' => false, 'message' => 'El tienda proporcionado ya se encuentra asignado'];
        }

        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = new Rol();

        $entity->tienda = $request->get('tienda');

        $entity->save();

        foreach ($permisos as $permiso) {
            $permiso_tienda = new PermisoRol();
            $permiso_tienda->rol_id = $entity->id;
            $permiso_tienda->views_id = $permiso->id;
            $permiso_tienda->ver = $permiso->ver;
            $permiso_tienda->crear = $permiso->crear;
            $permiso_tienda->modificar = $permiso->modificar;
            $permiso_tienda->eliminar = $permiso->eliminar;
            $permiso_tienda->save();
        }

        return ['success'=> true, 'message'=>'La operación se realizo correctamente'];
    }

    public function EditarTienda($request)
    {
        $permisos = $request->get('permisos');
        $permisos = $permisos != null ? json_decode($permisos) : [];

        $entity = Rol::find($request->get('id'));
        if($entity != null) {
            $entity->tienda = $request->get('tienda');
            $entity->save();

            foreach ($permisos as $permiso) {
                $permiso_tienda = PermisoRol::where('rol_id', $entity->id)->where('views_id', $permiso->id)->first();
                if(!$permiso_tienda) {
                    $permiso_tienda = new PermisoRol();
                    $permiso_tienda->rol_id = $entity->id;
                    $permiso_tienda->views_id = $permiso->id;
                }

                $permiso_tienda->ver = $permiso->ver ? true : false;
                $permiso_tienda->crear = $permiso->crear ? true : false;
                $permiso_tienda->modificar = $permiso->modificar ? true : false;
                $permiso_tienda->eliminar = $permiso->eliminar ? true : false;
                $permiso_tienda->save();
            }

            return ['success'=> true, 'message'=>'La operación se realizo correctamente'];
        }
        return ['success'=> false, 'message'=>'El tienda solicitado no se encuentra registrado en el sistema'];
    }
    public  function EliminarTienda($id) {
        $entity = Rol::find($id);
        $usuarios = User::firstWhere('rol_id', $id);

        if(!$usuarios && $entity) {
            $entity->delete();
            return ['success'=>true, "message"=> "La operación se ha realizado correctamente"];
        }

        return ['success'=>false, "message"=> "La operación no se ha realizado debido a que el tienda posee usuarios asociados"];
    }
}
