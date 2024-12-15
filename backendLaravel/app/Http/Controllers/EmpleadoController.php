<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empleado;

class EmpleadoControlador extends Controller
{
    public function obtenerNotificaciones()
    {
        $notificaciones = Notificacion::all();
        return response()->json(['Notificaciones' => $notificaciones]);
    }

    public function obtenerJornadas()
    {
        $jornadas = Jornada::with('usuario')
                            ->get();
        return response()->json(['jornadas' => $jornadas]);

    }

    public function obtenerAusencias()
    {
        $ausencias = Ausencia::all();
        return response()->json(['Ausencias' => $ausencias]);
    }
}



?>