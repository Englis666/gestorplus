import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config";

const FinalizarJornada = () => {
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("auth_token");

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

  const finalizarJornada = async () => {
    if (!window.confirm("¿Estás seguro de que deseas finalizar la jornada?")) {
      console.log("Confirmación cancelada");
      return;
    }

    if (!token) {
      setMensaje("❌ No se encontró el token de autenticación.");
      return;
    }

    setCargando(true);
    setMensaje("");

    const fechaBogota = obtenerFechaBogota();
    console.log("Fecha Bogotá:", fechaBogota);

    try {
      const response = await axios.post(
        API_URL,
        {
          action: "finalizarJornada",
          data: { fechaBogota },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta completa:", response);
      console.log("Datos recibidos:", response.data);

      if (response.data?.JornadaFinalizada) {
        setMensaje("✅ Jornada finalizada correctamente.");
      } else {
        setMensaje("⚠️ No se pudo finalizar la jornada.");
      }
    } catch (error) {
      console.error("Error al finalizar la jornada:", error);
      setMensaje("❌ Error al finalizar la jornada.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h5 className="card-title mb-3 fw-bold">Finalizar Jornada</h5>
          <p className="card-text text-muted">
            <span>
              Esto es obligatorio, debes hacer clic en el botón para registrar
              el fin de tu jornada laboral.
            </span>
            <span>
              Si no se registra tu jornada, lo más probable es que quede
              invalidada.
            </span>
          </p>
          <button
            className="btn btn-danger w-100 py-2 fw-semibold"
            onClick={finalizarJornada}
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
