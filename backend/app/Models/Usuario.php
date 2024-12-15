<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuario'; 
    protected $primaryKey = 'num_doc'; 
    public $timestamps = false; 

    protected $fillable = [
        'num_doc', 'nombres', 'apellidos', 'email', 'tipodDoc', 'password', 'estado', 'rol_idrol', 'hojadevida_idHojadevida'
    ];

    // Relación con HojaDeVida
    public function hojaDeVida()
    {
        return $this->belongsTo(HojaDeVida::class, 'idHojadevida', 'hojadevida_idHojadevida');
    }

    // Relación con Jornada (si un usuario tiene muchas jornadas)
    public function jornadas()
    {
        return $this->hasMany(Jornada::class, 'usuario_num_doc', 'num_doc');
    }

    // Relación con Notificaciones
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'num_doc', 'num_doc');
    }

    // Método de registro
    public function registrar($data)
    {
        DB::beginTransaction();  

        try {
            $hojaDeVida = new HojaDeVida(); 
            $hojaDeVida->save();
            $idHojadevida = $hojaDeVida->id;

            // Crear el usuario
            $usuario = new Usuario();
            $usuario->num_doc = $data['num_doc'];
            $usuario->nombres = $data['nombres'];
            $usuario->apellidos = $data['apellidos'];
            $usuario->email = $data['email'];
            $usuario->tipodDoc = $data['tipodDoc'];
            $usuario->password = bcrypt($data['password']);
            $usuario->estado = $data['estado'];
            $usuario->rol_idrol = $data['rol_idrol'];
            $usuario->hojadevida_idHojadevida = $idHojadevida;
            $usuario->save();

            DB::commit(); 

            return ['message' => 'Usuario registrado correctamente'];
        } catch (\Exception $e) {
            DB::rollBack(); 
            return ['message' => 'Error al registrar: ' . $e->getMessage()];
        }
    }

    // Método de inicio de sesión
    public function inicioSesion($data)
    {
        $usuario = Usuario::where('num_doc', $data['num_doc'])->first();

        if (!$usuario || !password_verify($data['password'], $usuario->password)) {
            return false;
        }

        // Si el rol no es 4, registra la jornada y notificación
        if ($usuario->rol_idrol != 4) {
            $fecha = now();
            $horaEntrada = $fecha->format('H:i');
            $horaSalida = $fecha->addHours(8)->format('H:i');

            // Registrar la jornada
            $jornada = new Jornada(); // Asumimos que tienes el modelo Jornada
            $jornada->fecha = $fecha->toDateString();
            $jornada->horaEntrada = $horaEntrada;
            $jornada->horaSalida = $horaSalida;
            $jornada->usuario_num_doc = $usuario->num_doc;
            $jornada->estadoJornada = 1;
            $jornada->save();

            $notificacion = new Notificacion();
            $notificacion->descripcionNotificacion = "Nueva jornada registrada para el usuario {$usuario->num_doc} ({$usuario->nombres})";
            $notificacion->estadoNotificacion = 1;
            $notificacion->tipo = 'Jornada';
            $notificacion->num_doc = $usuario->num_doc;
            $notificacion->save();
        }

        return [
            'num_doc' => $usuario->num_doc,
            'nombres' => $usuario->nombres,
            'rol' => $usuario->rol_idrol,
            'hojadevida_idHojadevida' => $usuario->hojadevida_idHojadevida
        ];
    }

    public function obtenerConvocatorias()
    {
        return Convocatoria::join('cargo as ca', 'ca.idcargo', '=', 'convocatoria.cargo_idcargo')
            ->select('convocatoria.*', 'ca.*')
            ->get();
    }

    public function obtenerTotalEstadisticas()
    {
        $resultados = Notificacion::selectRaw('
                SUM(CASE WHEN tipo = "Jornada" THEN 1 ELSE 0 END) AS totalEntradas,
                SUM(CASE WHEN tipo = "Ausencias" THEN 1 ELSE 0 END) AS totalAusencias
            ')
            ->first();

        return [
            'totalEntradas' => $resultados->totalEntradas ?? 0,
            'totalAusencias' => $resultados->totalAusencias ?? 0
        ];
    }
}

?>