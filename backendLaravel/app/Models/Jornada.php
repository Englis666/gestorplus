<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jornada extends Model
{
    use HasFactory;
    protected $table = 'jornada';
    public $timestamp = false;

    protected $fillable = [
        ''
    ];
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_num_doc');
    }
    
}


?>