<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Model;

use PHPUnit\Framework\TestCase;
use Model\Entrevista;
use Service\DatabaseService;
use PHPUnit\Framework\MockObject\MockObject;
use PDOException;

class EntrevistaModelTest extends TestCase
{
    private DatabaseService|MockObject $dbServiceMock;
    private Entrevista $entrevista;

    protected function setUp(): void
    {
        // Creamos un mock del DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        // Inyectamos el mock en nuestro modelo
        $this->entrevista = new Entrevista($this->dbServiceMock);
    }

    public function testObtenerEntrevistas(): void
    {
        // Simulamos que la consulta devuelve un array de entrevistas
        $fake = [
            ['identrevista' => 1, 'estadoEntrevista' => 'Pendiente'],
            ['identrevista' => 2, 'estadoEntrevista' => 'Confirmada'],
        ];
        $this->dbServiceMock
             ->method('ejecutarConsulta')
             ->willReturn($fake);

        $result = $this->entrevista->obtenerEntrevistas();
        $this->assertSame($fake, $result);
    }

    public function testObtenerDatosDelEntrevistado(): void
    {
        $numDoc = '12345';

        // Simulamos tres llamadas: datos, estudios y experiencias
        $datos       = [['idHojadevida' => 99, 'foo' => 'bar']];
        $estudios    = [['titulo' => 'X']];
        $experiencias= [['empresa' => 'Y']];

        $this->dbServiceMock
             ->method('ejecutarConsulta')
             ->willReturnOnConsecutiveCalls(
                 $datos,
                 $estudios,
                 $experiencias
             );

        $result = $this->entrevista->obtenerDatosDelEntrevistado($numDoc);

        // Esperamos el primer registro enriquecido
        $expected = array_merge(
            $datos[0],
            ['estudios' => $estudios, 'experiencias' => $experiencias]
        );
        $this->assertEquals($expected, $result);
    }

    public function testAsignarEntrevista(): void
    {
        $data = [
            'fecha'                       => '2025-01-01',
            'hora'                        => '09:00',
            'lugarMedio'                  => 'Sala',
            'postulacion_idpostulaciones' => 5
        ];

        // Simulamos: insert → devuelve cualquier array o vacío, luego select usuario, luego insert noti
        $this->dbServiceMock
             ->method('ejecutarConsulta')
             ->willReturnOnConsecutiveCalls(
                 [],                                      // primer INSERT
                 [['usuario_num_doc' => 'ABC123']],      // SELECT usuario
                 []                                       // INSERT notificación
             );

        $this->assertTrue($this->entrevista->asignarEntrevista($data));
    }

    public function testAsistenciaConfirmada(): void
    {
        // Simulamos un resultado cualquiera
        $this->dbServiceMock
             ->method('ejecutarConsulta')
             ->willReturn([]);

        // No debe lanzar excepción
        $this->entrevista->asistenciaConfirmada(7);
        $this->assertTrue(true);
    }

    public function testAsistenciaNoConfirmada(): void
    {
        $this->dbServiceMock
             ->method('ejecutarConsulta')
             ->willReturn([]);

        $this->entrevista->asistenciaNoConfirmada(9);
        $this->assertTrue(true);
    }

   
    public function errorProvider(): array
    {
        return [
            ['obtenerEntrevistas',        [],                    'Error al obtener entrevistas'],
            ['obtenerDatosDelEntrevistado',['123'],               'Error al obtener los datos del entrevistado'],
            ['asignarEntrevista',         [['a'=>1,'hora'=>null]], 'Error al asignar entrevista'],
        ];
    }
}
