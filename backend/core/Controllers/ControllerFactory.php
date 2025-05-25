<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Core\Controllers;

class ControllerFactory {
    private static $instances = [];

    private static $map = [
        'auth' => \Controller\AuthController::class,
        'archivos' => \Controller\ArchivosController::class,
        'ausencia' => \Controller\AusenciaController::class,
        'perfil' => \Controller\PerfilController::class,
        'experiencia' => \Controller\ExperienciaController::class,
        'estadistica' => \Controller\EstadisticaController::class,
        'estudio' => \Controller\EstudioController::class,
        'entrevista' => \Controller\EntrevistaController::class,
        'evaluacion' => \Controller\EvaluacionController::class,
        'cargo' => \Controller\CargoController::class,
        'convocatoria' => \Controller\ConvocatoriaController::class,
        'vinculacion' => \Controller\VinculacionController::class,
        'notificacion' => \Controller\NotificacionController::class,
        'jornada' => \Controller\JornadaController::class,
        'horaExtra' => \Controller\HorasExtraController::class,
        'hojadevida' => \Controller\HojadeVidaController::class,
        'permiso' => \Controller\PermisoController::class,
        'pazysalvo' => \Controller\PazySalvoController::class,
        'vacaciones' => \Controller\VacacionesController::class,
        'postulacion' => \Controller\PostulacionController::class,
        'usuario' => \Controller\UsuarioController::class,
        'empleado' => \Controller\EmpleadoController::class,
        'aspirante' => \Controller\AspiranteController::class,
        'chat' => \Controller\ChatController::class,
        'calculo' => \Controller\CalculoController::class,
        'publicaciones' => \Controller\PublicacionesController::class,
        'certificado' => \Controller\CertificadoController::class
    ];

    public static function createControllers($controllerNames = null) {
        $controllers = $controllerNames ? $controllerNames : array_keys(self::$map);
    
        foreach ($controllers as $name) {
            if (!isset(self::$instances[$name])) {
                if (!isset(self::$map[$name])) {
                    throw new \Exception("Controller “{$name}” no registrado.");
                }
                self::$instances[$name] = new self::$map[$name]();
            }
        }
    
        return self::$instances;
    }
    

    public static function get($name) {
        if (!isset(self::$map[$name])) {
            throw new \Exception("Controller “{$name}” no registrado.");
        }

        if (!isset(self::$instances[$name])) {
            self::$instances[$name] = new self::$map[$name]();
        }

        return self::$instances[$name];
    }
}
?>
