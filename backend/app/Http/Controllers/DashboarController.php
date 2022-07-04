<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ReportesService;
use Illuminate\Http\Request;

class DashboarController extends Controller
{
    public  function __construct(ReportesService $reportesService)
    {
        $this->reportesService = $reportesService;
    }


    public  function listarResumenConsumo() {
        try {

            return response()->json($this->reportesService->ListarResumenConsumoDashboar(), 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 200);
        }
    }
}
