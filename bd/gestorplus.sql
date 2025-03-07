-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: gestorplus
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `gestorplus`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `gestorplus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `gestorplus`;

--
-- Table structure for table `ausencia`
--

DROP TABLE IF EXISTS `ausencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencia` (
  `idausencia` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` tinyint(4) NOT NULL,
  `fechaRegistro` date NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idausencia`,`usuario_num_doc`),
  KEY `fk_ausencia_usuario1_idx` (`usuario_num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencia`
--

LOCK TABLES `ausencia` WRITE;
/*!40000 ALTER TABLE `ausencia` DISABLE KEYS */;
INSERT INTO `ausencia` VALUES (1,'2024-12-12','2024-12-21','INCAPACIDAD','ENFERMEDAD',1,'2024-12-05',1014),(3,'2025-02-03','2025-02-04','Enfermedad','asd',1,'2025-02-02',10224);
/*!40000 ALTER TABLE `ausencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ausencia_has_notificacion`
--

DROP TABLE IF EXISTS `ausencia_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencia_has_notificacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ausencia_idausencia` int(11) DEFAULT NULL,
  `notificacion_idnotificacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ausencias_idausencias` (`ausencia_idausencia`),
  KEY `notificaciones_idnotificacion` (`notificacion_idnotificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencia_has_notificacion`
--

LOCK TABLES `ausencia_has_notificacion` WRITE;
/*!40000 ALTER TABLE `ausencia_has_notificacion` DISABLE KEYS */;
INSERT INTO `ausencia_has_notificacion` VALUES (1,2,39);
/*!40000 ALTER TABLE `ausencia_has_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` int(11) NOT NULL,
  PRIMARY KEY (`idcargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (1,'Desarollador',1);
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificado`
--

DROP TABLE IF EXISTS `certificado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificado` (
  `idCertificado` int(11) NOT NULL,
  `certificadoLaboral` tinyint(1) NOT NULL,
  `certificadoARL` tinyint(1) NOT NULL,
  `fechaExpedicion` date NOT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL,
  PRIMARY KEY (`idCertificado`,`vinculacion_idvinculacion`),
  KEY `fk_certificado_vinculacion1_idx` (`vinculacion_idvinculacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificado`
--

LOCK TABLES `certificado` WRITE;
/*!40000 ALTER TABLE `certificado` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `idChat` int(11) NOT NULL AUTO_INCREMENT,
  `emisor` int(11) NOT NULL,
  `receptor` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idChat`),
  UNIQUE KEY `emisor` (`emisor`,`receptor`),
  UNIQUE KEY `receptor` (`receptor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,1014,10224,'2024-12-27 23:59:01','2024-12-27 23:59:01'),(2,10224,1025315410,'2025-02-06 22:44:08','2025-02-06 22:44:08');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convocatoria`
--

DROP TABLE IF EXISTS `convocatoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`idconvocatoria`,`cargo_idcargo`),
  KEY `fk_convocatoria_cargo1_idx` (`cargo_idcargo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convocatoria`
--

LOCK TABLES `convocatoria` WRITE;
/*!40000 ALTER TABLE `convocatoria` DISABLE KEYS */;
INSERT INTO `convocatoria` VALUES (1,'test','ASDASD','ASDASD',55000.00,50,1,NULL,'2025-02-28 22:01:10'),(2,'Desarrollador Full Stack','Buscamos un Desarrollador Full Stack con experiencia en el desarrollo de aplicaciones web. El candidato ideal debe tener habilidades tanto en el front-end como en el back-end, además de un enfoque orientado a la solución de problemas y la mejora continua.','Experiencia mínima de 3 años como desarrollador Full Stack. Dominio de tecnologías como React, Node.js, Express, y MongoDB. Conocimiento de control de versiones con Git. Capacidad para trabajar de forma autónoma y en equipo. Buen manejo de la comunicación verbal y escrita.',60000.00,15,1,NULL,'2025-02-28 22:01:10');
/*!40000 ALTER TABLE `convocatoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrevista`
--

DROP TABLE IF EXISTS `entrevista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entrevista` (
  `identrevista` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `lugarMedio` varchar(45) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  `estadoEntrevista` varchar(50) NOT NULL,
  PRIMARY KEY (`identrevista`,`postulacion_idpostulaciones`),
  KEY `fk_cita_postulacion1_idx` (`postulacion_idpostulaciones`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrevista`
--

LOCK TABLES `entrevista` WRITE;
/*!40000 ALTER TABLE `entrevista` DISABLE KEYS */;
INSERT INTO `entrevista` VALUES (2,'2024-12-12','18:00:00','CHAPINERO',7,'Pendiente'),(3,'2024-12-10','14:00:00','CHAPINERO',8,'Pendiente');
/*!40000 ALTER TABLE `entrevista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudio`
--

DROP TABLE IF EXISTS `estudio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`idestudio`,`hojadevida_idHojadevida`),
  KEY `fk_estudios_hojadevida1_idx` (`hojadevida_idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudio`
--

LOCK TABLES `estudio` WRITE;
/*!40000 ALTER TABLE `estudio` DISABLE KEYS */;
INSERT INTO `estudio` VALUES (1,'asd','asd','1','2000-06-06','2024-12-03','asd','asd','asd',24);
/*!40000 ALTER TABLE `estudio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluacionessg`
--

DROP TABLE IF EXISTS `evaluacionessg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`idevaluacion`,`entrevista_identrevista`,`entrevista_postulacion_idpostulaciones`),
  KEY `fk_evaluacionesSg_entrevista1_idx` (`entrevista_identrevista`,`entrevista_postulacion_idpostulaciones`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluacionessg`
--

LOCK TABLES `evaluacionessg` WRITE;
/*!40000 ALTER TABLE `evaluacionessg` DISABLE KEYS */;
INSERT INTO `evaluacionessg` VALUES (12,'ES UNA MIERDA','TIENE CANCER','NO ','NO APTO','xd',2,7,'No apto'),(13,'as','asd','asd','asd','asd',3,8,'No apto');
/*!40000 ALTER TABLE `evaluacionessg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencialaboral`
--

DROP TABLE IF EXISTS `experiencialaboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experiencialaboral` (
  `idexperienciaLaboral` varchar(45) NOT NULL,
  `profesion` varchar(45) DEFAULT NULL,
  `descripcionPerfil` varchar(45) DEFAULT NULL,
  `fechaInicioExp` date DEFAULT NULL,
  `fechaFinExp` date DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`idexperienciaLaboral`,`hojadevida_idHojadevida`),
  KEY `fk_experienciaLaboral_hojadevida1_idx` (`hojadevida_idHojadevida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencialaboral`
--

LOCK TABLES `experiencialaboral` WRITE;
/*!40000 ALTER TABLE `experiencialaboral` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencialaboral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hojadevida`
--

DROP TABLE IF EXISTS `hojadevida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hojadevida` (
  `idHojadevida` int(11) NOT NULL AUTO_INCREMENT,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` varchar(45) DEFAULT NULL,
  `estadohojadevida` bit(1) DEFAULT NULL,
  PRIMARY KEY (`idHojadevida`),
  UNIQUE KEY `idHojadevida_UNIQUE` (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hojadevida`
--

LOCK TABLES `hojadevida` WRITE;
/*!40000 ALTER TABLE `hojadevida` DISABLE KEYS */;
INSERT INTO `hojadevida` VALUES (23,NULL,NULL,NULL,NULL,NULL,NULL,''),(24,'2024-12-12','Calle 86',NULL,'BOGOTA','513531','2135235',''),(25,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,NULL,NULL,NULL,NULL,NULL,NULL,''),(27,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,NULL,NULL,NULL,NULL,NULL,NULL,''),(29,NULL,NULL,NULL,NULL,NULL,NULL,''),(30,NULL,NULL,NULL,NULL,NULL,NULL,''),(31,NULL,NULL,NULL,NULL,NULL,NULL,''),(32,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `hojadevida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaextra`
--

DROP TABLE IF EXISTS `horaextra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horaextra` (
  `idHoraextra` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idHoraextra`,`usuario_num_doc`),
  KEY `fk_horasextra_usuarios1_idx` (`usuario_num_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaextra`
--

LOCK TABLES `horaextra` WRITE;
/*!40000 ALTER TABLE `horaextra` DISABLE KEYS */;
/*!40000 ALTER TABLE `horaextra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada`
--

DROP TABLE IF EXISTS `jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `estadoJornada` varchar(50) NOT NULL,
  PRIMARY KEY (`idJornada`,`usuario_num_doc`),
  KEY `fk_jornada_usuarios1_idx` (`usuario_num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
INSERT INTO `jornada` VALUES (149,'2025-03-07','15:52:00','23:52:00',1014,'Jornada Corroborada'),(150,'2025-03-07','16:37:00','00:37:00',10224,'Jornada Corroborada'),(151,'2025-03-07','16:39:00','00:39:00',10224,'Jornada Corroborada'),(152,'2025-03-07','16:47:00','00:47:00',10224,'Jornada Corroborada'),(153,'2025-03-07','16:49:00','00:49:00',10224,'Pendiente');
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada_has_notificacion`
--

DROP TABLE IF EXISTS `jornada_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `jornada_idJornada` int(11) NOT NULL,
  KEY `fk_jornada_has_notificacion_notificacion1_idx` (`notificacion_idnotificacion`),
  KEY `fk_jornada_has_notificacion_jornada1_idx` (`jornada_idJornada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada_has_notificacion`
--

LOCK TABLES `jornada_has_notificacion` WRITE;
/*!40000 ALTER TABLE `jornada_has_notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `jornada_has_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificacion` (
  `idnotificacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcionNotificacion` text NOT NULL,
  `nombreCargo` varchar(25) DEFAULT NULL,
  `estadoNotificacion` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idnotificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (34,'Nueva jornada registrada por inicio de sesion para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(35,'Nueva jornada registrada por inicio de sesion para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(36,'Nueva jornada registrada por inicio de sesion para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(37,'Nueva jornada registrada por inicio de sesion para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(38,'El usuario con nÃºmero de documento 1014 y con los nombres TEST ha solicitado una ausencia',NULL,1,'ausencia',1014),(39,'El usuario con nÃºmero de documento 1014 y con los nombres TEST ha solicitado una ausencia',NULL,1,'ausencia',1014),(44,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(45,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(46,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(47,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(48,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(49,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(50,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 7777 y con el nombre TEST',NULL,1,'Jornada',7777),(51,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(52,'El usuario con nÃºmero de documento 999 y con los nombres alex ha realizado una postulaciÃ³n a la vacante con el cargo Desarollador','Desarollador',1,'postulacion',999),(53,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(54,'El usuario con nÃºmero de documento 1025315410 y con los nombres Juan ha realizado una postulaciÃ³n a la vacante con el cargo Desarollador','Desarollador',1,'postulacion',1025315410),(55,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(56,'Nueva jornada registrada por inicio de sesiÃ³n para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(57,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(58,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(59,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(60,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(61,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(62,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(63,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(64,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(65,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(66,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(67,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(68,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(69,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(70,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(71,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(72,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(73,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(74,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(75,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(76,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(77,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(78,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(79,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(80,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(81,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(82,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(83,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(84,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(85,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(86,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(87,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(88,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(89,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(90,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(91,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(92,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(93,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(94,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(95,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(96,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(97,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(98,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(99,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(100,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(101,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(102,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(103,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(104,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(105,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(106,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(107,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(108,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(109,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(110,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(111,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(112,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(113,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(114,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(115,'Ausencia rechazada',NULL,0,'Rechazo',0),(116,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(117,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(118,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(119,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(120,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(121,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(122,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(123,'El empleado identificado con la cedula 10224 ha solicitado una ausencia para el dia 2025-02-03 hasta el dia 2025-02-04',NULL,1,'Ausencia',10224),(124,'Ausencia aceptada',NULL,0,'Aceptacion',0),(125,'Ausencia aceptada',NULL,0,'Aceptacion',0),(126,'Ausencia rechazada',NULL,0,'Rechazo',0),(127,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(128,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(129,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(130,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(131,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(132,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(133,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(134,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(135,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(136,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(137,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(138,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(139,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(140,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(141,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(142,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(143,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(144,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(145,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(146,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(147,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(148,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(149,'El empleado identificado con la cedula 10224 ha solicitado una vacacion',NULL,0,'Vacacion',10224),(150,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(151,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(152,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(153,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(154,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(155,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(156,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(157,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(158,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(159,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(160,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(161,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(162,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(163,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(164,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(165,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(166,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(167,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(168,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(169,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(170,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(171,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(172,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(173,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(174,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(175,'El aspirante con número de documento 111 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',111),(176,'Has aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',222),(177,'El aspirante con número de documento 222 ha aplicado a una convocatoria',NULL,0,'PostulacionAspirantes',222),(178,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(179,'Ausencia aceptada',NULL,0,'Aceptacion',0),(180,'Ausencia aceptada',NULL,0,'Aceptacion',0),(181,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(182,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(183,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(184,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(185,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014 y con el nombre TEST',NULL,1,'Jornada',1014),(186,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(187,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(188,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224),(189,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 10224 y con el nombre Alex',NULL,1,'Jornada',10224);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pazysalvo`
--

DROP TABLE IF EXISTS `pazysalvo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pazysalvo` (
  `idpazysalvo` int(11) NOT NULL,
  `motivo` varchar(150) NOT NULL,
  `fechaEmision` date NOT NULL,
  `estado` bit(1) NOT NULL,
  `documentoPazysalvo` tinyint(1) DEFAULT NULL,
  `vinculacion_idvinculacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pazysalvo`
--

LOCK TABLES `pazysalvo` WRITE;
/*!40000 ALTER TABLE `pazysalvo` DISABLE KEYS */;
/*!40000 ALTER TABLE `pazysalvo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion`
--

DROP TABLE IF EXISTS `postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postulacion` (
  `idpostulacion` int(11) NOT NULL AUTO_INCREMENT,
  `estadoPostulacion` int(11) NOT NULL DEFAULT 1,
  `fecha_postulacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `convocatoria_idconvocatoria` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idpostulacion`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
INSERT INTO `postulacion` VALUES (20,0,'2025-02-28 21:55:05',2,111),(21,0,'2025-02-28 21:55:19',1,111),(22,0,'2025-02-28 22:03:46',2,222);
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion_has_notificacion`
--

DROP TABLE IF EXISTS `postulacion_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postulacion_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion_has_notificacion`
--

LOCK TABLES `postulacion_has_notificacion` WRITE;
/*!40000 ALTER TABLE `postulacion_has_notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `postulacion_has_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quejareclamo`
--

DROP TABLE IF EXISTS `quejareclamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quejareclamo` (
  `idquejaReclamo` int(11) NOT NULL AUTO_INCREMENT,
  `chat_idChat` int(11) NOT NULL,
  `usuario_emisor` int(11) NOT NULL,
  `usuario_receptor` int(11) NOT NULL,
  `mensaje_emisor` text DEFAULT NULL,
  `mensaje_receptor` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idquejaReclamo`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quejareclamo`
--

LOCK TABLES `quejareclamo` WRITE;
/*!40000 ALTER TABLE `quejareclamo` DISABLE KEYS */;
INSERT INTO `quejareclamo` VALUES (33,1,1014,10224,'asd','','2025-02-02 12:20:37'),(36,1,1014,10224,'asd','','2025-02-02 12:23:48'),(37,1,10224,1014,'asd',NULL,'2025-02-02 12:31:03'),(38,1,10224,1014,'asd',NULL,'2025-02-06 22:42:07'),(39,2,10224,1025315410,'asd',NULL,'2025-02-06 22:44:08'),(40,2,10224,1025315410,'asd',NULL,'2025-02-06 22:52:30'),(41,1,10224,1014,'a',NULL,'2025-02-06 23:10:21');
/*!40000 ALTER TABLE `quejareclamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `idrol` int(11) NOT NULL,
  `nombreRol` varchar(45) NOT NULL,
  `estadoRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador',1),(2,'Recursos humanos',1),(3,'Empleados',1),(4,'Aspirante',1);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `num_doc` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(45) NOT NULL,
  `tipodDoc` varchar(40) NOT NULL,
  `password` varchar(250) NOT NULL,
  `estado` int(11) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL AUTO_INCREMENT,
  `rol_idrol` int(11) NOT NULL,
  PRIMARY KEY (`hojadevida_idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1014,'TEST','API','API@gmail.com','CEDULA','$2y$10$PalwiV3z7dAD5Rp4CdIKZOO/h/Vdy9Y1XIFnXzGvPnGq2tKYY.GMy',1,23,3),(999,'alex','alex','alex@gmail.com','cedula','$2y$10$y3kLh73HKY/fhbR0kkGaWeKs1o45.TmEXp7dm7/EqCrkWCorCvWmK',1,24,4),(10224,'Alex','TEST','Arch@gmail.com','Cedula','$2y$10$cdB2mXF7JAkLp17x2dK34emyDZ61AHdx2f6rkRSsFQ0Au0a83QriW',1,25,2),(7777,'TEST','ADMIN','admin@gmail.com','Cedula','$2y$10$o2nz1SbhZe/EU6SlD9IL..0zuZIPu4blYblnzRIuhh9Q9aNnlL.Gm',1,26,1),(1241,'asd','asd','asd@gmail.com','CEDULA','$2y$10$cUfetnR2WB7hWuzVKGSLX.SQm1N5h9a5sCV.iaaO9h9A.uHVBEjE2',1,28,4),(10152215,'asd','asd','email@gmail.com','CEDULA','$2y$10$psfke4GqkR6wKSKCDnsw9.I9SGDikC1mpCSu7nP4a3arp7FlJmDIK',1,29,4),(354135,'ASD','LOL','alex@gmail.com','CEDULA','$2y$10$xyzMNWKCm/X1nV4qnmWnt.lUgE2ymXayb8VQbn0lS5CGW8nxdJple',1,30,4),(111,'Juan','Lopez','111@gmail.com','CEDULA','$2y$10$Nw3l7qwS7g8A5mJYL9iSOujiLzeOMOClt7zfRgh3iyMogzQkI12Om',1,31,4),(1025315410,'Juan','Lopez','JuanLopez@gmail.com','CEDULA','$2y$10$.61nxCEd5mdYTfkmZBONWuA5g9u910mcbVQdGu38.Vcq1oCx4STs.',1,32,3),(222,'juanito','alimana','juanito.alimana@gmail.com','cedula','$2y$10$mJV8amdi1QWpixkOetW12u1d1Y5PG25Fjux9e534AGuH2cw446KX2',1,33,4);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacacion`
--

DROP TABLE IF EXISTS `vacacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacacion` (
  `idvacacion` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprovadoPor` varchar(45) NOT NULL,
  `estadoVacacion` varchar(45) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacacion`
--

LOCK TABLES `vacacion` WRITE;
/*!40000 ALTER TABLE `vacacion` DISABLE KEYS */;
INSERT INTO `vacacion` VALUES (0,'2025-02-08','2025-02-15','','Pendiente',10224);
/*!40000 ALTER TABLE `vacacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vinculacion`
--

DROP TABLE IF EXISTS `vinculacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vinculacion` (
  `idvinculacion` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoContrato` varchar(80) NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `estadoContrato` int(11) NOT NULL,
  `fechaFirma` date NOT NULL,
  `documentoContrato` tinyint(1) DEFAULT NULL,
  `evaluacionesSg_idevaluacion` int(11) NOT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idvinculacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vinculacion`
--

LOCK TABLES `vinculacion` WRITE;
/*!40000 ALTER TABLE `vinculacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `vinculacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-07 16:55:24
