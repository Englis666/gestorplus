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
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_ausencia`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias`
--

LOCK TABLES `ausencias` WRITE;
/*!40000 ALTER TABLE `ausencias` DISABLE KEYS */;
INSERT INTO `ausencias` VALUES (1,'4','Enfermedad','2024-06-10','Cristian'),(2,'9','accidente','2023-03-10','Juan'),(3,'1','Calamidad familiar','2024-03-15','Estevan'),(4,'1','Incapacidad','2024-08-15','Johan'),(5,'1','Incapacidad','2024-08-15','Jhonny'),(6,'1','Incapacidad','2024-03-15','Yised'),(7,'3','Incapacidad','2024-03-05','Laura'),(8,'3','Viaje','2024-04-15','Rojas'),(9,'3','Vacaciones','2024-04-25','Alejandro');
/*!40000 ALTER TABLE `ausencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ausencias_jornada`
--

DROP TABLE IF EXISTS `ausencias_jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ausencias_jornada` (
  `Ausencias_id_aus` int(11) NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  `Jornada_Ausencias_id_aus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias_jornada`
--

LOCK TABLES `ausencias_jornada` WRITE;
/*!40000 ALTER TABLE `ausencias_jornada` DISABLE KEYS */;
/*!40000 ALTER TABLE `ausencias_jornada` ENABLE KEYS */;
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
  PRIMARY KEY (`id_cargo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (1,'Guardia','Responsable de vigilancia'),(2,'Contador','Acceso a funciones de contador y actividades relacionadas'),(3,'Ingeniero de sistemas','Responsable de control de area'),(4,'Recursos humanos','Responsable de control de hojas de vida, ausencias y control de aspirantes'),(5,'Aseador@','Control de asistencias y ausencias'),(6,'Gerente ','Consulta de asistencias y ausencias, quejas y reclamos'),(7,'Tecnico en programacion de software','Responsable de gestion back y frond end');
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_categorias`
--

DROP TABLE IF EXISTS `cargo_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo_categorias` (
  `Cargo_id_cargo` int(11) NOT NULL,
  `cargo_jornada_id_jornada` int(11) NOT NULL,
  `cargo_categorias_id_categorias` int(11) NOT NULL,
  `cargo_categorias_hojaDeVida_id_hvida` int(11) NOT NULL,
  `cargo_categorias_id_categorias1` int(11) NOT NULL,
  `cargo_categorias_hojaDeVida_id_hvida1` int(11) NOT NULL,
  `categorias_id_categorias` int(11) NOT NULL,
  `categorias_hojaDeVida_id_hvida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_categorias`
--

LOCK TABLES `cargo_categorias` WRITE;
/*!40000 ALTER TABLE `cargo_categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_jornada`
--

DROP TABLE IF EXISTS `cargo_jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo_jornada` (
  `Cargo_id_cargo` int(11) NOT NULL,
  `Cargo_Jornada_id_Jornada` int(11) NOT NULL,
  `Cargo_categorias_id_categorias` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida` int(11) NOT NULL,
  `Cargo_categorias_id_categorias1` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida1` int(11) NOT NULL,
  `Jornada_id_Jornada` int(11) NOT NULL,
  `Jornada_Ausencias_id_aus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_jornada`
--

LOCK TABLES `cargo_jornada` WRITE;
/*!40000 ALTER TABLE `cargo_jornada` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo_jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_quejas_reclamos`
--

DROP TABLE IF EXISTS `cargo_quejas_reclamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo_quejas_reclamos` (
  `Cargo_id_cargo` int(11) NOT NULL,
  `Cargo_Jornada_id_Jornada` int(11) NOT NULL,
  `Cargo_categorias_id_categorias` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida` int(11) NOT NULL,
  `Cargo_categorias_id_categorias1` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida1` int(11) NOT NULL,
  `QuejasReclamos_id_qyr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_quejas_reclamos`
--

LOCK TABLES `cargo_quejas_reclamos` WRITE;
/*!40000 ALTER TABLE `cargo_quejas_reclamos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo_quejas_reclamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_vacantes`
--

DROP TABLE IF EXISTS `cargo_vacantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo_vacantes` (
  `Cargo_id_cargo` int(11) NOT NULL,
  `Cargo_Jornada_id_Jornada` int(11) NOT NULL,
  `Cargo_categorias_id_categorias` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida` int(11) NOT NULL,
  `Cargo_categorias_id_categorias1` int(11) NOT NULL,
  `Cargo_categorias_hojaDeVida_id_hvida1` int(11) NOT NULL,
  `Vacantes_idVacantes` int(11) NOT NULL,
  `Vacantes_hojaDeVida_id_hvida` int(11) NOT NULL,
  `Vacantes_postulaciones_id_postulaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_vacantes`
--

LOCK TABLES `cargo_vacantes` WRITE;
/*!40000 ALTER TABLE `cargo_vacantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo_vacantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(50) NOT NULL,
  `descripcion_categoria` varchar(50) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_cita` date NOT NULL,
  `tipo_de_cita` varchar(50) NOT NULL,
  `descripcion_cita` mediumtext NOT NULL,
  PRIMARY KEY (`id_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,'2024-05-10','Entrevista','Aspirante para el cargo guardia'),(2,'2024-05-10','Entrevista','Aspirante para el cargo ingeniero de sistemas'),(3,'2024-07-19','Entrevista','Aspirante para el cargo aseador@'),(4,'2024-07-19','Entrevista','Aspirante para el cargo gerente'),(5,'2024-03-19','Entrevista','Aspirante para el cargo tecnico en programacion de software'),(6,'2024-07-19','Entrevista','Aspirante para el cargo contador'),(7,'2024-03-19','Entrevista','Aspirante para el cargo Recursos humanos'),(8,'2024-10-19','Entrevista','Aspirante para el cargo aseador@'),(9,'2024-12-09','Entrevista','Aspirante para el cargo tecnico en programacion de software'),(10,'2024-01-25','Entrevista','Aspirante para el cargo gerente');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contratos` (
  `idContrato` int(11) NOT NULL AUTO_INCREMENT,
  `contrato_doc` blob NOT NULL,
  `fechaInicial` date NOT NULL,
  `fechaFin` date DEFAULT NULL,
  `estadoCont` varchar(45) NOT NULL,
  `tipoCont` varchar(45) NOT NULL,
  PRIMARY KEY (`idContrato`)
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
-- Table structure for table `estudio`
--

DROP TABLE IF EXISTS `estudio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estudio` (
  `id_estudio` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estudio` varchar(80) NOT NULL,
  `institucion` varchar(80) NOT NULL,
  `nivel_estudio` varchar(50) NOT NULL,
  `fecha_final` varchar(60) NOT NULL,
  `certificado_estudio` longtext NOT NULL,
  PRIMARY KEY (`id_estudio`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudio`
--

LOCK TABLES `estudio` WRITE;
/*!40000 ALTER TABLE `estudio` DISABLE KEYS */;
INSERT INTO `estudio` VALUES (1,'Licenciatura en Inform?tica','Universidad Nacional','Grado','2022-07-15','certificado'),(2,'M?ster en Administraci?n de Empresas','Instituto de Negocios Globales','Posgrado','2023-05-30','certificado'),(3,'Curso de Programaci?n Avanzada','Academia TechPro','Curso','2021-12-10','certificado'),(4,'Diplomado en Marketing Digital','Escuela de Marketing Online','Diplomado','2020-09-25','certificado'),(5,'Curso de Ingl?s Avanzado','Instituto de Idiomas Globales','Curso','2021-04-15','certificado'),(6,'Diplomado en Marketing Digital','Escuela de Marketing Online','Diplomado','2020-09-25','certificado'),(7,'Curso de Ingl?s Avanzado','Instituto de Idiomas Globales','Curso','2021-04-15','certificado'),(8,'Curso de Desarrollo Web Full-Stack','Academia de Desarrollo Digital','Curso','2020-11-05','certificado'),(9,'Curso de Dise?o Gr?fico','Escuela de Arte y Dise?o','Curso','2021-07-10','certificado'),(10,'Especializaci?n en Inteligencia Artificial','Instituto de Tecnolog?a Avanzada','Especializaci?n','2022-02-28','certificado');
/*!40000 ALTER TABLE `estudio` ENABLE KEYS */;
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
  `descripcion_experiencia` varchar(50) NOT NULL,
  `fecha_inicio_experiencia` date NOT NULL,
  `fecha_fin_experiencia` date NOT NULL,
  `certificado_experiencia` longtext NOT NULL,
  PRIMARY KEY (`id_experiencia`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia`
--

LOCK TABLES `experiencia` WRITE;
/*!40000 ALTER TABLE `experiencia` DISABLE KEYS */;
INSERT INTO `experiencia` VALUES (1,'Postremia','Gerente','Practicas blandas correctas','2024-10-28','2024-06-23','certificado'),(2,'Postremia0','Pastelero','Practicas blandas correctas','2019-10-28','2022-06-23','certificado'),(3,'Carley','Ingeniero','Practicas blandas correctas','2019-05-28','2024-06-23','certificado'),(4,'Tech Solutions','Desarrollador Web','Desarrollo de aplicaciones web utilizando tecnolog','2020-02-15','2022-08-30','certificado'),(5,'InnovaSoft','Analista de Sistemas','An?lisis y dise?o de sistemas empresariales','2018-09-10','2020-03-20','certificado'),(6,'GlobalTech Solutions','Consultor de TI','Implementaci?n de soluciones de infraestructura en','2017-04-01','2019-11-15','certificado'),(7,'Startup Innovadora','Desarrollador de Software','Desarrollo de prototipos y pruebas de concepto','2023-01-05','0000-00-00','certificado'),(8,'Software Dynamics','Project Manager','Gesti?n del proyecto de migraci?n a la nube para c','2021-03-10','2023-09-25','certificado'),(9,'Universidad Tecnol?gica','Asistente de Investigaci?n','Colaboraci?n en proyectos de investigaci?n en inte','2019-08-15','2020-12-20','Certificado'),(10,'TechConsulting Group','Consultor de Seguridad IT','Auditor?a de sistemas y recomendaciones de segurid','2018-06-01','2021-01-30','certificado');
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
  `hoja_de_vida` longtext NOT NULL,
  `fotografia` longtext NOT NULL,
  `num_doc` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `f_nacimiento` date NOT NULL,
  `direccion` varchar(80) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `estado_civil` varchar(50) NOT NULL,
  `genero` varchar(50) NOT NULL,
  `tipo_rh` varchar(4) NOT NULL,
  PRIMARY KEY (`id_hojavida`),
  UNIQUE KEY `num_doc` (`num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoja_de_vida`
--

LOCK TABLES `hoja_de_vida` WRITE;
/*!40000 ALTER TABLE `hoja_de_vida` DISABLE KEYS */;
INSERT INTO `hoja_de_vida` VALUES (1,'','ruta/a/la/fotografia.jpg','123456789','Juan Perez','1990-05-15','Calle Principal #123','+1234567890','juan.perez@example.com','Soltero','Masculino','O+'),(2,'','ruta/a/la/foto3.jpg','345678901','Ana L?pez','1998-07-25','Col. Esperanza #234','+3339876543','ana.lopez@example.com','Soltero/a','Femenino','O-'),(4,'','ruta/a/la/foto7.jpg','789012345','Isabel L?pez','1995-12-18','Vereda La Paz, Finca La Esperanza','+8889990000','isabel.lopez@example.com','Soltero/a','Femenino','O+'),(5,'','ruta/a/la/foto9.jpg','9988776655','Laura Rodr?guez','1993-02-28','Col. Jardines del Norte, Casa #15','+7776665555','laura.rodriguez@example.com','Soltero/a','Femenino','B+'),(6,'','ruta/a/la/foto10.jpg','5544332211','Andr?s P?rez','1997-11-03','Condominio Santa Luc?a, Bloque D, Apt. 303','+2223334444','andres.perez@example.com','Soltero/a','Masculino','A-'),(7,'','ruta/a/la/foto8.jpg','1122334455','Pablo Hern?ndez','1989-06-08','Calle Mayor #1010, Apt. 202','+9998887777','pablo.hernandez@example.com','Casado/a','Masculino','AB-'),(8,'','ruta/a/la/foto6.jpg','678901234','Jorge Garc?a','1983-04-30','Oficina 301, Edificio Central, Av. Principal #789','+7773332222','jorge.garcia@example.com','Divorciado/a','Masculino','B-'),(9,'','ruta/a/la/foto4.jpg','456789012','Carlos Ram?rez','1980-01-05','Residencial Flores, Casa #10, Calle Primavera','+4441112222','carlos.ramirez@example.com','Casado/a','Masculino','AB+'),(10,'','ruta/a/la/foto1.jpg','987654321','Mar?a Gonz?lez','1985-11-20','Av. Libertad #456','+9876543210','maria.gonzalez@example.com','Casado/a','Femenino','A-');
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
  `fecha_del_dia` date NOT NULL,
  PRIMARY KEY (`id_horas_extra`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_extra`
--

LOCK TABLES `horas_extra` WRITE;
/*!40000 ALTER TABLE `horas_extra` DISABLE KEYS */;
INSERT INTO `horas_extra` VALUES (1,'18:00:00','21:00:00','2024-07-23'),(2,'20:00:00','01:00:00','2024-07-22'),(3,'22:30:00','02:30:00','2024-07-21'),(4,'10:00:00','14:30:00','2024-07-20'),(5,'09:00:00','18:00:00','2024-07-19'),(6,'08:00:00','17:00:00','2024-07-18'),(7,'10:00:00','14:00:00','2024-07-17'),(8,'16:00:00','23:00:00','2024-07-16'),(9,'19:00:00','00:30:00','2024-07-15'),(10,'13:00:00','21:00:00','2024-07-14');
/*!40000 ALTER TABLE `horas_extra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada`
--

DROP TABLE IF EXISTS `jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada` (
  `id_jornada` int(11) NOT NULL AUTO_INCREMENT,
  `registro_de_hora_inicial` time NOT NULL,
  `registro_de_hora_final` time NOT NULL,
  `hora_de_descanso` time NOT NULL,
  PRIMARY KEY (`id_jornada`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
INSERT INTO `jornada` VALUES (1,'09:00:00','18:00:00','01:00:00'),(2,'08:00:00','17:00:00','01:00:00'),(3,'07:30:00','19:30:00','02:00:00'),(4,'06:00:00','12:00:00','00:00:00'),(5,'13:00:00','21:00:00','00:30:00'),(6,'22:00:00','06:00:00','01:00:00'),(7,'08:00:00','12:00:00','00:15:00'),(8,'13:00:00','17:00:00','00:15:00'),(9,'09:00:00','13:00:00','00:30:00'),(10,'14:00:00','18:00:00','00:30:00'),(11,'10:00:00','16:00:00','01:30:00'),(12,'07:30:00','10:30:00','00:15:00'),(13,'11:00:00','14:00:00','00:15:00'),(14,'15:00:00','18:00:00','00:15:00'),(15,'08:30:00','16:30:00','00:00:00');
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada_horasextra`
--

DROP TABLE IF EXISTS `jornada_horasextra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada_horasextra` (
  `Jornada_id_Jornada` int(11) NOT NULL,
  `Jornada_Ausencias_id_aus` int(11) NOT NULL,
  `horas_extras_id_horasExtra` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada_horasextra`
--

LOCK TABLES `jornada_horasextra` WRITE;
/*!40000 ALTER TABLE `jornada_horasextra` DISABLE KEYS */;
/*!40000 ALTER TABLE `jornada_horasextra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada_vacaciones`
--

DROP TABLE IF EXISTS `jornada_vacaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada_vacaciones` (
  `Jornada_id_Jornada` int(11) NOT NULL,
  `Jornada_Ausencias_id_aus` int(11) NOT NULL,
  `vacaciones_id_vacaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada_vacaciones`
--

LOCK TABLES `jornada_vacaciones` WRITE;
/*!40000 ALTER TABLE `jornada_vacaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `jornada_vacaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paz_salvo`
--

DROP TABLE IF EXISTS `paz_salvo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paz_salvo` (
  `id_pys` int(11) NOT NULL AUTO_INCREMENT,
  `paz_salvo` longtext NOT NULL,
  `fecha_de_emision` date NOT NULL,
  `estado_paz_y_salvo` varchar(30) NOT NULL,
  PRIMARY KEY (`id_pys`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paz_salvo`
--

LOCK TABLES `paz_salvo` WRITE;
/*!40000 ALTER TABLE `paz_salvo` DISABLE KEYS */;
INSERT INTO `paz_salvo` VALUES (1,'Todos los impuestos y declaraciones fiscales han sido presentados y pagados.','2024-07-23','Emitido'),(2,'Las deudas con proveedores han sido saldadas.','2024-07-22','Activo'),(3,'Se han cumplido todas las normativas ambientales vigentes.','2024-07-21','Emitido'),(4,'Los pr?stamos bancarios han sido cancelados seg?n lo acordado.','2024-07-20','V?lido'),(5,'Todos los empleados tienen sus derechos laborales al d?a.','2024-07-19','Emitido'),(6,'Se han renovado todas las licencias y permisos necesarios.','2024-07-18','V?lido'),(7,'Todas las facturas pendientes han sido pagadas.','2024-07-17','Activo'),(8,'La auditor?a financiera ha sido aprobada sin observaciones.','2024-07-16','Emitido'),(9,'Se han implementado todas las medidas de seguridad requeridas.','2024-07-15','V?lido'),(10,'El proceso de reestructuraci?n empresarial ha finalizado conforme a lo planeado.','2024-07-14','Emitido');
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
  `estado_vacante` varchar(15) NOT NULL,
  PRIMARY KEY (`id_postulacion`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
INSERT INTO `postulacion` VALUES (1,'2024-07-23','En revisi?n'),(2,'2024-07-22','Aprobado'),(3,'2024-07-21','Rechazado'),(4,'2024-07-20','Pendiente'),(5,'2024-07-19','Entrevista prog'),(6,'2024-07-18','Finalista'),(7,'2024-07-17','Seleccionado'),(8,'2024-07-16','Contratado'),(9,'2024-07-15','Desistido'),(10,'2024-07-14','Cancelado');
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quejas_reclamos`
--

DROP TABLE IF EXISTS `quejas_reclamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quejas_reclamos` (
  `id_quejas_y_reclamos` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_de_queja` varchar(50) NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `estado` varchar(15) NOT NULL,
  `Respuesta` longtext NOT NULL,
  `fecha_respuesta` date NOT NULL,
  PRIMARY KEY (`id_quejas_y_reclamos`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quejas_reclamos`
--

LOCK TABLES `quejas_reclamos` WRITE;
/*!40000 ALTER TABLE `quejas_reclamos` DISABLE KEYS */;
INSERT INTO `quejas_reclamos` VALUES (1,'Servicio al cliente','2024-07-23','Pendiente','','0000-00-00'),(2,'Producto defectuoso','2024-07-22','Resuelto','Se ha reemplazado el producto defectuoso.','2024-07-22'),(3,'Demora en la entrega','2024-07-21','Pendiente','','0000-00-00'),(4,'Factura incorrecta','2024-07-20','En proceso','Se est? verificando el error en la factura.','2024-07-21'),(5,'Atenci?n telef?nica','2024-07-19','Pendiente','','0000-00-00'),(6,'Cobro indebido','2024-07-18','Resuelto','Se ha realizado el reembolso correspondiente.','2024-07-18'),(7,'Mal servicio en restaurante','2024-07-17','En proceso','Estamos investigando lo ocurrido.','2024-07-18'),(8,'Env?o incorrecto','2024-07-16','Resuelto','Se ha enviado el producto correcto.','2024-07-17'),(9,'Falta de stock en tienda','2024-07-15','Pendiente','','0000-00-00'),(10,'Servicio de internet intermitente','2024-07-14','En proceso','Estamos revisando la conexi?n.','2024-07-15');
/*!40000 ALTER TABLE `quejas_reclamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro`
--

DROP TABLE IF EXISTS `registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registro` (
  `num_doc` int(11) NOT NULL,
  `tipo_doc` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `f_nacimiento` date NOT NULL,
  `correo` varchar(45) NOT NULL,
  `num_telefono` varchar(45) NOT NULL,
  `pass` varchar(45) NOT NULL,
  PRIMARY KEY (`num_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro`
--

LOCK TABLES `registro` WRITE;
/*!40000 ALTER TABLE `registro` DISABLE KEYS */;
INSERT INTO `registro` VALUES (111222333,'Pasaporte','Ana','Mart?nez','1992-11-25','ana.martinez@example.com','987654321','ana987'),(444555666,'Pasaporte','Javier','G?mez','1998-09-05','javier.gomez@example.com','789456123','javier99'),(555444333,'Carnet de extranjer?a','Carlos','L?pez','1988-04-10','carlos.lopez@example.com','123456789','claveSegura'),(777666555,'Carnet de extranjer?a','Laura','Fern?ndez','1985-06-30','laura.fernandez@example.com','321654987','laura1234'),(987654321,'DNI','Mar?a','Garc?a','1995-08-20','maria.garcia@example.com','654321987','maria123'),(999888777,'DNI','Pedro','Rodr?guez','1980-02-15','pedro.rodriguez@example.com','456789123','p3dr0r0d'),(1112223332,'NIF','Roberto','Jim?nez','1996-10-20','roberto.jimenez@email.com','111222333','mi_contrase?a'),(2147483647,'RUT','Pedro','S?nchez','1980-06-05','pedro.sanchez@email.com','222333444','password123');
/*!40000 ALTER TABLE `registro` ENABLE KEYS */;
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
  PRIMARY KEY (`id_vacaciones`)
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
  `estado_vacante` varchar(10) NOT NULL,
  `descripcion_vacante` mediumtext NOT NULL,
  `numero_puestos` varchar(30) NOT NULL,
  PRIMARY KEY (`id_vacantes`)
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

-- Dump completed on 2024-08-14 15:35:48
