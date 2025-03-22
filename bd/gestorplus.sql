-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 22, 2025 at 03:40 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `ausencia_has_notificacion`
--

CREATE TABLE `ausencia_has_notificacion` (
  `id` int(11) NOT NULL,
  `ausencia_idausencia` int(11) NOT NULL,
  `notificacion_idnotificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cargo`
--

CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificado`
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
-- Table structure for table `chat`
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
-- Table structure for table `convocatoria`
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
-- Table structure for table `entrevista`
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
(38, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
  `estadoJornada` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `jornada`
--

INSERT INTO `jornada` (`idJornada`, `fecha`, `horaEntrada`, `horaSalida`, `usuario_num_doc`, `estadoJornada`) VALUES
(154, '2025-03-21', '20:32:00', '04:32:00', 1014736, 'Pendiente');

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
-- Table structure for table `mensajes`
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
(190, 'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis', NULL, 1, 'Jornada', 1014736);

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
  `estadoPostulacion` int(11) NOT NULL DEFAULT 1,
  `fecha_postulacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `convocatoria_idconvocatoria` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
(2, 'Recursos Humanos', 1),
(3, 'Empleado', 1),
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
(1014736, 'Englis', 'Barros', 'englis@gmail.com', 'CEDULA', '$2y$10$XNBEfw9/zT3O25hSNaC6v.d8sjc3NopI19CW2MEOmH/Mr73zC086W', 1, 38, 1);

-- --------------------------------------------------------

--
-- Table structure for table `vacacion`
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
  ADD PRIMARY KEY (`idausencia`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indexes for table `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ausencia_idausencia` (`ausencia_idausencia`),
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`);

--
-- Indexes for table `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`idcargo`);

--
-- Indexes for table `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`idCertificado`),
  ADD KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`idChat`),
  ADD KEY `usuario1` (`usuario1`),
  ADD KEY `usuario2` (`usuario2`);

--
-- Indexes for table `convocatoria`
--
ALTER TABLE `convocatoria`
  ADD PRIMARY KEY (`idconvocatoria`),
  ADD KEY `cargo_idcargo` (`cargo_idcargo`);

--
-- Indexes for table `entrevista`
--
ALTER TABLE `entrevista`
  ADD PRIMARY KEY (`identrevista`),
  ADD KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`);

