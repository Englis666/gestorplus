<?php

declare(strict_types=1);

use Model\Cargo;
use Service\DatabaseService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class CargoModelTest extends TestCase
{
    private MockObject $dbServiceMock;
    private Cargo $cargo;

    protected function setUp(): void
    {
        // Crear un mock de DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->cargo = new Cargo($this->dbServiceMock);
    }

    // Test para el método activarCargo
    public function testActivarCargo(): void
    {
        $idCargo = 1;

        // Configurar el mock para ejecutar correctamente el método
        $this->dbServiceMock
            ->method('ejecutarUpdate')
            ->willReturn(true);

        $result = $this->cargo->activarCargo($idCargo);
        $this->assertTrue($result);
    }

    // Test para el método desactivarCargo
    public function testDesactivarCargoSinConvocatoriasRelacionadas(): void
    {
        $idCargo = 1;

        // Configurar el mock para que no haya convocatorias relacionadas
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([['total' => 0]]); // No hay convocatorias relacionadas

        // Configurar el mock para ejecutar correctamente el update
        $this->dbServiceMock
            ->method('ejecutarUpdate')
            ->willReturn(true);

        $result = $this->cargo->desactivarCargo($idCargo);
        $this->assertTrue($result);
    }

    // Test para desactivar un cargo con convocatorias relacionadas
    public function testDesactivarCargoConConvocatoriasRelacionadas(): void
    {
        $idCargo = 1;

        // Configurar el mock para que haya convocatorias relacionadas
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([['total' => 2]]); // Hay 2 convocatorias relacionadas

        // Esperar que se lance una excepción
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('No se puede desactivar el cargo: existen 2 convocatoria(s) relacionada(s).');

        $this->cargo->desactivarCargo($idCargo);
    }

    // Test para el método obtenerCargos
    public function testObtenerCargos(): void
    {
        $cargos = [
            ['idCargo' => 1, 'nombreCargo' => 'Desarrollador', 'estadoCargo' => 'Activo'],
            ['idCargo' => 2, 'nombreCargo' => 'Diseñador', 'estadoCargo' => 'Activo']
        ];

        // Configurar el mock para que devuelva una lista de cargos
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn($cargos);

        $result = $this->cargo->obtenerCargos();
        $this->assertCount(2, $result);
        $this->assertEquals('Desarrollador', $result[0]['nombreCargo']);
    }

    // Test para el método agregarCargo
    public function testAgregarCargo(): void
    {
        $nombreCargo = 'Tester';

        // Configurar el mock para ejecutar correctamente el insert
        $this->dbServiceMock
            ->method('ejecutarInsert')
            ->willReturn(null); // Suponemos que la inserción no devuelve nada

        // Llamar al método
        $this->cargo->agregarCargo($nombreCargo);

        // Verificar que se haya llamado correctamente al método de inserción
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarInsert')
            ->with(
                $this->equalTo("INSERT INTO cargo (nombreCargo, estadoCargo) VALUES (?, 'Activo')"),
                $this->equalTo([$nombreCargo])
            );
    }
}
