<?php
use PHPUnit\Framework\TestCase;
use Model\Notificacion;
use Service\DatabaseService;
use PHPUnit\Framework\MockObject\MockObject;

class NotificacionModelTest extends TestCase {
    /** @var MockObject|DatabaseService */
    private $dbService;

    /** @var Notificacion */
    private $notificacion;

    protected function setUp(): void {
        // Mock DatabaseService
        $this->dbService = $this->createMock(DatabaseService::class);
        // Instanciar la clase Notificacion con el DatabaseService simulado
        $this->notificacion = new Notificacion($this->dbService);
    }

    // Test para el método obtenerTodasLasNotificaciones
    public function testObtenerTodasLasNotificaciones() {
        // Arrange
        $expectedResult = [
            ['idNotificacion' => 1, 'descripcionNotificacion' => 'Notificacion 1'],
            ['idNotificacion' => 2, 'descripcionNotificacion' => 'Notificacion 2']
        ];

        // Configurar el mock para devolver el resultado esperado
        $this->dbService->method('ejecutarConsulta')
                        ->with($this->equalTo('SELECT * FROM notificacion'))
                        ->willReturn($expectedResult);

        // Act
        $result = $this->notificacion->obtenerTodasLasNotificaciones();

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    // Test para el método obtenerNotificaciones
    public function testObtenerNotificaciones() {
        // Arrange
        $num_doc = 123;
        $expectedResult = [
            ['idNotificacion' => 1, 'descripcionNotificacion' => 'Notificacion 1']
        ];

        // Configurar el mock para devolver el resultado esperado
        $this->dbService->method('ejecutarConsulta')
                        ->with(
                            $this->equalTo('SELECT * FROM notificacion WHERE num_doc = :num_doc'),
                            $this->equalTo([':num_doc' => $num_doc])
                        )
                        ->willReturn($expectedResult);

        // Act
        $result = $this->notificacion->obtenerNotificaciones($num_doc);

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    // Test para el método obtenerNotificacionesAspirante
    public function testObtenerNotificacionesAspirante() {
        // Arrange
        $num_doc = 123;
        $expectedResult = [
            ['idNotificacion' => 1, 'descripcionNotificacion' => 'Notificacion de aspirante']
        ];

        // Configurar el mock para devolver el resultado esperado
        $this->dbService->method('ejecutarConsulta')
                        ->with(
                            $this->equalTo('SELECT * FROM notificacion WHERE num_doc = :num_doc AND (tipo = \'PostulacionAspirantes\' OR tipo = \'entrevista\')'),
                            $this->equalTo([':num_doc' => $num_doc])
                        )
                        ->willReturn($expectedResult);

        // Act
        $result = $this->notificacion->obtenerNotificacionesAspirante($num_doc);

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    // Test para el método notificacionAceptada
    public function testNotificacionAceptada() {
        // Arrange
        $idausencia = 1;

        // Configurar el mock para simular la actualización y consulta
        $this->dbService->method('ejecutarAccion')
                        ->willReturn(true); // Suponemos que la actualización fue exitosa
        $this->dbService->method('ejecutarConsulta')
                        ->willReturn(['usuario_num_doc' => 123]); // Simulamos que se devuelve un num_doc

        // Configurar el mock para simular la inserción de la notificación
        $this->dbService->method('ejecutarInsert')
                        ->willReturn(1); // Suponemos que la inserción fue exitosa

        // Act
        $result = $this->notificacion->notificacionAceptada($idausencia);

        // Assert
        $this->assertTrue($result);
    }

    // Test para el método notificacionRechazada
    public function testNotificacionRechazada() {
        // Arrange
        $idausencia = 2;

        // Configurar el mock para simular la actualización y consulta
        $this->dbService->method('ejecutarAccion')
                        ->willReturn(true); // Suponemos que la actualización fue exitosa
        $this->dbService->method('ejecutarConsulta')
                        ->willReturn(['usuario_num_doc' => 456]); // Simulamos que se devuelve un num_doc

        // Configurar el mock para simular la inserción de la notificación
        $this->dbService->method('ejecutarInsert')
                        ->willReturn(2); // Suponemos que la inserción fue exitosa

        // Act
        $result = $this->notificacion->notificacionRechazada($idausencia);

        // Assert
        $this->assertTrue($result);
    }
}
