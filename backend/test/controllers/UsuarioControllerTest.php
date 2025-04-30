<?php
namespace Test\Controlador;

use Controlador\UsuarioControlador;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Modelo\Usuario;
use Servicio\JsonResponseService;

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
        // Creamos el mock para Usuario
        $this->usuarioMock = $this->createMock(Usuario::class);

        // Creamos el mock para JsonResponseService
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Creamos la instancia del controlador pasando los mocks
        $this->ctrl = new UsuarioControlador();
        $reflection = new \ReflectionClass(UsuarioControlador::class);

        // Inyectamos el mock de Usuario en el controlador
        $usuarioProperty = $reflection->getProperty('usuario');
        $usuarioProperty->setAccessible(true);
        $usuarioProperty->setValue($this->ctrl, $this->usuarioMock);

        // Inyectamos el mock de JsonResponseService
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