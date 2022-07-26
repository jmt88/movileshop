<?php


namespace App\Services;


use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Rol;
use App\Models\Tienda;
use App\Models\Venta;
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

        $user = $this->getDatosUsuario();

        $query = Inventario::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%")->where('tienda_id', $user['tienda_id']);
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
                'producto_id' => $inventario->producto->id,
                'tienda' => $inventario->tienda->nombre,
                'codigo' => $inventario->producto->codigo,
                'nombre' => $inventario->producto->nombre,
                'descripcion' => $inventario->producto->descripcion,
                'precio_venta' => $inventario->producto->precio_venta,
                'precio_compra' => $inventario->producto->precio_compra,
                'categoria' => $inventario->producto->categoria->nombre,
                'cantidad' => $inventario->cantidad,
                'existencia' => $inventario->existencia,
                'estado' => $inventario->producto->estado,
            ];
        }
        return ["success" => true, "inventarios" => $resultado, 'pagination' => $pagination];
    }

    public function VentaInventario($request)
    {
        $producto = Producto::find($request->get('producto_id'));
        $producto_id = $request->get('producto_id');
        $cantidad = $request->get('cantidad');

        $user = $this->getDatosUsuario();

        if($producto->existencia < $cantidad) {
            return ['success' => false, 'message' => 'No es posible realizar la operación, la cantidad a distribuir excede a la cantidad existente'];
        }

        $entity = Inventario::where('tienda_id', $user['tienda_id'])->where('producto_id', $producto_id)->first();
        if(!is_null($entity)) {
            $entity_venta = new Venta();

            $entity_venta->fecha = new \DateTime();
            $entity_venta->cantidad = $cantidad;

            $entity_venta->inventario_id = $entity->id;
            $entity_venta->user_id = $user['id'];
            $entity_venta->estado = 'En Proceso';

            $entity_venta->save();

            $entity->existencia -= $cantidad;
            $entity->save();
        } else {
            return ['success' => false, 'message' => 'El registro no fue encontrado'];

        }

        $producto->existencia -= $request->get('cantidad');
        $producto->save();

        return ['success' => true, 'message' => 'La operación se realizó correctamente'];
    }
}
