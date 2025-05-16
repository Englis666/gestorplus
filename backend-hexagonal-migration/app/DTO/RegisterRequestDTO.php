<?php
namespace App\DTO;

class RegisterRequestDTO {
    public string $num_doc;
    public string $password;
    public int $estado;
    public int $rol_idrol;

    public function __construct(string $num_doc, string $password, int $estado, int $rol_idrol) {
        $this->num_doc = $num_doc;
        $this->password = $password;
        $this->estado = $estado;
        $this->rol_idrol = $rol_idrol;
    }

}