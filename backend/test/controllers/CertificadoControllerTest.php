<?php

use PHPUnit\Framework\TestCase;
use Controller\CertificadoController;
use Model\Certificado;
use Service\TokenService;
use Service\JsonResponseService;

class CertificadoControllerTest extends TestCase
{
    private $controller;
    private $certificadoMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;

    protected function setUp(): void
    {
        // Instanciar mocks
        $this->certificadoMock = $this->createMock(Certificado::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crear instancia real del controlador
        $this->controller = new CertificadoController();

        // Inyectar mocks usando Reflection
        $reflection = new ReflectionClass($this->controller);

        $certificadoProp = $reflection->getProperty('certificado');
        $certificadoProp->setAccessible(true);
        $certificadoProp->setValue($this->controller, $this->certificadoMock);

        $tokenServiceProp = $reflection->getProperty('tokenService');
        $tokenServiceProp->setAccessible(true);
        $tokenServiceProp->setValue($this->controller, $this->tokenServiceMock);

        $jsonServiceProp = $reflection->getProperty('jsonResponseService');
        $jsonServiceProp->setAccessible(true);
        $jsonServiceProp->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerDatosParaCertificadoExitoso()
    {
        $numDoc = '123456';
        $datosCertificado = ['nombre' => 'Ana', 'curso' => 'PHP'];

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn($numDoc);

        $this->certificadoMock->expects($this->once())
            ->method('obtenerDatosParaCertificado')
            ->with($numDoc)
            ->willReturn($datosCertificado);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['Certificado' => $datosCertificado]);

        $this->controller->obtenerDatosParaCertificado();
    }

    public function testObtenerDatosParaCertificadoFalla()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willThrowException(new Exception('Token inválido', 401));

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('Token inválido', 401);

        $this->controller->obtenerDatosParaCertificado();
    }
}
