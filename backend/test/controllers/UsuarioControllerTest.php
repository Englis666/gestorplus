<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Test\Controller;

use Controller\UsuarioController;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Model\Usuario;
use Service\JsonResponseService;

class UsuarioControllerTest extends TestCase
{
    /** @var MockObject|Usuario */
    private $usuarioMock;

    /** @var MockObject|JsonResponseService */
    private $jsonResponseServiceMock;

    /** @var UsuarioControlador */
    private $ctrl;

    protected function setUp(): void
    {
        $this->usuarioMock = $this->createMock(Usuario::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->ctrl = $this->getMockBuilder(UsuarioController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        $reflection = new \ReflectionClass(UsuarioController::class);

        // Inyecta los mocks
        $usuarioProperty = $reflection->getProperty('usuario');
        $usuarioProperty->setAccessible(true);
        $usuarioProperty->setValue($this->ctrl, $this->usuarioMock);

        $jsonResponseServiceProperty = $reflection->getProperty('jsonResponseService');
        $jsonResponseServiceProperty->setAccessible(true);
        $jsonResponseServiceProperty->setValue($this->ctrl, $this->jsonResponseServiceMock);
    }

    public function testObtenerRRHHConDatos(): void
    {
        $data = [['id'=>1, 'nombre'=>'Juan', 'apellido'=>'Perez']];
        
        // Configuramos el mock de obtenerRRHH
        $this->usuarioMock
             ->expects($this->once())
             ->method('obtenerRRHH')
             ->willReturn($data);

        // Configuramos el mock de responder
        $this->jsonResponseServiceMock
             ->expects($this->once())
             ->method('responder')
             ->with(
                 $this->callback(function ($response) use ($data) {
                     return isset($response['status']) && $response['status'] === 'success' &&
                            isset($response['RRHH']) && $response['RRHH'] === $data;
                 })
             );

        // Ejecutamos el método
        $this->ctrl->obtenerRRHH();
    }

    public function testObtenerRRHHSinDatos(): void
    {
        // Configuramos el mock de obtenerRRHH sin datos
        $this->usuarioMock
             ->expects($this->once())
             ->method('obtenerRRHH')
             ->willReturn([]);

        // Configuramos el mock de responder
        $this->jsonResponseServiceMock
             ->expects($this->once())
             ->method('responder')
             ->with(
                 $this->callback(function ($response) {
                     return isset($response['status']) && $response['status'] === 'success' &&
                            isset($response['RRHH']) && $response['RRHH'] === [];
                 })
             );

        // Ejecutamos el método
        $this->ctrl->obtenerRRHH();
    }

    public function testObtenerUsuariosConDatos(): void
    {
        $data = [['id'=>1014736, 'nombre'=>'Englis', 'apellido'=>'Barros']];

        // Configuramos el mock de obtenerUsuarios con datos
        $this->usuarioMock
             ->expects($this->once())
             ->method('obtenerUsuarios')
             ->willReturn($data);

        // Configuramos el mock de responder
        $this->jsonResponseServiceMock
             ->expects($this->once())
             ->method('responder')
             ->with(
                 $this->callback(function ($response) use ($data) {
                     return isset($response['status']) && $response['status'] === 'success' &&
                            isset($response['message']) && $response['message'] === 'Usuarios obtenidos correctamente' &&
                            isset($response['RRHH']) && $response['RRHH'] === $data;
                 })
             );

        // Ejecutamos el método
        $this->ctrl->obtenerUsuarios();
    }

    public function testObtenerUsuariosSinDatos(): void
    {
        // Configuramos el mock de obtenerUsuarios sin datos
        $this->usuarioMock
             ->expects($this->once())
             ->method('obtenerUsuarios')
             ->willReturn([]);

        // Configuramos el mock de responder
        $this->jsonResponseServiceMock
             ->expects($this->once())
             ->method('responder')
             ->with(
                 $this->callback(function ($response) {
                     return isset($response['status']) && $response['status'] === 'success' &&
                            isset($response['message']) && $response['message'] === 'Usuarios obtenidos correctamente' &&
                            isset($response['RRHH']) && $response['RRHH'] === [];
                 })
             );

        // Ejecutamos el método
        $this->ctrl->obtenerUsuarios();
    }
}
