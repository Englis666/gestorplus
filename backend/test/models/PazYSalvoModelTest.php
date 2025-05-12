<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\PazySalvo;
use Service\DatabaseService;

class PazySalvoModelTest extends TestCase
{
    private $dbServiceMock;
    private $pazySalvo;

    protected function setUp(): void
    {
        // Mock del servicio de base de datos
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->pazySalvo = new PazySalvo($this->dbServiceMock);
    }

    public function testObtenerPazYSalvos()
    {
        $expectedResult = [
            ['id' => 1, 'motivo' => 'Finalización contrato', 'estado' => 'Activo'],
            ['id' => 2, 'motivo' => 'Renuncia', 'estado' => 'Pendiente']
        ];

        $this->dbServiceMock
            ->expects($this->once())
            ->method('ejecutarConsulta')
            ->with("SELECT * FROM pazysalvo")
            ->willReturn($expectedResult);

        $result = $this->pazySalvo->obtenerPazYSalvos();
        $this->assertEquals($expectedResult, $result);
    }

    public function testObtenerMiPazYSalvo()
    {
        $num_doc = 12345;
        $vinculacionResult = ['idvinculacion' => 10];
        $pazYSalvoResult = [
            ['id' => 1, 'motivo' => 'Finalización contrato', 'estado' => 'Activo']
        ];

        // Primera llamada
        $this->dbServiceMock->expects($this->at(0))
            ->method('ejecutarConsulta')
            ->with(
                'SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc',
                [':num_doc' => $num_doc]
            )
            ->willReturn($vinculacionResult);

        // Segunda llamada
        $this->dbServiceMock->expects($this->at(1))
            ->method('ejecutarConsulta')
            ->with(
                'SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :id',
                [':id' => $vinculacionResult['idvinculacion']]
            )
            ->willReturn($pazYSalvoResult);

        $result = $this->pazySalvo->obtenerMiPazYSalvo($num_doc);

        $this->assertEquals($pazYSalvoResult, $result);
    }

    public function testCrearPazYSalvo()
    {
        $data = [
            'empleado' => ['num_doc' => 12345],
            'motivo' => 'Finalización contrato',
            'fechaEmision' => '2025-05-01',
            'estado' => 'Activo',
            'documentoPazysalvo' => 'documento.pdf'
        ];

        $vinculacion = ['idvinculacion' => 10];

        $this->dbServiceMock
            ->expects($this->at(0))
            ->method('ejecutarConsulta')
            ->with(
                'SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc',
                [':num_doc' => $data['empleado']['num_doc']]
            )
            ->willReturn($vinculacion);

        $this->dbServiceMock
            ->expects($this->at(1))
            ->method('ejecutarInsert')
            ->with(
                'INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion) VALUES (:motivo, :fechaEmision, :estado, :documentoPazysalvo, :vinculacion_idvinculacion)',
                $this->callback(function ($params) use ($data, $vinculacion) {
                    return $params[':motivo'] === $data['motivo']
                        && $params[':fechaEmision'] === $data['fechaEmision']
                        && $params[':estado'] === $data['estado']
                        && $params[':documentoPazysalvo'] === $data['documentoPazysalvo']
                        && $params[':vinculacion_idvinculacion'] === $vinculacion['idvinculacion'];
                })
            )
            ->willReturn(1); // Indica éxito

        $result = $this->pazySalvo->crearPazYSalvo($data);
        $this->assertTrue($result);
    }

    public function testCrearPazYSalvoSinVinculacion()
    {
        $data = [
            'empleado' => ['num_doc' => 12345],
            'motivo' => 'Finalización contrato',
            'fechaEmision' => '2025-05-01',
            'estado' => 'Activo',
            'documentoPazysalvo' => 'documento.pdf'
        ];

        $this->dbServiceMock
            ->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                'SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc',
                [':num_doc' => $data['empleado']['num_doc']]
            )
            ->willReturn(null); // No hay vinculacion

        $result = $this->pazySalvo->crearPazYSalvo($data);
        $this->assertFalse($result);
    }
}
