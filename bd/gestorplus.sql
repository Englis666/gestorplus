/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Linux (x86_64)
--
-- Host: gestorplus-db    Database: gestorplus
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;
-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestorplus;

-- Usar la base de datos creada
USE gestorplus;

--
-- Table structure for table `ausencia`
--

DROP TABLE IF EXISTS `ausencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencia`
--

LOCK TABLES `ausencia` WRITE;
/*!40000 ALTER TABLE `ausencia` DISABLE KEYS */;
INSERT INTO `ausencia` VALUES
(6,'2025-03-25','2025-03-30','Personal','Hola como vas','Justificada','2025-03-25',1014736),
(7,'2025-03-25','2025-03-31','Vacaciones','hola como vas de nuevo','Justificada','2025-03-25',1014736),
(8,'2025-03-25','2025-03-31','Enfermedad','hola como vas','Justificada','2025-03-25',1014736),
(9,'2025-03-25','2025-03-31','Vacaciones','que hace','Justificada','2025-03-25',1014736),
(10,'2025-03-25','2025-03-31','Enfermedad','Prueba','Justificada','2025-03-25',1014736),
(11,'2025-03-25','2025-03-31','Personal','Hola como vas','Justificada','2025-03-25',1014736),
(12,'2025-03-25','2025-03-31','Personal','Hola como vas','Justificada','2025-03-25',1014736),
(13,'2025-03-25','2025-03-31','Enfermedad','Notificacion','Justificada','2025-03-25',1014736),
(14,'2025-03-25','2025-03-31','Enfermedad','Hola como vas','Justificada','2025-03-25',1014736),
(15,'2025-03-25','2025-03-31','Enfermedad','hola como vas','Justificada','2025-03-25',1014736),
(16,'2025-03-26','2025-03-28','Vacaciones','asd','Rechazada','2025-03-26',1014736),
(17,'2025-04-16','2025-04-17','Enfermedad','Enfermedad respiratoria','En proceso','2025-04-15',1141114912);
/*!40000 ALTER TABLE `ausencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ausencia_has_notificacion`
--

DROP TABLE IF EXISTS `ausencia_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencia_has_notificacion`
--

LOCK TABLES `ausencia_has_notificacion` WRITE;
/*!40000 ALTER TABLE `ausencia_has_notificacion` DISABLE KEYS */;
INSERT INTO `ausencia_has_notificacion` VALUES
(2,14,237),
(3,14,239),
(4,14,241),
(5,15,244);
/*!40000 ALTER TABLE `ausencia_has_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCargo` varchar(45) DEFAULT NULL,
  `estadoCargo` varchar(21) NOT NULL,
  PRIMARY KEY (`idcargo`),
  UNIQUE KEY `nombreCargo` (`nombreCargo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES
(1,'Desarollador de software','Activo'),
(2,'Gerente de Sistemas','Activo'),
(3,'Administrador de Base De Datos','Activo'),
(4,'Analista de Soporte Tenico','Activo'),
(5,'Director Comercial', 'Activo'),
(6,'Ejecutivo de Cuenta', 'Activo'),
(7,'Vendedor Punto de Venta', 'Activo'),
(8,'Coordinador de Mercado', 'Activo'),
(10,'Supervisor de Produccion','Activo'),
(11,'Dibujante Textil','Activo'),
(12,'Jefe de Tienda','Activo'),
(13,'Operario de Produccion','Activo');
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificado`
--

DROP TABLE IF EXISTS `certificado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES
(3,1014736,1141114912,'2025-04-02 18:49:18','2025-04-02 18:49:18');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convocatoria`
--

DROP TABLE IF EXISTS `convocatoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convocatoria`
--

LOCK TABLES `convocatoria` WRITE;
/*!40000 ALTER TABLE `convocatoria` DISABLE KEYS */;
INSERT INTO `convocatoria` VALUES
(6,'Operario de Produccion Textil','Buscamos operarios para manejar maquinaria textil y asegurar la produccion eficiente de nuestros productos','Experiencia mínima de 1 año en plantas de producción textil.​conocimiento en manejo de maquinaria industrial, disponibilidad para trabajar en turnos rotativos',1800000.00,10,13,NULL,'2025-03-26 21:58:25'),
(7,'Analista de Soporte Tecnico','Buscamos un analista para brindar soporte tenico a los usuarios internos y mantener la infraestructura tecnologica','Tecnico o tecnologo en sistemas o areas relacionadas, experiencia minima de 2 a;os en soporte tecnico',1800000.00,4,4,NULL,'2025-03-26 22:01:22'),
(8,'Administrador de Base de Datos','Buscamos un Administrador de Base de Datos con experiencia en la gestion, optimizacion y mantenimiento de bases de datos empresariales , garantizando la seguridad, disponibilidad y rendimiento de la informacion','Profesional en Ingeniería de Sistemas, Informática o afines.  Experiencia mínima de 3 años en administración de bases de datos SQL y NoSQL.  Conocimientos avanzados en MySQL, PostgreSQL y MongoDB.  Manejo de procedimientos almacenados, optimización de consultas y modelado de datos.  Experiencia en backup, recuperación y seguridad de datos.  Conocimientos en administración de servidores y alta disponibilidad.',3500000.00,2,3,NULL,'2025-03-26 22:03:51'),
(9,'Gerente de sistemas','Buscamos un Gerente de Sistemas para liderar la estrategia tecnologica de la empresa, asegurando la eficiencia y seguridad de los sistemas de informacion , asi como la alineacion con los objetivos del negocio','Profesional en Ingeniería de Sistemas, Informática o carreras afines.  Experiencia mínima de 5 años en gestión de TI y liderazgo de equipos.  Conocimientos avanzados en infraestructura tecnológica, ciberseguridad y gestión de proyectos.  Experiencia en implementación de ERP, CRM y soluciones cloud.  Habilidades en administración de presupuesto y negociación con proveedores.  Capacidad de liderazgo, planificación estratégica y resolución de problemas.',8000000.00,1,2,NULL,'2025-03-26 22:05:58'),
(11,'Jefe de Tienda','Buscamos un Jefe de Tienda para liderar la operacion comercial , gestion de equipo y cumplimiento de objetivos de ventas en una de las nuestras tiendas','Profesional o tecnólogo en Administración de Empresas, Mercadeo o afines.  Experiencia mínima de 3 años en gestión de tiendas y equipos de ventas.  Conocimientos en estrategias de ventas, servicio al cliente y manejo de inventarios.  Habilidades en liderazgo, toma de decisiones y resolución de conflictos.  Disponibilidad para trabajar en horarios de centro comercial.',2500000.00,1,12,NULL,'2025-03-26 22:08:41'),
(12,'Vendedor de Punto de Venta','Buscamos un Vendedor de Punto de Venta para asesorar a los clientes, impulsar las ventas y garantizar una excelente experiencia de comrpa en nuestras tiendas','Bachiller, técnico o tecnólogo en áreas comerciales o afines.  Experiencia mínima de 1 año en ventas y atención al cliente.  Habilidades en persuasión, comunicación y orientación al cliente.  Disponibilidad para trabajar en horarios de centro comercial.  Conocimientos básicos en manejo de caja y facturación.',1600000.00,4,7,NULL,'2025-03-26 22:11:45'),
(13,'Coordinador de Mercadeo','Buscamos un Coordinador de Mercadeo para desarrollar e implementar estrategias de marketing que impulsen la visibilidad de la marca y el crecimiento en el mercado.','Profesional en Mercadeo, Publicidad, Administración de Empresas o afines.  Experiencia mínima de 3 años en coordinación de estrategias de mercadeo.  Conocimientos en marketing digital, redes sociales y análisis de mercado.  Habilidades en planificación estratégica, creatividad e innovación.  Manejo de herramientas como Google Ads, Meta Ads, CRM y software de diseño básico.',3500000.00,1,8,NULL,'2025-03-26 22:12:41'),
(14,'Desarrollador de Software','Buscamos un Desarrollador de Software para diseñar, desarrollar y mantener aplicaciones empresariales que optimicen nuestros procesos internos.','Profesional en Ingeniería de Sistemas o afines.  Experiencia mínima de 3 años en desarrollo web y móvil.  Conocimientos en PHP, JavaScript, Laravel, React Native y bases de datos SQL/NoSQL.  Habilidades en resolución de problemas y trabajo en equipo.',4000000.00,2,1,NULL,'2025-03-26 22:16:07'),
(15,'Director Comercial','Buscamos un Director Comercial para liderar estrategias de ventas y expansión de mercado, asegurando el crecimiento y posicionamiento de la empresa.','Profesional en Administración de Empresas, Mercadeo o afines.  Experiencia mínima de 5 años en dirección comercial.  Conocimientos en estrategias de ventas, CRM y negociación.  Habilidades en liderazgo y gestión de equipos comerciales.',8000000.00,1,5,NULL,'2025-03-26 22:17:52'),
(16,'Ejecutivo de Cuenta','Buscamos un Ejecutivo de Cuenta para gestionar relaciones con clientes, identificar oportunidades de negocio y asegurar la satisfaccion del cliente','Profesional en Mercadeo, Administración o afines.  Experiencia mínima de 2 años en gestión de clientes y ventas.  Conocimientos en estrategias comerciales y CRM.  Habilidades en comunicación y negociación.',4000000.00,2,6,NULL,'2025-03-26 22:18:53');
/*!40000 ALTER TABLE `convocatoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrevista`
--

DROP TABLE IF EXISTS `entrevista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrevista`
--

LOCK TABLES `entrevista` WRITE;
/*!40000 ALTER TABLE `entrevista` DISABLE KEYS */;
INSERT INTO `entrevista` VALUES
(4,'2025-03-28','14:30:00','Chapinero',25,'Pendiente'),
(6,'2025-04-08','11:30:00','Via Google Meet',26,'Pendiente'),
(7,'2025-04-10','11:00:00','Sala 2 Oficina Principal Av 68',26,'Pendiente');
/*!40000 ALTER TABLE `entrevista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudio`
--

DROP TABLE IF EXISTS `estudio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `modalidad` varchar(45) DEFAULT NULL,
  `paisInstitucion` varchar(45) DEFAULT NULL,
  `duracionEstudio` varchar(45) DEFAULT NULL,
  `materiasDestacadas` text DEFAULT NULL,  
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`idestudio`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `estudio_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudio`
--

LOCK TABLES `estudio` WRITE;
/*!40000 ALTER TABLE `estudio` DISABLE KEYS */;
INSERT INTO `estudio` VALUES
(2,'Tecnóloga','Tecnología','Activa','2022-01-15','2025-12-09','Desarrollador de Software','SENA','Cra 30 Con Primera de Mayo','Presencial','Colombia','3 años','PHP, JavaScript, HTML',45),
(7,'Profesional','Director Comercial','Activo','2025-04-09','2025-04-24','Director Comercial','UNAD','Bogotá, Chapinero','Virtual','Colombia','15 días','Gestión Comercial, Ventas Estratégicas',39),
(18,'Tecnólogo','Sistemas','Activo','2022-06-12','2025-05-09','Desarrollador de Software','SENA','Cra 30 Con Primera de Mayo','Virtual','Colombia','3 años','Laravel, React, PostgreSQL',38),
(19,'Técnico','Sistemas','Finalizado','2023-03-30','2025-04-17','Programación en software','SENA','Quirigua, Engativá, Bogotá','Presencial','Colombia','2 años','Soporte técnico, Redes, Algoritmos',38);
/*!40000 ALTER TABLE `estudio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluacionessg`
--

DROP TABLE IF EXISTS `evaluacionessg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluacionessg`
--

LOCK TABLES `evaluacionessg` WRITE;
/*!40000 ALTER TABLE `evaluacionessg` DISABLE KEYS */;
INSERT INTO `evaluacionessg` VALUES
(14,'Correcto','Correctas','Ninguna','Correcta','Ninguno',4,25,'Apto');
/*!40000 ALTER TABLE `evaluacionessg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencialaboral`
--

DROP TABLE IF EXISTS `experiencialaboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencialaboral` (
  `idexperienciaLaboral` int(11) NOT NULL AUTO_INCREMENT,
  `profesion` varchar(45) DEFAULT NULL,
  `descripcionPerfil` varchar(45) DEFAULT NULL,
  `fechaInicioExp` date DEFAULT NULL,
  `fechaFinExp` date DEFAULT NULL,
  `cargo` VARCHAR(40) DEFAULT NULL,
  `empresa` VARCHAR(80) DEFAULT NULL,
  `ubicacionEmpresa` VARCHAR(80) DEFAULT NULL,
  `tipoContrato` VARCHAR(80) DEFAULT NULL,
  `salario` decimal DEFAULT NULL,
  `logros` VARCHAR(50) DEFAULT NULL,
  `referenciasLaborales` VARCHAR(50) DEFAULT NULL,
  `hojadevida_idHojadevida` int(11) NOT NULL,
  PRIMARY KEY (`idexperienciaLaboral`),
  KEY `hojadevida_idHojadevida` (`hojadevida_idHojadevida`),
  CONSTRAINT `experiencialaboral_ibfk_1` FOREIGN KEY (`hojadevida_idHojadevida`) REFERENCES `hojadevida` (`idHojadevida`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencialaboral`
--

LOCK TABLES `experiencialaboral` WRITE;
/*!40000 ALTER TABLE `experiencialaboral` DISABLE KEYS */;
INSERT INTO `experiencialaboral` VALUES
(1, 'Desarrollador Backend', 'Encargado del desarrollo en PHP', '2023-01-15', '2024-03-30', 'Analista de Sistemas', 'La Fayette S.A.', 'Medellín, Antioquia', 'Contrato a término indefinido', 3200000, 'Optimización del sistema ERP', 'Carlos Gómez - 3121234567', 38),
(2, 'Ingeniero de Software', 'Desarrollo de software educativo', '2022-05-01', '2023-12-20', 'Desarrollador Full Stack', 'EduTech Soluciones', 'Bogotá, Cundinamarca', 'Contrato a término fijo', 2900000, 'Implementación de IA en planes de estudio', 'María Ruiz - 3107654321', 38),
(3, 'Técnico en Sistemas', 'Soporte y mantenimiento de sistemas', '2021-07-10', '2022-04-15', 'Soporte Técnico', 'ServiTIC SAS', 'Cali, Valle del Cauca', 'Prestación de servicios', 2200000, 'Reducción de tiempos de respuesta en un 40%', 'Andrés Torres - 3119876543', 38),
(4, 'Analista de Datos', 'Manejo de bases de datos y reportes', '2020-02-05', '2021-06-30', 'Analista de Información', 'Datavisión LTDA', 'Barranquilla, Atlántico', 'Contrato de aprendizaje', 1800000, 'Automatización de reportes mensuales', 'Laura Méndez - 3135557890', 38);
/*!40000 ALTER TABLE `experiencialaboral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hojadevida`
--

DROP TABLE IF EXISTS `hojadevida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hojadevida` (
  `idHojadevida` int(11) NOT NULL AUTO_INCREMENT,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `ciudad` varchar(45) DEFAULT NULL,
  `ciudadNacimiento` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `telefonoFijo` bigint(20) DEFAULT NULL,
  `estadohojadevida` enum('Activa','Inactiva') DEFAULT 'Activa',
  `estadoCivil` varchar(45) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `habilidades` varchar(80) DEFAULT NULL,
  `portafolio` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`idHojadevida`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hojadevida`
--

LOCK TABLES `hojadevida` WRITE;
/*!40000 ALTER TABLE `hojadevida` DISABLE KEYS */;
INSERT INTO `hojadevida` VALUES
(38,'2006-01-02','Call Sur 99','Bogotá','Bogotá','312312',3123123123,'Activa',
'Soltero','Masculino','PHP, JS, MySQL','https://github.com/user38'),

