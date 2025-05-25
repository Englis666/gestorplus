<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

use PHPUnit\Framework\TestCase;
use Model\Publicaciones;
use Service\DatabaseService;
use PHPUnit\Framework\MockObject\MockObject;

class PublicacionModelTest extends TestCase {
    /** @var MockObject|DatabaseService */
    private $dbService;

    /** @var Publicaciones */
    private $publicaciones;

    protected function setUp(): void {
        $this->dbService = $this->createMock(DatabaseService::class);
        $this->publicaciones = new Publicaciones($this->dbService);
    }

    public function testObtenerPublicacionPorTipoDeContrato() {
        $num_doc = 123;
        $expected = [
            ['idPublicacion' => 1, 'titulo' => 'Publication 1', 'estado' => 'activo'],
            ['idPublicacion' => 2, 'titulo' => 'Publication 2', 'estado' => 'activo'],
        ];

        $this->dbService->method('ejecutarConsulta')->willReturn($expected);

        $result = $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc);
        $this->assertEquals($expected, $result);
    }

    public function testAgregarPublicacion() {
        $data = [
            'titulo' => 'New Publication',
            'descripcion' => 'Description of the new publication',
            'imagen' => 'image.jpg',
            'fechaPublicacion' => '2025-05-04',
            'tipo_contrato' => 'full-time',
            'estado' => 'activo',
        ];
        $num_doc = 123;

        $this->dbService->method('ejecutarAccion')->willReturn(true);

        $this->assertTrue($this->publicaciones->agregarPublicacion($data, $num_doc));
    }

    public function testActualizarPublicacion() {
        $data = [
            'idPublicacion' => 1,
            'titulo' => 'Updated Title',
            'descripcion' => 'Updated Description',
            'imagen' => 'updated_image.jpg',
            'fechaPublicacion' => '2025-05-05',
            'tipo_contrato' => 'part-time',
            'estado' => 'activo',
        ];

        $this->dbService->method('ejecutarAccion')->willReturn(true);

        $this->assertTrue($this->publicaciones->actualizarPublicacion($data));
    }

    public function testEliminarPublicacion() {
        $id = 1;

        $this->dbService->method('ejecutarAccion')->willReturn(true);

        $this->assertTrue($this->publicaciones->eliminarPublicacion($id));
    }
}
