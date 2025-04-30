<?php
namespace Core\Controllers;

class ControllerFactory {
    private static $instances = [];

    private static $map = [
        'auth' => \Controlador\AuthController::class,
        'archivos' => \Controlador\ArchivosControlador::class,
        'ausencia' => \Controlador\AusenciaController::class,
        'perfil' => \Controlador\PerfilController::class,
        'experiencia' => \Controlador\ExperienciaController::class,
        'estadistica' => \Controlador\EstadisticaController::class,
        'estudio' => \Controlador\EstudioController::class,
        'entrevista' => \Controlador\EntrevistaController::class,
        'evaluacion' => \Controlador\EvaluacionController::class,
        'cargo' => \Controlador\CargoController::class,
        'convocatoria' => \Controlador\ConvocatoriaController::class,
        'vinculacion' => \Controlador\VinculacionController::class,
        'notificacion' => \Controlador\NotificacionController::class,
        'jornada' => \Controlador\JornadaController::class,
        'horaExtra' => \Controlador\HorasExtraController::class,
        'hojadevida' => \Controlador\HojadeVidaController::class,
        'permiso' => \Controlador\PermisoController::class,
        'pazysalvo' => \Controlador\PazySalvoController::class,
        'vacaciones' => \Controlador\VacacionesController::class,
        'postulacion' => \Controlador\PostulacionController::class,
        'usuario' => \Controlador\UsuarioControlador::class,
        'empleado' => \Controlador\EmpleadoControlador::class,
        'aspirante' => \Controlador\AspiranteControlador::class,
        'chat' => \Controlador\ChatController::class,
        'calculo' => \Controlador\CalculoControlador::class,
        'publicaciones' => \Controlador\PublicacionesControlador::class,
        'certificado' => \Controlador\CertificadoController::class
    ];

    public static function createControllers($controllerNames = null) {
        $controllers = $controllerNames ? $controllerNames : array_keys(self::$map);
    
        foreach ($controllers as $name) {
            if (!isset(self::$instances[$name])) {
                if (!isset(self::$map[$name])) {
                    throw new \Exception("Controlador “{$name}” no registrado.");
                }
                self::$instances[$name] = new self::$map[$name]();
            }
        }
    
        return self::$instances;
    }
    

    public static function get($name) {
        if (!isset(self::$map[$name])) {
            throw new \Exception("Controlador “{$name}” no registrado.");
        }

        if (!isset(self::$instances[$name])) {
            self::$instances[$name] = new self::$map[$name]();
        }

        return self::$instances[$name];
    }
}
?>
