from pydantic import BaseModel
from .hojadevida import HojaDeVida
from .cargo import Cargo
from .convocatoria import Convocatoria

class AnalisisRequest(BaseModel):
    hoja: HojaDeVida
    cargo: Cargo
    convocatoria: Convocatoria