(39,'2005-10-10','Calle 100B #10-50','Bogotá','Bogotá','1541345112',4133413,'Activa',
'Casado','Femenino','Ventas, CRM, Comunicación','https://linkedin.com/in/user39'),

(40,'2004-07-21','Calle 45 #32-16','Medellín','Medellín','3001234567',6041234567,'Activa',
'Soltero','Masculino','Java, Redes, PostgreSQL','https://github.com/user40'),

(41,'2003-03-15','Carrera 12 #5-40','Cali','Cali','3207654321',6028765432,'Activa',
'Unión libre','Femenino','Contabilidad, Excel','https://user41.com/portfolio'),

(42,'2002-12-03','Transversal 23 #12-67','Barranquilla','Barranquilla','3109876543',6052345678,'Activa',
'Casado','Masculino','Redacción, Inglés','https://github.com/user42'),

(43,'1999-11-30','Diagonal 45 #21-30','Cúcuta','Cúcuta','3007651234',5777654321,'Activa',
'Soltero','Masculino','Electricidad, Normas RETIE','https://portafoliosena.com/user43'),

(44,'2000-05-20','Av. 1E #5-90','Pereira','Pereira','3111112222',6068889999,'Activa',
'Divorciado','Femenino','Administración, Logística','https://linkedin.com/in/user44'),

