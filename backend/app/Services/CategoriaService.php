<?php


namespace App\Services;

use App\Models\Categoria;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CategoriaService extends BaseService
{
    public function ListarCategorias($request)
    {
        $searchKey = $request->get('searchKey');
        $searchKey = $searchKey != null ?  json_decode($searchKey) : [];

        $orderKey = $request->get('orderKey');
        $orderValue = $request->get('orderValue');
        $page = $request->get('page');
        $pageSize = $request->get('pageSize');

        $query = Categoria::query();

        $query->orderBy($orderKey, $orderValue);
        foreach ($searchKey as $item) {
            $query->where($item->key, 'like', "%$item->value%");
        }
        $total = $query->count();

        $categorias = $query->offset(($page -1 ) *$pageSize) -> limit($pageSize)->get();

        $pagination ['page'] = $page;
        $pagination ['pageSize'] = $pageSize;
        $pagination ['total'] = $total;
        $pagination ['lastPage'] = ceil($total/$pageSize);

        $resultado = array();
        foreach ($categorias as $categoria) {

            $resultado [] = [
                'id' => $categoria->id,
                'nombre' => $categoria->nombre,
                'descripcion' => $categoria->descripcion,
                'estado' => $categoria->estado
            ];
        }
        return ["success" => true, "categorias" => $resultado, 'pagination' => $pagination];
    }

    public function CargarDatos($id)
    {
        $entity = Categoria::findOrFail($id);

        $resultado = array();
        $array_resultado = array();
        if ($entity != null) {

            $resultado ['id'] = $entity->id;
            $resultado ['nombre'] = $entity->nombre;
            $resultado ['descripcion'] = $entity->descripcion;
            $resultado ['estado'] = $entity->estado;

            $array_resultado['success'] = true;
            $array_resultado['categoria'] = $resultado;

        } else {
            $array_resultado['success'] = false;
            $array_resultado['message'] = 'No se pudo encontrar el categoría solicitada';
        }
        return $array_resultado;
    }

    public function SalvarCategoria($request)
    {
        $validador = Validator::make($request->all(), [
            'categoria' => 'unique:Categoria,nombre',
        ]);

        if (count($validador->errors()) > 0 && $validador->errors()->has('categoria')) {
            return ['success' => false, 'message' => 'La categoría proporcionada ya se encuentra registrada'];
        }

        $entity = new Categoria();

        $entity->nombre = $request->get('nombre');
        $entity->descripcion = $request->get('descripcion');
        $entity->estado = $request->get('estado');

        $entity->save();

        return ['success' => true, 'message' => 'La operación se realizó correctamente'];
    }

    public function EditarCategoria($request)
    {
        $validador = Validator::make($request->all(), [
            'categoria' => 'unique:Categoria,nombre',
        ]);

        if (count($validador->errors()) > 0 && $validador->errors()->has('categoria')) {
            return ['success' => false, 'message' => 'La categoría proporcionada ya se encuentra registrada'];
        }

        $entity = Categoria::find($request->get('id'));
        if ($entity != null) {
            $entity->nombre = $request->get('nombre');
            $entity->descripcion = $request->get('descripcion');
            $entity->estado = $request->get('estado');
            $entity->save();

            return ['success' => true, 'message' => 'La operación se realizó correctamente'];
        }
        return ['success' => false, 'message' => 'La categoría solicitada no se encuentra registrada en el sistema'];
    }

    public function EliminarCategoria($id)
    {
        $entity = Categoria::find($id);
//        $productos = Producto::firstWhere('categoria_id', $id);

        if ($entity) {
            $entity->delete();
            return ['success' => true, "message" => "La operación se ha realizado correctamente"];
        }

        return ['success' => false, "message" => "La operación no se ha realizado debido a que el categoría posee productos asociados"];
    }
}
