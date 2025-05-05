<?php
use PHPUnit\Framework\TestCase;
use Model\Empleado;
use Service\DatabaseService;

class EmpleadoModelTest extends TestCase {
    private $dbServiceMock;
    private Empleado $empleado;

    protected function setUp(): void {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->empleado = new Empleado($this->dbServiceMock);
    }

    public function testObtenerEmpleados() {
        $empleadosEsperados = [
            ['num_doc' => '123', 'nombre' => 'Juan Pérez', 'cargo' => 'Developer'],
            ['num_doc' => '456', 'nombre' => 'Ana García', 'cargo' => 'Manager']
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with($this->stringContains('SELECT * FROM vinculacion'))
            ->willReturn($empleadosEsperados);

        $resultado = $this->empleado->obtenerEmpleados();
        $this->assertEquals($empleadosEsperados, $resultado);
    }

    public function testSolicitarQuejaExito() {
        $num_doc = '123';
        $data = ['fecha' => '2025-05-01'];

        $descripcionNotificacion = 'El usuario identificado con el número de documento 123 ha realizado una queja relacionada con la jornada 2025-05-01';
        
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('INSERT INTO notificacion'),
                $this->arrayHasKey(':descripcionNotificacion')
            )
            ->willReturn(true);

        $resultado = $this->empleado->solicitarQueja($num_doc, $data);
        $this->assertTrue($resultado > 0);
    }

    public function testSolicitarQuejaError() {
        $num_doc = '123';
        $data = ['fecha' => '2025-05-01'];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('INSERT INTO notificacion'),
                $this->arrayHasKey(':descripcionNotificacion')
            )
            ->will($this->throwException(new PDOException('Database error')));

        $resultado = $this->empleado->solicitarQueja($num_doc, $data);
        $this->assertEquals(0, $resultado);
    }
}
