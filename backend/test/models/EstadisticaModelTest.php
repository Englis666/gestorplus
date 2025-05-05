<?php

declare(strict_types=1);

use Model\Estadistica;
use Service\DatabaseService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class EstadisticaModelTest extends TestCase
{
    private MockObject $dbServiceMock;
    private Estadistica $estadistica;

    protected function setUp(): void
    {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->estadistica = new Estadistica($this->dbServiceMock);
    }

    public function testObtenerEstadisticasGlobales(): void
    {
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([
                'totalJornadas' => 5,
                'totalGenerales' => 10,
                'totalActualizaciones' => 3
            ]);

        $result = $this->estadistica->obtenerTotalEstadisticas('12345', 'Administrador');
        
        $this->assertIsArray($result);
        $this->assertEquals(5, $result['totalJornadas']);
        $this->assertEquals(10, $result['totalGenerales']);
        $this->assertEquals(3, $result['totalActualizaciones']);
    }

    public function testObtenerEstadisticasPorUsuario(): void
    {
        $num_doc = '12345';

        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([
                'totalJornadas' => 2,
                'totalGenerales' => 4,
                'totalActualizaciones' => 1
            ]);

        $result = $this->estadistica->obtenerTotalEstadisticas($num_doc);

        $this->assertIsArray($result);
        $this->assertEquals(2, $result['totalJornadas']);
        $this->assertEquals(4, $result['totalGenerales']);
        $this->assertEquals(1, $result['totalActualizaciones']);
    }

    public function testObtenerEstadisticasVacias(): void
    {
        $num_doc = '12345';

        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([]);

        $result = $this->estadistica->obtenerTotalEstadisticas($num_doc);

        $this->assertIsArray($result);
        $this->assertEquals(0, $result['totalJornadas']);
        $this->assertEquals(0, $result['totalGenerales']);
        $this->assertEquals(0, $result['totalActualizaciones']);
    }
}
