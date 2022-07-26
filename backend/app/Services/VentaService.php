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
use function PHPUnit\Framework\isEmpty;

class VentaService extends BaseService
{
    public function ListarVentas($request)
    {
        $resultado = array();

        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $user = $this->getDatosUsuario();

        $query = Venta::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%")->where('inventario.tienda_id', $user['tienda_id']);
        }
        $total = $query->count();

        $ventas = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        foreach ($ventas as $venta) {
            $resultado [] = [
                'id' => $venta->id,
                'producto_id' => $venta->producto->id,
                'tienda' => $venta->tienda->nombre,
                'codigo' => $venta->producto->codigo,
                'nombre' => $venta->producto->nombre,
                'descripcion' => $venta->producto->descripcion,
                'precio_venta' => $venta->producto->precio_venta,
                'precio_compra' => $venta->producto->precio_compra,
                'categoria' => $venta->producto->categoria->nombre,
                'cantidad' => $venta->cantidad,
                'existencia' => $venta->existencia,
                'estado' => $venta->producto->estado,
            ];
        }
        return ["success" => true, "ventas" => $resultado, 'pagination' => $pagination];
    }

    public function cancelarVenta($request)
    {
        $id = Producto::find($request->get('id'));

        $user = $this->getDatosUsuario();

//        if($producto->existencia < $cantidad) {
//            return ['success' => false, 'message' => 'No es posible realizar la operación, la cantidad a distribuir excede a la cantidad existente'];
//        }

//        $entity = Venta::where('tienda_id', $user['tienda_id'])->where('producto_id', $producto_id)->first();
//        if(!is_null($entity)) {
//            $entity_venta = new Venta();
//
//            $entity_venta->fecha = new \DateTime();
//            $entity_venta->cantidad = $cantidad;
//
//            $entity_venta->venta_id = $entity->id;
//            $entity_venta->user_id = $user['id'];
//            $entity_venta->estado = 'En Proceso';
//
//            $entity_venta->save();
//
//            $entity->existencia -= $cantidad;
//            $entity->save();
//        } else {
//            return ['success' => false, 'message' => 'El registro no fue encontrado'];
//
//        }
//
//        $producto->existencia -= $request->get('cantidad');
//        $producto->save();

        return ['success' => true, 'message' => 'La operación se realizó correctamente'];
    }
}
