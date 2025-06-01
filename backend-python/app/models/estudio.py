from pydantic import BaseModel
from typing import Optional

class Estudio(BaseModel):
    nivelEstudio: Optional[str] = None
    areaEstudio: Optional[str] = None
    estadoEstudio: Optional[str] = None
    fechaInicioEstudio: Optional[str] = None
    fechaFinEstudio: Optional[str] = None
    tituloEstudio: Optional[str] = None
    institucionEstudio: Optional[str] = None
    ubicacionEstudio: Optional[str] = None
    modalidad: Optional[str] = None
    paisInstitucion: Optional[str] = None
    duracionEstudio: Optional[str] = None
    materiasDestacadas: Optional[str] = None