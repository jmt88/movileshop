<?php


namespace App\Services;


use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Rol;
use App\Models\Tienda;
use App\Models\Views;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Inventario;
use function PHPUnit\Framework\isEmpty;

class InventarioService extends BaseService
{
    public function ListarInventarios($request)
    {
        $resultado = array();

        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $query = Inventario::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%");
        }
        $total = $query->count();

        $inventarios = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        foreach ($inventarios as $inventario) {
            $resultado [] = [
                'id' => $inventario->id,
                'tienda' => $inventario->tienda,
                'producto' => $inventario->producto,
                'cantidad' => $inventario->cantidad,
                'existencia' => $inventario->existencia
            ];
        }
        return ["success" => true, "inventarios" => $resultado, 'pagination' => $pagination];
    }

    public function CargarDatos($id)
    {
        $entity = Inventario::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['tienda'] = $entity->tienda;
            $resultado ['producto'] = $entity->producto;
            $resultado ['cantidad'] = $entity->cantidad;
            $resultado ['existencia'] = $entity->existencia;

            $array_resultado['success'] = true;
            $array_resultado['inventario'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el inventario solicitado';
        }
        return $array_resultado;
    }

    public function SalvarInventario($request)
    {
        $entity = Inventario::where('tienda', $request->get('tienda'))->and('producto', $request->get('producto'))->get();
        if(isEmpty($entity))
            $entity = new Inventario();

        $entity->cantidad += $request->get('cantidad');
        $entity->existencia += $request->get('existencia');
        $entity->tienda = $request->get('tienda');
        $entity->producto = $request->get('producto');
        $entity->save();

        return ['success' => true, 'message' => 'La operación se realizó correctamente'];
    }

    public function EditarInventario($request)
    {
        $entity = Inventario::where('tienda', $request->get('tienda'))->and('producto', $request->get('producto'))->get();

        if ($entity != null) {
            if($request->get('cantidad') >= $entity->cantidad) {
                return ['success' => false, 'message' => 'No es posible realizar la opreción, la cantidad a retirar excede a la cantidad existente'];
            }
            $entity->cantidad -= $request->get('cantidad');
            $entity->existencia -= $request->get('cantidad');
            $entity->save();

            return ['success' => true, 'message' => 'La operación se realizó correctamente'];
        }
        return ['success' => false, 'message' => 'El inventario solicitado no se encuentra registrado en el sistema'];
    }
}
