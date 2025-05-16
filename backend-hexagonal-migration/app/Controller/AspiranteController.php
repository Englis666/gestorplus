<?php
namespace App\Controller;

use App\Service\AspiranteService;
use Shared\Respose\JsonResponse;

class AspiranteController{
    private AspiranteService $aspiranteService;

    public function __construct(){
        $this->aspiranteService = new AspiranteService();
    }

    public function aplicar(array $data): void{
        try{
            $this->aspiranteService->aplicarAspirante($data['num_doc'], $data['idconvocatoria']);
            JsonResponse::success(['message' => 'Aplicacion registrada']);
        } catch (\Throwable $e){
            JsonResponse::error($e->getMessage(), $e->getCode() ?: 500);
        }
    }


}