<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convocatoria extends Model
{
    protected $table = 'convocatoria';  

    // Define los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombreConvocatoria',
        'descripcion',
        'requisitos',
        'salario',
        'cantidadConvocatoria',
        'cargo_idcargo',
    ];

    // Si el campo 'id' no es el nombre predeterminado, también lo puedes especificar
    protected $primaryKey = 'idconvocatoria';

    // Si tu tabla no usa el formato de fecha predeterminado (created_at y updated_at),
    // puedes desactivarlo así:
    public $timestamps = false;
}
