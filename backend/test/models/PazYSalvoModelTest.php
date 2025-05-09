<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\PazySalvo;
use Service\DatabaseService;

class PazySalvoModelTest extends TestCase{
    private $mockDbService;
    private $pazySalvo;

    protected function setUp(): void
    {
        $this->mockDbService = $this->createMock(DatabaseService::class);
        $this->pazySalvo = new PazySalvo($this->mockDbService);
    }

    public function testObtenerPazYSalvos()
    {
        $fakeResult = [
            ['id' => 1, 'motivo' => 'Motivo 1', 'estado' => 'activo'],
            ['id' => 2, 'motivo' => 'Motivo 2', 'estado' => 'inactivo']
        ];

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('fetchAll')->willReturn($fakeResult);
        $this->mockDbService->method('prepare')->willReturn($stmt);
        $result = $this->pazySalvo->obtenerPazYSalvos();
        $this->assertEquals($fakeResult, $result);
    }

    public function testObtenerMiPazYSalvo()
    {
        $numDoc = 12345;

        $fakeVinculacion = ['idvinculacion' => 1];
        $stmtVinculacion = $this->createMock(PDOStatement::class);
        $stmtVinculacion->method('fetch')->willReturn($fakeVinculacion);

        // Simular el resultado de la consulta del Paz y Salvo
        $fakePazYSalvo = [
            ['id' => 1, 'motivo' => 'Motivo 1', 'estado' => 'activo']
        ];
        $stmtPazYSalvo = $this->createMock(PDOStatement::class);
        $stmtPazYSalvo->method('fetchAll')->willReturn($fakePazYSalvo);

        // Simular que prepare devuelve las consultas correctas
        $this->mockDbService->method('prepare')
            ->will($this->returnValueMap([
                ["SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc", $stmtVinculacion],
                ["SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion", $stmtPazYSalvo],
            ]));

        // Llamar al método a probar
        $result = $this->pazySalvo->obtenerMiPazYSalvo($numDoc);

        // Verificar los resultados
        $this->assertEquals($fakePazYSalvo, $result);
    }

    public function testCrearPazYSalvoSuccess()
    {
        // Datos de prueba
        $data = [
            'empleado' => ['num_doc' => '12345'],
            'motivo' => 'Motivo de prueba',
            'fechaEmision' => '2025-05-01',
            'estado' => 'activo',
            'documentoPazysalvo' => 'documento123.pdf'
        ];

        // Simular que la consulta de la vinculación devuelve un ID válido
        $stmtVinculacion = $this->createMock(PDOStatement::class);
        $stmtVinculacion->method('fetchColumn')->willReturn(1);

        // Simular que la consulta de inserción tiene éxito
        $stmtInsert = $this->createMock(PDOStatement::class);
        $stmtInsert->method('execute')->willReturn(true);
        $stmtInsert->method('rowCount')->willReturn(1);

        // Simular el comportamiento del método prepare
        $this->mockDbService->method('prepare')
            ->will($this->returnValueMap([
                ["SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc", $stmtVinculacion],
                [
                    "INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion) 
                    VALUES (:motivo, :fechaEmision, :estado, :documentoPazysalvo, :vinculacion_idvinculacion)", 
                    $stmtInsert
                ]
            ]));

        // Llamar al método a probar
        $result = $this->pazySalvo->crearPazYSalvo($data);

        // Verificar que la inserción fue exitosa
        $this->assertTrue($result);
    }

    public function testCrearPazYSalvoFailure()
    {
        // Datos de prueba
        $data = [
            'empleado' => ['num_doc' => '12345'],
            'motivo' => 'Motivo de prueba',
            'fechaEmision' => '2025-05-01',
            'estado' => 'activo',
            'documentoPazysalvo' => 'documento123.pdf'
        ];

        // Simular que la consulta de la vinculación no devuelve un ID válido
        $stmtVinculacion = $this->createMock(PDOStatement::class);
        $stmtVinculacion->method('fetchColumn')->willReturn(false);

        // Simular el comportamiento del método prepare
        $this->mockDbService->method('prepare')
            ->will($this->returnValueMap([
                ["SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc", $stmtVinculacion]
            ]));

        // Llamar al método a probar
        $result = $this->pazySalvo->crearPazYSalvo($data);

        // Verificar que la creación falló
        $this->assertFalse($result);
    }
}
