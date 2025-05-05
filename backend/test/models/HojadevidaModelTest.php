<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\Hojadevida;
use Service\DatabaseService;

class HojadevidaModelTest extends TestCase
{
    private $dbServiceMock;
    private $hojadevida;

    protected function setUp(): void
    {
        // Mocking the DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->hojadevida = new Hojadevida($this->dbServiceMock);
    }

    public function testObtenerHojadevidaPorNumDocSuccess()
    {
        // Test case where the number of documents returns a valid hoja de vida
        $num_doc = 123456789;
        $hojadevidaData = [
            'hojadevida_idHojadevida' => 1
        ];

        // Mocking the DB response
        $this->dbServiceMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($this->createMock(PDOStatement::class));

        $this->dbServiceMock->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->dbServiceMock->expects($this->once())
            ->method('fetch')
            ->willReturn($hojadevidaData);

        $result = $this->hojadevida->obtenerHojadevidaPorNumDoc($num_doc);
        
        $this->assertNotNull($result);
        $this->assertEquals($hojadevidaData, $result);
    }

    public function testObtenerHojadevidaPorNumDocNoFound()
    {
        // Test case where the number of documents returns no hoja de vida
        $num_doc = 123456789;
        $hojadevidaData = null;

        $this->dbServiceMock->expects($this->exactly(2))
            ->method('prepare')
            ->willReturn($this->createMock(PDOStatement::class));

        $this->dbServiceMock->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $this->dbServiceMock->expects($this->once())
            ->method('fetch')
            ->willReturn($hojadevidaData);

        $result = $this->hojadevida->obtenerHojadevidaPorNumDoc($num_doc);
        
        $this->assertNull($result);
    }

    public function testObtenerHojadevidaPorNumDocThrowsException()
    {
        // Test case for invalid document number
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('El número de documento no es válido');

        $num_doc = -1;
        $this->hojadevida->obtenerHojadevidaPorNumDoc($num_doc);
    }

    public function testActualizacionHojadeVida()
    {
        // Test case where the hoja de vida is updated successfully
        $hojadevida_idHojadevida = 1;
        $data = [
            'fechaNacimiento' => '1990-01-01',
            'direccion' => 'Test Address',
            'ciudad' => 'Test City',
            'ciudadNacimiento' => 'Test Birth City',
            'telefono' => '123456789',
            'telefonoFijo' => '987654321',
            'estadoCivil' => 'Soltero',
            'genero' => 'Masculino',
            'habilidades' => 'PHP, MySQL',
            'portafolio' => 'http://example.com'
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('prepare')
            ->willReturn($this->createMock(PDOStatement::class));

        $this->dbServiceMock->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $response = $this->hojadevida->actualizacionHojadeVida($hojadevida_idHojadevida, $data);

        $this->assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Hoja de vida actualizada']),
            $response
        );
    }
}
