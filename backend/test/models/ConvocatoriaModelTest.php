<?php
use PHPUnit\Framework\TestCase;
use Model\Convocatoria;
use Service\DatabaseService;

class ConvocatoriaModelTest extends TestCase {
    private $dbServiceMock;
    private Convocatoria $convocatoria;

    protected function setUp(): void {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->convocatoria = new Convocatoria($this->dbServiceMock);
    }

    public function testObtenerConvocatorias() {
        $esperado = [
            ['idconvocatoria' => 1, 'nombreConvocatoria' => 'Conv A', 'cargo_idCargo' => 1],
            ['idconvocatoria' => 2, 'nombreConvocatoria' => 'Conv B', 'cargo_idCargo' => 2]
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with($this->stringContains('SELECT * FROM convocatoria'))
            ->willReturn($esperado);

        $resultado = $this->convocatoria->obtenerConvocatorias();
        $this->assertEquals($esperado, $resultado);
    }

    public function testAgregarConvocatoria() {
        $data = [
            'nombreConvocatoria' => 'Nueva Conv',
            'descripcion' => 'Descripción',
            'requisitos' => 'Requisitos',
            'salario' => 2000,
            'cantidadConvocatoria' => 5,
            'idcargo' => 3
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('INSERT INTO convocatoria'),
                $this->arrayHasKey(':nombreConvocatoria')
            )
            ->willReturn(true);

        $resultado = $this->convocatoria->agregarConvocatoria($data);
        $this->assertTrue($resultado);
    }

    public function testObtenerDetalleConvocatoria() {
        $esperado = ['idconvocatoria' => 1, 'nombreConvocatoria' => 'Conv Detalle'];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with($this->stringContains('WHERE idconvocatoria = :idconvocatoria'))
            ->willReturn([$esperado]);

        $resultado = $this->convocatoria->obtenerDetalleConvocatoria(1);
        $this->assertEquals($esperado, $resultado);
    }
}
