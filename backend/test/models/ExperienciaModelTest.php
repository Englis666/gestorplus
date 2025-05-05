<?php
use PHPUnit\Framework\TestCase;
use Model\Experiencia;
use Service\DatabaseService;

class ExperienciaModelTest extends TestCase
{
    private $dbServiceMock;
    private $experiencia;

    protected function setUp(): void
    {
        // Crear el mock del DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        
        // Crear una instancia de la clase Experiencia con el mock del servicio
        $this->experiencia = new Experiencia($this->dbServiceMock);
    }

    public function testObtenerExperiencia()
    {
        $idhojadevida = 1;

        // Configurar el mock para devolver un resultado simulado
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with('SELECT * FROM experiencialaboral WHERE hojadevida_idhojadevida = :idhojadevida', ['idhojadevida' => $idhojadevida])
            ->willReturn([
                ['profesion' => 'Desarrollador', 'descripcionPerfil' => 'Desarrollador PHP', 'cargo' => 'Programador', 'empresa' => 'Acme Corp']
            ]);
        
        // Llamar al método y verificar el resultado
        $result = $this->experiencia->obtenerExperiencia($idhojadevida);
        
        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Desarrollador', $result[0]['profesion']);
    }

    public function testEliminarExperiencia()
    {
        $idexperiencialaboral = 1;

        // Configurar el mock para devolver un valor booleano indicando éxito
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarAccion')
            ->with('DELETE FROM experiencialaboral WHERE idexperienciaLaboral = :idexperienciaLaboral', ['idexperienciaLaboral' => $idexperiencialaboral])
            ->willReturn(true);
        
        // Llamar al método y verificar el resultado
        $result = $this->experiencia->eliminarExperiencia($idexperiencialaboral);
        
        $this->assertTrue($result);
    }

    public function testAgregarExp()
    {
        // Datos simulados para agregar una experiencia
        $data = [
            'profesion' => 'Desarrollador',
            'descripcionPerfil' => 'Desarrollador PHP',
            'fechaInicioExp' => '2022-01-01',
            'fechaFinExp' => '2023-01-01',
            'cargo' => 'Programador',
            'empresa' => 'Acme Corp',
            'ubicacionEmpresa' => 'Ciudad X',
            'tipoContrato' => 'Indefinido',
            'salario' => 50000,
            'logros' => 'Desarrollo de aplicaciones',
            'referenciasLaborales' => 'Referencias X',
            'fechaIngreso' => '2022-01-01',
            'fechaSalida' => '2023-01-01'
        ];
        $hojadevida_idHojadevida = 1;

        // Configurar el mock para devolver un ID de inserción
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarInsert')
            ->with(
                'INSERT INTO experiencialaboral (profesion, descripcionPerfil, fechaInicioExp, fechaFinExp, cargo, empresa, ubicacionEmpresa, tipoContrato, salario, logros, referenciasLaborales, fechaIngreso, fechaSalida, hojadevida_idHojadevida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                $this->anything()
            )
            ->willReturn(123);  // El ID de inserción simulado
        
        // Llamar al método y verificar el resultado
        $result = $this->experiencia->agregarExp($data, $hojadevida_idHojadevida);
        
        $this->assertJson($result);
        $resultDecoded = json_decode($result, true);
        $this->assertEquals('Experiencia agregada', $resultDecoded['message']);
        $this->assertEquals(123, $resultDecoded['id']);
    }

    public function testActualizarExperiencia()
    {
        $data = [
            'profesion' => 'Desarrollador',
            'descripcionPerfil' => 'Desarrollador PHP',
            'fechaInicioExp' => '2022-01-01',
            'fechaFinExp' => '2023-01-01',
            'idexperienciaLaboral' => 1
        ];

        // Configurar el mock para devolver true indicando que la actualización fue exitosa
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->with(
                'UPDATE experiencialaboral SET profesion = ?, descripcionPerfil = ?, fechaInicioExp = ?, fechaFinExp = ? WHERE idexperienciaLaboral = ?',
                $this->anything()
            )
            ->willReturn(true);

        // Llamar al método y verificar el resultado
        $result = $this->experiencia->actualizarExperiencia($data);
        
        $this->assertTrue($result);
    }
}
