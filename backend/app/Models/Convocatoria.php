<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convocatoria extends Model
{
    
    protected $table = 'convocatoria';     
    
    protected $fillable = [
        'nombreConvocatoria',
        'descripcion',
        'requisitos',
        'salario',
        'cantidadConvocatoria',
        'cargo_idcargo',
    ];
}
