<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;
    protected $table = 'notificacion';
    public $timestamps = false;

    protected $fillable = [
        'descripcionNotificacion', 'estadoNotificacion', 'tipo', 'num_doc'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'num_doc');
    }
}

?>