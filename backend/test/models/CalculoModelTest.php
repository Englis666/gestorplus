<?php

use PHPUnit\Framework\TestCase;
use Model\Calculo;
use Service\DatabaseService;

class CalculoModelTest extends TestCase
{
    private $calculo;
    private $dbServiceMock;

    protected function setUp(): void
    {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->calculo = new Calculo($this->dbServiceMock);
    }

    public function testRetornaArrayVacioCuandoNoHayJornadas()
    {
        $this->dbServiceMock->method('ejecutarConsulta')->willReturn([]);

        $resultado = $this->calculo->calcularHorasExtra();

        $this->assertIsArray($resultado);
        $this->assertEmpty($resultado);
    }

    public function testCalculaYActualizaRegistroExistente()
    {
        $jornadas = [
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '20:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ]
        ];

        // Simula que ya existe un registro previo
        $this->dbServiceMock->method('ejecutarConsulta')->willReturnOnConsecutiveCalls(
            $jornadas, // para obtener jornadas
            [['id' => 1]] // para buscar registro existente
        );

        // Simula actualización exitosa
        $this->dbServiceMock->method('ejecutarUpdate')->willReturn(true);

        $resultado = $this->calculo->calcularHorasExtra();

        $this->assertIsArray($resultado);
        $this->assertNotEmpty($resultado);
        $this->assertEquals('123', $resultado[0]['usuario_num_doc']);
    }

    public function testCalculaEInsertaNuevoRegistro()
    {
        $jornadas = [
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '07:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana López',
                'nombreRol' => 'Operaria'
            ]
        ];

        // Simula que no hay registro previo
        $this->dbServiceMock->method('ejecutarConsulta')->willReturnOnConsecutiveCalls(
            $jornadas, // para obtener jornadas
            []         // no encuentra registro existente
        );

        // Simula inserción exitosa (retorna ID insertado)
        $this->dbServiceMock->method('ejecutarInsert')->willReturn(10);

        $resultado = $this->calculo->calcularHorasExtra();

        $this->assertIsArray($resultado);
        $this->assertNotEmpty($resultado);
        $this->assertEquals('456', $resultado[0]['usuario_num_doc']);
    }
}