(45,'2006-10-16','Kr 80J #66-58','Bogotá','Bogotá','3213675466',NULL,'Activa',
'Soltero','Masculino','React, Laravel, MySQL','https://github.com/shell-ninja'),

(46,'2005-09-05','Cra 70 #48-20','Bucaramanga','Bucaramanga','3005551212',6071234567,'Activa',
'Soltero','Femenino','Psicología, Escucha activa','https://user46.netlify.app'),

(47,'2001-06-18','Calle 80 #21-22','Cartagena','Cartagena','3126543210',6059876543,'Activa',
'Casado','Masculino','Guianza, Inglés turístico','https://github.com/user47'),

(48,'1998-04-01','Calle 55 #12-34','Manizales','Manizales','3112223344',6083344556,'Activa',
'Unión libre','Masculino','Logística, Excel','https://user48.dev'),

(49,'2003-11-08','Av 30 #45-10','Neiva','Neiva','3201239999',6081234321,'Activa',
'Soltero','Masculino','Soporte, Redes, Windows','https://github.com/user49'),

(50,'2002-08-25','Calle 10 #20-15','Tunja','Tunja','3123214567',6087896543,'Activa',
'Soltero','Femenino','Enfermería, Atención al paciente','https://portafoliosalud.com/user50');
/*!40000 ALTER TABLE `hojadevida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaextra`
--

DROP TABLE IF EXISTS `horaextra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaextra` (
  `idHoraextra` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `horasExtra` varchar(8) DEFAULT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  PRIMARY KEY (`idHoraextra`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `horaextra_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaextra`
--

LOCK TABLES `horaextra` WRITE;
/*!40000 ALTER TABLE `horaextra` DISABLE KEYS */;
INSERT INTO `horaextra` VALUES
(9,'2025-04-13','72',1014736);
/*!40000 ALTER TABLE `horaextra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada`
--

DROP TABLE IF EXISTS `jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time DEFAULT NULL,
  `usuario_num_doc` int(11) NOT NULL,
  `estadoJornada` varchar(50) NOT NULL,
  PRIMARY KEY (`idJornada`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
INSERT INTO `jornada` VALUES
(154,'2025-03-21','20:32:00','04:32:00',1014736,'Jornada Corroborada'),
(155,'2025-03-25','14:58:00','22:58:00',1014736,'Jornada Corroborada'),
(156,'2025-03-25','15:00:00','23:00:00',1014736,'Jornada Corroborada'),
(157,'2025-03-25','15:02:00','23:02:00',1014736,'Jornada Corroborada'),
(158,'2025-03-25','15:08:00','23:08:00',1014736,'Jornada Corroborada'),
(159,'2025-03-25','16:14:00','00:14:00',1014736,'Jornada Corroborada'),
(160,'2025-03-25','16:40:00','00:40:00',1014736,'Jornada Corroborada'),
(161,'2025-03-26','15:44:00','23:44:00',1014736,'Jornada Corroborada'),
(162,'2025-03-26','15:57:00','23:57:00',1014736,'Jornada rechazada'),
(163,'2025-03-26','16:02:00','00:02:00',1014736,'Pendiente'),
(164,'2025-03-26','16:07:00','00:07:00',1014736,'Pendiente'),
(165,'2025-03-26','16:46:00','00:46:00',1014736,'Pendiente'),
(166,'2025-03-26','17:27:00','01:27:00',1014736,'Pendiente'),
(167,'2025-03-26','20:11:00','04:11:00',1014736,'Pendiente'),
(168,'2025-03-27','18:15:00','02:15:00',1014736,'Pendiente'),
(169,'2025-03-27','18:23:00','02:23:00',1014736,'Pendiente'),
(170,'2025-03-27','21:13:00','05:13:00',1014736,'Pendiente'),
(171,'2025-03-27','22:00:00','06:00:00',1014736,'Pendiente'),
(172,'2025-03-27','22:01:00','06:01:00',1014736,'Pendiente'),
(173,'2025-03-28','14:13:00','22:13:00',1014736,'Pendiente'),
(174,'2025-03-28','14:21:00','22:21:00',1014736,'Pendiente'),
(175,'2025-03-28','15:24:00','23:24:00',1014736,'Pendiente'),
(176,'2025-03-28','16:24:00','00:24:00',1014736,'Pendiente'),
(177,'2025-03-28','17:20:00','01:20:00',1014736,'Pendiente'),
(178,'2025-03-31','14:02:00','22:02:00',1014736,'Pendiente'),
(179,'2025-03-31','14:20:00','22:20:00',1014736,'Pendiente'),
(180,'2025-03-31','15:40:00','23:40:00',1014736,'Pendiente'),
(181,'2025-03-31','16:41:00','00:41:00',1014736,'Pendiente'),
(182,'2025-03-31','20:26:00','04:26:00',1014736,'Pendiente'),
(183,'2025-03-31','21:41:00','05:41:00',1014736,'Pendiente'),
(184,'2025-03-31','21:59:00','05:59:00',1014736,'Pendiente'),
(185,'2025-04-01','14:54:00','22:54:00',1014736,'Pendiente'),
(186,'2025-04-01','15:30:00','23:30:00',1014736,'Pendiente'),
(187,'2025-04-01','15:35:00','23:35:00',1014736,'Pendiente'),
(188,'2025-04-01','15:35:00','23:35:00',1014736,'Pendiente'),
(189,'2025-04-01','15:40:00','23:40:00',1014736,'Pendiente'),
(190,'2025-04-01','22:01:00','06:01:00',1014736,'Pendiente'),
(191,'2025-04-01','22:46:00','06:46:00',1141114912,'Jornada Corroborada'),
(192,'2025-04-01','23:34:00','07:34:00',1014736,'Pendiente'),
(193,'2025-04-02','00:34:00','08:34:00',1014736,'Pendiente'),
(194,'2025-04-02','11:23:00','19:23:00',1014736,'Pendiente'),
(195,'2025-04-02','11:41:00','19:41:00',1014736,'Pendiente'),
(196,'2025-04-02','13:47:00','21:47:00',1014736,'Pendiente'),
(197,'2025-04-02','14:35:00','22:35:00',1014736,'Pendiente'),
(198,'2025-04-02','15:10:00','23:10:00',1014736,'Pendiente'),
(199,'2025-04-02','15:42:00','23:42:00',1014736,'Pendiente'),
(200,'2025-04-02','15:43:00','23:43:00',1014736,'Pendiente'),
(201,'2025-04-02','15:48:00','23:48:00',1014736,'Pendiente'),
(202,'2025-04-02','16:00:00','00:00:00',1014736,'Pendiente'),
(203,'2025-04-02','16:01:00','00:01:00',1141114912,'Pendiente'),
(204,'2025-04-02','16:45:00','00:45:00',1014736,'Pendiente'),
(205,'2025-04-04','06:28:00','14:28:00',1014736,'Pendiente'),
(206,'2025-04-04','11:01:00','19:01:00',1014736,'Pendiente'),
(207,'2025-04-04','11:01:00','19:01:00',1014736,'Pendiente'),
(208,'2025-04-04','11:02:00','19:02:00',1014736,'Pendiente'),
(209,'2025-04-04','12:02:00','20:02:00',1014736,'Pendiente'),
(210,'2025-04-04','12:08:00','20:08:00',1014736,'Pendiente'),
(211,'2025-04-04','12:32:00','20:32:00',1014736,'Pendiente'),
(212,'2025-04-04','12:35:00','20:35:00',1014736,'Jornada rechazada'),
(213,'2025-04-04','12:42:00','20:42:00',1014736,'Pendiente'),
(214,'2025-04-04','12:46:00','20:46:00',1014736,'Pendiente'),
(215,'2025-04-04','12:46:00','20:46:00',1014736,'Pendiente'),
(216,'2025-04-04','12:46:00','20:46:00',1014736,'Pendiente'),
(217,'2025-04-04','14:08:00','22:08:00',1014736,'Pendiente'),
(218,'2025-04-04','14:10:00','22:10:00',1014736,'Pendiente'),
(219,'2025-04-04','14:11:00','22:11:00',1014736,'Pendiente'),
(220,'2025-04-04','15:51:00','23:51:00',1014736,'Pendiente'),
(221,'2025-04-05','23:04:00','07:04:00',1014736,'Pendiente'),
(222,'2025-04-06','13:55:00','21:55:00',1141114912,'Jornada Corroborada'),
(223,'2025-04-06','13:57:00','21:57:00',1014736,'Pendiente'),
(224,'2025-04-06','13:58:00','21:58:00',1014736,'Pendiente'),
(225,'2025-04-06','15:14:00','23:14:00',1014736,'Pendiente'),
(226,'2025-04-06','16:14:00','00:14:00',1014736,'Pendiente'),
(227,'2025-04-06','19:53:00','03:53:00',1014736,'Pendiente'),
(228,'2025-04-06','20:13:00','04:13:00',1014736,'Pendiente'),
(229,'2025-04-06','21:02:00','05:02:00',1014736,'Pendiente'),
(230,'2025-04-06','21:29:00','05:29:00',1014736,'Pendiente'),
(231,'2025-04-06','22:15:00','06:15:00',1014736,'Pendiente'),
(232,'2025-04-07','07:15:00','15:15:00',1014736,'Pendiente'),
(233,'2025-04-07','10:10:00','18:10:00',1014736,'Pendiente'),
(234,'2025-04-07','10:20:00','18:20:00',1014736,'Pendiente'),
(235,'2025-04-07','10:24:00','18:24:00',1014736,'Pendiente'),
(236,'2025-04-07','10:30:00','18:30:00',1014736,'Pendiente'),
(237,'2025-04-09','17:20:00','01:20:00',1014736,'Pendiente'),
(238,'2025-04-09','17:29:00','01:29:00',1014736,'Pendiente'),
(239,'2025-04-09','17:32:00','01:32:00',1014736,'Pendiente'),
(240,'2025-04-09','18:34:00','02:34:00',1014736,'Pendiente'),
(241,'2025-04-09','19:12:00','03:12:00',1014736,'Pendiente'),
(242,'2025-04-09','19:25:00','03:25:00',1014736,'Pendiente'),
(243,'2025-04-09','19:40:00','03:40:00',1014736,'Pendiente'),
(244,'2025-04-10','14:08:00','22:08:00',1014736,'Pendiente'),
(245,'2025-04-10','15:06:00','23:06:00',1014736,'Pendiente'),
(246,'2025-04-10','15:16:00','23:16:00',1141114912,'Jornada Corroborada'),
(247,'2025-04-10','16:09:00','00:09:00',1014736,'Pendiente'),
(248,'2025-04-10','16:19:00','00:19:00',1141114912,'Jornada Corroborada'),
(249,'2025-04-10','17:13:00','01:13:00',1014736,'Pendiente'),
(250,'2025-04-10','17:20:00','01:20:00',1141114912,'Jornada Corroborada'),
(251,'2025-04-10','17:42:00','01:42:00',1014736,'Pendiente'),
(252,'2025-04-10','18:10:00','02:10:00',1014736,'Pendiente'),
(253,'2025-04-10','18:27:00','02:27:00',1014736,'Pendiente'),
(254,'2025-04-10','18:31:00','02:31:00',1014736,'Pendiente'),
(255,'2025-04-10','19:38:00','03:38:00',1014736,'Pendiente'),
(256,'2025-04-10','20:39:00','04:39:00',1014736,'Pendiente'),
(257,'2025-04-10','21:16:00','05:16:00',1014736,'Pendiente'),
(258,'2025-04-10','21:24:00','05:24:00',1014736,'Pendiente'),
(259,'2025-04-10','21:50:00','05:50:00',1014736,'Pendiente'),
(260,'2025-04-11','06:10:00','14:10:00',1014736,'Pendiente'),
(261,'2025-04-11','06:10:00','14:10:00',1014736,'Pendiente'),
(262,'2025-04-11','06:13:00','14:13:00',1014736,'Pendiente'),
(263,'2025-04-12','11:41:00','19:41:00',1014736,'Pendiente'),
(264,'2025-04-12','14:03:00','22:03:00',1014736,'Pendiente'),
(265,'2025-04-12','14:04:00','22:04:00',1014736,'Pendiente'),
(266,'2025-04-12','15:17:00','23:17:00',1014736,'Pendiente'),
(267,'2025-04-12','19:53:00','03:53:00',1014736,'Pendiente'),
(268,'2025-04-12','20:08:00','04:08:00',1014736,'Pendiente'),
(269,'2025-04-12','20:08:00','04:08:00',1014736,'Pendiente'),
(270,'2025-04-12','20:08:00','04:08:00',1014736,'Pendiente'),
(271,'2025-04-12','20:09:00','04:09:00',1014736,'Pendiente'),
(272,'2025-04-12','20:09:00','04:09:00',1014736,'Pendiente'),
(273,'2025-04-12','23:03:00','07:03:00',1014736,'Pendiente'),
(274,'2025-04-12','23:15:00','07:15:00',1014736,'Pendiente'),
(275,'2025-04-12','23:39:00','07:39:00',1014736,'Pendiente'),
(276,'2025-04-13','00:18:00','08:18:00',1014736,'Pendiente'),
(277,'2025-04-13','00:20:00','08:20:00',1014736,'Pendiente'),
(278,'2025-04-13','00:22:00','08:22:00',1014736,'Pendiente'),
(279,'2025-04-13','09:01:00','17:01:00',1014736,'Pendiente'),
(280,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(281,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(282,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(283,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(284,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(285,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(286,'2025-04-13','10:02:00','18:02:00',1014736,'Pendiente'),
(287,'2025-04-13','10:03:00','18:03:00',1014736,'Pendiente'),
(288,'2025-04-13','11:03:00','19:03:00',1014736,'Pendiente'),
(289,'2025-04-13','11:37:00','19:37:00',1014736,'Pendiente'),
(290,'2025-04-13','12:44:00','20:44:00',1014736,'Pendiente'),
(291,'2025-04-13','13:12:00','21:12:00',1014736,'Pendiente'),
(292,'2025-04-13','14:15:00','22:15:00',1014736,'Pendiente'),
(293,'2025-04-13','18:27:00','02:27:00',1014736,'Pendiente'),
(294,'2025-04-13','19:09:00','03:09:00',1014736,'Pendiente'),
(295,'2025-04-13','19:20:00','03:20:00',1014736,'Pendiente'),
(296,'2025-04-13','20:43:00','04:43:00',1014736,'Pendiente'),
(297,'2025-04-13','20:50:00','04:50:00',1014736,'Pendiente'),
(298,'2025-04-13','22:18:00','06:18:00',1014736,'Pendiente'),
(299,'2025-04-13','23:39:00','07:39:00',1014736,'Pendiente'),
(300,'2025-04-15','13:15:00','21:15:00',1014736,'Pendiente'),
(301,'2025-04-15','13:59:00','21:59:00',1014736,'Jornada Corroborada'),
(302,'2025-04-15','15:35:00','23:35:00',1014736,'Pendiente'),
(303,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(304,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(305,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(306,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(307,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(308,'2025-04-15','16:22:00','00:22:00',1141114912,'Jornada Corroborada'),
(309,'2025-04-15','16:23:00','00:23:00',1141114912,'Jornada Corroborada'),
(310,'2025-04-15','16:23:00','00:23:00',1141114912,'Jornada Corroborada'),
(311,'2025-04-15','16:23:00','00:23:00',1141114912,'Jornada Corroborada'),
(312,'2025-04-15','16:23:00','00:23:00',1141114912,'Jornada Corroborada'),
(313,'2025-04-15','16:24:00','00:24:00',1141114912,'Jornada Corroborada'),
(314,'2025-04-15','16:24:00','00:24:00',1014736,'Pendiente'),
(315,'2025-04-15','16:29:00','00:29:00',1141114912,'Pendiente'),
(316,'2025-04-15','16:29:00','00:29:00',1141114912,'Pendiente'),
(317,'2025-04-15','16:29:00','00:29:00',1141114912,'Pendiente'),
(318,'2025-04-15','16:30:00','00:30:00',1141114912,'Pendiente'),
(319,'2025-04-15','16:30:00','00:30:00',1141114912,'Pendiente'),
(320,'2025-04-15','16:30:00','00:30:00',1141114912,'Pendiente'),
(321,'2025-04-15','16:30:00','00:30:00',1141114912,'Pendiente'),
(322,'2025-04-15','16:30:00','00:30:00',1141114912,'Pendiente'),
(323,'2025-04-15','16:31:00','00:31:00',1141114912,'Pendiente'),
(324,'2025-04-15','16:31:00','00:31:00',1141114912,'Pendiente'),
(325,'2025-04-15','16:31:00','00:31:00',1141114912,'Pendiente'),
(326,'2025-04-15','16:32:00','00:32:00',1141114912,'Pendiente'),
(327,'2025-04-15','16:33:00','00:33:00',1141114912,'Pendiente'),
(328,'2025-04-15','16:33:00','00:33:00',1014736,'Pendiente'),
(329,'2025-04-15','16:33:00','00:33:00',1141114912,'Pendiente'),
(330,'2025-04-15','16:33:00','00:33:00',1141114912,'Pendiente'),
(331,'2025-04-15','16:34:00','00:34:00',1141114912,'Pendiente'),
(332,'2025-04-15','16:34:00','00:34:00',1141114912,'Pendiente'),
(333,'2025-04-15','16:34:00','00:34:00',1141114912,'Pendiente'),
(334,'2025-04-15','16:34:00','00:34:00',1141114912,'Pendiente'),
(335,'2025-04-15','17:00:00','01:00:00',1014736,'Pendiente'),
(336,'2025-04-15','17:03:00','01:03:00',1014736,'Pendiente'),
(337,'2025-04-15','18:06:00','02:06:00',1014736,'Pendiente'),
(338,'2025-04-15','18:08:00','02:08:00',1141114912,'Pendiente'),
(339,'2025-04-15','19:39:00','03:39:00',1141114912,'Pendiente'),
(340,'2025-04-15','20:43:19',NULL,1141114912,'Pendiente'),
(341,'2025-04-17','13:18:46',NULL,1014736,'Pendiente');
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada_has_notificacion`
--

DROP TABLE IF EXISTS `jornada_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jornada_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `jornada_idJornada` int(11) NOT NULL,
  KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  KEY `jornada_idJornada` (`jornada_idJornada`),
  CONSTRAINT `jornada_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jornada_has_notificacion_ibfk_2` FOREIGN KEY (`jornada_idJornada`) REFERENCES `jornada` (`idJornada`)
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
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES
(5,1014736,'2025-04-04 17:24:54','asd',3),
(6,1014736,'2025-04-04 17:47:18','asd',3),
(7,1014736,'2025-04-04 20:51:28','ased',3),
(8,1014736,'2025-04-07 02:30:58','Hola',3),
(9,1014736,'2025-04-07 02:42:03','asd',3),
(10,1014736,'2025-04-07 02:48:16','ol',3),
(11,1014736,'2025-04-07 02:52:18','h',3),
(12,1014736,'2025-04-07 02:52:30','ytt',3),
(13,1014736,'2025-04-07 12:18:15','uwu',3),
(14,1014736,'2025-04-07 15:44:15','asd',3),
(15,1014736,'2025-04-07 15:50:31','wtf',3),
(16,1014736,'2025-04-10 20:15:18','Hola',3),
(17,1014736,'2025-04-10 20:27:13','g',3),
(18,1014736,'2025-04-10 21:09:44','asd',3),
(19,1014736,'2025-04-10 21:10:35','Hola',3),
(20,1014736,'2025-04-10 21:12:31','wtf',3),
(21,1014736,'2025-04-10 21:19:09','hola',3);
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=450 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES
(190,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(191,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(192,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(193,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(194,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(202,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-13 hasta el dia 2025-03-29',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(204,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-30',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(206,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(208,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(210,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(215,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(217,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(218,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(220,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(221,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(222,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(223,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(224,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-25 22:11:50'),
(225,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(226,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:11:50'),
(227,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(228,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(229,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:11:50'),
(230,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:12:06'),
(231,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:12:06'),
(232,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:14:26'),
(233,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:14:26'),
(234,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:14:50'),
(235,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(236,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:15:29'),
(237,'Ausencia rechazada',NULL,'0','Rechazo',1014736,'2025-03-25 22:15:29'),
(238,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:16:26'),
(239,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:16:26'),
(240,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:17:27'),
(241,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:17:27'),
(242,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-25 hasta el dia 2025-03-31',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(243,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:23:55'),
(244,'Ausencia aceptada',NULL,'0','Aceptacion',1014736,'2025-03-25 22:23:55'),
(245,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 20:44:31'),
(246,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 20:57:33'),
(247,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 21:02:28'),
(248,'El empleado identificado con la cedula 1014736 ha solicitado una ausencia para el dia 2025-03-26 hasta el dia 2025-03-28',NULL,'1','General',1014736,'2025-04-11 01:06:47'),
(249,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 21:07:51'),
(250,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 21:46:32'),
(251,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-26 22:27:25'),
(252,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-27 01:11:30'),
(253,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-27 23:15:57'),
(254,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-27 23:23:48'),
(255,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-28 02:13:02'),
(258,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1141114912,'2025-03-28 02:47:59'),
(259,'El aspirante con número de documento 1141114912 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1141114912,'2025-03-28 02:47:59'),
(260,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'1','Jornada',1014736,'2025-03-28 03:00:08'),
(261,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 03:01:54'),
(262,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 19:13:14'),
(263,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 19:21:17'),
(264,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 20:24:19'),
(265,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 21:24:48'),
(266,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-28 22:20:34'),
(267,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-31 19:02:22'),
(268,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-31 19:20:14'),
(269,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-31 20:40:58'),
(270,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-03-31 21:41:09'),
(271,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 01:26:06'),
(272,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 02:41:51'),
(273,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 02:59:48'),
(274,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 19:54:19'),
(275,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 20:30:49'),
(276,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 20:35:11'),
(277,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 20:35:33'),
(278,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-01 20:40:33'),
(279,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 03:01:59'),
(280,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-02 03:46:38'),
(281,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 04:34:12'),
(282,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 05:34:55'),
(283,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 16:23:58'),
(284,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 16:41:17'),
(285,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 18:47:07'),
(286,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 19:35:44'),
(287,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 20:10:05'),
(288,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 20:42:09'),
(289,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 20:43:59'),
(290,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 20:48:04'),
(291,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 21:00:11'),
(292,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-02 21:01:24'),
(293,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-02 21:45:44'),
(294,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 11:28:54'),
(295,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 16:01:43'),
(296,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 16:01:54'),
(297,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 16:02:21'),
(298,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:02:01'),
(299,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:08:26'),
(300,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:32:52'),
(301,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:35:22'),
(302,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:42:03'),
(303,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:46:11'),
(304,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:46:29'),
(305,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 17:47:00'),
(306,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 19:08:42'),
(307,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 19:10:41'),
(308,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 19:11:04'),
(309,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-04 20:51:13'),
(310,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-06 04:04:29'),
(311,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-06 18:55:49'),
(312,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-06 18:57:59'),
(313,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-06 18:58:14'),
(314,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-06 20:14:57'),
(315,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-06 21:14:28'),
(316,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 00:53:55'),
(317,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1014189999,'2025-04-07 01:13:14'),
(318,'El aspirante con número de documento 1014189999 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1014189999,'2025-04-07 01:13:14'),
(319,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 01:13:25'),
(320,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 02:02:57'),
(321,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 02:29:12'),
(322,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 03:15:00'),
(323,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 12:15:22'),
(324,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 15:10:58'),
(325,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 15:20:45'),
(326,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 15:24:12'),
(327,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-07 15:30:44'),
(328,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-09 22:20:51'),
(329,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-09 22:29:42'),
(330,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1056789123,'2025-04-09 22:32:23'),
(331,'El aspirante con número de documento 1056789123 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1056789123,'2025-04-09 22:32:23'),
(332,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-09 22:32:46'),
(333,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-09 23:34:33'),
(334,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 00:12:43'),
(335,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 00:25:42'),
(336,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 00:40:57'),
(337,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 19:08:41'),
(338,'El empleado identificado con la cedula 1014736 ha solicitado una vacacion',NULL,'Pendiente','General ',1014736,'2025-04-10 19:15:15'),
(339,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 20:06:22'),
(340,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-10 20:16:50'),
(341,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 21:09:31'),
(342,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-10 21:19:01'),
(343,'El empleado identificado con la cedula 1141114912 ha solicitado una vacacion',NULL,'Pendiente','General ',1141114912,'2025-04-10 22:08:31'),
(344,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 22:13:28'),
(345,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-10 22:20:26'),
(346,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 22:42:03'),
(347,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 23:10:14'),
(348,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 23:27:17'),
(349,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-10 23:31:04'),
(350,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 00:38:34'),
(351,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 01:39:45'),
(352,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 02:16:04'),
(353,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 02:24:08'),
(354,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 02:50:36'),
(355,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 11:10:00'),
(356,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 11:10:56'),
(357,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-11 11:13:43'),
(358,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-12 16:41:00'),
(359,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-12 19:03:25'),
(360,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-12 19:04:40'),
(361,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-12 20:17:00'),
(362,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 00:53:23'),
(363,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 01:08:00'),
(364,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 01:08:09'),
(365,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 01:08:29'),
(366,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 01:09:06'),
(367,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 01:09:43'),
(368,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1074526863,'2025-04-13 04:02:00'),
(369,'El aspirante con número de documento 1074526863 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1074526863,'2025-04-13 04:02:00'),
(370,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 04:03:18'),
(371,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1074526863,'2025-04-13 04:14:51'),
(372,'El aspirante con número de documento 1074526863 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1074526863,'2025-04-13 04:14:51'),
(373,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1074526863,'2025-04-13 04:15:25'),
(374,'El aspirante con número de documento 1074526863 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1074526863,'2025-04-13 04:15:25'),
(375,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 04:15:50'),
(376,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1045678912,'2025-04-13 04:39:04'),
(377,'El aspirante con número de documento 1045678912 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1045678912,'2025-04-13 04:39:04'),
(378,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 04:39:52'),
(379,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 05:18:14'),
(380,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 05:20:40'),
(381,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 05:22:31'),
(382,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 14:01:08'),
(383,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:05'),
(384,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:14'),
(385,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:24'),
(386,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:31'),
(387,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:38'),
(388,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:46'),
(389,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:02:53'),
(390,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 15:03:10'),
(391,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 16:03:21'),
(392,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 16:37:53'),
(393,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 17:44:21'),
(394,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 18:12:38'),
(395,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 19:15:12'),
(396,'Has aplicado a una convocatoria',NULL,'No leida','PostulacionAspirantes',1074526863,'2025-04-13 23:26:37'),
(397,'El aspirante con número de documento 1074526863 ha aplicado a una convocatoria',NULL,'No leida','Postulacion',1074526863,'2025-04-13 23:26:37'),
(398,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-13 23:27:28'),
(399,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 00:09:56'),
(400,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 00:20:42'),
(401,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 01:43:48'),
(402,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 01:50:26'),
(403,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 03:18:20'),
(404,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-14 04:39:12'),
(405,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 18:15:48'),
(406,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 18:59:01'),
(407,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 20:35:26'),
(408,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:00'),
(409,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:08'),
(410,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:16'),
(411,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:24'),
(412,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:47'),
(413,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:22:55'),
(414,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:23:05'),
(415,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:23:22'),
(416,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:23:31'),
(417,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:23:42'),
(418,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:24:02'),
(419,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 21:24:32'),
(420,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:29:31'),
(421,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:29:42'),
(422,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:29:49'),
(423,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:30:00'),
(424,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:30:11'),
(425,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:30:37'),
(426,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:30:47'),
(427,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:30:58'),
(428,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:31:07'),
(429,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:31:17'),
(430,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:31:28'),
(431,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:32:57'),
(432,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:33:14'),
(433,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 21:33:21'),
(434,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:33:47'),
(435,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:33:57'),
(436,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:34:07'),
(437,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:34:15'),
(438,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:34:27'),
(439,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 21:34:41'),
(440,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 22:00:53'),
(441,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 22:03:07'),
(442,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-15 23:06:31'),
(443,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-15 23:08:06'),
(444,'El empleado identificado con la cedula 1141114912 ha solicitado una ausencia para el dia 2025-04-16 hasta el dia 2025-04-17',NULL,'No leida','General',1141114912,'2025-04-15 23:16:37'),
(445,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-16 00:39:49'),
(446,'El empleado identificado con la cédula 1141114912 ha solicitado un permiso de tipo ',NULL,'Pendiente','General',1141114912,'2025-04-16 00:42:38'),
(447,'El empleado identificado con la cédula 1141114912 ha solicitado un permiso de tipo Incapacidad',NULL,'Pendiente','General',1141114912,'2025-04-16 00:43:09'),
(448,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1141114912 y con el nombre Yised Dayana',NULL,'Jornada Registrada','Jornada',1141114912,'2025-04-16 01:43:19'),
(449,'Nueva jornada registrada por inicio de sesión para el usuario con documento: 1014736 y con el nombre Englis',NULL,'Jornada Registrada','Jornada',1014736,'2025-04-17 18:18:46');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pazysalvo`
--

DROP TABLE IF EXISTS `pazysalvo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pazysalvo`
--

LOCK TABLES `pazysalvo` WRITE;
/*!40000 ALTER TABLE `pazysalvo` DISABLE KEYS */;
/*!40000 ALTER TABLE `pazysalvo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `idPermisos` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `estadoPermiso` varchar(50) DEFAULT 'Pendiente',
  `usuario_num_doc` int(11) NOT NULL,
  `fechaSolicitud` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idPermisos`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `permiso_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES
(1,'Incapacidad','2025-04-15','2025-04-16','Pendiente',1141114912,'2025-04-16 00:42:38'),
(2,'Incapacidad','2025-04-15','2025-04-16','Pendiente',1141114912,'2025-04-16 00:43:09');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion`
--

DROP TABLE IF EXISTS `postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
INSERT INTO `postulacion` VALUES
(25,'En proceso','2025-03-28 02:47:59',7,1141114912),
(26,'En proceso','2025-04-07 01:13:14',15,1014189999),
(27,'En proceso','2025-04-09 22:32:23',6,1056789123),
(28,'En proceso','2025-04-13 04:02:00',16,1074526863),
(29,'En proceso','2025-04-13 04:14:51',7,1074526863),
(30,'En proceso','2025-04-13 04:15:25',6,1074526863),
(31,'En proceso','2025-04-13 04:39:04',11,1045678912),
(32,'En proceso','2025-04-13 23:26:37',12,1074526863);
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion_has_notificacion`
--

DROP TABLE IF EXISTS `postulacion_has_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `postulacion_has_notificacion` (
  `notificacion_idnotificacion` int(11) NOT NULL,
  `postulacion_idpostulaciones` int(11) NOT NULL,
  KEY `notificacion_idnotificacion` (`notificacion_idnotificacion`),
  KEY `postulacion_idpostulaciones` (`postulacion_idpostulaciones`),
  CONSTRAINT `postulacion_has_notificacion_ibfk_1` FOREIGN KEY (`notificacion_idnotificacion`) REFERENCES `notificacion` (`idnotificacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postulacion_has_notificacion_ibfk_2` FOREIGN KEY (`postulacion_idpostulaciones`) REFERENCES `postulacion` (`idpostulacion`) ON DELETE CASCADE ON UPDATE CASCADE
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
-- Table structure for table `publicacion`
--

DROP TABLE IF EXISTS `publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacion` (
  `idPublicacion` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fechaPublicacion` datetime DEFAULT current_timestamp(),
  `usuario_num_doc` int(11) NOT NULL,
  `tipo_contrato` enum('Prestación de servicios','Obra laboral','Fijo','Indefinido','todos') DEFAULT 'todos',
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`idPublicacion`),
  KEY `usuario_num_doc` (`usuario_num_doc`),
  CONSTRAINT `publicacion_ibfk_1` FOREIGN KEY (`usuario_num_doc`) REFERENCES `usuario` (`num_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacion`
--

LOCK TABLES `publicacion` WRITE;
/*!40000 ALTER TABLE `publicacion` DISABLE KEYS */;
INSERT INTO `publicacion` VALUES
(16,'Días libres por cumplimiento de metas','Los empleados con contrato de prestación de servicios que cumplieron los objetivos del trimestre tendrán días libres esta semana, según el cronograma de bienestar.',NULL,'2025-04-15 13:24:02',1014736,'Prestación de servicios','activo'),
(17,'Ajustes en pagos por obra labor','A partir del próximo mes, los pagos para contratos por obra labor se realizarán el día 10 de cada mes. Favor verificar sus cuentas bancarias actualizadas.',NULL,'2025-04-15 13:24:02',1014736,'Obra laboral','activo'),
(18,'Nuevo horario para administrativos','Los trabajadores con contrato fijo deberán acogerse al nuevo horario de atención establecido entre las 7:30 a. m. y 5:00 p. m. desde el lunes.',NULL,'2025-04-15 13:24:02',1014736,'Fijo','activo'),
(19,'Teletrabajo permanente aprobado','El comité directivo ha aprobado el teletrabajo permanente para empleados con contrato indefinido del área de tecnología. Aplicará desde el 1 de mayo.',NULL,'2025-04-15 13:24:02',1014736,'Indefinido','activo'),
(21,'Capacitación obligatoria sobre seguridad','Los colaboradores con contrato de prestación de servicios deberán asistir a la capacitación sobre salud ocupacional este viernes a las 9:00 a. m.',NULL,'2025-04-15 13:24:02',1014736,'Prestación de servicios','activo'),
(22,'Entrega de dotación para personal de obra','Los empleados contratados por obra laboral deben presentarse este jueves para reclamar su dotación de seguridad.',NULL,'2025-04-15 13:24:02',1014736,'Obra laboral','activo'),
(23,'Encuesta de satisfacción laboral','Invitamos a los empleados con contrato fijo a participar en la encuesta de clima organizacional antes del viernes.',NULL,'2025-04-15 13:24:02',1014736,'Fijo','activo'),
(24,'Plan de carrera profesional','Se abre convocatoria interna para planes de ascenso dirigidos a empleados con contrato indefinido.',NULL,'2025-04-15 13:24:02',1014736,'Indefinido','activo'),
(25,'Celebración día del trabajadores','Este 1 de mayo celebraremos el día del trabajador con una actividad especial. Todos los empleados están invitados.',NULL,'2025-04-15 13:24:02',1014736,'todos','activo'),
(26,'Actualización de datos bancarios','Los contratistas por prestación de servicios deben actualizar sus datos bancarios antes del cierre de mes.',NULL,'2025-04-15 13:24:02',1014736,'Prestación de servicios','activo'),
(27,'Nueva herramienta para control de asistencia','Los empleados de obra laboral empezarán a registrar su asistencia mediante código QR desde la próxima semana.',NULL,'2025-04-15 13:24:02',1014736,'Obra laboral','activo'),
(28,'Revisión de contratos fijos','Invitamos a los empleados con contrato fijo a revisar la cláusula de renovación automática antes del 15 de mayo.',NULL,'2025-04-15 13:24:02',1014736,'Fijo','activo'),
(29,'Asignación de bonos trimestrales','A partir de este trimestre, los bonos por productividad se asignarán a empleados con contrato indefinido que superen sus KPIs.',NULL,'2025-04-15 13:24:02',1014736,'Indefinido','activo'),
(30,'Cierre contable mensual','Se recuerda a todos los empleados enviar sus reportes de gastos antes del día 30 para el cierre contable mensual.',NULL,'2025-04-15 13:24:02',1014736,'todos','activo'),
(31, 'Revisión de políticas de vacaciones', 'Recordamos a todos los empleados que las políticas de vacaciones fueron actualizadas, por lo que deben revisarlas y ajustarse a los nuevos lineamientos.', NULL, '2025-04-16 08:30:45', 1014736, 'todos', 'activo'),
(32, 'Nueva política de trabajo remoto', 'A partir del próximo mes, todos los empleados deberán solicitar autorización para trabajar desde casa, excepto los de áreas operativas.', NULL, '2025-04-16 09:10:12', 1014736, 'todos', 'activo'),
(33, 'Actualización en beneficios de salud', 'Los beneficios de salud se actualizaron para incluir consultas odontológicas gratuitas para todos los empleados con contrato indefinido.', NULL, '2025-04-16 09:45:23', 1014736, 'Indefinido', 'activo'),
(34, 'Convocatoria de empleo para nuevos proyectos', 'Se abre una nueva convocatoria de empleo para el área de marketing y ventas. Los interesados deben enviar su CV antes del 20 de abril.', NULL, '2025-04-16 10:00:00', 1014736, 'todos', 'activo'),
(35, 'Capacitación sobre nuevas herramientas digitales', 'La capacitación sobre las nuevas herramientas digitales será impartida la próxima semana. Todos los empleados deben asistir según su grupo asignado.', NULL, '2025-04-16 11:20:30', 1014736, 'todos', 'activo'),
(36, 'Modificación de horario para departamento de ventas', 'El departamento de ventas tendrá un nuevo horario desde el lunes: de 9:00 a 18:00, para adaptarse a las necesidades del mercado.', NULL, '2025-04-16 12:30:15', 1014736, 'todos', 'activo'),
(37, 'Cambio en proceso de entrega de nómina', 'A partir del próximo mes, la entrega de nómina será digital. Todos los empleados deberán registrarse en la plataforma para acceder a su comprobante.', NULL, '2025-04-16 13:00:50', 1014736, 'todos', 'activo'),
(38, 'Entrega de premios por rendimiento', 'Los empleados con mejor rendimiento del trimestre recibirán premios el próximo viernes durante la reunión mensual.', NULL, '2025-04-16 14:00:30', 1014736, 'todos', 'activo'),
(39, 'Nuevo convenio con gimnasio para empleados', 'Todos los empleados con contrato indefinido podrán acceder a descuentos exclusivos en un gimnasio local. Ver detalles en el portal interno.', NULL, '2025-04-16 15:30:00', 1014736, 'Indefinido', 'activo'),
(40, 'Recordatorio de uso de equipo de seguridad', 'Se recuerda a todos los empleados que deben usar el equipo de seguridad asignado cuando estén en áreas de trabajo de alto riesgo. Verifica tu equipo.', NULL, '2025-04-16 16:45:00', 1014736, 'todos', 'activo');

