<?php

use PHPUnit\Framework\TestCase;
use Model\Entrevista;
use Service\DatabaseService;

class EntrevistaModelTest extends TestCase
{
    private $dbServiceMock;
    private Entrevista $entrevista;

    protected function setUp(): void
    {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->entrevista = new Entrevista($this->dbServiceMock);
    }

    public function testObtenerEntrevistas()
    {
        $expectedResult = [
            [
                'identrevista' => 1,
                'fecha' => '2025-05-05',
                'hora' => '10:00',
                'lugarMedio' => 'Sala A',
                'postulacion_idpostulaciones' => 1,
                'estadoEntrevista' => 'Pendiente'
            ]
        ];

        $this->dbServiceMock->method('ejecutarConsulta')
            ->willReturn($expectedResult);

        $result = $this->entrevista->obtenerEntrevistas();

        $this->assertEquals($expectedResult, $result);
    }

    public function testObtenerDatosDelEntrevistado()
    {
        $num_doc = '1234567890';
        $expectedData = [
            'num_doc' => '1234567890',
            'nombre' => 'Juan Pérez',
            'idHojadevida' => 1,
            'estudios' => [
                ['titulo' => 'Ingeniero', 'institucion' => 'Universidad X']
            ],
            'experiencias' => [
                ['empresa' => 'Empresa Y', 'puesto' => 'Desarrollador']
            ]
        ];

        $this->dbServiceMock->method('ejecutarConsulta')
            ->willReturnOnConsecutiveCalls(
                [$expectedData], 
                [['titulo' => 'Ingeniero', 'institucion' => 'Universidad X']],
                [['empresa' => 'Empresa Y', 'puesto' => 'Desarrollador']] 
            );

        $result = $this->entrevista->obtenerDatosDelEntrevistado($num_doc);

        $this->assertEquals($expectedData, $result);
    }

    public function testAsignarEntrevista()
    {
        $data = [
            'fecha' => '2025-05-05',
            'hora' => '10:00',
            'lugarMedio' => 'Sala A',
            'postulacion_idpostulaciones' => 1
        ];

        $this->dbServiceMock->method('ejecutarConsulta')
            ->willReturn(true);
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->method('fetch')->willReturn(['usuario_num_doc' => '1234567890']);
        $this->dbServiceMock->method('prepare')->willReturn($stmtMock);
        $result = $this->entrevista->asignarEntrevista($data);

        $this->assertTrue($result);
    }

    public function testAsistenciaConfirmada()
    {
        $identrevista = 1;

        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute');
        $this->dbServiceMock->method('prepare')->willReturn($stmtMock);

        $this->entrevista->asistenciaConfirmada($identrevista);
    }

    public function testAsistenciaNoConfirmada()
    {
        $identrevista = 1;
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute');
        $this->dbServiceMock->method('prepare')->willReturn($stmtMock);

        $this->entrevista->asistenciaNoConfirmada($identrevista);
    }
}
