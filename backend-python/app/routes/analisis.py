from fastapi import APIRouter
from services.analisis_service import analizar_hoja_de_vida
from models.analisis_request import AnalisisRequest

router = APIRouter()

@router.post("/analizar-hojadevida")
async def analizar_hojadevida(request: AnalisisRequest):
    return analizar_hoja_de_vida(request.hoja, request.cargo, request.convocatoria)