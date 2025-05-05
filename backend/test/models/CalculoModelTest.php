<?php
use PHPUnit\Framework\TestCase;
use Model\Calculo;
use Service\DatabaseService;

class CalculoModelTest extends TestCase {
    private $dbServiceMock;
    private Calculo $calculo;

    protected function setUp(): void {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->calculo = new Calculo($this->dbServiceMock);
    }

    public function testCalcularHorasExtraRetornaArrayVacioCuandoNoHayJornadas(): void {
        $this->dbServiceMock->method('ejecutarConsulta')
            ->willReturn([]);

        $result = $this->calculo->calcularHorasExtra();

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testCalcularHorasExtraCalculaCorrectamenteYActualizaRegistroExistente(): void {
        $jornadas = [
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '18:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ],
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '18:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ],
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '18:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ],
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '18:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ],
            [
                'usuario_num_doc' => '123',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '20:00:00',
                'nombres' => 'Juan Pérez',
                'nombreRol' => 'Empleado'
            ]
        ];

        $this->dbServiceMock->expects($this->at(0))
            ->method('ejecutarConsulta')
            ->willReturn($jornadas);

        $this->dbServiceMock->expects($this->at(1))
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT horasExtra FROM horaextra'),
                $this->arrayHasKey(':num_doc')
            )
            ->willReturn(['horasExtra' => 1]);

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->with(
                $this->stringContains('UPDATE horaextra'),
                $this->callback(function ($params) {
                    return $params[':num_doc'] === '123' && $params[':horasExtra'] === '02:00:00';
                })
            );

        $result = $this->calculo->calcularHorasExtra();

        $this->assertNotEmpty($result);
        $this->assertEquals('123', $result[0]['num_doc']);
        $this->assertEquals('Juan Pérez', $result[0]['nombres']);
        $this->assertEquals('Empleado', $result[0]['nombreRol']);
        $this->assertEquals(2, $result[0]['horasExtra']);
    }

    public function testCalcularHorasExtraInsertaNuevoRegistroCuandoNoExiste(): void {
        $jornadas = [
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana Gómez',
                'nombreRol' => 'Supervisor'
            ],
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana Gómez',
                'nombreRol' => 'Supervisor'
            ],
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana Gómez',
                'nombreRol' => 'Supervisor'
            ],
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana Gómez',
                'nombreRol' => 'Supervisor'
            ],
            [
                'usuario_num_doc' => '456',
                'horaEntrada' => '08:00:00',
                'horaSalida' => '19:00:00',
                'nombres' => 'Ana Gómez',
                'nombreRol' => 'Supervisor'
            ]
        ];

        $this->dbServiceMock->expects($this->at(0))
            ->method('ejecutarConsulta')
            ->willReturn($jornadas);

        $this->dbServiceMock->expects($this->at(1))
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT horasExtra FROM horaextra'),
                $this->arrayHasKey(':num_doc')
            )
            ->willReturn(false);

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarInsert')
            ->with(
                $this->stringContains('INSERT INTO horaextra'),
                $this->callback(function ($params) {
                    return $params[':num_doc'] === '456' && $params[':horasExtra'] === '03:00:00';
                })
            );

        $result = $this->calculo->calcularHorasExtra();

        $this->assertNotEmpty($result);
        $this->assertEquals('456', $result[0]['num_doc']);
        $this->assertEquals('Ana Gómez', $result[0]['nombres']);
        $this->assertEquals('Supervisor', $result[0]['nombreRol']);
        $this->assertEquals(3, $result[0]['horasExtra']);
    }
}
