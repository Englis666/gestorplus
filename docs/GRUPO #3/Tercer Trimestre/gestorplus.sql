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
-- Table structure for table `ausencias`
--

DROP TABLE IF EXISTS `ausencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencias` (
  `idausencias` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `tipoAusencia` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `justificada` bit(1) DEFAULT NULL,
  `fechaRegistro` date NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL,
  PRIMARY KEY (`idausencias`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`),
  CONSTRAINT `ausencias_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  CONSTRAINT `ausencias_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`),
  CONSTRAINT `ausencias_ibfk_3` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias`
--

LOCK TABLES `ausencias` WRITE;
/*!40000 ALTER TABLE `ausencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `ausencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargos` (
  `idcargos` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCargo` varchar(45) NOT NULL,
  `estadoCargo` bit(1) NOT NULL,
  PRIMARY KEY (`idcargos`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` VALUES (1,'Desarollador de software',''),(2,'Ingeniero Industrial',''),(3,'Contador','');
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contratos` (
  `idcontrato` int(11) NOT NULL AUTO_INCREMENT,
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
  `postulaciones_usuarios_roles_idrol` int(11) NOT NULL,
  PRIMARY KEY (`idcontrato`),
  KEY `postulaciones_idpostulaciones` (`postulaciones_idpostulaciones`),
  KEY `postulaciones_usuarios_num_doc` (`postulaciones_usuarios_num_doc`),
  KEY `postulaciones_usuarios_hojadevida_idHojadevida` (`postulaciones_usuarios_hojadevida_idHojadevida`),
  KEY `cargos_idcargos` (`cargos_idcargos`),
  KEY `postulaciones_usuarios_roles_idrol` (`postulaciones_usuarios_roles_idrol`),
  CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`postulaciones_idpostulaciones`) REFERENCES `postulaciones` (`idpostulaciones`),
  CONSTRAINT `contratos_ibfk_2` FOREIGN KEY (`postulaciones_usuarios_num_doc`) REFERENCES `postulaciones` (`usuarios_num_doc`),
  CONSTRAINT `contratos_ibfk_3` FOREIGN KEY (`postulaciones_usuarios_hojadevida_idHojadevida`) REFERENCES `postulaciones` (`usuarios_hojadevida_idHojadevida`),
  CONSTRAINT `contratos_ibfk_4` FOREIGN KEY (`cargos_idcargos`) REFERENCES `cargos` (`idcargos`),
  CONSTRAINT `contratos_ibfk_5` FOREIGN KEY (`postulaciones_usuarios_roles_idrol`) REFERENCES `postulaciones` (`usuarios_roles_idrol`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
INSERT INTO `contratos` VALUES (6,'2024-09-18','2024-10-02','bjbjbj',55555.00,'','2024-09-11',NULL,1,123,4,3,3),(7,'2024-09-18','2024-10-02','bjbjbj',55555.00,'','2024-09-11',NULL,1,123,4,3,3);
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudios`
--

DROP TABLE IF EXISTS `estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estudios` (
  `id_estudios` int(11) NOT NULL AUTO_INCREMENT,
  `nivelEstudio` varchar(25) NOT NULL,
  `areaEstudio` varchar(25) NOT NULL,
  `estadoEstudio` varchar(15) NOT NULL,
  `fechaInicioEstudio` date NOT NULL,
  `fechaFinEstudio` date NOT NULL,
  `tituloEstudio` varchar(45) NOT NULL,
  `ubicacionEstudio` varchar(50) DEFAULT NULL,
  `institucionEstudio` varchar(100) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`id_estudios`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudios`
--

LOCK TABLES `estudios` WRITE;
/*!40000 ALTER TABLE `estudios` DISABLE KEYS */;
INSERT INTO `estudios` VALUES (1,'asdsad','dsadsa','dsadsa','2024-10-09','2024-09-18','dsadsa','dsadsa','dsadsadsa',4),(2,'SADDSA','DSA','adsdsa','2024-09-09','2024-09-25','dsadsa','dsadsadsa','dsadsadsa',5),(3,'Licenciatura','Ingeniería','Titulado','2015-01-01','2020-12-31','Ingeniero en sistemas','Ciudad de México','Universidad Nacional Autónoma de México',7),(4,'Maestría','Ingeniería en redes','Titulado','2012-01-01','2015-12-31','Ingeniero en redes','Ciudad de México','Universidad Nacional Autónoma de México',7);
/*!40000 ALTER TABLE `estudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencialaboral`
--

DROP TABLE IF EXISTS `experiencialaboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experiencialaboral` (
  `id_experiencia` int(11) NOT NULL AUTO_INCREMENT,
  `profesion` varchar(45) NOT NULL,
  `descripcionPerfil` varchar(45) NOT NULL,
  `fechaInicioExp` date NOT NULL,
  `fechaFinExp` date NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`id_experiencia`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencialaboral`
--

LOCK TABLES `experiencialaboral` WRITE;
/*!40000 ALTER TABLE `experiencialaboral` DISABLE KEYS */;
INSERT INTO `experiencialaboral` VALUES (1,'sddsasadsad','asffsafsa','2024-09-18','2024-09-17',4),(2,'adsdsadsa','adsdsadsa','2024-09-18','2024-09-30',5),(3,'Ingeniero de software','Desarrollador de software','2020-01-01','2022-12-31',7),(4,'Ingeniero de redes','Administrador de redes','2018-01-01','2020-12-31',7);
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
  `estadohojadevida` int(11) NOT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hojadevida`
--

LOCK TABLES `hojadevida` WRITE;
/*!40000 ALTER TABLE `hojadevida` DISABLE KEYS */;
INSERT INTO `hojadevida` VALUES (3,'2024-09-11','sads',1,'addsa','asdsad','53151351','531531'),(4,'2024-09-11','sads',1,'addsa','asdsad','53151351','531531'),(5,'0000-00-00','asda',1,'sddsadsa','dsadsa','65436436','643643'),(6,'1990-01-01','Calle 123',1,'Bogotá','Bogotá','1234567890','123456'),(7,'1990-01-01','Calle 123',1,'Bogotá','Bogotá','1234567890','123456');
/*!40000 ALTER TABLE `hojadevida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horasextra`
--

DROP TABLE IF EXISTS `horasextra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horasextra` (
  `idHorasextra` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `horasExtra` time NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  PRIMARY KEY (`idHorasextra`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  CONSTRAINT `horasextra_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  CONSTRAINT `horasextra_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horasextra`
--

LOCK TABLES `horasextra` WRITE;
/*!40000 ALTER TABLE `horasextra` DISABLE KEYS */;
INSERT INTO `horasextra` VALUES (2,'2022-01-02','09:00:00',12345,4);
/*!40000 ALTER TABLE `horasextra` ENABLE KEYS */;
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
  `estadoJornada` int(11) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL,
  PRIMARY KEY (`idJornada`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  CONSTRAINT `jornada_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`),
  CONSTRAINT `jornada_ibfk_3` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
INSERT INTO `jornada` VALUES (4,'2024-09-18','19:59:00','21:55:00',1,123,3,8),(5,'2022-01-02','09:00:00','18:00:00',2,12345,4,21);
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificaciones` (
  `idnotificacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` text NOT NULL,
  `tipo` varchar(150) NOT NULL,
  `estadoNotificacion` bit(1) NOT NULL,
  `nombreCargo` varchar(45) NOT NULL,
  PRIMARY KEY (`idnotificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,'El usuario con número de documento 123 y con los nombres TEST ha realizado una postulación a la vacante con el cargo Contador','postulacion','',''),(2,'El usuario con número de documento 789 y con los nombres YISED ha realizado una postulación a la vacante con el cargo Contador','postulacion','',''),(8,'Nueva jornada registrada por el usuario con documento: 123 y con el nombre TEST','Jornada','',''),(9,'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia','Ausencia','',''),(14,'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia','Ausencia','',''),(15,'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia','Ausencia','',''),(16,'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia','Ausencia','',''),(17,'El usuario con número de documento 123 y con los nombres TEST ha solicitado una ausencia','Ausencia','',''),(20,'Se ha postulado para el cargo','Postulación','','cargo'),(21,'Se ha creado una nueva jornada para el día 2022-01-01','Jornada','','jornada'),(22,'Se ha creado una nueva jornada para el día 2022-01-01','Jornada','','jornada');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pazysalvo`
--

DROP TABLE IF EXISTS `pazysalvo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pazysalvo` (
  `idpazysalvo` int(11) NOT NULL AUTO_INCREMENT,
  `motivo` varchar(150) NOT NULL,
  `fechaEmision` date NOT NULL,
  `estado` bit(1) NOT NULL,
  `documentoPazysalvo` tinyint(1) DEFAULT NULL,
  `contratos_idcontrato` int(11) NOT NULL,
  `contratos_postulaciones_idpostulaciones` int(11) NOT NULL,
  `contratos_postulaciones_usuarios_num_doc` int(11) NOT NULL,
  `contratos_cargos_idcargos` int(11) NOT NULL,
  PRIMARY KEY (`idpazysalvo`),
  KEY `contratos_idcontrato` (`contratos_idcontrato`),
  KEY `contratos_postulaciones_idpostulaciones` (`contratos_postulaciones_idpostulaciones`),
  KEY `contratos_postulaciones_usuarios_num_doc` (`contratos_postulaciones_usuarios_num_doc`),
  KEY `contratos_cargos_idcargos` (`contratos_cargos_idcargos`),
  CONSTRAINT `pazysalvo_ibfk_1` FOREIGN KEY (`contratos_idcontrato`) REFERENCES `contratos` (`idcontrato`),
  CONSTRAINT `pazysalvo_ibfk_2` FOREIGN KEY (`contratos_postulaciones_idpostulaciones`) REFERENCES `contratos` (`postulaciones_idpostulaciones`),
  CONSTRAINT `pazysalvo_ibfk_3` FOREIGN KEY (`contratos_postulaciones_usuarios_num_doc`) REFERENCES `contratos` (`postulaciones_usuarios_num_doc`),
  CONSTRAINT `pazysalvo_ibfk_4` FOREIGN KEY (`contratos_cargos_idcargos`) REFERENCES `cargos` (`idcargos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pazysalvo`
--

LOCK TABLES `pazysalvo` WRITE;
/*!40000 ALTER TABLE `pazysalvo` DISABLE KEYS */;
/*!40000 ALTER TABLE `pazysalvo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulaciones`
--

DROP TABLE IF EXISTS `postulaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postulaciones` (
  `idpostulaciones` int(11) NOT NULL AUTO_INCREMENT,
  `estadoPostulacion` bit(1) NOT NULL,
  `vacantes_idvacantes` int(11) NOT NULL,
  `vacantes_cargos_idcargos` int(11) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_hojadevida_idHojadevida` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  `notificaciones_idnotificacion` int(11) NOT NULL,
  PRIMARY KEY (`idpostulaciones`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  KEY `usuarios_hojadevida_idHojadevida` (`usuarios_hojadevida_idHojadevida`),
  KEY `notificaciones_idnotificacion` (`notificaciones_idnotificacion`),
  KEY `vacantes_idvacantes` (`vacantes_idvacantes`),
  KEY `vacantes_cargos_idcargos` (`vacantes_cargos_idcargos`),
  CONSTRAINT `postulaciones_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`) ON UPDATE CASCADE,
  CONSTRAINT `postulaciones_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postulaciones_ibfk_3` FOREIGN KEY (`usuarios_hojadevida_idHojadevida`) REFERENCES `usuarios` (`hojadevida_idHojadevida`) ON UPDATE CASCADE,
  CONSTRAINT `postulaciones_ibfk_4` FOREIGN KEY (`notificaciones_idnotificacion`) REFERENCES `notificaciones` (`idnotificacion`) ON UPDATE CASCADE,
  CONSTRAINT `postulaciones_ibfk_7` FOREIGN KEY (`vacantes_idvacantes`) REFERENCES `vacantes` (`idvacantes`) ON UPDATE CASCADE,
  CONSTRAINT `postulaciones_ibfk_8` FOREIGN KEY (`vacantes_cargos_idcargos`) REFERENCES `vacantes` (`cargos_idcargos`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulaciones`
--

LOCK TABLES `postulaciones` WRITE;
/*!40000 ALTER TABLE `postulaciones` DISABLE KEYS */;
INSERT INTO `postulaciones` VALUES (1,'',1,3,123,4,3,1),(2,'',1,3,789,5,2,2),(4,'',1,3,12345,7,4,20);
/*!40000 ALTER TABLE `postulaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quejasreclamos`
--

DROP TABLE IF EXISTS `quejasreclamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quejasreclamos` (
  `idQuejasReclamos` int(11) NOT NULL AUTO_INCREMENT,
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipoQuejaReclamo` varchar(45) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `estado` bit(1) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  PRIMARY KEY (`idQuejasReclamos`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  CONSTRAINT `quejasreclamos_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  CONSTRAINT `quejasreclamos_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quejasreclamos`
--

LOCK TABLES `quejasreclamos` WRITE;
/*!40000 ALTER TABLE `quejasreclamos` DISABLE KEYS */;
INSERT INTO `quejasreclamos` VALUES (2,'2024-09-30 23:47:16','Reclamo por servicio','El servicio fue muy malo','\0',12345,4);
/*!40000 ALTER TABLE `quejasreclamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL AUTO_INCREMENT,
  `nombreRol` varchar(20) NOT NULL,
  `estadoRol` bit(1) NOT NULL,
  PRIMARY KEY (`idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador',''),(2,'Recursos humanos',''),(3,'Empleados',''),(4,'Aspirantes','');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `num_doc` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `tipodDoc` varchar(20) NOT NULL,
  `password` varchar(150) NOT NULL,
  `estado` bit(1) NOT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  `roles_idrol` int(11) NOT NULL,
  PRIMARY KEY (`num_doc`),
  KEY `roles_idrol` (`roles_idrol`),
  KEY `fk_usuarios_hojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `fk_usuarios_hojadevida` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`roles_idrol`) REFERENCES `roles` (`idrol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12346 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (123,'TEST','ALEX','alex@gmail.es','Cedula','$2y$10$yYnNQSqK8pzNuhdj7H8fZ.x10j7GKG5bk9mlZiufBkR3yTUKMEKSC','',4,3),(789,'YISED','YONAIKER','YISED@gmail.com','Cedula','$2y$10$Hlp.zusVSIUQe14puqhbcOA6K0mFEUSXI3D4ZiBcMTM/ZvIHkdruW','',5,2),(12345,'Juan','Pérez','juan.perez@example.com','CC','password123','',7,4);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacaciones`
--

DROP TABLE IF EXISTS `vacaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacaciones` (
  `idvacaciones` int(11) NOT NULL AUTO_INCREMENT,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `aprobadoPor` varchar(25) NOT NULL,
  `estado` bit(1) NOT NULL,
  `usuarios_num_doc` int(11) NOT NULL,
  `usuarios_roles_idrol` int(11) NOT NULL,
  PRIMARY KEY (`idvacaciones`),
  KEY `usuarios_num_doc` (`usuarios_num_doc`),
  KEY `usuarios_roles_idrol` (`usuarios_roles_idrol`),
  CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`usuarios_num_doc`) REFERENCES `usuarios` (`num_doc`),
  CONSTRAINT `vacaciones_ibfk_2` FOREIGN KEY (`usuarios_roles_idrol`) REFERENCES `usuarios` (`roles_idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacaciones`
--

LOCK TABLES `vacaciones` WRITE;
/*!40000 ALTER TABLE `vacaciones` DISABLE KEYS */;
INSERT INTO `vacaciones` VALUES (2,'2022-01-01','2022-01-31','Jefe de Recursos Humanos','',12345,4);
/*!40000 ALTER TABLE `vacaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacantes`
--

DROP TABLE IF EXISTS `vacantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacantes` (
  `idvacantes` int(11) NOT NULL AUTO_INCREMENT,
  `nombreVacante` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cargos_idcargos` int(11) NOT NULL,
  `habilidades` text NOT NULL,
  `cantidadVacantes` int(11) NOT NULL,
  PRIMARY KEY (`idvacantes`),
  KEY `cargos_idcargos` (`cargos_idcargos`),
  CONSTRAINT `vacantes_ibfk_1` FOREIGN KEY (`cargos_idcargos`) REFERENCES `cargos` (`idcargos`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacantes`
--

LOCK TABLES `vacantes` WRITE;
/*!40000 ALTER TABLE `vacantes` DISABLE KEYS */;
INSERT INTO `vacantes` VALUES (1,'Contador','asdadsdsa','dsadsadsa',50000.00,3,'saddsadsa',55),(2,'Desarrollador de software','Desarrollar software','Conocimientos en Java y Spring',50000.00,1,'Java, Spring',2);
/*!40000 ALTER TABLE `vacantes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-30 23:32:00
