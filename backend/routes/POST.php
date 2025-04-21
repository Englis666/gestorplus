<?php
return[
    // AUTH
    'login' => ['auth', 'iniciar'],
    'registrarse' => ['auth', 'registrar'],
    //Archivo
    'subirContrato' => ['archivos', 'subirContrato'],
    //ESTUDIO
    'agregarEstudio' => ['estudio', 'agregarEstudio'],
    //EXPERIENCIA
    'agregarExp' => ['experiencia', 'agregarExp'],
    'consultarExp' => ['experiencia', 'consultarExp'],
    //HORAEXTRA
    'registroHorasExtra' => ['horaExtra', 'registroHorasExtra'],
    //estudio
    'consultarEstudio' => ['estudio', 'consultarEstudio'],
    //exp
    //jornada
    
    // Empleado
    'solicitarQueja' => ['empleado', 'solicitarQueja'],
    //AUSENCIA
    'solicitarAusencia' => ['ausencia', 'solicitarAusencia'],
    'asistenciaConfirmada' => ['ausencia', 'asistenciaConfirmada'],
    'asistenciaNoConfirmada' => ['ausencia', 'asistenciaNoConfirmada'],
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
    'rechazarVacacion' => ['vacaciones' , 'aceptarVacacion'],
    //entrevista
    'asignarEntrevista' => ['entrevista', 'asignarEntrevista'],
    //vinculacion
    'asignarVinculacion' => ['vinculacion', 'asignarVinculacion'],
   
    //permiso
    'permisoAceptado' => ['permiso', 'permisoAceptado'],
    'permisoRechazado' => ['permiso' , 'permisoRechazado'],
    'agregarPublicacion' => ['publicaciones' , 'agregarPublicacion']
];

?>