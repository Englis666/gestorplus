<?php
namespace Core\Controller;

use Servicio\JsonResponseService;
use Servicio\ValidationService;

abstract class BaseController{
    protected JsonResponseService $jsonResponseService;
    protected ValidationService $validator;

    public function __construct(){
        $this->jsonResponseService = new JsonResponseService();
        $this->validator = new ValidationService();
    }

    /**
     * Esto valida que data contenga todas las claves de camposrequeridos
     * Si falta alguna responde como error y retorna falso
     */

     protected function parametrosRequeridos(array $data, array $camposRequeridos): bool{
        return $this->validator->verificarDatosRequeridos($data,$camposRequeridos);
     }

     /**
      * Extrae y  convierte un parametro a entero.
      */
     protected function getIntParam(array $data, string $key): int{
        return isset($data[$key]) ? (int) $data[$key]: 0;
     }

     


}