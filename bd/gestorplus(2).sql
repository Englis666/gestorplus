-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 09, 2024 at 11:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestorplus`
--

-- --------------------------------------------------------

--
-- Table structure for table `ausencia`
--

CREATE TABLE `ausencia` (
  `idausencia` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` tinyint(4) NOT NULL,
  `fechaRegistro` date NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ausencia`
--

INSERT INTO `ausencia` (`idausencia`, `fechaInicio`, `fechaFin`, `tipoAusencia`, `descripcion`, `justificada`, `fechaRegistro`, `usuario_num_doc`) VALUES
(1, '2024-12-12', '2024-12-21', 'INCAPACIDAD', 'ENFERMEDAD', 1, '2024-12-05', 1014);

-- --------------------------------------------------------

--
-- Table structure for table `ausencia_has_notificacion`
--

CREATE TABLE `ausencia_has_notificacion` (
  `id` int(11) NOT NULL,
  `ausencia_idausencia` int(11) DEFAULT NULL,
  `notificacion_idnotificacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ausencia_has_notificacion`
--

INSERT INTO `ausencia_has_notificacion` (`id`, `ausencia_idausencia`, `notificacion_idnotificacion`) VALUES
(1, 2, 39);

-- --------------------------------------------------------

--
-- Table structure for table `cargo`
--

CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `cargo`
--

INSERT INTO `cargo` (`idcargo`, `nombreCargo`, `estadoCargo`) VALUES
(1, 'Desarollador', 1);

-- --------------------------------------------------------

--
-- Table structure for table `certificado`
--

CREATE TABLE `certificado` (
  `idCertificado` int(11) NOT NULL,
  `certificadoLaboral` tinyint(1) NOT NULL,
  `certificadoARL` tinyint(1) NOT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `convocatoria`
--

CREATE TABLE `convocatoria` (
  `idconvocatoria` int(11) NOT NULL,
  `nombreConvocatoria` varchar(80) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cantidadConvocatoria` int(11) DEFAULT NULL,
  `cargo_idcargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `convocatoria`
--

INSERT INTO `convocatoria` (`idconvocatoria`, `nombreConvocatoria`, `descripcion`, `requisitos`, `salario`, `cantidadConvocatoria`, `cargo_idcargo`) VALUES
(1, 'test', 'ASDASD', 'ASDASD', 55000.00, 50, 1);

-- --------------------------------------------------------

--
-- Table structure for table `entrevista`
--

CREATE TABLE `entrevista` (
  `identrevista` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `lugarMedio` varchar(45) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEntrevista` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `entrevista`
--

INSERT INTO `entrevista` (`identrevista`, `fecha`, `hora`, `lugarMedio`, `postulacion_idpostulaciones`, `estadoEntrevista`) VALUES
(2, '2024-12-12', '18:00:00', 'CHAPINERO', 7, 0),
(3, '2024-12-10', '14:00:00', 'CHAPINERO', 8, 0);

-- --------------------------------------------------------

--
-- Table structure for table `estudio`
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

--
-- Dumping data for table `estudio`
--

INSERT INTO `estudio` (`idestudio`, `nivelEstudio`, `areaEstudio`, `estadoEstudio`, `fechaInicioEstudio`, `fechaFinEstudio`, `tituloEstudio`, `institucionEstudio`, `ubicacionEstudio`, `hojadevida_idHojadevida`) VALUES
(1, 'asd', 'asd', '1', '2000-06-06', '2024-12-03', 'asd', 'asd', 'asd', 24);

-- --------------------------------------------------------

--
-- Table structure for table `evaluacionessg`
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

--
-- Dumping data for table `evaluacionessg`
--

INSERT INTO `evaluacionessg` (`idevaluacion`, `estado_salud`, `evaluacionRiesgos`, `recomendaciones`, `aptitudLaboral`, `comentarios`, `entrevista_identrevista`, `entrevista_postulacion_idpostulaciones`, `estadoEvaluacion`) VALUES
(12, 'ES UNA MIERDA', 'TIENE CANCER', 'NO ', 'NO APTO', 'xd', 2, 7, 'No apto'),
(13, 'as', 'asd', 'asd', 'asd', 'asd', 3, 8, 'No apto');

-- --------------------------------------------------------

