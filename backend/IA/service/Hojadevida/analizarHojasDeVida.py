import sys, json
from datetime import datetime

def calcular_edad(nacimiento_str):
    if not nacimiento_str:
        return None
    try:
        n = datetime.strptime(nacimiento_str, "%Y-%m-%d")
        return datetime.now().year - n.year
    except:
        return None

def evaluar_nivel_educativo(nivel):
    if not nivel:
        return 0
    n = nivel.lower()
    if "master" in n or "doctorado" in n:
        return 3
    if "licenciatura" in n or "ingenieria" in n:
        return 2
    if "bachiller" in n:
        return 1
    return 0

def evaluar_experiencia(descripciones, logros, referencias):
    texto = " ".join(descripciones)
    if not texto:
        return 0
    palabras = len(texto.split())
    score = 0
    if palabras > 100: score += 3
    elif palabras > 50: score += 2
    elif palabras > 20: score += 1

    if any(len(l.split()) > 50 for l in logros): score += 1
    if any(len(r.split()) > 50 for r in referencias): score += 1

    return score

def evaluar_habilidades(skills):
    if not skills:
        return 0
    count = len(skills.split(","))
    if count >= 5: return 3
    if count >= 3: return 2
    if count > 0:  return 1
    return 0

def evaluar_idiomas(skills):
    if not skills:
        return 0
    langs = [s.strip().lower() for s in skills.split(",")]
    if "ingles" in langs or "frances" in langs:
        return 2
    return 1

def evaluar_certificados(titulos):
    return 1 if any(titulos) else 0

def main():
    payload = json.loads(sys.argv[1])
    resultados = []

    for item in payload:
        hv   = item.get("hojadevida", {}).get("hojadevida", {})
        estudios    = item.get("hojadevida", {}).get("estudios", [])
        experiencias= item.get("hojadevida", {}).get("experiencias", [])

        edad   = calcular_edad(hv.get("fechaNacimiento"))
        nivel  = evaluar_nivel_educativo(hv.get("nivelEducativo"))

        descripciones = [e.get("descripcionPerfil","") for e in experiencias]
        logros        = [e.get("logros","")             for e in experiencias]
        referencias   = [e.get("referenciasLaborales","") for e in experiencias]

        exp_score  = evaluar_experiencia(descripciones, logros, referencias)
        hab_score  = evaluar_habilidades(hv.get("skills",""))
        idi_score  = evaluar_idiomas(hv.get("skills",""))
        titulos    = [e.get("tituloEstudio","") for e in estudios]
        cert_score = evaluar_certificados(titulos)

        puntaje = nivel + exp_score + hab_score + idi_score + cert_score

        if not hv:
            rendimiento = "Sin hoja de vida"
        elif puntaje >= 10:
            rendimiento = "Rendimiento alto"
        elif puntaje >= 5:
            rendimiento = "Rendimiento medio"
        else:
            rendimiento = "Rendimiento bajo"

        resultados.append({
            "num_doc"    : item.get("num_doc"),
            "nombres"    : item.get("nombres"),
            "email"      : item.get("email"),
            "cargo"      : item.get("cargo"),
            "puntaje"    : puntaje,
            "rendimiento": rendimiento
        })

    print(json.dumps({"analisis": resultados}, ensure_ascii=False))

if __name__ == "__main__":
    main()
