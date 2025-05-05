<?php
declare(strict_types=1);
namespace Model;

use Service\DatabaseService;
use PDO;
use PDOException;

class Publicaciones {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function obtenerPublicacionPorTipoDeContrato(int $num_doc): array {
        $sql = "
            SELECT p.*
            FROM publicacion p
            WHERE p.estado = 'activo'
              AND (
                p.tipo_contrato = 'todos'
                OR p.tipo_contrato IN (
                    SELECT v.tipoContrato
                    FROM vinculacion v
                    WHERE v.usuario_num_doc = :num_doc
                )
              )
            ORDER BY p.fechaPublicacion DESC
        ";
        return $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc]);
    }

    public function agregarPublicacion(array $data, int $num_doc): bool {
        $sql = "
            INSERT INTO publicacion 
            (titulo, descripcion, imagen, fechaPublicacion, usuario_num_doc, tipo_contrato, estado) 
            VALUES 
            (:titulo, :descripcion, :imagen, :fecha, :usuario_num_doc, :tipo_contrato, :estado)
        ";

        return $this->dbService->ejecutarAccion($sql, [
            ':titulo'          => $data['titulo'],
            ':descripcion'     => $data['descripcion'],
            ':imagen'          => $data['imagen'],
            ':fecha'           => $data['fechaPublicacion'],
            ':usuario_num_doc' => $num_doc,
            ':tipo_contrato'   => $data['tipo_contrato'],
            ':estado'          => $data['estado'],
        ]);
    }

    public function actualizarPublicacion(array $data): bool {
        $sql = "
            UPDATE publicacion
            SET titulo = :titulo, 
                descripcion = :descripcion, 
                imagen = :imagen, 
                fechaPublicacion = :fecha, 
                tipo_contrato = :tipo_contrato, 
                estado = :estado
            WHERE idPublicacion = :id
        ";

        return $this->dbService->ejecutarAccion($sql, [
            ':titulo'        => $data['titulo'],
            ':descripcion'   => $data['descripcion'],
            ':imagen'        => $data['imagen'],
            ':fecha'         => $data['fechaPublicacion'],
            ':tipo_contrato' => $data['tipo_contrato'],
            ':estado'        => $data['estado'],
            ':id'            => $data['idPublicacion'],
        ]);
    }

    public function eliminarPublicacion(int $idPublicacion): bool {
        $sql = "DELETE FROM publicacion WHERE idPublicacion = :id";
        return $this->dbService->ejecutarAccion($sql, [':id' => $idPublicacion]);
    }
}
