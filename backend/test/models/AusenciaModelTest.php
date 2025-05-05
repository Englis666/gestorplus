<?php
use PHPUnit\Framework\TestCase;
use Model\Ausencia;
use Service\DatabaseService;

class AusenciaModelTest extends TestCase
{
    private $dbMock;
    private Ausencia $ausencia;

    protected function setUp(): void
    {
        $this->dbMock = $this->createMock(DatabaseService::class);
        $this->ausencia = new Ausencia($this->dbMock);
    }

    public function testObtenerAusenciasDevuelveArray()
    {
        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with($this->anything(), [':num_doc' => '123'], true)
            ->willReturn([['id' => 1, 'descripcion' => 'Enfermedad']]);

        $resultado = $this->ausencia->obtenerAusencias('123');

        $this->assertIsArray($resultado);
        $this->assertCount(1, $resultado);
    }

    public function testObtenerTodasLasAusencias()
    {
        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willReturn([['id' => 2, 'justificada' => 'No justificada']]);

        $resultado = $this->ausencia->obtenerTodasLasAusencias();

        $this->assertIsArray($resultado);
    }

    public function testAusenciaAceptada()
    {
        $this->dbMock->expects($this->exactly(3))
            ->method('ejecutarConsulta')
            ->willReturn(['usuario_num_doc' => '123']);

        $this->dbMock->expects($this->once())
            ->method('ejecutarUpdate');

        $this->dbMock->expects($this->once())
            ->method('ejecutarInsert');

        $resultado = $this->ausencia->ausenciaAceptada(5);
        $this->assertTrue($resultado);
    }

    public function testAusenciaAceptadaFalla()
    {
        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willReturn(null);

        $resultado = $this->ausencia->ausenciaAceptada(99);
        $this->assertFalse($resultado);
    }

    public function testAusenciaRechazada()
    {
        $this->dbMock->expects($this->exactly(3))
            ->method('ejecutarConsulta')
            ->willReturn(['usuario_num_doc' => '123']);

        $this->dbMock->expects($this->once())
            ->method('ejecutarUpdate');

        $this->dbMock->expects($this->once())
            ->method('ejecutarInsert');

        $resultado = $this->ausencia->ausenciaRechazada(7);
        $this->assertTrue($resultado);
    }

    public function testSolicitarAusencia()
    {
        $this->dbMock->expects($this->exactly(2))
            ->method('ejecutarInsert');

        $data = [
            'fechaInicio' => '2025-05-01',
            'fechaFin' => '2025-05-03',
            'tipoAusencia' => 'Vacaciones',
            'descripcion' => 'Viaje familiar'
        ];

        $resultado = $this->ausencia->solicitarAusencia('123', $data);
        $this->assertTrue($resultado);
    }
}
