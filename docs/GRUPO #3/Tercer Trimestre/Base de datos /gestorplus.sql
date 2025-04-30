-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2024 a las 00:30:55
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

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
-- Estructura de tabla para la tabla `ausencias`
--

CREATE TABLE `ausencias` (
  `idausencias` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` bit(1) DEFAULT NULL,
  `fechaRegistro` date NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ausencias`
--

INSERT INTO `ausencias` (`idausencias`, `fechaInicio`, `fechaFin`, `tipoAusencia`, `descripcion`, `justificada`, `fechaRegistro`, `usuarios_num_doc`, `usuarios_roles_idrol`, `notificaciones_idnotificacion`) VALUES
(3, '2024-09-11', '2024-09-18', 'sada', 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', NULL, '2024-09-23', 123, 3, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

CREATE TABLE `cargos` (
  `idcargos` int(11) NOT NULL,
  `nombreCargo` varchar(45) NOT NULL,
  `estadoCargo` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargos`
--

INSERT INTO `cargos` (`idcargos`, `nombreCargo`, `estadoCargo`) VALUES
(1, 'Desarollador de software', b'1'),
(2, 'Ingeniero Industrial', b'1'),
(3, 'Contador', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratos`
--

CREATE TABLE `contratos` (
  `idcontrato` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoContrato` varchar(50) DEFAULT NULL,
  `salario` decimal(10,2) NOT NULL,
  `estadoContrato` bit(1) NOT NULL,
  `fechaFirma` date NOT NULL,
  `documentoContrato` tinyint(1) DEFAULT NULL,
  `postulaciones_idpostulaciones` int(11) NOT NULL,
  `postulaciones_usuarios_num_doc` int(11) NOT NULL,
  `postulaciones_usuarios_hojadevida_idHojadevida` int(11) DEFAULT NULL,
  `cargos_idcargos` int(11) NOT NULL,
  `postulaciones_usuarios_roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contratos`
--

INSERT INTO `contratos` (`idcontrato`, `fechaInicio`, `fechaFin`, `tipoContrato`, `salario`, `estadoContrato`, `fechaFirma`, `documentoContrato`, `postulaciones_idpostulaciones`, `postulaciones_usuarios_num_doc`, `postulaciones_usuarios_hojadevida_idHojadevida`, `cargos_idcargos`, `postulaciones_usuarios_roles_idrol`) VALUES
(6, '2024-09-18', '2024-10-02', 'bjbjbj', 55555.00, b'1', '2024-09-11', NULL, 1, 123, 4, 3, 3),
(7, '2024-09-18', '2024-10-02', 'bjbjbj', 55555.00, b'1', '2024-09-11', NULL, 1, 123, 4, 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudios`
--

CREATE TABLE `estudios` (
  `id_estudios` int(11) NOT NULL,
  `nivelEstudio` varchar(25) NOT NULL,
  `areaEstudio` varchar(25) NOT NULL,
  `estadoEstudio` varchar(15) NOT NULL,
  `fechaInicioEstudio` date NOT NULL,
  `fechaFinEstudio` date NOT NULL,
  `tituloEstudio` varchar(45) NOT NULL,
  `ubicacionEstudio` varchar(50) DEFAULT NULL,
  `institucionEstudio` varchar(100) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudios`
--

INSERT INTO `estudios` (`id_estudios`, `nivelEstudio`, `areaEstudio`, `estadoEstudio`, `fechaInicioEstudio`, `fechaFinEstudio`, `tituloEstudio`, `ubicacionEstudio`, `institucionEstudio`, `hojadevida_idHojadevida`) VALUES
(1, 'asdsad', 'dsadsa', 'dsadsa', '2024-10-09', '2024-09-18', 'dsadsa', 'dsadsa', 'dsadsadsa', 4),
(2, 'SADDSA', 'DSA', 'adsdsa', '2024-09-09', '2024-09-25', 'dsadsa', 'dsadsadsa', 'dsadsadsa', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencialaboral`
--

CREATE TABLE `experiencialaboral` (
  `id_experiencia` int(11) NOT NULL,
  `profesion` varchar(45) NOT NULL,
  `descripcionPerfil` varchar(45) NOT NULL,
  `fechaInicioExp` date NOT NULL,
  `fechaFinExp` date NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `experiencialaboral`
--

INSERT INTO `experiencialaboral` (`id_experiencia`, `profesion`, `descripcionPerfil`, `fechaInicioExp`, `fechaFinExp`, `hojadevida_idHojadevida`) VALUES
(1, 'sddsasadsad', 'asffsafsa', '2024-09-18', '2024-09-17', 4),
(2, 'adsdsadsa', 'adsdsadsa', '2024-09-18', '2024-09-30', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hojadevida`
--

CREATE TABLE `hojadevida` (
  `idHojadevida` int(11) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `estadohojadevida` int(11) NOT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hojadevida`
--

INSERT INTO `hojadevida` (`idHojadevida`, `fechaNacimiento`, `direccion`, `estadohojadevida`, `ciudad`, `ciudadNacimiento`, `telefono`, `telefonoFijo`) VALUES
(3, '2024-09-11', 'sads', 1, 'addsa', 'asdsad', '53151351', '531531'),
(4, '2024-09-11', 'sads', 1, 'addsa', 'asdsad', '53151351', '531531'),
(5, '0000-00-00', 'asda', 1, 'sddsadsa', 'dsadsa', '65436436', '643643');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horasextra`
--

CREATE TABLE `horasextra` (
  `idHorasextra` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horasextra`
--

INSERT INTO `horasextra` (`idHorasextra`, `fecha`, `horasExtra`, `usuarios_num_doc`, `usuarios_roles_idrol`) VALUES
(1, '2024-09-18', '20:17:00', 123, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornada`
--

CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time NOT NULL,
  `estadoJornada` int(11) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jornada`
--

INSERT INTO `jornada` (`idJornada`, `fecha`, `horaEntrada`, `horaSalida`, `estadoJornada`, `usuarios_num_doc`, `usuarios_roles_idrol`, `notificaciones_idnotificacion`) VALUES
(4, '2024-09-18', '19:59:00', '21:55:00', 1, 123, 3, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `idnotificacion` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo` varchar(150) NOT NULL,
  `estadoNotificacion` bit(1) NOT NULL,
  `num_doc` int(11) NOT NULL,
  `nombreCargo` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`idnotificacion`, `descripcion`, `tipo`, `estadoNotificacion`, `num_doc`, `nombreCargo`) VALUES
(1, 'El usuario con número de documento 123 y con los nombres TEST ha realizado una postulación a la vacante con el cargo Contador', 'postulacion', b'1', 123, 'Contador'),
(2, 'El usuario con número de documento 789 y con los nombres YISED ha realizado una postulación a la vacante con el cargo Contador', 'postulacion', b'1', 789, 'Contador'),
(8, 'Nueva jornada registrada por el usuario con documento: 123 y con el nombre TEST', 'Jornada', b'1', 123, ''),
(9, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, ''),
(14, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, NULL),
(15, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, NULL),
(16, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, NULL),
(17, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, NULL),
(18, 'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia', 'Ausencia', b'1', 123, NULL);

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
  `contratos_idcontrato` int(11) NOT NULL,
  `contratos_postulaciones_idpostulaciones` int(11) NOT NULL,
  `contratos_postulaciones_usuarios_num_doc` int(11) NOT NULL,
  `contratos_cargos_idcargos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulaciones`
--

CREATE TABLE `postulaciones` (
  `idpostulaciones` int(11) NOT NULL,
  `estadoPostulacion` bit(1) NOT NULL,
  `vacantes_idvacantes` int(11) NOT NULL,
  `vacantes_cargos_idcargos` int(11) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_hojadevida_idHojadevida` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `postulaciones`
--

INSERT INTO `postulaciones` (`idpostulaciones`, `estadoPostulacion`, `vacantes_idvacantes`, `vacantes_cargos_idcargos`, `usuarios_num_doc`, `usuarios_hojadevida_idHojadevida`, `usuarios_roles_idrol`, `notificaciones_idnotificacion`) VALUES
(1, b'1', 1, 3, 123, 4, 3, 1),
(2, b'1', 1, 3, 789, 5, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `quejasreclamos`
--

CREATE TABLE `quejasreclamos` (
  `idQuejasReclamos` int(11) NOT NULL,
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipoQuejaReclamo` varchar(45) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `estado` bit(1) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL,
  `nombreRol` varchar(20) NOT NULL,
  `estadoRol` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idrol`, `nombreRol`, `estadoRol`) VALUES
(1, 'Administrador', b'1'),
(2, 'Recursos humanos', b'1'),
(3, 'Empleados', b'1'),
(4, 'Aspirantes', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `num_doc` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `tipodDoc` varchar(20) NOT NULL,
  `password` varchar(150) NOT NULL,
  `estado` bit(1) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  `roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`num_doc`, `nombres`, `apellidos`, `email`, `tipodDoc`, `password`, `estado`, `hojadevida_idHojadevida`, `roles_idrol`) VALUES
(123, 'TEST', 'ALEX', 'alex@gmail.es', 'Cedula', '$2y$10$yYnNQSqK8pzNuhdj7H8fZ.x10j7GKG5bk9mlZiufBkR3yTUKMEKSC', b'1', 4, 3),
(789, 'YISED', 'YONAIKER', 'YISED@gmail.com', 'Cedula', '$2y$10$Hlp.zusVSIUQe14puqhbcOA6K0mFEUSXI3D4ZiBcMTM/ZvIHkdruW', b'1', 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacaciones`
--

CREATE TABLE `vacaciones` (
  `idvacaciones` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprobadoPor` varchar(25) NOT NULL,
  `estado` bit(1) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacantes`
--

CREATE TABLE `vacantes` (
  `idvacantes` int(11) NOT NULL,
  `nombreVacante` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cargos_idcargos` int(11) NOT NULL,
  `habilidades` text NOT NULL,
  `cantidadVacantes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vacantes`
--

INSERT INTO `vacantes` (`idvacantes`, `nombreVacante`, `descripcion`, `requisitos`, `salario`, `cargos_idcargos`, `habilidades`, `cantidadVacantes`) VALUES
(1, 'Contador', 'asdadsdsa', 'dsadsadsa', 50000.00, 3, 'saddsadsa', 55);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD PRIMARY KEY (`idausencias`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  ADD KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`);

--
-- Indices de la tabla `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`idcargos`);

--
-- Indices de la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`idcontrato`),
  ADD KEY `postulaciones_idpostulaciones` (`postulaciones_idpostulaciones`),
  ADD KEY `postulaciones_usuarios_num_doc` (`postulaciones_usuarios_num_doc`),
  ADD KEY `postulaciones_usuarios_hojadevida_idHojadevida` (`postulaciones_usuarios_hojadevida_idHojadevida`),
  ADD KEY `cargos_idcargos` (`cargos_idcargos`),
  ADD KEY `postulaciones_usuarios_roles_idrol` (`postulaciones_usuarios_roles_idrol`);

--
-- Indices de la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD PRIMARY KEY (`id_estudios`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indices de la tabla `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD PRIMARY KEY (`id_experiencia`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indices de la tabla `hojadevida`
--
ALTER TABLE `hojadevida`
  ADD PRIMARY KEY (`idHojadevida`);

--
-- Indices de la tabla `horasextra`
--
ALTER TABLE `horasextra`
  ADD PRIMARY KEY (`idHorasextra`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`);

--
-- Indices de la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`idJornada`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  ADD KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`idnotificacion`);

--
-- Indices de la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD PRIMARY KEY (`idpazysalvo`),
  ADD KEY `contratos_idcontrato` (`contratos_idcontrato`),
  ADD KEY `contratos_postulaciones_idpostulaciones` (`contratos_postulaciones_idpostulaciones`),
  ADD KEY `contratos_postulaciones_usuarios_num_doc` (`contratos_postulaciones_usuarios_num_doc`),
  ADD KEY `contratos_cargos_idcargos` (`contratos_cargos_idcargos`);

--
-- Indices de la tabla `postulaciones`
--
ALTER TABLE `postulaciones`
  ADD PRIMARY KEY (`idpostulaciones`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  ADD KEY `usuarios_hojadevida_idHojadevida` (`usuarios_hojadevida_idHojadevida`),
  ADD KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`),
  ADD KEY `vacantes_idvacantes` (`vacantes_idvacantes`),
  ADD KEY `vacantes_cargos_idcargos` (`vacantes_cargos_idcargos`);

--
-- Indices de la tabla `quejasreclamos`
--
ALTER TABLE `quejasreclamos`
  ADD PRIMARY KEY (`idQuejasReclamos`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`num_doc`),
  ADD KEY `roles_idrol` (`roles_idrol`),
  ADD KEY `fk_usuarios_hojadevida` (`hojadevida_idHojadevida`);

--
-- Indices de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD PRIMARY KEY (`idvacaciones`),
  ADD KEY `usuarios_num_doc` (`usuarios_num_doc`),
  ADD KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`);

--
-- Indices de la tabla `vacantes`
--
ALTER TABLE `vacantes`
  ADD PRIMARY KEY (`idvacantes`),
  ADD KEY `cargos_idcargos` (`cargos_idcargos`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `idausencias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cargos`
--
ALTER TABLE `cargos`
  MODIFY `idcargos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `contratos`
--
ALTER TABLE `contratos`
  MODIFY `idcontrato` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estudios`
--
ALTER TABLE `estudios`
  MODIFY `id_estudios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  MODIFY `id_experiencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `hojadevida`
--
ALTER TABLE `hojadevida`
  MODIFY `idHojadevida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `horasextra`
--
ALTER TABLE `horasextra`
  MODIFY `idHorasextra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `jornada`
--
ALTER TABLE `jornada`
  MODIFY `idJornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `idnotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  MODIFY `idpazysalvo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `postulaciones`
--
ALTER TABLE `postulaciones`
  MODIFY `idpostulaciones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `quejasreclamos`
--
ALTER TABLE `quejasreclamos`
  MODIFY `idQuejasReclamos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `num_doc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=790;

--
-- AUTO_INCREMENT de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  MODIFY `idvacaciones` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vacantes`
--
ALTER TABLE `vacantes`
  MODIFY `idvacantes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD CONSTRAINT `ausencias_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  ADD CONSTRAINT `ausencias_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`),
  ADD CONSTRAINT `ausencias_ibfk_3` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`postulaciones_idpostulaciones`) REFERENCES `postulaciones` (`idpostulaciones`),
  ADD CONSTRAINT `contratos_ibfk_2` FOREIGN KEY (`postulaciones_usuarios_num_doc`) REFERENCES `postulaciones` (`usuarios_num_doc`),
  ADD CONSTRAINT `contratos_ibfk_3` FOREIGN KEY (`postulaciones_usuarios_hojadevida_idHojadevida`) REFERENCES `postulaciones` (`usuarios_hojadevida_idHojadevida`),
  ADD CONSTRAINT `contratos_ibfk_4` FOREIGN KEY (`cargos_idcargos`) REFERENCES `cargos` (`idcargos`),
  ADD CONSTRAINT `contratos_ibfk_5` FOREIGN KEY (`postulaciones_usuarios_roles_idrol`) REFERENCES `postulaciones` (`usuarios_roles_idrol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`);

--
-- Filtros para la tabla `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`);

--
-- Filtros para la tabla `horasextra`
--
ALTER TABLE `horasextra`
  ADD CONSTRAINT `horasextra_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  ADD CONSTRAINT `horasextra_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  ADD CONSTRAINT `jornada_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`),
  ADD CONSTRAINT `jornada_ibfk_3` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD CONSTRAINT `pazysalvo_ibfk_1` FOREIGN KEY (`contratos_idcontrato`) REFERENCES `contratos` (`idcontrato`),
  ADD CONSTRAINT `pazysalvo_ibfk_2` FOREIGN KEY (`contratos_postulaciones_idpostulaciones`) REFERENCES `contratos` (`postulaciones_idpostulaciones`),
  ADD CONSTRAINT `pazysalvo_ibfk_3` FOREIGN KEY (`contratos_postulaciones_usuarios_num_doc`) REFERENCES `contratos` (`postulaciones_usuarios_num_doc`),
  ADD CONSTRAINT `pazysalvo_ibfk_4` FOREIGN KEY (`contratos_cargos_idcargos`) REFERENCES `cargos` (`idcargos`);

--
-- Filtros para la tabla `postulaciones`
--
ALTER TABLE `postulaciones`
  ADD CONSTRAINT `postulaciones_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_ibfk_3` FOREIGN KEY (`usuarios_hojadevida_idHojadevida`) REFERENCES `usuarios` (`hojadevida_idHojadevida`) ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_ibfk_4` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_ibfk_7` FOREIGN KEY (`vacantes_idvacantes`) REFERENCES `vacantes` (`idvacantes`) ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_ibfk_8` FOREIGN KEY (`vacantes_cargos_idcargos`) REFERENCES `vacantes` (`cargos_idcargos`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `quejasreclamos`
--
ALTER TABLE `quejasreclamos`
  ADD CONSTRAINT `quejasreclamos_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  ADD CONSTRAINT `quejasreclamos_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_hojadevida` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`roles_idrol`) REFERENCES `roles` (`idrol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  ADD CONSTRAINT `vacaciones_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`);

--
-- Filtros para la tabla `vacantes`
--
ALTER TABLE `vacantes`
  ADD CONSTRAINT `vacantes_ibfk_1` FOREIGN KEY (`cargos_idcargos`) REFERENCES `cargos` (`idcargos`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
