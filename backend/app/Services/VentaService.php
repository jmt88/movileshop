<?php


namespace App\Services;


use App\Models\Categoria;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\Rol;
use App\Models\Tienda;
use App\Models\Venta;
use App\Models\Views;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use function PHPUnit\Framework\isEmpty;

class VentaService extends BaseService
{
    public function ListarVentas($request)
    {
        $resultado = array();

        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ? json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $user = $this->getDatosUsuario();

        $query = Venta::query();

        $query->orderBy('venta.' . $orderKey, $orderValue);
        foreach ($searchKey as $item) {
            if ($user['isAdmin']) {
                if ($item->key == 'tienda_id') {
                    $query->join('inventario', 'inventario.id', 'venta.inventario_id')->where('inventario.tienda_id', '=', $item->value);
                }
                if ($item->key == 'producto_id') {
                    $esta_query = strstr($query->toSql(), 'inventario');
                    if ($esta_query != "") {
                        $query->where('inventario.producto_id', '=', $item->value);
                    } else {
                        $query->join('inventario', 'inventario.id', 'venta.inventario_id')->where('inventario.producto_id', '=', $item->value);
                    }
                }
                if ($item->key == 'fecha_inicial') {
                    $date_ini = new \DateTime($item->value);
                    $query->where('fecha', '>=', $date_ini->format('Y-m-d') . " 00:00:00");
                }
                if ($item->key == 'fecha_final') {
                    $date_end = new \DateTime($item->value);
                    $query->where('fecha', '<=', $date_end->format('Y-m-d') . " 23:59:59");
                }
            } else {
                $query->join('inventario', 'inventario.id', 'venta.inventario_id')->where('inventario.tienda_id', '=', $item->value);

                if ($item->key == 'producto_id') {
                    $query->where('inventario.producto_id', '=', $item->value);
                }
                if ($item->key == 'fecha_inicial') {
                    $date_ini = new \DateTime($item->value);
                    $query->where('fecha', '>=', $date_ini->format('Y-m-d') . " 00:00:00");
                }
                if ($item->key == 'fecha_final') {
                    $date_end = new \DateTime($item->value);
                    $query->where('fecha', '<=', $date_end->format('Y-m-d') . " 23:59:59");
                }
            }
        }
        $total = $query->count();

        $ventas = $query->offset(($page - 1) * $pageSize)->limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total / $pageSize);

        foreach ($ventas as $venta) {
            $resultado [] = [
                'id' => $venta->id,
                'fecha' => $venta->fecha,
                'producto_id' => $venta->inventario->producto->id,
                'tienda' => $venta->inventario->tienda->nombre,
                'codigo' => $venta->inventario->producto->codigo,
                'nombre' => $venta->inventario->producto->nombre,
                'descripcion' => $venta->inventario->producto->descripcion,
                'precio_venta' => $venta->inventario->producto->precio_venta,
                'precio_compra' => $venta->inventario->producto->precio_compra,
                'categoria' => $venta->inventario->producto->categoria->nombre,
                'cantidad' => $venta->cantidad,
                'existencia' => $venta->existencia,
                'estado' => $venta->estado,
            ];
        }
        return ["success" => true, "ventas" => $resultado, 'pagination' => $pagination];
    }

    public function CancelarVenta($request)
    {
        $entity = Venta::find($request->get('id'));

        if ($entity->estado == 'Pagado') {
            return ['success' => false, "message" => "No es posible cancelar la venta, ya esta en estado: Pagado"];
        }
        if ($entity) {
            $entity->estado = 'Cancelada';
            $entity->save();

            $inventario = Inventario::find($entity->inventario_id);
            if ($inventario != null) {
                $inventario->existencia += $entity->cantidad;
                $inventario->save();
            }

            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que no se encontró la venta"];
    }

    public function AprobarVenta($request)
    {
        $entity = Venta::find($request->get('id'));

        if ($entity->estado == 'Cancelada') {
            return ['success' => false, "message" => "No es posible aprobar la venta, ya esta en estado: Cancelada"];
        }

        if ($entity) {
            $entity->estado = 'Pagado';
            $entity->save();

            $inventario = Inventario::find($entity->inventario_id);
            if ($inventario != null) {
                $tienda = Tienda::find($inventario->tienda_id);
                $producto = Producto::find($inventario->producto_id);
                if ($tienda != null && $producto != null) {
                    $tienda->monto_total += $entity->cantidad * $producto->precio_venta;
                    $tienda->monto_actual += $entity->cantidad * $producto->precio_venta;
                    $tienda->save();
                }
            }

            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que no se encontró la venta"];
    }

    public function EliminarVenta($request)
    {
        $entity = Venta::find($request->get('id'));

        if ($entity) {
            $entity->delete();

            $inventario = Inventario::find($entity->inventario_id);
            if ($inventario != null) {
                $inventario->existencia += $entity->cantidad;
                $inventario->save();
                $tienda = Tienda::find($inventario->tienda_id);
                $producto = Producto::find($inventario->producto_id);
                if ($tienda != null && $producto != null && $entity->estado == 'Pagado') {
                    $monto = $entity->cantidad * $producto->precio_venta;
                    if ($monto <= $tienda->monto_actual) {
                        $tienda->monto_actual -= $monto;
                        $tienda->monto_total -= $monto;
                        $tienda->save();
                    }
                }
            }
            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que no se encontró la venta"];
    }
}
