from pydantic import BaseModel
from typing import List, Optional
from models.experiencialaboral import ExperienciaLaboral
from models.estudio import Estudio

class HojaDeVida(BaseModel):
    idHojadevida: int
    fechaNacimiento: str
    direccion: str
    ciudad: str
    ciudadNacimiento: str
    telefono: str
    telefonoFijo: str
    estadohojadevida: Optional[str] = None
    estadoCivil: str
    genero: str
    habilidades: str
    portafolio: str
    experiencia: List[ExperienciaLaboral]
    estudios: List[Estudio]
