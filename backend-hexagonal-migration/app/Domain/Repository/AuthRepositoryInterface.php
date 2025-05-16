<?php
namespace Domain\Repository;

interface AuthRepositoryInterface{
    public function registrar(array $data): string;
    public  function buscarUsuarioPorNumDoc(string $num_doc): ?array;
}