<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\Perfil;
use Service\DatabaseService;

class PerfilModelTest extends TestCase
{
    private $mockDbService;
    private $perfil;

    protected function setUp(): void
    {
        // Crear el mock de la clase DatabaseService
        $this->mockDbService = $this->createMock(DatabaseService::class);
        $this->perfil = new Perfil($this->mockDbService);
    }

    public function testDatosPerfil()
    {
        // Datos de prueba para el perfil
        $numDoc = 12345;
        $fakeUserData = [
            'num_doc' => 12345,
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC',
            'idHojadevida' => 1
        ];
        $fakeHojadevidaData = [
            'idHojadevida' => 1,
            'experiencia' => '5 años de experiencia',
            'formacion' => 'Ingeniero de Sistemas'
        ];
        
        // Simular la respuesta de la consulta para el perfil
        $fakeResult = array_merge($fakeUserData, $fakeHojadevidaData);

        // Simular que la consulta devuelve el perfil combinado
        $this->mockDbService->method('ejecutarConsulta')
            ->with(
                "SELECT * FROM usuario as u
                INNER JOIN hojadevida as h ON u.hojadevida_idHojadevida = h.idHojadevida 
                WHERE num_doc = :num_doc", 
                [':num_doc' => $numDoc],
                true
            )
            ->willReturn($fakeResult);

        // Llamar al método a probar
        $result = $this->perfil->datosPerfil($numDoc);

        // Verificar que el resultado es el esperado
        $this->assertEquals($fakeResult, $result);
    }

    public function testActualizarPerfilSuccess()
    {
        // Datos de prueba para actualizar el perfil
        $numDoc = 12345;
        $data = [
            'nombres' => 'Juan Carlos',
            'apellidos' => 'Pérez García',
            'email' => 'juan.carlos.perez@example.com',
            'tipodDoc' => 'CC'
        ];

        // Simular que la consulta de actualización fue exitosa
        $this->mockDbService->method('ejecutarAccion')
            ->with(
                "UPDATE usuario SET nombres = ?, apellidos = ?, email = ?, tipodDoc = ? WHERE num_doc = ?",
                [
                    $data['nombres'],
                    $data['apellidos'],
                    $data['email'],
                    $data['tipodDoc'],
                    $numDoc
                ]
            )
            ->willReturn(true);

        // Llamar al método a probar
        $result = $this->perfil->actualizarPerfil($numDoc, $data);

        // Verificar que la actualización fue exitosa
        $this->assertTrue($result);
    }

    public function testActualizarPerfilFailure()
    {
        // Datos de prueba para actualizar el perfil
        $numDoc = 12345;
        $data = [
            'nombres' => 'Juan Carlos',
            'apellidos' => 'Pérez García',
            'email' => 'juan.carlos.perez@example.com',
            'tipodDoc' => 'CC'
        ];

        // Simular que la consulta de actualización falla
        $this->mockDbService->method('ejecutarAccion')
            ->with(
                "UPDATE usuario SET nombres = ?, apellidos = ?, email = ?, tipodDoc = ? WHERE num_doc = ?",
                [
                    $data['nombres'],
                    $data['apellidos'],
                    $data['email'],
                    $data['tipodDoc'],
                    $numDoc
                ]
            )
            ->willReturn(false);

        // Llamar al método a probar
        $result = $this->perfil->actualizarPerfil($numDoc, $data);

        // Verificar que la actualización falló
        $this->assertFalse($result);
    }
}