/*!40000 ALTER TABLE `publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `idrol` int(11) NOT NULL AUTO_INCREMENT,
  `nombreRol` varchar(45) NOT NULL,
  `estadoRol` int(11) NOT NULL,
  PRIMARY KEY (`idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES
(1,'Administrador',1),
(2,'Recursos Humanos',1),
(3,'Empleado',1),
(4,'Aspirante',1);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES
(1014,'Juan Esteban ','Becerra Genez','genez@gmail.com','cedula','$2y$10$ceDUJKTnwu6n/VkMCTY1rOlBo0.wg.S6MZDa437elxddmRPyI2ilW',1,41,4),
(1014736,'Englis','Barros','englis@gmail.com','CEDULA','$2y$10$XNBEfw9/zT3O25hSNaC6v.d8sjc3NopI19CW2MEOmH/Mr73zC086W',1,38,1),
(52027643,'Janneth Lucia','Osuna Plazas','Janneth@gmail.com','CEDULA','$2y$12$Cp8.V7zP4p6zxb1OZor0h.aAo6CMVGdVerVN7HNdF6Dk0bYUfQV9u',1,44,4),
(1012349306,'Laura Vannesa','Sanchez Salgado','laura@gmail.com','CEDULA','$2y$12$n2T9uUoHT0SjSBgVZ/mJeOt0OhXZjGcUblB.lVEHu8xjAIRl8tB/i',1,46,4),
(1014189999,'Juan ','Becerra ','juan@gmail.com','cellllllll','$2y$10$YZ73LkfFEKGydlcOqK546.uwUPRdnZwiE39Isqj1QBa0ALfyAeTLK',1,39,4),
(1022340806,'Johan Estiven','Rodriguez Vargas','Johan@gmail.com','CEDULA','$2y$12$GzzTy05Rbi5C8RF4HecqA.Cb6ZWw2iT26axdC5sG9e/Qi.Baltd1u',1,43,4),
(1028662366,'Dylan Santiago','Herrera Espinoza','Dylan@gmail.com','CEDULA','$2y$12$.vyJHztbCHvbf5IJu19zbOkAFAULeF4qn2dsS2jM8mk4myesbCR2q',1,42,4),
(1034567890,'Andres Felipe','Martinez Rios','andres@gmail.com','CEDULA','$2y$12$gjTu2deWgEyEV/iBDY0aJ.Z2XxbjYZb/wbCjb/sWpYm5u3fe/WIcO',1,47,4),
(1045678912,'Natalia Sofia','Gomez Paredes','natalia@gmail.com','CEDULA','$2y$12$HmDHEhm/.PstM/A3fhyzy.yRqIaXtabcXgEPruMvlaWXE/GVX1WxC',1,48,4),
(1056789123,'Sebastian','Rodriguez Perez','sebastian@gmail.com','CEDULA','$2y$12$ooSvgljsob.awCZ9iMYzbul.8lumhipfO.PHR.it6PVbuwwSDLXOy',1,49,4),
(1074526863,'Luan','Leyton','jeheilyrile@gmail.com','Cédula','$2y$12$/tOXNJKbXNS5UfLCoB0nk.8VwFoUgIGJvg2CRH8mXelSC0k1XJqRW',1,50,4),
(1141114912,'Yised Dayana','Castiblanco Herrera','yised@gmail.com','CEDULA','$2y$12$GETFrXbKFQTVtQHxL.Nf3e.PveaEuAN9C9UK1Rbpk./XcHewKs//.',1,45,3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `password_resets`

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  idPasswordReset INT AUTO_INCREMENT PRIMARY KEY,
  usuario_num_doc INT NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (usuario_num_doc) REFERENCES usuario(num_doc) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacacion`
--

DROP TABLE IF EXISTS `vacacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacacion`
--

LOCK TABLES `vacacion` WRITE;
/*!40000 ALTER TABLE `vacacion` DISABLE KEYS */;
INSERT INTO `vacacion` VALUES
(1,'2025-04-11','2025-04-17',NULL,'Pendiente',1014736),
(2,'2025-04-21','2025-05-06',NULL,'Pendiente',1141114912);
/*!40000 ALTER TABLE `vacacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vinculacion`
--

DROP TABLE IF EXISTS `vinculacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vinculacion`
--

LOCK TABLES `vinculacion` WRITE;
/*!40000 ALTER TABLE `vinculacion` DISABLE KEYS */;
INSERT INTO `vinculacion` VALUES
(6,'2025-03-31','2025-03-31','Prestacion de Servicios',1800000.00,'Activo','2025-03-31','uploads/contratos/1748806736_contrato_ejemplo.pdf',14,1141114912);
/*!40000 ALTER TABLE `vinculacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-04-17 18:34:13