--
-- Indexes for table `estudio`
--
ALTER TABLE `estudio`
  ADD PRIMARY KEY (`idestudio`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indexes for table `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  ADD PRIMARY KEY (`idevaluacion`),
  ADD KEY `entrevista_identrevista` (`entrevista_identrevista`),
  ADD KEY `evaluacionessg_ibfk_2` (`entrevista_postulacion_idpostulaciones`);

--
-- Indexes for table `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD PRIMARY KEY (`idexperienciaLaboral`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`);

--
-- Indexes for table `hojadevida`
--
ALTER TABLE `hojadevida`
  ADD PRIMARY KEY (`idHojadevida`);

--
-- Indexes for table `horaextra`
--
ALTER TABLE `horaextra`
  ADD PRIMARY KEY (`idHoraextra`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indexes for table `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`idJornada`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indexes for table `jornada_has_notificacion`
--
ALTER TABLE `jornada_has_notificacion`
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  ADD KEY `jornada_idJornada` (`jornada_idJornada`);

--
-- Indexes for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`idmensaje`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `mensajes_ibfk_2` (`idChat`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`idnotificacion`),
  ADD KEY `num_doc` (`num_doc`);

--
-- Indexes for table `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD PRIMARY KEY (`idpazysalvo`),
  ADD KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`);

--
-- Indexes for table `postulacion`
--
ALTER TABLE `postulacion`
  ADD PRIMARY KEY (`idpostulacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `convocatoria_idconvocatoria` (`convocatoria_idconvocatoria`);

--
-- Indexes for table `postulacion_has_notificacion`
--
ALTER TABLE `postulacion_has_notificacion`
  ADD KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  ADD KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idrol`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`num_doc`),
  ADD KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  ADD KEY `rol_idrol` (`rol_idrol`);

--
-- Indexes for table `vacacion`
--
ALTER TABLE `vacacion`
  ADD PRIMARY KEY (`idvacacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`);

--
-- Indexes for table `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD PRIMARY KEY (`idvinculacion`),
  ADD KEY `usuario_num_doc` (`usuario_num_doc`),
  ADD KEY `vinculacion_ibfk_2` (`evaluacionesSg_idevaluacion`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ausencia`
--
ALTER TABLE `ausencia`
  MODIFY `idausencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `idChat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `convocatoria`
--
ALTER TABLE `convocatoria`
  MODIFY `idconvocatoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `idHojadevida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `jornada`
--
ALTER TABLE `jornada`
  MODIFY `idJornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `idmensaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `idnotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT for table `pazysalvo`
--
ALTER TABLE `pazysalvo`
  MODIFY `idpazysalvo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `postulacion`
--
ALTER TABLE `postulacion`
  MODIFY `idpostulacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vacacion`
--
ALTER TABLE `vacacion`
  MODIFY `idvacacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vinculacion`
--
ALTER TABLE `vinculacion`
  MODIFY `idvinculacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ausencia`
--
ALTER TABLE `ausencia`
  ADD CONSTRAINT `ausencia_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ausencia_has_notificacion`
--
ALTER TABLE `ausencia_has_notificacion`
  ADD CONSTRAINT `ausencia_has_notificacion_ibfk_1` FOREIGN KEY (`ausencia_idausencia`) REFERENCES `ausencia` (`idausencia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ausencia_has_notificacion_ibfk_2` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `certificado`
--
ALTER TABLE `certificado`
  ADD CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `convocatoria`
--
ALTER TABLE `convocatoria`
  ADD CONSTRAINT `convocatoria_ibfk_1` FOREIGN KEY (`cargo_idcargo`) REFERENCES `cargo` (`idcargo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `entrevista`
--
ALTER TABLE `entrevista`
  ADD CONSTRAINT `entrevista_ibfk_1` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `estudio`
--
ALTER TABLE `estudio`
  ADD CONSTRAINT `estudio_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `evaluacionessg`
--
ALTER TABLE `evaluacionessg`
  ADD CONSTRAINT `evaluacionessg_ibfk_1` FOREIGN KEY (`entrevista_identrevista`) REFERENCES `entrevista` (`identrevista`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluacionessg_ibfk_2` FOREIGN KEY (`entrevista_postulacion_idpostulaciones`) REFERENCES `entrevista` (`postulacion_idpostulaciones`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `experiencialaboral`
--
ALTER TABLE `experiencialaboral`
  ADD CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `horaextra`
--
ALTER TABLE `horaextra`
  ADD CONSTRAINT `horaextra_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`);

--
-- Constraints for table `jornada`
--
ALTER TABLE `jornada`
  ADD CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jornada_has_notificacion`
--
ALTER TABLE `jornada_has_notificacion`
  ADD CONSTRAINT `jornada_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jornada_has_notificacion_ibfk_2` FOREIGN KEY (`jornada_idJornada`) REFERENCES `jornada` (`idJornada`);

--
-- Constraints for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`idChat`) REFERENCES `chat` (`idChat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pazysalvo`
--
ALTER TABLE `pazysalvo`
  ADD CONSTRAINT `pazysalvo_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `postulacion`
--
ALTER TABLE `postulacion`
  ADD CONSTRAINT `postulacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postulacion_ibfk_2` FOREIGN KEY (`convocatoria_idconvocatoria`) REFERENCES `convocatoria` (`idconvocatoria`);

--
-- Constraints for table `postulacion_has_notificacion`
--
ALTER TABLE `postulacion_has_notificacion`
  ADD CONSTRAINT `postulacion_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postulacion_has_notificacion_ibfk_2` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`rol_idrol`) REFERENCES `rol` (`idrol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vacacion`
--
ALTER TABLE `vacacion`
  ADD CONSTRAINT `vacacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`);

--
-- Constraints for table `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD CONSTRAINT `vinculacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`),
  ADD CONSTRAINT `vinculacion_ibfk_2` FOREIGN KEY (`evaluacionesSg_idevaluacion`) REFERENCES `evaluacionessg` (`idevaluacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
