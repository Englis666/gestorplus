<?php
return [
        // Usuario
        'obtenerConvocatorias' => ['convocatoria', 'obtenerConvocatorias'],
        'obtenerTotalEstadisticas' => ['estadistica', 'obtenerTotalEstadisticas'],
        'obtenerRRHH' => ['usuario', 'obtenerRRHH'],        
        'obtenerDatosParaCertificado' => ['certificado', 'obtenerDatosParaCertificado'],
        'obtenerNotificaciones' => ['notificacion', 'obtenerNotificaciones'],
        'obtenerEstudio' => ['estudio', 'obtenerEstudio'],
        'obtenerExperiencia' => ['experiencia', 'obtenerExperiencia'],

        //Perfil
        'datosPerfil' => ['perfil', 'datosPerfil'],
        
        // Empleado
        'obtenerJornadas' => ['empleado', 'obtenerJornadas'],
        'obtenerAusencias' => ['ausencia', 'obtenerAusencias'],
        'obtenerMisVacaciones' => ['empleado', 'obtenerMisVacaciones'],
        'obtenerMiPazySalvo' => ['empleado', 'obtenerMiPazYSalvo'],
        'obtenerPermisos' => ['permiso', 'obtenerPermisos'],

        // Aspirante
        'obtenerPostulacionesAspirante' => ['postulacion', 'obtenerPostulacionesAspirante'],
        'obtenerDetalleConvocatoria' => ['convocatoria', 'obtenerDetalleConvocatoria'],
        'verificarPostulacion' => ['postulacion', 'verificarPostulacion'],
        'obtenerNotificacionesAspirante' => ['notificacion', 'obtenerNotificacionesAspirante'],

        // Chat
        'obtenerMensajes' => ['chat', 'obtenerMensajes'],

        // Admin
        'obtenerVinculaciones' => ['vinculacion', 'obtenerVinculaciones'],
        'obtenerCargos' => ['cargo', 'obtenerCargos'],
        'obtenerPostulaciones' => ['postulacion', 'obtenerPostulaciones'],
        //arreglar
        'obtenerEmpleados' => ['empleado', 'obtenerEmpleados'],
        'obtenerPazYSalvos' => ['pazysalvo', 'obtenerPazYSalvos'],
        'obtenerTodasLasNotificaciones' => ['notificacion', 'obtenerTodasLasNotificaciones'],
        'obtenerTodasLasJornadas' => ['jornada', 'obtenerTodasLasJornadas'],
        'obtenerTodasLasAusencias' => ['ausencia', 'obtenerTodasLasAusencias'],
        //arreglar
        'obtenerUsuarios' => ['admin', 'obtenerUsuarios'],
        //cargos definir aun
        'obtenerCargosParaConvocatorias' => ['admin', 'obtenerCargosParaConvocatorias'],
        'obtenerEntrevistas' => ['entrevista', 'obtenerEntrevistas'],
        'obtenerTodasLasHorasExtra' => ['horaExtra', 'obtenerTodasLasHorasExtra'],
        'obtenerTodasLasVacaciones' => ['vacaciones', 'obtenerTodasLasVacaciones'],
        'obtenerDatosDelEntrevistado' => ['entrevista', 'obtenerDatosDelEntrevistado'],
        'obtenerTodasLasEstadisticas' => ['estadistica', 'obtenerTodasLasEstadisticas'],
        'obtenerSistemaDeGestion' => ['evaluacion', 'obtenerSistemaDeGestion'],
        'buscarIdEvaluacion' => ['evaluacion', 'buscarIdEvaluacion'],
        'obtenerTodosLosPermisos' => ['permiso' , 'obtenerTodosLosPermisos'],
        
        //Calculo
        'calcularPostulacionesEnConvocatorias' => ['calculo', 'calcularPostulacionesEnConvocatorias'],
        'calcularHorasExtra' =>  ['calculo', 'calcularHorasExtra'],
        'obtenerMinutosTrabajadosDelEmpleado' => ['calculo', 'obtenerMinutosTrabajadosDelEmpleado'],
        'obtenerMinutosTrabajados' => ['calculo' , 'obtenerMinutosTrabajados'],

        //Publicacion
        'obtenerPublicacionPorTipoDeContrato' => ['publicaciones', 'obtenerPublicacionPorTipoDeContrato'],
];
?>