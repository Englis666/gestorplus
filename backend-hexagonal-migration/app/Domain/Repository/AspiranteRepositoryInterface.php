<?php
namespace Domain\Repository;

interface AspiranteRepositoryInterface{
    public function aplicar(string $num_doc, int $idConvocatoria): void;
}