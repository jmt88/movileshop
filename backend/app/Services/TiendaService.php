<?php


namespace App\Services;

use App\Models\Producto;
use App\Models\Tienda;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class TiendaService extends BaseService
{
    public function ListarTodosTiendas()
    {
        $tiendas = Tienda::where('estado', '1')->get();

        $resultado = array();
        foreach ($tiendas as $tienda) {
            $resultado [] = [
                'id' => $tienda->id,
                'nombre' => $tienda->nombre,
            ];
        }

        return ["success" => true, "tiendas" => $resultado];
    }

    public function ListarTiendas($request)
    {
        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $query = Tienda::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%");
        }
        $total = $query->count();

        $tiendas = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        $resultado = array();
        foreach ($tiendas as $tienda) {

            $resultado [] = [
                'id' => $tienda->id,
                'nombre' => $tienda->nombre,
                'monto_total' => $tienda->monto_total,
                'monto_actual' => $tienda->monto_actual,
                'estado' => $tienda->estado
            ];
        }
        return ["success" => true, "tiendas" => $resultado, 'pagination' => $pagination];
    }

    public function CargarDatos($id)
    {
        $entity = Tienda::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['nombre'] = $entity->nombre;
            $resultado ['estado'] = $entity->estado;

            $array_resultado['success'] = true;
            $array_resultado['tienda'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el tienda solicitado';
        }
        return $array_resultado;
    }

    public function SalvarTienda($request)
    {
        $validador = Validator::make($request->all(), [
            'nombre' => 'unique:tienda,nombre',
        ]);

        if (count($validador->errors()) > 0 && $validador->errors()->has('nombre')) {
            return ['success' => false, 'message' => 'El tienda proporcionada ya se encuentra registrada'];
        }

        $entity = new Tienda();

        $entity->nombre = $request->get('nombre');
        $entity->estado = $request->get('estado');

        $entity->save();

        return ['success' => true, 'message' => 'La operación se realizo correctamente'];
    }

    public function EditarTienda($request)
    {
        $tienda = Tienda::where('nombre', $request->get('nombre'))->first();

        if (!empty($tienda) && $tienda->id != $request->get('id')) {
            return ['success' => false, 'message' => 'El tienda proporcionada ya se encuentra registrada'];
        }

        $entity = Tienda::find($request->get('id'));
        if ($entity != null) {
            $entity->nombre = $request->get('nombre');
            $entity->estado = $request->get('estado');
            $entity->save();

            return ['success' => true, 'message' => 'La operación se realizó correctamente'];
        }
        return ['success' => false, 'message' => 'La tienda solicitada no se encuentra registrada en el sistema'];
    }

    public function EliminarTienda($id)
    {
        $entity = Tienda::find($id);
        $usuarios = User::firstWhere('tienda_id', $id);
        $productos = Producto::firstWhere('tienda_id', $id);

        if (!$productos && !$usuarios && $entity) {
            $entity->delete();
            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que la tienda posee usuarios o productos asociados"];
    }
}
