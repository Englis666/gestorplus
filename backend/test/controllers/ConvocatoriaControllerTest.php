<?php
declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\ConvocatoriaController;
use Model\Convocatoria;
use Service\JsonResponseService;
use PHPUnit\Framework\MockObject\MockObject;

class ConvocatoriaControllerTest extends TestCase
{
    private ConvocatoriaController $controller;
    private MockObject $mockConvocatoria;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Mocks de dependencias
        $this->mockConvocatoria = $this->createMock(Convocatoria::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Mock parcial del controlador para stubear parametrosRequeridos
        $this->controller = $this->getMockBuilder(ConvocatoriaController::class)
                                 ->onlyMethods(['parametrosRequeridos'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyección de mocks mediante reflection
        $ref = new \ReflectionClass(ConvocatoriaController::class);

        // Inyectar convocatoria
        $prop = $ref->getProperty('convocatoria');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockConvocatoria);

        // Inyectar jsonResponseService (propiedad heredada de BaseController)
        $base = $ref->getParentClass();
        $prop = $base->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testAgregarConvocatoriaMissingParams(): void
    {
        $data = ['nombreConvocatoria' => 'Test'];
        $this->controller->expects($this->once())
             ->method('parametrosRequeridos')
             ->with($data, [
                 'nombreConvocatoria','descripcion','requisitos','salario','cantidadConvocatoria','idcargo'
             ])
             ->willReturn(false);
        // No debe llamar al modelo ni responder
        $this->mockConvocatoria->expects($this->never())->method('agregarConvocatoria');
        $this->mockJsonResponseService->expects($this->never())->method('responder');

        $this->controller->agregarConvocatoria($data);
    }

    public function testAgregarConvocatoriaSuccess(): void
    {
        $data = [
            'nombreConvocatoria'=>'C1',
            'descripcion'=>'Desc',
            'requisitos'=>'R',
            'salario'=>'1000',
            'cantidadConvocatoria'=>'5',
            'idcargo'=>'2'
        ];
        $resultado = ['id'=>123];

        $this->controller->expects($this->once())
             ->method('parametrosRequeridos')
             ->with($data, [
                 'nombreConvocatoria','descripcion','requisitos','salario','cantidadConvocatoria','idcargo'
             ])
             ->willReturn(true);
        $this->mockConvocatoria->expects($this->once())
             ->method('agregarConvocatoria')
             ->with($data)
             ->willReturn($resultado);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with(['Convocatoria'=>$resultado]);

        $this->controller->agregarConvocatoria($data);
    }

    public function testObtenerConvocatorias(): void
    {
        $lista = [['id'=>1], ['id'=>2]];
        $this->mockConvocatoria->expects($this->once())
             ->method('obtenerConvocatorias')
             ->willReturn($lista);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with(['convocatorias'=>$lista]);

        $this->controller->obtenerConvocatorias();
    }

    public function testObtenerDetalleMissingId(): void
    {
        // Simular GET vacío
        $_GET = [];
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with(json_encode(['error'=>'No se encontró la convocatoria']), 400);

        $this->controller->obtenerDetalleConvocatoria();
    }

    public function testObtenerDetalleNotFound(): void
    {
        $_GET['idconvocatoria'] = '5';
        $this->mockConvocatoria->expects($this->once())
             ->method('obtenerDetalleConvocatoria')
             ->with(5)
             ->willReturn(null);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with(json_encode([
                 'message'=>'No se encontraron detalles para esta convocatoria','data'=>[]
             ]), 404);

        $this->controller->obtenerDetalleConvocatoria();
    }

    public function testObtenerDetalleSuccess(): void
    {
        $_GET['idconvocatoria'] = '5';
        $detalle = ['id'=>5,'name'=>'C'];
        $this->mockConvocatoria->expects($this->once())
             ->method('obtenerDetalleConvocatoria')
             ->with(5)
             ->willReturn($detalle);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with(['message'=>'DetalleConvocatoria','data'=>$detalle]);

        $this->controller->obtenerDetalleConvocatoria();
    }
}
