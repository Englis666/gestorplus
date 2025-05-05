<?php
namespace Model;

use Service\DatabaseService;

class Experiencia {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerExperiencia(int $idhojadevida) {
        $sql = "SELECT * FROM experiencialaboral WHERE hojadevida_idhojadevida = :idhojadevida";
        return $this->dbService->ejecutarConsulta($sql, ['idhojadevida' => $idhojadevida]);
    }

    public function eliminarExperiencia(int $idexperiencialaboral): bool {
        $sql = "DELETE FROM experiencialaboral WHERE idexperienciaLaboral = :idexperienciaLaboral";
        return $this->dbService->ejecutarAccion($sql, ['idexperienciaLaboral' => $idexperiencialaboral]);
    }

    public function agregarExp(array $data, int $hojadevida_idHojadevida): string {
        $sql = "INSERT INTO experiencialaboral 
                (profesion, descripcionPerfil, fechaInicioExp, fechaFinExp, cargo, empresa, ubicacionEmpresa, tipoContrato, salario, logros, referenciasLaborales, fechaIngreso, fechaSalida, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data['profesion'],
            $data['descripcionPerfil'],
            $data['fechaInicioExp'],
            $data['fechaFinExp'],
            $data['cargo'],
            $data['empresa'],
            $data['ubicacionEmpresa'],
            $data['tipoContrato'],
            $data['salario'],
            $data['logros'],
            $data['referenciasLaborales'],
            $data['fechaIngreso'],
            $data['fechaSalida'],
            $hojadevida_idHojadevida
        ];
        
        $insertId = $this->dbService->ejecutarInsert($sql, $params);
        
        return $insertId ? json_encode(['message' => 'Experiencia agregada', 'id' => $insertId]) : json_encode(['message' => 'Error al agregar experiencia']);
    }

    public function actualizarExperiencia(array $data): bool {
        $sql = 'UPDATE experiencialaboral SET profesion = ?, descripcionPerfil = ?, fechaInicioExp = ?, fechaFinExp = ? WHERE idexperienciaLaboral = ?';
        $params = [
            $data['profesion'],
            $data['descripcionPerfil'],
            $data['fechaInicioExp'],
            $data['fechaFinExp'],
            $data['idexperienciaLaboral']
        ];

        return $this->dbService->ejecutarUpdate($sql, $params);
    }
}
