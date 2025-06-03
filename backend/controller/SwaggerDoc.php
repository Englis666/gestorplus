<?php
namespace Controller;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="GestorPlus API",
 *     version="1.0.0",
 *     description="Documentación Swagger para la API de GestorPlus",
 *     @OA\Contact(
 *         email="soporte@tudominio.com",
 *         name="Soporte GestorPlus"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 *
 * @OA\Server(
 *     url="http://localhost/api/",
 *     description="Servidor local"
 * )
 * @OA\Server(
 *     url="https://api.tudominio.com/",
 *     description="Servidor producción"
 * )
 */
class SwaggerDoc
{
}
