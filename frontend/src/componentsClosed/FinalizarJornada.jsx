import { useState } from "react";
import { finalizarJornada } from "../services/JornadasService";
import { notificarError, notificarExito } from "../utils/notificaciones";

const FinalizarJornada = () => {
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const obtenerFechaBogota = () => {
    const fecha = new Date();

    const opciones = {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formatter = new Intl.DateTimeFormat("es-CO", opciones);
    const partes = formatter.formatToParts(fecha);

    const year = partes.find((p) => p.type === "year").value;
    const month = partes.find((p) => p.type === "month").value;
    const day = partes.find((p) => p.type === "day").value;

    return `${year}-${month}-${day}`;
  };

  const handleFinalizarJornada = async () => {
    if (!window.confirm("¿Estás seguro de que deseas finalizar esta jornada?"))
      return;

    setCargando(true);
    setMensaje("");

    try {
      const fechaBogota = obtenerFechaBogota();
      await finalizarJornada(fechaBogota);
      notificarExito("✅ Jornada finalizada correctamente.");
    } catch (error) {
      console.error("Error al finalizar jornada:", error);
      notificarError("❌ Error al finalizar la jornada.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container p-3">
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body p-4">
          <h5 className="card-title mb-3 fw-bold">Finalizar Jornada</h5>
          <p className="card-text text-muted">
            Esto es obligatorio, debes hacer clic en el botón para registrar el
            fin de tu jornada laboral. Si no se registra tu jornada, lo más
            probable es que quede invalidada.
          </p>
          <button
            className="btn btn-danger w-100 py-2 fw-semibold"
            onClick={handleFinalizarJornada}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Finalizando...
              </>
            ) : (
              <>
                <i className="material-icons align-middle me-2 text-center">
                  logout
                </i>
                Finalizar Jornada
              </>
            )}
          </button>

          {mensaje && (
            <div className="alert alert-info mt-4 mb-0" role="alert">
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalizarJornada;
