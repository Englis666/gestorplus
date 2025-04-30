<?php
namespace Model;
use PDO;
use PDOException;
use Config\Database;

class Certificado{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }


    public function obtenerDatosParaCertificado($num_doc){
        $sql = "SELECT * FROM vinculacion as v
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                INNER JOIN rol as r ON u.rol_idrol = r.idrol
                INNER JOIN evaluacionessg as e ON v.evaluacionesSg_idevaluacion = e.idevaluacion
                INNER JOIN entrevista as ent ON e.entrevista_identrevista = ent.identrevista
                INNER JOIN postulacion as p ON ent.postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN convocatoria as c ON convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as car ON 
                c.cargo_idcargo = car.idcargo
                WHERE u.num_doc = :num_doc
                ";
       $stmt = $this->db->prepare($sql);
       $stmt->bindPAram(':num_doc' , $num_doc, PDO::PARAM_INT);
       $stmt->execute();

       $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
       if($resultado){
           return $resultado;
       }
       return[];
   }



}
