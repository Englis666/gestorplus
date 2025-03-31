-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-03-2025 a las 20:59:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestorplus`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ausencia`
--

CREATE TABLE `ausencia` (
  `idausencia` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` varchar(45) NOT NULL DEFAULT 'No justificada',
  `fechaRegistro` date NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `ausencia`
--

INSERT INTO `ausencia` (`idausencia`, `fechaInicio`, `fechaFin`, `tipoAusencia`, `descripcion`, `justificada`, `fechaRegistro`, `usuario_num_doc`) VALUES
(6, '2025-03-25', '2025-03-30', 'Personal', 'Hola como vas', 'Justificada', '2025-03-25', 1014736),
(7, '2025-03-25', '2025-03-31', 'Vacaciones', 'hola como vas de nuevo', 'Justificada', '2025-03-25', 1014736),
(8, '2025-03-25', '2025-03-31', 'Enfermedad', 'hola como vas', 'Justificada', '2025-03-25', 1014736),
(9, '2025-03-25', '2025-03-31', 'Vacaciones', 'que hace', 'Justificada', '2025-03-25', 1014736),
(10, '2025-03-25', '2025-03-31', 'Enfermedad', 'Prueba', 'Justificada', '2025-03-25', 1014736),
(11, '2025-03-25', '2025-03-31', 'Personal', 'Hola como vas', 'Justificada', '2025-03-25', 1014736),
(12, '2025-03-25', '2025-03-31', 'Personal', 'Hola como vas', 'Justificada', '2025-03-25', 1014736),
(13, '2025-03-25', '2025-03-31', 'Enfermedad', 'Notificacion', 'Justificada', '2025-03-25', 1014736),
(14, '2025-03-25', '2025-03-31', 'Enfermedad', 'Hola como vas', 'Justificada', '2025-03-25', 1014736),
(15, '2025-03-25', '2025-03-31', 'Enfermedad', 'hola como vas', 'Justificada', '2025-03-25', 1014736);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ausencia_has_notificacion`
--

CREATE TABLE `ausencia_has_notificacion` (
  `id` int(11) NOT NULL,
  `ausencia_idausencia` int(11) NOT NULL,
  `notificacion_idnotificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `ausencia_has_notificacion`
--

INSERT INTO `ausencia_has_notificacion` (`id`, `ausencia_idausencia`, `notificacion_idnotificacion`) VALUES
(2, 14, 237),
(3, 14, 239),
(4, 14, 241),
(5, 15, 244);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificado`
--

CREATE TABLE `certificado` (
  `idCertificado` int(11) NOT NULL,
  `certificadoLaboral` tinyint(1) NOT NULL,
  `certificadoARL` tinyint(1) NOT NULL,
  `fechaExpedicion` date NOT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat`
--

CREATE TABLE `chat` (
  `idChat` int(11) NOT NULL,
  `usuario1` int(11) NOT NULL,
  `usuario2` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convocatoria`
--

CREATE TABLE `convocatoria` (
  `idconvocatoria` int(11) NOT NULL,
  `nombreConvocatoria` varchar(80) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cantidadConvocatoria` int(11) DEFAULT NULL,
  `cargo_idcargo` int(11) NOT NULL,
  `fecha_limite` date DEFAULT NULL,
  `fecha_apertura` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrevista`
--

CREATE TABLE `entrevista` (
  `identrevista` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `lugarMedio` varchar(45) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEntrevista` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudio`
--

CREATE TABLE `estudio` (
  `idestudio` int(45) NOT NULL,
  `nivelEstudio` varchar(45) DEFAULT NULL,
  `areaEstudio` varchar(45) DEFAULT NULL,
  `estadoEstudio` varchar(45) DEFAULT NULL,
  `fechaInicioEstudio` date DEFAULT NULL,
  `fechaFinEstudio` date DEFAULT NULL,
  `tituloEstudio` varchar(45) DEFAULT NULL,
  `institucionEstudio` varchar(45) DEFAULT NULL,
  `ubicacionEstudio` varchar(45) DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacionessg`
--

CREATE TABLE `evaluacionessg` (
  `idevaluacion` int(11) NOT NULL,
  `estado_salud` varchar(45) DEFAULT NULL,
  `evaluacionRiesgos` varchar(45) DEFAULT NULL,
  `recomendaciones` varchar(45) DEFAULT NULL,
  `aptitudLaboral` varchar(45) DEFAULT NULL,
  `comentarios` varchar(45) DEFAULT NULL,
  `entrevista_identrevista` int(11) NOT NULL,
  `entrevista_postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEvaluacion` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencialaboral`
--

CREATE TABLE `experiencialaboral` (
  `idexperienciaLaboral` varchar(45) NOT NULL,
  `profesion` varchar(45) DEFAULT NULL,
  `descripcionPerfil` varchar(45) DEFAULT NULL,
  `fechaInicioExp` date DEFAULT NULL,
  `fechaFinExp` date DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hojadevida`
--

CREATE TABLE `hojadevida` (
  `idHojadevida` int(11) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` varchar(45) DEFAULT NULL,
  `estadohojadevida` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `hojadevida`
--

INSERT INTO `hojadevida` (`idHojadevida`, `fechaNacimiento`, `direccion`, `ciudad`, `ciudadNacimiento`, `telefono`, `telefonoFijo`, `estadohojadevida`) VALUES
(38, '2006-01-02', 'call sur 99', 'bogota ', 'bogota ', '312312', '3123123123', NULL),
(39, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horaextra`
--

CREATE TABLE `horaextra` (
  `idHoraextra` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornada`
--

CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `estadoJornada` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `jornada`
--

INSERT INTO `jornada` (`idJornada`, `fecha`, `horaEntrada`, `horaSalida`, `usuario_num_doc`, `estadoJornada`) VALUES
(154, '2025-03-21', '20:32:00', '04:32:00', 1014736, 'Jornada Corroborada'),
(155, '2025-03-25', '14:58:00', '22:58:00', 1014736, 'Jornada rechazada'),
(156, '2025-03-25', '15:00:00', '23:00:00', 1014736, 'Pendiente'),
(157, '2025-03-25', '15:02:00', '23:02:00', 1014736, 'Pendiente'),
(158, '2025-03-25', '15:08:00', '23:08:00', 1014736, 'Pendiente'),
(159, '2025-03-25', '16:14:00', '00:14:00', 1014736, 'Pendiente'),
(160, '2025-03-25', '16:40:00', '00:40:00', 1014736, 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornada_has_notificacion`
--

CREATE TABLE `jornada_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `jornada_idJornada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `idmensaje` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mensaje` varchar(200) DEFAULT NULL,
  `idChat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `idnotificacion` int(11) NOT NULL,
  `descripcionNotificacion` text NOT NULL,
  `nombreCargo` varchar(25) DEFAULT NULL,
  `estadoNotificacion` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `num_doc` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`idnotificacion`, `descripcionNotificacion`, `nombreCargo`, `estadoNotificacion`, `tipo`, `num_doc`, `created_at`) VALUES
(190, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(191, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(192, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(193, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(194, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(202, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-13 hasta el dia 2025-03-29', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(204, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-30', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(206, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(208, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(210, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(215, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(217, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(218, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(220, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(221, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(222, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(223, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(224, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736, '2025-03-25 22:11:50'),
(225, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(226, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:11:50'),
(227, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:11:50'),
(228, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(229, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:11:50'),
(230, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:12:06'),
(231, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:12:06'),
(232, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:14:26'),
(233, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:14:26'),
(234, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:14:50'),
(235, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:15:23'),
(236, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:15:29'),
(237, 'Ausencia rechazada', NULL, 0, 'Rechazo', 1014736, '2025-03-25 22:15:29'),
(238, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:16:26'),
(239, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:16:26'),
(240, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:17:27'),
(241, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:17:27'),
(242, 'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31', NULL, 1, 'Ausencia', 1014736, '2025-03-25 22:23:38'),
(243, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:23:55'),
(244, 'Ausencia aceptada', NULL, 0, 'Aceptacion', 1014736, '2025-03-25 22:23:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pazysalvo`
--

CREATE TABLE `pazysalvo` (
  `idpazysalvo` int(11) NOT NULL,
  `motivo` varchar(150) NOT NULL,
  `fechaEmision` date NOT NULL,
  `estado` bit(1) NOT NULL,
  `documentoPazysalvo` tinyint(1) DEFAULT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulacion`
--

CREATE TABLE `postulacion` (
  `idpostulacion` int(11) NOT NULL,
  `estadoPostulacion` int(11) NOT NULL DEFAULT 1,
  `fecha_postulacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `convocatoria_idconvocatoria` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulacion_has_notificacion`
--

CREATE TABLE `postulacion_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idrol` int(11) NOT NULL,
  `nombreRol` varchar(45) NOT NULL,
  `estadoRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idrol`, `nombreRol`, `estadoRol`) VALUES
(1, 'Administrador', 1),
(2, 'Recursos Humanos', 1),
(3, 'Empleado', 1),
(4, 'Aspirante', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `num_doc` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(45) NOT NULL,
  `tipodDoc` varchar(40) NOT NULL,
  `password` varchar(250) NOT NULL,
  `estado` int(11) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  `rol_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`num_doc`, `nombres`, `apellidos`, `email`, `tipodDoc`, `password`, `estado`, `hojadevida_idHojadevida`, `rol_idrol`) VALUES
(1014, 'Juan Esteban ', 'Becerra Genez', 'genez@gmail.com', 'cedula', '$2y$10$ceDUJKTnwu6n/VkMCTY1rOlBo0.wg.S6MZDa437elxddmRPyI2ilW', 1, 41, 4),
(1014736, 'Englis', 'Barros', 'englis@gmail.com', 'CEDULA', '$2y$10$XNBEfw9/zT3O25hSNaC6v.d8sjc3NopI19CW2MEOmH/Mr73zC086W', 1, 38, 1),
(1014189999, 'Juan ', 'Becerra ', 'juan@gmail.com', 'cellllllll', '$2y$10$YZ73LkfFEKGydlcOqK546.uwUPRdnZwiE39Isqj1QBa0ALfyAeTLK', 1, 39, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacacion`
--

CREATE TABLE `vacacion` (
  `idvacacion` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprovadoPor` varchar(45) NOT NULL,
  `estadoVacacion` varchar(45) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vinculacion`
--

CREATE TABLE `vinculacion` (
  `idvinculacion` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoContrato` varchar(80) NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `estadoContrato` int(11) NOT NULL,
  `fechaFirma` date NOT NULL,
  `documentoContrato` tinyint(1) DEFAULT NULL,
  `evaluacionesSg_idevaluacion` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ausencia`
--
ALTER TABLE `ausencia`
  ADD PRIMARY KEY (`idausencia`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indices de la tabla `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ausencia_idausencia` (`ausencia_idausencia`),
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`idcargo`);

--
-- Indices de la tabla `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`idCertificado`),
  ADD KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`);

--
-- Indices de la tabla `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`idChat`),
  ADD KEY `usuario1` (`usuario1`),
  ADD KEY `usuario2` (`usuario2`);

--
-- Indices de la tabla `convocatoria`
--
ALTER TABLE `convocatoria`
  ADD PRIMARY KEY (`idconvocatoria`),
  ADD KEY `cargo_idcargo` (`cargo_idcargo`);

--
-- Indices de la tabla `entrevista`
--
ALTER TABLE `entrevista`
  ADD PRIMARY KEY (`identrevista`),
  ADD KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`);

--
-- Indices de la tabla `estudio`
--
ALTER TABLE `estudio`
  ADD PRIMARY KEY (`idestudio`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indices de la tabla `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  ADD PRIMARY KEY (`idevaluacion`),
  ADD KEY `entrevista_identrevista` (`entrevista_identrevista`),
  ADD KEY `evaluacionessg_ibfk_2` (`entrevista_postulacion_idpostulaciones`);

--
-- Indices de la tabla `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD PRIMARY KEY (`idexperienciaLaboral`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indices de la tabla `hojadevida`
--
ALTER TABLE `hojadevida`
  ADD PRIMARY KEY (`idHojadevida`);

--
-- Indices de la tabla `horaextra`
--
ALTER TABLE `horaextra`
  ADD PRIMARY KEY (`idHoraextra`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indices de la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`idJornada`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indices de la tabla `jornada_has_notificacion`
--
ALTER TABLE `jornada_has_notificacion`
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  ADD KEY `jornada_idJornada` (`jornada_idJornada`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`idmensaje`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `mensajes_ibfk_2` (`idChat`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`idnotificacion`),
  ADD KEY `num_doc` (`num_doc`);

--
-- Indices de la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD PRIMARY KEY (`idpazysalvo`),
  ADD KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`);

--
-- Indices de la tabla `postulacion`
--
ALTER TABLE `postulacion`
  ADD PRIMARY KEY (`idpostulacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `convocatoria_idconvocatoria` (`convocatoria_idconvocatoria`);

--
-- Indices de la tabla `postulacion_has_notificacion`
--
ALTER TABLE `postulacion_has_notificacion`
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  ADD KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idrol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`num_doc`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  ADD KEY `rol_idrol` (`rol_idrol`);

--
-- Indices de la tabla `vacacion`
--
ALTER TABLE `vacacion`
  ADD PRIMARY KEY (`idvacacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indices de la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD PRIMARY KEY (`idvinculacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `vinculacion_ibfk_2` (`evaluacionesSg_idevaluacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ausencia`
--
ALTER TABLE `ausencia`
  MODIFY `idausencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `chat`
--
ALTER TABLE `chat`
  MODIFY `idChat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `convocatoria`
--
ALTER TABLE `convocatoria`
  MODIFY `idconvocatoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `entrevista`
--
ALTER TABLE `entrevista`
  MODIFY `identrevista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estudio`
--
ALTER TABLE `estudio`
  MODIFY `idestudio` int(45) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  MODIFY `idevaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `hojadevida`
--
ALTER TABLE `hojadevida`
  MODIFY `idHojadevida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `jornada`
--
ALTER TABLE `jornada`
  MODIFY `idJornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `idmensaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `idnotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=245;

--
-- AUTO_INCREMENT de la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  MODIFY `idpazysalvo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `postulacion`
--
ALTER TABLE `postulacion`
  MODIFY `idpostulacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `vacacion`
--
ALTER TABLE `vacacion`
  MODIFY `idvacacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  MODIFY `idvinculacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ausencia`
--
ALTER TABLE `ausencia`
  ADD CONSTRAINT `ausencia_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  ADD CONSTRAINT `ausencia_has_notificacion_ibfk_1` FOREIGN KEY (`ausencia_idausencia`) REFERENCES `ausencia` (`idausencia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ausencia_has_notificacion_ibfk_2` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `certificado`
--
ALTER TABLE `certificado`
  ADD CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `convocatoria`
--
ALTER TABLE `convocatoria`
  ADD CONSTRAINT `convocatoria_ibfk_1` FOREIGN KEY (`cargo_idcargo`) REFERENCES `cargo` (`idcargo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `entrevista`
--
ALTER TABLE `entrevista`
  ADD CONSTRAINT `entrevista_ibfk_1` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudio`
--
ALTER TABLE `estudio`
  ADD CONSTRAINT `estudio_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  ADD CONSTRAINT `evaluacionessg_ibfk_1` FOREIGN KEY (`entrevista_identrevista`) REFERENCES `entrevista` (`identrevista`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluacionessg_ibfk_2` FOREIGN KEY (`entrevista_postulacion_idpostulaciones`) REFERENCES `entrevista` (`postulacion_idpostulaciones`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `horaextra`
--
ALTER TABLE `horaextra`
  ADD CONSTRAINT `horaextra_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`);

--
-- Filtros para la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `jornada_has_notificacion`
--
ALTER TABLE `jornada_has_notificacion`
  ADD CONSTRAINT `jornada_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jornada_has_notificacion_ibfk_2` FOREIGN KEY (`jornada_idJornada`) REFERENCES `jornada` (`idJornada`);

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`idChat`) REFERENCES `chat` (`idChat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD CONSTRAINT `pazysalvo_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `postulacion`
--
ALTER TABLE `postulacion`
  ADD CONSTRAINT `postulacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postulacion_ibfk_2` FOREIGN KEY (`convocatoria_idconvocatoria`) REFERENCES `convocatoria` (`idconvocatoria`);

--
-- Filtros para la tabla `postulacion_has_notificacion`
--
ALTER TABLE `postulacion_has_notificacion`
  ADD CONSTRAINT `postulacion_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postulacion_has_notificacion_ibfk_2` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`rol_idrol`) REFERENCES `rol` (`idrol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vacacion`
--
ALTER TABLE `vacacion`
  ADD CONSTRAINT `vacacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`);

--
-- Filtros para la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD CONSTRAINT `vinculacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`),
  ADD CONSTRAINT `vinculacion_ibfk_2` FOREIGN KEY (`evaluacionesSg_idevaluacion`) REFERENCES `evaluacionessg` (`idevaluacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
