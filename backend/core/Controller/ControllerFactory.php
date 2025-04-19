<?php
namespace Core\Controller;

class ControllerFactory {
    private static $instances = [];

    private static $map = [
        'auth' => \Controlador\AuthController::class,
        'ausencia' => \Controlador\AusenciaController::class,
        'perfil' => \Controlador\PerfilController::class,
        'experiencia' => \Controlador\ExperienciaController::class,
        'estadistica' => \Controlador\EstadisticaController::class,
        'entrevista' => \Controlador\EntrevistaController::class,
        'cargo' => \Controlador\CargoController::class,
        'convocatoria' => \Controlador\ConvocatoriaController::class,
        'vinculacion' => \Controlador\VinculacionController::class,
        'notificacion' => \Controlador\NotificacionController::class,
        'jornada' => \Controlador\JornadaController::class,
        'horaExtra' => \Controlador\HorasExtraController::class,
        'permiso' => \Controlador\PermisoController::class,
        'pazysalvo' => \Controlador\PazySalvoController::class,
        'vacaciones' => \Controlador\VacacionesController::class,
        'postulacion' => \Controlador\PostulacionController::class,
        'usuario' => \Controlador\UsuarioControlador::class,
        'empleado' => \Controlador\EmpleadoControlador::class,
        'aspirante' => \Controlador\AspiranteControlador::class,
        'chat' => \Controlador\ChatControlador::class,
        'calculo' => \Controlador\CalculoControlador::class,
        'publicaciones' => \Controlador\PublicacionesControlador::class,
        'certificado' => \Controlador\CertificadoController::class
    ];

    public static function createControllers() {
        foreach (self::$map as $key => $className) {
            if (!isset(self::$instances[$key])) {
                self::$instances[$key] = new $className();
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
