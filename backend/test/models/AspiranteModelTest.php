<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Model;

use PHPUnit\Framework\TestCase;
use Model\Aspirante;
use Service\DatabaseService;
use PDOException;

final class AspiranteModelTest extends TestCase
{
    private $dbMock;
    private Aspirante $aspirante;

    protected function setUp(): void
    {
        $this->dbMock = $this->createMock(DatabaseService::class);
        $this->aspirante = new Aspirante($this->dbMock);
    }

    public function testObtenerDetalleConvocatoriaDevuelveResultado(): void
    {
        $expected = ['idconvocatoria' => 1, 'titulo' => 'Convocatoria 1'];

        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT * FROM convocatoria'),
                [':idconvocatoria' => 1],
                true
            )
            ->willReturn($expected);

        $result = $this->aspirante->obtenerDetalleConvocatoria(1);
        $this->assertSame($expected, $result);
    }

    public function testObtenerDetalleConvocatoriaDevuelveNullCuandoFalla(): void
    {
        $this->dbMock->method('ejecutarConsulta')
            ->willThrowException(new PDOException("Error"));

        $this->expectOutputRegex('/Error en la consulta/');
        $result = $this->aspirante->obtenerDetalleConvocatoria(999);
        $this->assertNull($result);
    }

    public function testObtenerNotificacionesAspiranteDevuelveCorrecto(): void
    {
        $expected = [['descripcionNotificacion' => 'Has aplicado a una convocatoria']];
        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT * FROM notificacion'),
                [':num_doc' => 123]
            )
            ->willReturn($expected);

        $res = $this->aspirante->obtenerNotificacionesAspirante(123);
        $this->assertSame($expected, $res);
    }

    public function testVerificarPostulacionRetornaCorrecto(): void
    {
        $expected = ['usuario_num_doc' => 1, 'convocatoria_idconvocatoria' => 1];

        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT * FROM postulacion'),
                [':num_doc' => 1, ':idconvocatoria' => 1],
                true
            )
            ->willReturn($expected);

        $res = $this->aspirante->verificarPostulacion(1, 1);
        $this->assertSame($expected, $res);
    }

    public function testAplicacionDeAspiranteInsertaCorrectamente(): void
    {
        $this->dbMock->expects($this->exactly(3))
            ->method('ejecutarInsert')
            ->willReturn(1);

        $res = $this->aspirante->aplicacionDeAspirante(5, 10);
        $this->assertTrue($res);
    }

    public function testAplicacionDeAspiranteFallaEnPrimerInsert(): void
    {
        $this->dbMock->expects($this->once())
            ->method('ejecutarInsert')
            ->willReturn(null);

        $this->expectOutputRegex('/Error al insertar la aplicaci/');
        $res = $this->aspirante->aplicacionDeAspirante(5, 10);
        $this->assertFalse($res);
    }

    public function testAplicacionDeAspiranteFallaEnNotificacion(): void
    {
        $this->dbMock->expects($this->exactly(2))
            ->method('ejecutarInsert')
            ->willReturnOnConsecutiveCalls(1, null);
    
        // Buscamos sólo la parte inicial, sin el caracter acentuado
        $this->expectOutputRegex('/Error en la consulta: Error al insertar la notificaci/');
        $res = $this->aspirante->aplicacionDeAspirante(5, 10);
        $this->assertFalse($res);
    }
    
}
