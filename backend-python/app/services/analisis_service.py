from datetime import datetime
import unicodedata

def calcular_anios(fecha_inicio, fecha_fin):
    try:
        d1 = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        d2 = datetime.strptime(fecha_fin, "%Y-%m-%d")
        return max(0, (d2 - d1).days // 365)
    except Exception:
        return 0

def analizar_hoja_de_vida(hoja, cargo, convocatoria):
    requisitos = (convocatoria.requisitos or "").lower().split(",")
    estudios_texto = " ".join([e.tituloEstudio or "" for e in hoja.estudios or []]).lower()
    experiencia_texto = " ".join([exp.profesion or "" for exp in hoja.experiencia or []]).lower()

    razones = []

    requisitos_cumplidos = sum(
        1 for req in requisitos if req.strip() and (req.strip() in estudios_texto or req.strip() in experiencia_texto)
    )
    if requisitos_cumplidos == 0:
        razones.append("No cumple con los requisitos de la convocatoria.")

    anios_exp = sum(
        calcular_anios(exp.fechaInicioExp, exp.fechaFinExp) for exp in hoja.experiencia or []
    )
    if anios_exp == 0:
        razones.append("No tiene experiencia registrada.")

    niveles = {
        "doctorado": 5,
        "maestría": 4,
        "maestria": 4,
        "universitario": 3,
        "tecnologo": 2,
        "tecnóloga": 2,
        "tecnica": 1,
        "técnico": 1,
        "técnica": 1,
        "tecnica": 1,
        "": 0
    }
    nivel_max = max([
        niveles.get(quitar_tildes((e.nivelEstudio or "").lower()), 0)
        for e in hoja.estudios or []
    ], default=0)
    if nivel_max == 0:
        razones.append("No tiene estudios registrados.")

    puntaje = (
        requisitos_cumplidos * 20 +
        anios_exp * 5 +
        nivel_max * 10
    )
    compatibilidad = min(100, puntaje)

    return {
        "mensaje": f"Análisis del numero de hoja de vida {hoja.idHojadevida} - del cargo {cargo.nombreCargo}",
        "puntaje": compatibilidad,
        "detalle": {
            "requisitos_cumplidos": requisitos_cumplidos,
            "anios_experiencia": anios_exp,
            "nivel_estudio_max": nivel_max,
            "nivel_estudio_max_nombre": [k for k, v in niveles.items() if v == nivel_max][0] if nivel_max else "N/A",
        },
        "razones": razones
    }

def quitar_tildes(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')