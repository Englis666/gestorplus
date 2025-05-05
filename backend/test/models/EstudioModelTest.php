<?php

declare(strict_types=1);

use Model\Estudio;
use Service\DatabaseService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class EstudioModelTest extends TestCase
{
    private MockObject $dbServiceMock;
    private Estudio $estudio;

    protected function setUp(): void
    {
        // Crear un mock de DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->estudio = new Estudio($this->dbServiceMock);
    }

    // Test para obtener un estudio
    public function testObtenerEstudio(): void
    {
        $idhojadevida = 1;

        // Configurar el mock para devolver un resultado simulado
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn([
                'nivelEstudio' => 'Licenciatura',
                'areaEstudio' => 'Ingeniería',
                'estadoEstudio' => 'En curso',
                'fechaInicioEstudio' => '2020-01-01',
                'fechaFinEstudio' => '2023-01-01',
                'tituloEstudio' => 'Licenciatura en Ingeniería',
                'institucionEstudio' => 'Universidad Nacional',
                'ubicacionEstudio' => 'Ciudad',
                'modalidad' => 'Presencial',
                'paisInstitucion' => 'Colombia',
                'duracionEstudio' => '3 años',
                'materiasDestacadas' => 'Matemáticas, Física'
            ]);

        $result = $this->estudio->obtenerEstudio($idhojadevida);

        $this->assertIsArray($result);
        $this->assertEquals('Licenciatura', $result['nivelEstudio']);
        $this->assertEquals('Ingeniería', $result['areaEstudio']);
    }

    // Test para agregar un nuevo estudio
    public function testAgregarEstudio(): void
    {
        $data = [
            'nivelEstudio' => 'Licenciatura',
            'areaEstudio' => 'Ingeniería',
            'estadoEstudio' => 'Finalizado',
            'fechaInicioEstudio' => '2018-01-01',
            'fechaFinEstudio' => '2022-01-01',
            'tituloEstudio' => 'Licenciatura en Ingeniería',
            'institucionEstudio' => 'Universidad XYZ',
            'ubicacionEstudio' => 'Ciudad',
            'modalidad' => 'Presencial',
            'paisInstitucion' => 'Colombia',
            'duracionEstudio' => '4 años',
            'materiasDestacadas' => 'Cálculo, Programación'
        ];

        $hojadevida_idHojadevida = 1;

        // Configurar el mock para simular una inserción exitosa
        $this->dbServiceMock
            ->method('getConnection')
            ->willReturn($this->createMock(PDO::class));

        // Suponemos que el método execute devuelve true cuando se realiza correctamente
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn(true);

        $result = $this->estudio->agregarEstudio($data, $hojadevida_idHojadevida);

        $this->assertTrue($result);
    }

    // Test para actualizar un estudio
    public function testActualizarEstudio(): void
    {
        $data = [
            'nivelEstudio' => 'Maestría',
            'areaEstudio' => 'Ciencias de la Computación',
            'estadoEstudio' => 'En curso',
            'fechaInicioEstudio' => '2023-01-01',
            'fechaFinEstudio' => '2025-01-01',
            'tituloEstudio' => 'Maestría en Ciencias de la Computación',
            'institucionEstudio' => 'Universidad ABC',
            'ubicacionEstudio' => 'Ciudad',
            'idestudio' => 1
        ];

        // Configurar el mock para simular una actualización exitosa
        $this->dbServiceMock
            ->method('getConnection')
            ->willReturn($this->createMock(PDO::class));

        // Suponemos que el método execute devuelve true cuando se realiza correctamente
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn(true);

        $result = $this->estudio->actualizarEstudio($data);

        $this->assertTrue($result);
    }

    // Test para eliminar un estudio
    public function testEliminarEstudio(): void
    {
        $idestudio = 1;

        // Configurar el mock para simular una eliminación exitosa
        $this->dbServiceMock
            ->method('getConnection')
            ->willReturn($this->createMock(PDO::class));

        // Suponemos que el método execute devuelve true cuando se realiza correctamente
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willReturn(true);

        $result = $this->estudio->eliminarEstudio($idestudio);

        $this->assertTrue($result);
    }

    // Test para manejar errores en la base de datos
    public function testManejarErrorAgregarEstudio(): void
    {
        $data = [
            'nivelEstudio' => 'Licenciatura',
            'areaEstudio' => 'Ingeniería',
            'estadoEstudio' => 'Finalizado',
            'fechaInicioEstudio' => '2018-01-01',
            'fechaFinEstudio' => '2022-01-01',
            'tituloEstudio' => 'Licenciatura en Ingeniería',
            'institucionEstudio' => 'Universidad XYZ',
            'ubicacionEstudio' => 'Ciudad',
            'modalidad' => 'Presencial',
            'paisInstitucion' => 'Colombia',
            'duracionEstudio' => '4 años',
            'materiasDestacadas' => 'Cálculo, Programación'
        ];

        $hojadevida_idHojadevida = 1;

        // Simular un error en la consulta
        $this->dbServiceMock
            ->method('ejecutarConsulta')
            ->willThrowException(new PDOException('Error de base de datos'));

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Error al agregar estudio: Error de base de datos');

        $this->estudio->agregarEstudio($data, $hojadevida_idHojadevida);
    }
}
