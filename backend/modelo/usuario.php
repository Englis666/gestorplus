<?php
require_once 'config/config.php';
class Usuario {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }

    //cambios
    public function registrar($data) {
        try {
            $this->db->beginTransaction();
            $sqlHojaDeVida = "INSERT INTO hojadevida () VALUES ()"; 
            $stmtHojaDeVida = $this->db->prepare($sqlHojaDeVida);
            $stmtHojaDeVida->execute();

            $idHojadevida = $this->db->lastInsertId();
            $sqlUsuario = "INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, rol_idrol, hojadevida_idHojadevida) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtUsuario = $this->db->prepare($sqlUsuario);    
            $stmtUsuario->execute([
                $data['num_doc'],
                $data['nombres'],
                $data['apellidos'],
                $data['email'],
                $data['tipodDoc'],
                $data['password'],
                $data['estado'],
                $data['rol_idrol'],
                $idHojadevida 
            ]);
            $this->db->commit();
            return json_encode(['message' => 'Usuario registrado']);       
        } catch (PDOException $e) {
            $this->db->rollBack();
            return json_encode(['message' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

   public function inicioSesion($data){
    header("Content-Type: application/json");
    $sql = "SELECT * FROM usuario WHERE num_doc = ?";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([$data['num_doc']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($data['password'], $usuario['password'])) {

        session_start(); 
        $_SESSION['usuario'] = [
            'num_doc' => $usuario['num_doc'],
            'nombres' => $usuario['nombres'],
            'rol' => $usuario['rol_idrol'],  
            'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
        ];

        return [
            'num_doc' => $usuario['num_doc'],
            'nombres' => $usuario['nombres'],
            'rol' => $usuario['rol_idrol'],  
            'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
        ];
    } else {
        return false; 
    }
}
   

    public function obtenerConvocatorias(){
        $sql = "SELECT * FROM convocatoria as c
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    return [];
    }

    public function obtenerTotalEstadisticas() {
        $sql = "
            SELECT 
                SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalEntradas,
                SUM(CASE WHEN tipo = 'Ausencias' THEN 1 ELSE 0 END) AS totalAusencias
            FROM notificacion
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($resultado) {
            return [
                'totalEntradas' => (int)$resultado['totalEntradas'],
                'totalAusencias' => (int)$resultado['totalAusencias']
            ];
        } else {
            return [
                'totalEntradas' => 0,
                'totalAusencias' => 0
            ];
        }
    }
}

?>