--
-- Table structure for table `experiencialaboral`
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
-- Table structure for table `hojadevida`
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
-- Dumping data for table `hojadevida`
--

INSERT INTO `hojadevida` (`idHojadevida`, `fechaNacimiento`, `direccion`, `ciudad`, `ciudadNacimiento`, `telefono`, `telefonoFijo`, `estadohojadevida`) VALUES
(23, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(24, '2024-12-12', 'Calle 86', NULL, 'BOGOTA', '513531', '2135235', b'1'),
(25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(27, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(29, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(30, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(31, NULL, NULL, NULL, NULL, NULL, NULL, b'1'),
(32, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `horaextra`
--

CREATE TABLE `horaextra` (
  `idHoraextra` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jornada`
--

CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `estadoJornada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `jornada`
--

INSERT INTO `jornada` (`idJornada`, `fecha`, `horaEntrada`, `horaSalida`, `usuario_num_doc`, `estadoJornada`) VALUES
(46, '2024-12-08', '02:10:00', '10:10:00', 10224, 1),
(47, '2024-12-08', '13:25:00', '21:25:00', 10224, 1),
(48, '2024-12-08', '17:40:00', '01:40:00', 1014, 1),
(49, '2024-12-08', '18:04:00', '02:04:00', 1014, 1),
(50, '2024-12-08', '18:26:00', '02:26:00', 1014, 1),
(51, '2024-12-08', '18:52:00', '02:52:00', 1014, 1),
(52, '2024-12-08', '18:53:00', '02:53:00', 7777, 1),
(53, '2024-12-09', '14:36:00', '22:36:00', 10224, 1),
(54, '2024-12-09', '14:37:00', '22:37:00', 10224, 1),
(55, '2024-12-09', '14:54:00', '22:54:00', 10224, 1),
(56, '2024-12-09', '14:58:00', '22:58:00', 10224, 1);

-- --------------------------------------------------------

--
-- Table structure for table `jornada_has_notificacion`
--

CREATE TABLE `jornada_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `jornada_idJornada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `idnotificacion` int(11) NOT NULL,
  `descripcionNotificacion` text NOT NULL,
  `nombreCargo` varchar(25) DEFAULT NULL,
  `estadoNotificacion` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `notificacion`
--

INSERT INTO `notificacion` (`idnotificacion`, `descripcionNotificacion`, `nombreCargo`, `estadoNotificacion`, `tipo`, `num_doc`) VALUES
(34, 'Nueva jornada registrada por inicio de sesion para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(35, 'Nueva jornada registrada por inicio de sesion para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(36, 'Nueva jornada registrada por inicio de sesion para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(37, 'Nueva jornada registrada por inicio de sesion para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(38, 'El usuario con nÃºmero de documento 1014 y con los nombres TEST ha solicitado una ausencia', NULL, 1, 'ausencia', 1014),
(39, 'El usuario con nÃºmero de documento 1014 y con los nombres TEST ha solicitado una ausencia', NULL, 1, 'ausencia', 1014),
(44, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(45, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(46, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(47, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(48, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(49, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST', NULL, 1, 'Jornada', 1014),
(50, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 7777 y con el nombre TEST', NULL, 1, 'Jornada', 7777),
(51, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(52, 'El usuario con nÃºmero de documento 999 y con los nombres alex ha realizado una postulaciÃ³n a la vacante con el cargo Desarollador', 'Desarollador', 1, 'postulacion', 999),
(53, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(54, 'El usuario con nÃºmero de documento 1025315410 y con los nombres Juan ha realizado una postulaciÃ³n a la vacante con el cargo Desarollador', 'Desarollador', 1, 'postulacion', 1025315410),
(55, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224),
(56, 'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex', NULL, 1, 'Jornada', 10224);

-- --------------------------------------------------------

--
-- Table structure for table `pazysalvo`
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
-- Table structure for table `postulacion`
--

CREATE TABLE `postulacion` (
  `idpostulacion` int(11) NOT NULL,
  `estadoPostulacion` int(11) NOT NULL,
  `convocatoria_idconvocatoria` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `postulacion`
--

INSERT INTO `postulacion` (`idpostulacion`, `estadoPostulacion`, `convocatoria_idconvocatoria`, `usuario_num_doc`) VALUES
(6, 0, 1, 999),
(7, 0, 1, 999),
(8, 0, 1, 1025315410);

-- --------------------------------------------------------

--
-- Table structure for table `postulacion_has_notificacion`
--

CREATE TABLE `postulacion_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quejareclamo`
--

CREATE TABLE `quejareclamo` (
  `idquejaReclamo` int(11) NOT NULL,
  `fechaRedactado` date NOT NULL,
  `tipoQuejaReclamo` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `estadoQueja` varchar(10) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `Respuesta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `quejareclamo`
--

INSERT INTO `quejareclamo` (`idquejaReclamo`, `fechaRedactado`, `tipoQuejaReclamo`, `descripcion`, `estadoQueja`, `usuario_num_doc`, `Respuesta`) VALUES
(1, '2024-12-04', 'NOSE', 'TAMPOCO SE', '1', 1014, 'TEST DE Queja'),
(2, '2024-12-24', 'NO SE', 'CAMBIOS', '1', 1014, 'TEST RESPUESTA');

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `idrol` int(11) NOT NULL,
  `nombreRol` varchar(45) NOT NULL,
  `estadoRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`idrol`, `nombreRol`, `estadoRol`) VALUES
(1, 'Administrador', 1),
(2, 'Recursos humanos', 1),
(3, 'Empleados', 1),
(4, 'Aspirante', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
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
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`num_doc`, `nombres`, `apellidos`, `email`, `tipodDoc`, `password`, `estado`, `hojadevida_idHojadevida`, `rol_idrol`) VALUES
(1014, 'TEST', 'API', 'API@gmail.com', 'CEDULA', '$2y$10$PalwiV3z7dAD5Rp4CdIKZOO/h/Vdy9Y1XIFnXzGvPnGq2tKYY.GMy', 1, 23, 3),
(999, 'alex', 'alex', 'alex@gmail.com', 'cedula', '$2y$10$y3kLh73HKY/fhbR0kkGaWeKs1o45.TmEXp7dm7/EqCrkWCorCvWmK', 1, 24, 4),
(10224, 'Alex', 'TEST', 'Arch@gmail.com', 'Cedula', '$2y$10$cdB2mXF7JAkLp17x2dK34emyDZ61AHdx2f6rkRSsFQ0Au0a83QriW', 1, 25, 2),
(7777, 'TEST', 'ADMIN', 'admin@gmail.com', 'Cedula', '$2y$10$o2nz1SbhZe/EU6SlD9IL..0zuZIPu4blYblnzRIuhh9Q9aNnlL.Gm', 1, 26, 1),
(1241, 'asd', 'asd', 'asd@gmail.com', 'CEDULA', '$2y$10$cUfetnR2WB7hWuzVKGSLX.SQm1N5h9a5sCV.iaaO9h9A.uHVBEjE2', 1, 28, 4),
(10152215, 'asd', 'asd', 'email@gmail.com', 'CEDULA', '$2y$10$psfke4GqkR6wKSKCDnsw9.I9SGDikC1mpCSu7nP4a3arp7FlJmDIK', 1, 29, 4),
(354135, 'ASD', 'LOL', 'alex@gmail.com', 'CEDULA', '$2y$10$xyzMNWKCm/X1nV4qnmWnt.lUgE2ymXayb8VQbn0lS5CGW8nxdJple', 1, 30, 4),
(111, 'Juan', 'Lopez', '111@gmail.com', 'CEDULA', '$2y$10$Nw3l7qwS7g8A5mJYL9iSOujiLzeOMOClt7zfRgh3iyMogzQkI12Om', 1, 31, 4),
(1025315410, 'Juan', 'Lopez', 'JuanLopez@gmail.com', 'CEDULA', '$2y$10$.61nxCEd5mdYTfkmZBONWuA5g9u910mcbVQdGu38.Vcq1oCx4STs.', 1, 32, 4);

-- --------------------------------------------------------

--
-- Table structure for table `vacacion`
--

CREATE TABLE `vacacion` (
  `idvacacion` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprovadoPor` varchar(45) NOT NULL,
  `estado` varchar(45) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vinculacion`
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
-- Indexes for dumped tables
--

--
-- Indexes for table `ausencia`
--
ALTER TABLE `ausencia`
  ADD PRIMARY KEY (`idausencia`,`usuario_num_doc`),
  ADD KEY `fk_ausencia_usuario1_idx` (`usuario_num_doc`);

--
-- Indexes for table `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ausencias_idausencias` (`ausencia_idausencia`),
  ADD KEY `notificaciones_idnotificacion` (`notificacion_idnotificacion`);

--
-- Indexes for table `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`idcargo`);

--
-- Indexes for table `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`idCertificado`,`vinculacion_idvinculacion`),
  ADD KEY `fk_certificado_vinculacion1_idx` (`vinculacion_idvinculacion`);

--
-- Indexes for table `convocatoria`
--
ALTER TABLE `convocatoria`
  ADD PRIMARY KEY (`idconvocatoria`,`cargo_idcargo`),
  ADD KEY `fk_convocatoria_cargo1_idx` (`cargo_idcargo`);

--
-- Indexes for table `entrevista`
--
ALTER TABLE `entrevista`
  ADD PRIMARY KEY (`identrevista`,`postulacion_idpostulaciones`),
  ADD KEY `fk_cita_postulacion1_idx` (`postulacion_idpostulaciones`);

--
-- Indexes for table `estudio`
--
ALTER TABLE `estudio`
  ADD PRIMARY KEY (`idestudio`,`hojadevida_idHojadevida`),
  ADD KEY `fk_estudios_hojadevida1_idx` (`hojadevida_idHojadevida`);

--
-- Indexes for table `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  ADD PRIMARY KEY (`idevaluacion`,`entrevista_identrevista`,`entrevista_postulacion_idpostulaciones`),
  ADD KEY `fk_evaluacionesSg_entrevista1_idx` (`entrevista_identrevista`,`entrevista_postulacion_idpostulaciones`);

--
-- Indexes for table `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD PRIMARY KEY (`idexperienciaLaboral`,`hojadevida_idHojadevida`),
  ADD KEY `fk_experienciaLaboral_hojadevida1_idx` (`hojadevida_idHojadevida`);

--
-- Indexes for table `hojadevida`
--
ALTER TABLE `hojadevida`
  ADD PRIMARY KEY (`idHojadevida`),
  ADD UNIQUE KEY `idHojadevida_UNIQUE` (`idHojadevida`);

--
-- Indexes for table `horaextra`
--
ALTER TABLE `horaextra`
  ADD PRIMARY KEY (`idHoraextra`,`usuario_num_doc`),
  ADD KEY `fk_horasextra_usuarios1_idx` (`usuario_num_doc`);

--
-- Indexes for table `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`idJornada`,`usuario_num_doc`),
  ADD KEY `fk_jornada_usuarios1_idx` (`usuario_num_doc`);

--
-- Indexes for table `jornada_has_notificacion`
--
ALTER TABLE `jornada_has_notificacion`
  ADD KEY `fk_jornada_has_notificacion_notificacion1_idx` (`notificacion_idnotificacion`),
  ADD KEY `fk_jornada_has_notificacion_jornada1_idx` (`jornada_idJornada`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`idnotificacion`);

--
-- Indexes for table `postulacion`
--
ALTER TABLE `postulacion`
  ADD PRIMARY KEY (`idpostulacion`);

--
-- Indexes for table `quejareclamo`
--
ALTER TABLE `quejareclamo`
  ADD PRIMARY KEY (`idquejaReclamo`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`hojadevida_idHojadevida`);

--
-- Indexes for table `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD PRIMARY KEY (`idvinculacion`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ausencia`
--
ALTER TABLE `ausencia`
  MODIFY `idausencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `entrevista`
--
ALTER TABLE `entrevista`
  MODIFY `identrevista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `estudio`
--
ALTER TABLE `estudio`
  MODIFY `idestudio` int(45) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  MODIFY `idevaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `hojadevida`
--
ALTER TABLE `hojadevida`
  MODIFY `idHojadevida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `jornada`
--
ALTER TABLE `jornada`
  MODIFY `idJornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `idnotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `postulacion`
--
ALTER TABLE `postulacion`
  MODIFY `idpostulacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `quejareclamo`
--
ALTER TABLE `quejareclamo`
  MODIFY `idquejaReclamo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `hojadevida_idHojadevida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `vinculacion`
--
ALTER TABLE `vinculacion`
  MODIFY `idvinculacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
