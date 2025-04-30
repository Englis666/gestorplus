<?php
use PHPUnit\Framework\TestCase;
use Controller\AuthController;
use Model\Auth;
use Service\JsonResponseService;

class AuthControllerTest extends TestCase
{
    // Test para el método registrar
    public function testRegistrar()
    {
        // Datos simulados para el registro de un usuario
        $datosSimulados = [
            'num_doc' => '7891011',
            'nombres' => 'Ana López',
            'password' => 'passwordSegura',
            'estado' => 1,
            'rol_idrol' => 4
        ];

        // Mock del modelo Auth
        $mockAuth = $this->createMock(Auth::class);
        $mockAuth->method('registrar')
            ->willReturn(true);  // Simulamos que el registro fue exitoso

        // Mock del servicio jsonResponseService
        $mockResponse = $this->getMockBuilder(JsonResponseService::class)
            ->onlyMethods(['responder'])
            ->getMock();

        // Esperamos que el mock de responder sea llamado una vez con los datos adecuados
        $mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'success'
                    && $response['message'] === true;  // Cambiado a true, que es lo que retorna el método registrar
            }));

        // Crear una instancia real del controlador
        $controller = new AuthController();

        // Reemplazamos la propiedad privada $auth y $jsonResponseService usando Reflection
        $reflected = new \ReflectionClass($controller);
        
        $propAuth = $reflected->getProperty('auth');
        $propAuth->setAccessible(true);
        $propAuth->setValue($controller, $mockAuth);

        $propResponse = $reflected->getProperty('jsonResponseService');
        $propResponse->setAccessible(true);
        $propResponse->setValue($controller, $mockResponse);

        // Ejecutamos el método registrar
        $controller->registrar($datosSimulados);
    }

    // Test para el método iniciar con credenciales correctas
    public function testIniciarConCredencialesCorrectas()
    {
        // Datos de prueba
        $datosLogin = [
            'num_doc' => '7891011',
            'password' => 'passwordSegura'
        ];

        // Usuario simulado
        $usuarioSimulado = [
            'num_doc' => '123456',
            'nombres' => 'Juan Pérez',
            'rol' => '4',
            'hojadevida_idHojadevida' => 10
        ];

        // Mock del modelo Auth
        $mockAuth = $this->createMock(Auth::class);
        $mockAuth->method('inicioSesion')
            ->willReturn($usuarioSimulado);

        // Mock del servicio jsonResponseService
        $mockResponse = $this->getMockBuilder(JsonResponseService::class)
            ->onlyMethods(['responder'])
            ->getMock();

        // Esperamos que el mock de responder sea llamado una vez con los datos adecuados
        $mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'success'
                    && $response['message'] === 'Credenciales correctas'
                    && isset($response['data']['token']);
            }));

        // Crear una instancia real del controlador
        $controller = new AuthController();

        // Reemplazamos la propiedad privada $auth y $jsonResponseService usando Reflection
        $reflected = new \ReflectionClass($controller);
        
        $propAuth = $reflected->getProperty('auth');
        $propAuth->setAccessible(true);
        $propAuth->setValue($controller, $mockAuth);

        $propResponse = $reflected->getProperty('jsonResponseService');
        $propResponse->setAccessible(true);
        $propResponse->setValue($controller, $mockResponse);

        // Ejecutamos el método iniciar
        $controller->iniciar($datosLogin);
    }

    // Test para el método iniciar con credenciales incorrectas
    public function testIniciarConCredencialesIncorrectas()
    {
        // Datos de prueba con credenciales incorrectas
        $datosLogin = [
            'num_doc' => '123456',
            'password' => 'passwordIncorrecta'
        ];

        // Mock del modelo Auth
        $mockAuth = $this->createMock(Auth::class);
        $mockAuth->method('inicioSesion')
            ->willReturn(null);  // Simulamos que las credenciales son incorrectas

        // Mock del servicio jsonResponseService
        $mockResponse = $this->getMockBuilder(JsonResponseService::class)
            ->onlyMethods(['responder'])
            ->getMock();

        // Esperamos que el mock de responder sea llamado con el mensaje de error adecuado
        $mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'error'
                    && $response['message'] === 'Credenciales incorrectas';
            }));

        // Crear una instancia real del controlador
        $controller = new AuthController();

        // Reemplazamos la propiedad privada $auth y $jsonResponseService usando Reflection
        $reflected = new \ReflectionClass($controller);
        
        $propAuth = $reflected->getProperty('auth');
        $propAuth->setAccessible(true);
        $propAuth->setValue($controller, $mockAuth);

        $propResponse = $reflected->getProperty('jsonResponseService');
        $propResponse->setAccessible(true);
        $propResponse->setValue($controller, $mockResponse);

        // Ejecutamos el método iniciar
        $controller->iniciar($datosLogin);
    }
}
