<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\EntrevistaController;
use Model\Entrevista;
use Service\JsonResponseService;
use PHPUnit\Framework\MockObject\MockObject;

class EntrevistaControllerTest extends TestCase
{
    private EntrevistaController $controller;
    private MockObject $mockEntrevista;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Crear mocks
        $this->mockEntrevista = $this->createMock(Entrevista::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Crear un mock parcial del controlador para stubear parametrosRequeridos y getIntParam
        $this->controller = $this->getMockBuilder(EntrevistaController::class)
                                 ->onlyMethods(['parametrosRequeridos', 'getIntParam'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyectar mocks en propiedades privadas usando reflection
        $ref = new \ReflectionClass(EntrevistaController::class);

        // Inyectar "entrevista"
        $prop = $ref->getProperty('entrevista');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockEntrevista);

        // Inyectar "jsonResponseService" (propiedad de BaseController)
        $baseRef = $ref->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testResponderUsesJsonService(): void
    {
        $data = ['foo' => 'bar'];
        $httpCode = 201;

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with($data, $httpCode);

        $this->controller->responder($data, $httpCode);
    }

    public function testAsignarEntrevistaMissingParams(): void
    {
        $data = [];
        $this->controller
            ->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['fecha', 'hora', 'lugarMedio'])
            ->willReturn(false);

        // No debe llamar a asignarEntrevista ni responder
        $this->mockEntrevista
            ->expects($this->never())
            ->method('asignarEntrevista');
        $this->mockJsonResponseService
            ->expects($this->never())
            ->method('responder');

        $this->controller->asignarEntrevista($data);
    }

    public function testAsignarEntrevistaSuccess(): void
{
    $data = ['fecha' => '2025-05-01', 'hora' => '10:00', 'lugarMedio' => 'Online'];
    $resultado = true; // Cambiar el resultado a un booleano

    $this->controller
        ->expects($this->once())
        ->method('parametrosRequeridos')
        ->with($data, ['fecha', 'hora', 'lugarMedio'])
        ->willReturn(true);

    $this->mockEntrevista
        ->expects($this->once())
        ->method('asignarEntrevista')
        ->with($data)
        ->willReturn($resultado); // Retorna true en lugar de un array

    $this->mockJsonResponseService
        ->expects($this->once())
        ->method('responder')
        ->with(['Entrevista' => $resultado]);

    $this->controller->asignarEntrevista($data);
}

    public function testObtenerEntrevistas(): void
    {
        $lista = [ ['id'=>1], ['id'=>2] ];
        $this->mockEntrevista
            ->expects($this->once())
            ->method('obtenerEntrevistas')
            ->willReturn($lista);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Entrevista' => $lista]);

        $this->controller->obtenerEntrevistas();
    }

    public function testObtenerDatosDelEntrevistadoWithParam(): void
    {
        $entrevistado = ['num_doc'=>'123'];
        $_GET['num_doc'] = '123';

        $this->mockEntrevista
            ->expects($this->once())
            ->method('obtenerDatosDelEntrevistado')
            ->with('123')
            ->willReturn($entrevistado);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Entrevistado' => $entrevistado]);

        $this->controller->obtenerDatosDelEntrevistado(null);
    }

    public function testObtenerDatosDelEntrevistadoNotFound(): void
    {
        $_GET['num_doc'] = '999';
        $this->mockEntrevista
            ->expects($this->once())
            ->method('obtenerDatosDelEntrevistado')
            ->with('999')
            ->willReturn(null);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Entrevistado' => ['error' => 'No se encontraron datos para el documento proporcionado']]);

        $this->controller->obtenerDatosDelEntrevistado(null);
    }

    public function testAsistenciaConfirmada(): void{
        $data = ['identrevista' => '5'];

        $this->controller
            ->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['identrevista'])
            ->willReturn(true);

        $this->controller
            ->expects($this->once())
            ->method('getIntParam')
            ->with($data, 'identrevista')
            ->willReturn(5); 

        $this->mockEntrevista
            ->expects($this->once())
            ->method('asistenciaConfirmada')
            ->with(5);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['AsistenciaConfirmada' => null]);

        $this->controller->asistenciaConfirmada($data);
    }

    public function testAsistenciaNoConfirmada(): void{
        $data = ['identrevista' => '5'];

        $this->controller
            ->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data,['identrevista'])
            ->willReturn(true);
        $this->controller
             ->expects($this->once())
             ->method('getIntParam')
             ->with($data, 'identrevista')
            ->willReturn(5);
        $this->mockEntrevista
             ->expects($this->once())
            ->method('asistenciaNoConfirmada')
            ->with(5);
        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['AsistenciaNoConfirmada' => null]);
        $this->controller->asistenciaNoConfirmada($data);
    } 
   
    
}
