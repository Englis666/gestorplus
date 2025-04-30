-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: gestor_plus
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

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
-- Current Database: `gestor_plus`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `gestor_plus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `gestor_plus`;

--
-- Table structure for table `ausencias`
--

DROP TABLE IF EXISTS `ausencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencias` (
  `id_ausencia` int(11) NOT NULL AUTO_INCREMENT,
  `numero_de_ausencia` varchar(50) NOT NULL,
  `motivo_de_ausencia` mediumtext NOT NULL,
  `fecha_ausencia` date NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_ausencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias`
--

LOCK TABLES `ausencias` WRITE;
/*!40000 ALTER TABLE `ausencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `ausencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ausencias_has_jornada`
--

DROP TABLE IF EXISTS `ausencias_has_jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencias_has_jornada` (
  `Ausencias_id_ausencia` int(11) NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  KEY `Ausencias_id_ausencia` (`Ausencias_id_ausencia`),
  KEY `Jornada_id_Jornada` (`Jornada_id_Jornada`),
  CONSTRAINT `ausencias_has_jornada_ibfk_1` FOREIGN KEY (`Ausencias_id_ausencia`) REFERENCES `ausencias` (`id_ausencia`),
  CONSTRAINT `ausencias_has_jornada_ibfk_2` FOREIGN KEY (`Jornada_id_Jornada`) REFERENCES `jornada` (`id_Jornada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias_has_jornada`
--

LOCK TABLES `ausencias_has_jornada` WRITE;
/*!40000 ALTER TABLE `ausencias_has_jornada` DISABLE KEYS */;
/*!40000 ALTER TABLE `ausencias_has_jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo` (
  `id_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `cargo` varchar(50) NOT NULL,
  `descripcion_cargo` mediumtext NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  `categorias_id_categoria` int(11) NOT NULL,
  `categorias_Hoja_de_vida_id_hojavida` int(11) NOT NULL,
  PRIMARY KEY (`id_cargo`),
  KEY `categorias_id_categoria` (`categorias_id_categoria`),
  KEY `categorias_Hoja_de_vida_id_hojavida` (`categorias_Hoja_de_vida_id_hojavida`),
  CONSTRAINT `cargo_ibfk_1` FOREIGN KEY (`categorias_id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `cargo_ibfk_2` FOREIGN KEY (`categorias_Hoja_de_vida_id_hojavida`) REFERENCES `hoja_de_vida` (`id_hojavida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(50) NOT NULL,
  `descripcion_categoria` varchar(50) NOT NULL,
  `Hoja_de_vida_id_hojavida` int(11) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  KEY `Hoja_de_vida_id_hojavida` (`Hoja_de_vida_id_hojavida`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`Hoja_de_vida_id_hojavida`) REFERENCES `hoja_de_vida` (`id_hojavida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cita` (
  `id_Cita` int(11) NOT NULL,
  `fecha_cita` date NOT NULL,
  `tipo_de_cita` varchar(50) NOT NULL,
  `descripcion_cita` mediumtext NOT NULL,
  `postulaciones_id_postulaciones` int(11) NOT NULL,
  PRIMARY KEY (`id_Cita`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contratos` (
  `id_contrato` int(11) NOT NULL AUTO_INCREMENT,
  `contrato_doc` blob NOT NULL,
  `fechaInicial` date NOT NULL,
  `fechaFinal` date DEFAULT NULL,
  `estadoCont` varchar(45) NOT NULL,
  `tipoCont` varchar(45) NOT NULL,
  `postulaciones_id_postulaciones` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contrato`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudios`
--

DROP TABLE IF EXISTS `estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estudios` (
  `id_estudio` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estudio` varchar(45) NOT NULL,
  `institucion` varchar(45) NOT NULL,
  `nivel_estudio` varchar(45) NOT NULL,
  `fecha_final` varchar(60) NOT NULL,
  `certificado_estudio` longtext NOT NULL,
  `Hoja_de_vida_id_hojavida` int(11) NOT NULL,
  PRIMARY KEY (`id_estudio`),
  KEY `Hoja_de_vida_id_hojavida` (`Hoja_de_vida_id_hojavida`),
  CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`Hoja_de_vida_id_hojavida`) REFERENCES `hoja_de_vida` (`id_hojavida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudios`
--

LOCK TABLES `estudios` WRITE;
/*!40000 ALTER TABLE `estudios` DISABLE KEYS */;
/*!40000 ALTER TABLE `estudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencia`
--

DROP TABLE IF EXISTS `experiencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experiencia` (
  `id_experiencia` int(11) NOT NULL AUTO_INCREMENT,
  `empresa` varchar(50) NOT NULL,
  `puesto` varchar(50) NOT NULL,
  `descripcion_experiencia` varchar(45) NOT NULL,
  `fecha_inicio_experiencia` date NOT NULL,
  `fecha_fin_experiencia` date NOT NULL,
  `certificado_experiencia` longtext NOT NULL,
  `Hoja_de_vida_id_hojavida` int(11) NOT NULL,
  PRIMARY KEY (`id_experiencia`),
  KEY `Hoja_de_vida_id_hojavida` (`Hoja_de_vida_id_hojavida`),
  CONSTRAINT `experiencia_ibfk_1` FOREIGN KEY (`Hoja_de_vida_id_hojavida`) REFERENCES `hoja_de_vida` (`id_hojavida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia`
--

LOCK TABLES `experiencia` WRITE;
/*!40000 ALTER TABLE `experiencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoja_de_vida`
--

DROP TABLE IF EXISTS `hoja_de_vida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoja_de_vida` (
  `id_hojavida` int(11) NOT NULL AUTO_INCREMENT,
  `Hoja_de_vida` longtext NOT NULL,
  `fotografia` longtext NOT NULL,
  `num_doc` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `f_nacimiento` date NOT NULL,
  `dirección` varchar(80) NOT NULL,
  `teléfono` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `estado_civil` varchar(50) NOT NULL,
  `genero` varchar(50) NOT NULL,
  `tipo_rh` varchar(4) NOT NULL,
  PRIMARY KEY (`id_hojavida`),
  UNIQUE KEY `num_doc` (`num_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoja_de_vida`
--

LOCK TABLES `hoja_de_vida` WRITE;
/*!40000 ALTER TABLE `hoja_de_vida` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoja_de_vida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_extra`
--

DROP TABLE IF EXISTS `horas_extra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horas_extra` (
  `id_horas_extra` int(11) NOT NULL AUTO_INCREMENT,
  `inicio_hora_extra` time NOT NULL,
  `fin_hora_extra` time NOT NULL,
  `fecha_día` date NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  PRIMARY KEY (`id_horas_extra`),
  KEY `Jornada_id_Jornada` (`Jornada_id_Jornada`),
  CONSTRAINT `horas_extra_ibfk_1` FOREIGN KEY (`Jornada_id_Jornada`) REFERENCES `jornada` (`id_Jornada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_extra`
--

LOCK TABLES `horas_extra` WRITE;
/*!40000 ALTER TABLE `horas_extra` DISABLE KEYS */;
/*!40000 ALTER TABLE `horas_extra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada`
--

DROP TABLE IF EXISTS `jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada` (
  `id_Jornada` int(11) NOT NULL AUTO_INCREMENT,
  `registro_de_hora_inicial` time NOT NULL,
  `registro_de_hora_final` time NOT NULL,
  `hora_de_descanso_inicial` time NOT NULL,
  `hora_de_descanso_fin` time NOT NULL,
  `Cargo_id_cargo` int(11) NOT NULL,
  PRIMARY KEY (`id_Jornada`),
  KEY `Cargo_id_cargo` (`Cargo_id_cargo`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`Cargo_id_cargo`) REFERENCES `cargo` (`id_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paz_salvo`
--

DROP TABLE IF EXISTS `paz_salvo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paz_salvo` (
  `id_paz_y_salvo` int(11) NOT NULL AUTO_INCREMENT,
  `paz_salvo` tinyint(1) NOT NULL,
  `Fecha_de_emision` date NOT NULL,
  `Estado_paz_y_salvo` varchar(50) DEFAULT NULL,
  `Contratos_id_contrato` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_paz_y_salvo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paz_salvo`
--

LOCK TABLES `paz_salvo` WRITE;
/*!40000 ALTER TABLE `paz_salvo` DISABLE KEYS */;
/*!40000 ALTER TABLE `paz_salvo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion`
--

DROP TABLE IF EXISTS `postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postulacion` (
  `id_postulacion` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_postulacion` date NOT NULL,
  `estado_vacante` varchar(50) NOT NULL,
  `Vacantes_id_vacantes` int(11) NOT NULL,
  PRIMARY KEY (`id_postulacion`),
  KEY `Vacantes_id_vacantes` (`Vacantes_id_vacantes`),
  CONSTRAINT `postulacion_ibfk_1` FOREIGN KEY (`Vacantes_id_vacantes`) REFERENCES `vacantes` (`id_vacantes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quejas_y_reclamos`
--

DROP TABLE IF EXISTS `quejas_y_reclamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quejas_y_reclamos` (
  `id_quejas_y_reclamos` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_de_queja` varchar(250) NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  `Respuesta` varchar(45) NOT NULL,
  `Fecha_respuesta` date NOT NULL,
  PRIMARY KEY (`id_quejas_y_reclamos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quejas_y_reclamos`
--

LOCK TABLES `quejas_y_reclamos` WRITE;
/*!40000 ALTER TABLE `quejas_y_reclamos` DISABLE KEYS */;
/*!40000 ALTER TABLE `quejas_y_reclamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quejas_y_reclamos_has_cargo`
--

DROP TABLE IF EXISTS `quejas_y_reclamos_has_cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quejas_y_reclamos_has_cargo` (
  `Quejas_y_reclamos_id_quejas_y_reclamos` int(11) NOT NULL,
  `Cargo_id_cargo` int(11) NOT NULL,
  `Cargo_categorias_id_categorias1` int(11) NOT NULL,
  `Cargo_categorias_Hoja_de_vida_id_hojavida1` int(11) NOT NULL,
  KEY `Quejas_y_reclamos_id_quejas_y_reclamos` (`Quejas_y_reclamos_id_quejas_y_reclamos`),
  KEY `Cargo_id_cargo` (`Cargo_id_cargo`),
  CONSTRAINT `quejas_y_reclamos_has_cargo_ibfk_1` FOREIGN KEY (`Quejas_y_reclamos_id_quejas_y_reclamos`) REFERENCES `quejas_y_reclamos` (`id_quejas_y_reclamos`),
  CONSTRAINT `quejas_y_reclamos_has_cargo_ibfk_2` FOREIGN KEY (`Cargo_id_cargo`) REFERENCES `cargo` (`id_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quejas_y_reclamos_has_cargo`
--

LOCK TABLES `quejas_y_reclamos_has_cargo` WRITE;
/*!40000 ALTER TABLE `quejas_y_reclamos_has_cargo` DISABLE KEYS */;
/*!40000 ALTER TABLE `quejas_y_reclamos_has_cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacaciones`
--

DROP TABLE IF EXISTS `vacaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacaciones` (
  `id_vacaciones` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  PRIMARY KEY (`id_vacaciones`),
  KEY `Jornada_id_Jornada` (`Jornada_id_Jornada`),
  CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`Jornada_id_Jornada`) REFERENCES `jornada` (`id_Jornada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacaciones`
--

LOCK TABLES `vacaciones` WRITE;
/*!40000 ALTER TABLE `vacaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `vacaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacantes`
--

DROP TABLE IF EXISTS `vacantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacantes` (
  `id_vacantes` int(11) NOT NULL AUTO_INCREMENT,
  `estado_vacante` varchar(50) NOT NULL,
  `descripcion_vacante` text NOT NULL,
  `numero_puestos` int(11) NOT NULL,
  `Hoja_de_vida_id_hojavida` int(11) NOT NULL,
  `Cargo_id_cargo` int(11) NOT NULL,
  PRIMARY KEY (`id_vacantes`),
  KEY `Hoja_de_vida_id_hojavida` (`Hoja_de_vida_id_hojavida`),
  KEY `Cargo_id_cargo` (`Cargo_id_cargo`),
  CONSTRAINT `vacantes_ibfk_1` FOREIGN KEY (`Hoja_de_vida_id_hojavida`) REFERENCES `hoja_de_vida` (`id_hojavida`),
  CONSTRAINT `vacantes_ibfk_2` FOREIGN KEY (`Cargo_id_cargo`) REFERENCES `cargo` (`id_cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacantes`
--

LOCK TABLES `vacantes` WRITE;
/*!40000 ALTER TABLE `vacantes` DISABLE KEYS */;
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

-- Dump completed on 2024-08-14 17:00:26
