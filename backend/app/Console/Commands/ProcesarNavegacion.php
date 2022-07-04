<?php

namespace App\Console\Commands;

use App\Models\Consumo;
use App\Models\Cuotas;
use App\Models\HistorialCuota;
use App\Models\HistorialNavegacion;
use App\Models\Lectura;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;

class ProcesarNavegacion extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cac:startcaching';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comienza el proceso de recoleccion de datos de la navegacion';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->ProcesarTraza();
    }

    public function ProcesarTraza()
    {
        $access_log = config('serverfiles.accesslog');

        $archivo = file($access_log);
        $inicio = Lectura::find(1);

        $start = 0;
        $end = 0;
        $lastTimeStand = $inicio->timestand;

        if ($archivo) {
            $end = count($archivo);
        }

        if ($inicio->posicion > 0 && !empty(exec('grep -c ' . $inicio->timestand . ' ' . $access_log)[0])) {
            $start = $inicio->posicion;
        }

        for ($n = $start; $n < $end; $n++) {
            $linea = preg_replace("/\s+/", " ", trim($archivo[$n]));
            $linea = explode(" ", $linea);

            $respuesta = explode("\/", $linea[3])[0];
            $sitio = $linea[6];
            $lastTimeStand = $linea[0];
            echo $respuesta;
            $fecha = $this->convertirFechaHora($lastTimeStand, "Y-m-d ");
            $hora = $this->convertirFechaHora($lastTimeStand, "h:i:s");
            echo $fecha;
            $usuario = $linea[7];

            $ip = $linea[2];
            $consumido = $linea[4];

            $this->SalvarHistorialNavegacion($fecha, $hora, $this->crearHora($linea[1]), $ip, $sitio, $usuario, $consumido);

            if ($respuesta != "TCP_DENIED" && !Str::contains($sitio, 'onat.gob.cu') && $linea[1] != 0) {
                $consumido = ($consumido / 1024) / 1024;
                if ($usuario != '-') {
                    $this->SalvarDatosUsuario($usuario, $ip, $sitio, $fecha, $hora, $this->crearHora($linea[1]), $consumido);
                }
            }
        }

        $inicio->posicion = $end;
        $inicio->timestand = $lastTimeStand;
        $inicio->save();
        $this->ComprobarConsumoUsuario();

        exec('service squid reload');

        return true;
    }

    public function SalvarDatosUsuario($username, $ip, $sitio, $fecha, $hora, $permanencia, $consumo)
    {
        $cuota = Cuotas::firstWhere('username', '=', $username);

        if ($cuota) {
            $id = $cuota->id;
            $datos = $cuota->consumo;

            if ($datos) {
                $datos->consumo = $consumo + $datos->consumo;
                $datos->save();
            } else {
                $datos = new Consumo();
                $datos->cuotas_id = $id;
                $datos->consumo = $consumo;
                $datos->save();
            }

            $historial = new HistorialCuota();
            $historial->cuotas_id = $id;
            $historial->fecha = $fecha;
            $historial->hora = $hora;
            $historial->permanencia = $permanencia;
            $historial->ip = $ip;
            $historial->sitio = $sitio;
            $historial->consumo = $consumo;
            $historial->save();
        }
    }

    public function SalvarHistorialNavegacion($fecha, $hora, $permanencia, $ip, $sitio, $usuario, $consumo)
    {
        $entity = new HistorialNavegacion();
        echo 'Entra bien a este metodo '.$fecha;
        $entity->fecha = $fecha;
        $entity->hora = $hora;
        $entity->permanencia = $permanencia;
        $entity->ip = $ip;
        $entity->sitio = $sitio;
        $entity->usuario = $usuario;
        $entity->consumo = $consumo;

        $entity->save();
    }

    public function crearHora($milisecons)
    {
        $seconds = $milisecons / 1000;
        $minutes = '';
        $hours = '';

        $minutos = '';
        $segundos = '';
        $horas = '';

        if ($seconds > 60) {
            $minutes = $seconds / 60;
            $seconds = floor($minutes);
        }

        if ($minutes > 60) {
            $hours = $minutes / 60;
            $minutes = floor($hours);
        }

        if ($hours <= 0) {
            $horas = '00';

            $minutos = $minutes < 10 ? '0' . intval($minutes) : intval($minutes);

            $segundos = $seconds < 10 ? '0' . intval($seconds) : intval($seconds);


        } else {
            $horas = $hours < 10 ? '0' . $hours : $hours;

            $minutos = $minutes < 10 ? '0' . intval($minutes) : intval($minutes);

            $segundos = $seconds < 10 ? '0' . intval($seconds) : intval($seconds);
        }

        return $horas . ':' . $minutos . ':' . $segundos;

    }

    public function convertirFechaHora($timestand, $format)
    {
        return date($format, $timestand);
    }

    public function ComprobarConsumoUsuario()
    {
        $cuotas_user = Cuotas::all();
        $consumed_file = config('serverfiles.consumed');

        foreach ($cuotas_user as $cuota) {
            $temporalData = $cuota->consumo;

            if ($temporalData && intval($temporalData->consumo) >= $cuota->cuota && empty(exec('grep -c ' . $cuota->username . ' ' . $consumed_file)[0])) {
                file_put_contents($consumed_file, $cuota->username . "\n", FILE_APPEND);
            }
        }
    }
}
