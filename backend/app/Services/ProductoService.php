<?php


namespace App\Services;


use App\Models\Categoria;
use App\Models\Rol;
use App\Models\Tienda;
use App\Models\Views;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Producto;

class ProductoService extends BaseService
{
    public function ListarInformacionRequeridaProductos()
    {
        $categorias = Categoria::where('estado', true)->get();
        $tiendas = Tienda::where('estado', true)->get();

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

        return ['success' => true, 'categorias' => $categorias, 'tiendas' => $tiendas, 'permiso' => $array_permiso];
    }

    public function ListarProductos($request)
    {
        $resultado = array();

        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $query = Producto::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%");
        }
        $total = $query->count();

        $productos = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        foreach ($productos as $producto) {
            $resultado [] = [
                'id' => $producto->id,
                'codigo' => $producto->codigo,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'precio_venta' => $producto->precio_venta,
                'precio_compra' => $producto->precio_compra,
                'categoria' => $producto->categoria->nombre,
                'cantidad' => $producto->cantidad,
                'existencia' => $producto->existencia,
                'estado' => $producto->estado,
            ];
        }
        return ["success" => true, "productos" => $resultado, 'pagination' => $pagination];
    }

    public function CargarDatos($id)
    {
        $entity = Producto::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['codigo'] = $entity->codigo;
            $resultado ['nombre'] = $entity->nombre;
            $resultado ['descripcion'] = $entity->descripcion;
            $resultado ['precio_venta'] = $entity->precio_venta;
            $resultado ['precio_compra'] = $entity->precio_compra;
            $resultado ['cantidad'] = $entity->cantidad;
            $resultado ['existencia'] = $entity->existencia;
            $resultado ['categoria'] = $entity->categoria_id;

            $resultado ['estado'] = $entity->estado;

            $array_resultado['success'] = true;
            $array_resultado['producto'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el producto solicitado';
        }
        return $array_resultado;
    }

    public function SalvarProducto($request)
    {
        $validador = Validator::make($request->all(), [
            'codigo' => 'unique:producto,codigo',
        ]);

        if (count($validador->errors()) > 0) {
            if ($validador->errors()->has('codigo')) {
                return ['success' => false, 'message' => 'El código proporcionado ya se encuentra asignado'];
            }
        }

        if ($request->get('existencia') > $request->get('cantidad')) {
            return ['success' => false, 'message' => 'La existencia no puede ser mayor a la cantidad'];
        }

        $entity = new Producto();

        $entity->codigo = $request->get('codigo');
        $entity->nombre = $request->get('nombre');
        $entity->descripcion = $request->get('descripcion');
        $entity->precio_venta = $request->get('precio_venta');
        $entity->precio_compra = $request->get('precio_compra');
        $entity->cantidad = $request->get('cantidad');
        $entity->existencia = $request->get('existencia');
        $entity->estado = $request->get('estado');
        $entity->categoria_id = $request->get('categoria');
        $entity->save();

        return ['success' => true, 'message' => 'La operación se realizó correctamente'];
    }

    public function EditarProducto($request)
    {
        $producto_codigo = Producto::where('codigo', $request->get('codigo'))->first();
        if (!empty($producto_codigo) && $producto_codigo->id != $request->get('id')) {
            return ['success' => false, 'message' => 'El codigo proporcionado ya se encuentra asignado'];
        }
        if ($request->get('existencia') > $request->get('cantidad')) {
            return ['success' => false, 'message' => 'La existencia no puede ser mayor a la cantidad'];
        }

        $entity = Producto::find($request->get('id'));
        if ($entity != null) {
            $entity->nombre = $request->get('nombre');
            $entity->descripcion = $request->get('descripcion');
            $entity->precio_venta = $request->get('precio_venta');
            $entity->precio_compra = $request->get('precio_compra');
            $entity->cantidad = $request->get('cantidad');
            $entity->existencia = $request->get('existencia');
            $entity->estado = $request->get('estado');
            $entity->categoria_id = $request->get('categoria');
            $entity->save();

            return ['success' => true, 'message' => 'La operación se realizó correctamente'];
        }
        return ['success' => false, 'message' => 'El producto solicitado no se encuentra registrado en el sistema'];
    }

    public function EliminarProducto($id) {

        $producto = Producto::find($id);
        if($producto) {

            $producto->delete();
            return ["success"=>true, "message"=> "La operación se realizó correctamente"];
        }
        return ["success"=>false, "message"=> "El producto proporcionado no existe"];
    }
}
