<?php
namespace App\DTO;

class LoginRequestDTO{
    public string $num_doc;
    public string $password;

    public function __construct(string $num_doc, string $password){
        $this->num_doc = $num_doc;
        $this->password = $password;
    }
}