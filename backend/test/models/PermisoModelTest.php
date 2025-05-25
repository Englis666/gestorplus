<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\Permiso;
use Service\DatabaseService;

class PermisoModelTest extends TestCase
{
    private $mockDbService;
    private $permiso;

    protected function setUp(): void
    {
        $this->mockDbService = $this->createMock(DatabaseService::class);
        $this->permiso = new Permiso($this->mockDbService);
    }

    public function testObtenerTodosLosPermisos()
    {
        $fakeData = [
            ['idPermisos' => 1, 'usuario_num_doc' => 12345, 'tipo' => 'Vacaciones', 'estado' => 'Pendiente'],
            ['idPermisos' => 2, 'usuario_num_doc' => 67890, 'tipo' => 'Enfermedad', 'estado' => 'Pendiente']
        ];

        $this->mockDbService->method('ejecutarConsulta')->willReturn($fakeData);
        $result = $this->permiso->obtenerTodosLosPermisos();
        $this->assertEquals($fakeData, $result);
    }

    public function testObtenerPermisos()
    {
        $numDoc = 12345;
        $fakeData = [
            ['idPermisos' => 1, 'usuario_num_doc' => 12345, 'tipo' => 'Vacaciones', 'estado' => 'Pendiente']
        ];

        $this->mockDbService->method('ejecutarConsulta')->willReturn($fakeData);
        $result = $this->permiso->obtenerPermisos($numDoc);
        $this->assertEquals($fakeData, $result);
    }

    public function testObtenerPermisosConExcepcionDevuelveArrayVacio(){
        $dbServiceMock = $this->createMock(DatabaseService::class);
        $dbServiceMock->method('ejecutarConsulta')
            ->willThrowException(new \Exception("Error de prueba"));

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Error de prueba");

        $permiso = new Permiso($dbServiceMock);
        $permiso->obtenerPermisos('123456');

    }
    

    public function testSolicitarPermisoSuccess()
    {
        $numDoc = 12345;
        $data = [
            'tipo' => 'Vacaciones',
            'fechaInicio' => '2025-06-01',
            'fechaFin' => '2025-06-10'
        ];

        $this->mockDbService->method('ejecutarInsert')->willReturn(1);
        $this->mockDbService->method('iniciarTransaccion');
        $this->mockDbService->method('confirmarTransaccion');

        $result = $this->permiso->solicitarPermiso($numDoc, $data);
        $this->assertTrue($result);
    }

    public function testSolicitarPermisoFailure()
    {
        $numDoc = 12345;
        $data = [
            'tipo' => 'Vacaciones',
            'fechaInicio' => '2025-06-01',
            'fechaFin' => '2025-06-10'
        ];

        $this->mockDbService->method('ejecutarInsert')->willReturn(null);
        $result = $this->permiso->solicitarPermiso($numDoc, $data);
        $this->assertFalse($result);
    }

    public function testGestionarPermiso()
    {
        $idPermisos = [1, 2];
        $estadoPermiso = 'Aceptada';
        $descripcionNotificacion = 'Tu permiso ha sido aprobado para las fechas {fechaInicio} hasta {fechaFin}';

        $this->mockDbService->method('ejecutarAccion')->willReturn(true);
        $this->mockDbService->method('ejecutarInsert')->willReturn(null);
        $this->mockDbService->method('ejecutarConsulta')->willReturn([
            'fechaInicio' => '2025-06-01',
            'fechaFin' => '2025-06-10',
            'usuario_num_doc' => 12345
        ]);

        $this->permiso->permisoAceptado($idPermisos);
        $this->assertTrue(true);
    }

    public function testPermisoRechazado()
    {
        $idPermisos = [1];
        $descripcionNotificacion = 'Tu permiso ha sido rechazado para las fechas {fechaInicio} hasta {fechaFin}';

        $this->mockDbService->method('ejecutarAccion')->willReturn(true);
        $this->mockDbService->method('ejecutarInsert')->willReturn(null);
        $this->mockDbService->method('ejecutarConsulta')->willReturn([
            'fechaInicio' => '2025-06-01',
            'fechaFin' => '2025-06-10',
            'usuario_num_doc' => 12345
        ]);

        $this->permiso->permisoRechazado($idPermisos);
        $this->assertTrue(true);
    }
}
