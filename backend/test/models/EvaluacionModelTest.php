<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\Evaluacion;
use Service\DatabaseService;

class EvaluacionModelTest extends TestCase {
    private DatabaseService $dbService;
    private Evaluacion $evaluacion;

    protected function setUp(): void {
        $this->dbService = $this->createMock(DatabaseService::class);

        $this->evaluacion = new Evaluacion($this->dbService);
    }

    /**
     * Test para guardar los resultados del sistema de gestión.
     */
    public function testGuardarResultadosSistemaDeGestion(): void {
        $data = [
            'estado_salud' => 'Buena',
            'evaluacionRiesgos' => 'Baja',
            'recomendaciones' => 'Ninguna',
            'aptitudLaboral' => 'Apta',
            'comentarios' => 'Todo en orden',
            'identrevista' => 1,
            'idpostulacion' => 123,
            'estadoEvaluacion' => 'Pendiente',
        ];

        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->method('execute')->willReturn(true);

        $this->dbService->method('getConnection')->willReturn($this->createMock(PDO::class));
        $this->dbService->getConnection()->method('prepare')->willReturn($stmtMock);

        $result = $this->evaluacion->guardarResultadosSistemaDeGestion($data);

        $this->assertTrue($result);
    }

    /**
     * Test para buscar el ID de la evaluación.
     */
    public function testBuscarIdEvaluacion(): void {
        $identrevista = 1;

        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->method('fetch')->willReturn(['idevaluacion' => 456]); 
        $this->dbService->method('getConnection')->willReturn($this->createMock(PDO::class));
        $this->dbService->getConnection()->method('prepare')->willReturn($stmtMock);

        $result = $this->evaluacion->buscarIdEvaluacion($identrevista);

        $this->assertEquals(['idevaluacion' => 456], $result);
    }
}
