-- Base de datos: `gestorplus`
-- --------------------------------------------------------
--
-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: gestorplus-db   Database: gestorplus
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.20.04.3
--
-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET time_zone = "+00:00";
-- SET NAMES utf8mb4;
-- SET foreign_key_checks = 0;
-- SET sql_notes = 0;
--
-- ------------------------------------------------------
-- Base de datos: `gestorplus`
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `gestorplus`;
USE `gestorplus`;

-- 1. Tablas de catálogo y sin dependencias
CREATE TABLE `rol` (
  `idrol` int(11) NOT NULL AUTO_INCREMENT,
  `nombreRol` varchar(45) NOT NULL,
  `estadoRol` int(11) NOT NULL,
  PRIMARY KEY (`idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `hojadevida` (
  `idHojadevida` int(11) NOT NULL AUTO_INCREMENT,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` bigint(20) DEFAULT NULL,
  `estadohojadevida` enum('Activa','Inactiva') DEFAULT 'Activa',
  PRIMARY KEY (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` int(11) NOT NULL,
  PRIMARY KEY (`idcargo`),
  UNIQUE KEY `nombreCargo` (`nombreCargo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 2. Tablas principales
CREATE TABLE `usuario` (
  `num_doc` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(45) NOT NULL,
  `tipodDoc` varchar(40) NOT NULL,
  `password` varchar(250) NOT NULL,
  `estado` int(11) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  `rol_idrol` int(11) NOT NULL,
  PRIMARY KEY (`num_doc`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  KEY `rol_idrol` (`rol_idrol`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`rol_idrol`) REFERENCES `rol` (`idrol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Tabla de restablecimiento de contraseñas
CREATE TABLE `password_resets` (
  `idPasswordReset` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_num_doc` INT NOT NULL,
  `token` CHAR(64) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `used` TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario`(`num_doc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Tabla de publicaciones internas
CREATE TABLE `publicacion` (
  `idPublicacion` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `fechaPublicacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `usuario_num_doc` INT NOT NULL,
  `tipo_contrato` ENUM('Prestación de servicios','Obra laboral','Fijo','Indefinido','todos') DEFAULT 'todos',
  `estado` ENUM('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`idPublicacion`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `publicacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario`(`num_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tablas dependientes de usuario
CREATE TABLE `ausencia` (
  `idausencia` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` varchar(45) NOT NULL DEFAULT 'No justificada',
  `fechaRegistro` date NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idausencia`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `ausencia_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `estadoJornada` varchar(50) NOT NULL,
  PRIMARY KEY (`idJornada`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `vacacion` (
  `idvacacion` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprovadoPor` int(11) DEFAULT NULL,
  `estadoVacacion` varchar(45) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idvacacion`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `vacacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `horaextra` (
  `idHoraextra` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idHoraextra`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `horaextra_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 4. Tablas de notificación y relaciones
CREATE TABLE `notificacion` (
  `idnotificacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcionNotificacion` text NOT NULL,
  `nombreCargo` varchar(25) DEFAULT NULL,
  `estadoNotificacion` varchar(250) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `num_doc` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idnotificacion`),
  KEY `num_doc` (`num_doc`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=348 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `ausencia_has_notificacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ausencia_idausencia` int(11) NOT NULL,
  `notificacion_idnotificacion` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ausencia_idausencia` (`ausencia_idausencia`),
  KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  CONSTRAINT `ausencia_has_notificacion_ibfk_1` FOREIGN KEY (`ausencia_idausencia`) REFERENCES `ausencia` (`idausencia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ausencia_has_notificacion_ibfk_2` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `jornada_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `jornada_idJornada` int(11) NOT NULL,
  KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  KEY `jornada_idJornada` (`jornada_idJornada`),
  CONSTRAINT `jornada_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jornada_has_notificacion_ibfk_2` FOREIGN KEY (`jornada_idJornada`) REFERENCES `jornada` (`idJornada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Tablas dependientes de cargo
CREATE TABLE `convocatoria` (
  `idconvocatoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombreConvocatoria` varchar(80) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cantidadConvocatoria` int(11) DEFAULT NULL,
  `cargo_idcargo` int(11) NOT NULL,
  `fecha_limite` date DEFAULT NULL,
  `fecha_apertura` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idconvocatoria`),
  KEY `cargo_idcargo` (`cargo_idcargo`),
  CONSTRAINT `convocatoria_ibfk_1` FOREIGN KEY (`cargo_idcargo`) REFERENCES `cargo` (`idcargo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 6. Tablas dependientes de convocatoria y usuario
CREATE TABLE `postulacion` (
  `idpostulacion` int(11) NOT NULL AUTO_INCREMENT,
  `estadoPostulacion` varchar(250) NOT NULL,
  `fecha_postulacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `convocatoria_idconvocatoria` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idpostulacion`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  KEY `convocatoria_idconvocatoria` (`convocatoria_idconvocatoria`),
  CONSTRAINT `postulacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postulacion_ibfk_2` FOREIGN KEY (`convocatoria_idconvocatoria`) REFERENCES `convocatoria` (`idconvocatoria`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `postulacion_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`),
  CONSTRAINT `postulacion_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postulacion_has_notificacion_ibfk_2` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Tablas de experiencia y estudio
CREATE TABLE `experiencialaboral` (
  `idexperienciaLaboral` varchar(45) NOT NULL,
  `profesion` varchar(45) DEFAULT NULL,
  `descripcionPerfil` varchar(45) DEFAULT NULL,
  `fechaInicioExp` date DEFAULT NULL,
  `fechaFinExp` date DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`idexperienciaLaboral`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `estudio` (
  `idestudio` int(45) NOT NULL AUTO_INCREMENT,
  `nivelEstudio` varchar(45) DEFAULT NULL,
  `areaEstudio` varchar(45) DEFAULT NULL,
  `estadoEstudio` varchar(45) DEFAULT NULL,
  `fechaInicioEstudio` date DEFAULT NULL,
  `fechaFinEstudio` date DEFAULT NULL,
  `tituloEstudio` varchar(45) DEFAULT NULL,
  `institucionEstudio` varchar(45) DEFAULT NULL,
  `ubicacionEstudio` varchar(45) DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`idestudio`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `estudio_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 8. Tablas de chat y mensajes
CREATE TABLE `chat` (
  `idChat` int(11) NOT NULL AUTO_INCREMENT,
  `usuario1` int(11) NOT NULL,
  `usuario2` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idChat`),
  KEY `usuario1` (`usuario1`),
  KEY `usuario2` (`usuario2`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE
  -- Falta FK para usuario2 si aplica
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `mensajes` (
  `idmensaje` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_num_doc` int(11) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mensaje` varchar(200) DEFAULT NULL,
  `idChat` int(11) NOT NULL,
  PRIMARY KEY (`idmensaje`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  KEY `mensajes_ibfk_2` (`idChat`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`idChat`) REFERENCES `chat` (`idChat`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 9. Tablas de evaluaciones y vinculaciones
CREATE TABLE `entrevista` (
  `identrevista` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `lugarMedio` varchar(45) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEntrevista` varchar(50) NOT NULL,
  PRIMARY KEY (`identrevista`),
  KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`),
  CONSTRAINT `entrevista_ibfk_1` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `evaluacionessg` (
  `idevaluacion` int(11) NOT NULL AUTO_INCREMENT,
  `estado_salud` varchar(45) DEFAULT NULL,
  `evaluacionRiesgos` varchar(45) DEFAULT NULL,
  `recomendaciones` varchar(45) DEFAULT NULL,
  `aptitudLaboral` varchar(45) DEFAULT NULL,
  `comentarios` varchar(45) DEFAULT NULL,
  `entrevista_identrevista` int(11) NOT NULL,
  `entrevista_postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEvaluacion` varchar(25) NOT NULL,
  PRIMARY KEY (`idevaluacion`),
  KEY `entrevista_identrevista` (`entrevista_identrevista`),
  KEY `evaluacionessg_ibfk_2` (`entrevista_postulacion_idpostulaciones`),
  CONSTRAINT `evaluacionessg_ibfk_1` FOREIGN KEY (`entrevista_identrevista`) REFERENCES `entrevista` (`identrevista`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `evaluacionessg_ibfk_2` FOREIGN KEY (`entrevista_postulacion_idpostulaciones`) REFERENCES `entrevista` (`postulacion_idpostulaciones`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vinculacion` (
  `idvinculacion` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoContrato` varchar(80) NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `estadoContrato` varchar(50) DEFAULT NULL,
  `fechaFirma` date NOT NULL,
  `documentoContrato` varchar(255) DEFAULT NULL,
  `evaluacionesSg_idevaluacion` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idvinculacion`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  KEY `vinculacion_ibfk_2` (`evaluacionesSg_idevaluacion`),
  CONSTRAINT `vinculacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`),
  CONSTRAINT `vinculacion_ibfk_2` FOREIGN KEY (`evaluacionesSg_idevaluacion`) REFERENCES `evaluacionessg` (`idevaluacion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `certificado` (
  `idCertificado` int(11) NOT NULL,
  `certificadoLaboral` tinyint(1) NOT NULL,
  `certificadoARL` tinyint(1) NOT NULL,
  `fechaExpedicion` date NOT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL,
  PRIMARY KEY (`idCertificado`),
  KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`),
  CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pazysalvo` (
  `idpazysalvo` int(11) NOT NULL AUTO_INCREMENT,
  `motivo` varchar(150) NOT NULL,
  `fechaEmision` date NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `documentoPazysalvo` tinyint(1) DEFAULT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL,
  PRIMARY KEY (`idpazysalvo`),
  KEY `vinculacion_idvinculacion` (`vinculacion_idvinculacion`),
  CONSTRAINT `pazysalvo_ibfk_1` FOREIGN KEY (`vinculacion_idvinculacion`) REFERENCES `vinculacion` (`idvinculacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
