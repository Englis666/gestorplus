<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

return[
    // AUTH
    'login' => ['auth', 'iniciar'],
    'registrarse' => ['auth', 'registrar'],
    'recuperarPassword' => ['auth', 'recuperarPassword'],
    'restablecerPassword' => ['auth', 'restablecerPassword'],
    //Archivo
    'subirContrato' => ['archivos', 'subirContrato'],
    //ESTUDIO
    'agregarEstudio' => ['estudio', 'agregarEstudio'],
    //EXPERIENCIA
    'agregarExp' => ['experiencia', 'agregarExp'],
    //HORAEXTRA
    'registroHorasExtra' => ['horaExtra', 'registroHorasExtra'],
    
    // Empleado
    'solicitarQueja' => ['empleado', 'solicitarQueja'],
    //AUSENCIA
    'solicitarAusencia' => ['ausencia', 'solicitarAusencia'],
    'ausenciaRechazada' => ['ausencia', 'ausenciaRechazada'],
    'ausenciaAceptada' => ['ausencia' , 'ausenciaAceptada'],
    
    //VACACIONES
    'solicitarVacaciones' => ['vacaciones', 'solicitarVacaciones'],
    //PERMISO
    'solicitarPermiso' => ['permiso', 'solicitarPermiso'],

    // Aspirante
    'aplicacionDeAspirante' => ['aspirante', 'aplicacionDeAspirante'],

    // Chat
    'enviarMensaje' => ['chat', 'enviarMensaje'],
    'obtenerOcrearChat' => ['chat', 'obtenerOcrearChat'],
    'iniciarChat' => ['chat', 'iniciarChat'],

    // Admin
    'agregarCargo' => ['cargo', 'agregarCargo'],
    'guardarResultadosSistemaDeGestion' => ['evaluacion', 'guardarResultadosSistemaDeGestion'],
    //Convocatoria
    'agregarConvocatoria' => ['convocatoria', 'agregarConvocatoria'],
    //jornada
    'corroborarJornada' => ['jornada', 'corroborarJornada'],
    'noCorroborarJornada' => ['jornada', 'noCorroborarJornada'],
    'finalizarJornada' => ['jornada', 'finalizarJornada'],
    //notificacion
    'notificacionAceptada' => ['notificacion', 'notificacionAceptada'],
    'notificacionRechazada' => ['notificacion', 'notificacionRechazada'],
    //vacaciones
    'aceptarVacacion' => ['vacaciones', 'aceptarVacacion'],
    'rechazarVacacion' => ['vacaciones' , 'rechazarVacacion'],
    //entrevista
    'asignarEntrevista' => ['entrevista', 'asignarEntrevista'],
    //vinculacion
    'asignarVinculacion' => ['vinculacion', 'asignarVinculacion'],
   
    //permiso
    'permisoAceptado' => ['permiso', 'permisoAceptado'],
    'permisoRechazado' => ['permiso' , 'permisoRechazado'],
    'agregarPublicacion' => ['publicaciones' , 'agregarPublicacion'],
    'generarPazYSalvo' => ['pazysalvo' , 'generarPazYSalvo'],
];

?>
