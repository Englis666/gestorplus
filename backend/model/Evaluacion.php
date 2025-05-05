<?php
declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;

class Evaluacion {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    /**
     * Obtiene el sistema de gestión de evaluaciones, uniendo las tablas relevantes.
     *
     * @return array
     */
    public function obtenerSistemaDeGestion() {
        $sql = "SELECT * FROM evaluacionessg as e 
                INNER JOIN postulacion as p ON e.entrevista_postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc";
        return $this->dbService->ejecutarConsulta($sql);
    }

    /**
     * Guarda los resultados de la evaluación en el sistema de gestión.
     *
     * @param array $data
     * @return bool
     */
    public function guardarResultadosSistemaDeGestion(array $data): bool {
        $sql = "INSERT INTO evaluacionessg 
                (estado_salud, evaluacionRiesgos, recomendaciones, aptitudLaboral, comentarios, 
                 entrevista_identrevista, entrevista_postulacion_idpostulaciones, estadoEvaluacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $data['estado_salud'],
            $data['evaluacionRiesgos'],
            $data['recomendaciones'],
            $data['aptitudLaboral'],
            $data['comentarios'],
            $data['identrevista'],
            $data['idpostulacion'],
            $data['estadoEvaluacion']
        ];

        return $this->dbService->ejecutarInsert($sql, $params);
    }

    /**
     * Busca el ID de la evaluación basada en la ID de la entrevista.
     *
     * @param int $identrevista
     * @return array|null
     */
    public function buscarIdEvaluacion(int $identrevista): ?array {
        $sql = "SELECT idevaluacion FROM evaluacionessg WHERE entrevista_identrevista = ?";
        $result = $this->dbService->ejecutarConsulta($sql, [$identrevista], true);
        return $result ?: null;
    }
}
