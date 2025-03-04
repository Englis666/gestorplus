8import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; 
import NavbarClosed from "../componentsClosed/Navbar";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Certificados = () => {
  const fechaEmision = new Date().toLocaleDateString("es-ES");
  const [tipoCertificado, setTipoCertificado] = useState("laboral");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtener cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Verificar expiración del token
  const isTokenExpired = (decodedToken) => decodedToken.exp * 1000 < Date.now();

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const token = getCookie("auth_token");
      if (!token) {
        alert("No se encontró un token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (isTokenExpired(decodedToken)) {
          alert("El token está expirado");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerDatosParaCertificado" },
        })
        .then((response) => {
          const certificado = response.data?.Certificado;
          console.log(response.data);

          if (Array.isArray(certificado)){
            setTipoCertificado(certificado);
          } else {
            console.error("Los datos de los certificados no son un array");
            setTipoCertificado(false);
          }

        })
      } catch (err) {
        console.error("Error al obtener los datos para el certificado", err);
        setUserData({});
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();
    const titulo = tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL";
    const fecha = `Fecha de emisión: ${fechaEmision}`;
    const firma = "Firma autorizada: La Frayette";

    // Configuración de fuente y título
    doc.setFont("helvetica", "bold").setFontSize(20);
    doc.text(titulo, 105, 20, null, null, "center");

    doc.setFont("helvetica", "normal").setFontSize(14);
    doc.text("Documento de certificación La Frayette", 20, 40);

    const contenido = `
      Rol ejercido: ${userData?.rol || "No disponible"}
      Departamento: ${userData?.departamento || "No especificado"}
      Fecha de ingreso: ${userData?.fechaIngreso || "No disponible"}
      Tipo de contrato: ${userData?.contrato || "No especificado"}
      Certificación: Esta hoja certifica que ${userData?.nombre || "Nombre del empleado"} 
      pertenece a la empresa La Frayette como ${userData?.rol || "rol no especificado"}.
    `;

    doc.text(contenido, 20, 50, { maxWidth: 170 });

    if (tipoCertificado === "arl") {
      doc.text("\nInformación ARL: El empleado cuenta con afiliación activa a una ARL bajo las normativas vigentes.", 20, 90);
    }

    doc.setFont("helvetica", "italic").setFontSize(10);
    doc.text(
      "Normativas aplicables en Colombia, Bogotá 2025...",
      20,
      120,
      { maxWidth: 170 }
    );

    doc.setFont("helvetica", "normal").setFontSize(12);
    doc.text(
      "Para más información, contacte a La Frayette.",
      20,
      150,
      { maxWidth: 170 }
    );

    doc.text(
      "Teléfono: (1) 123 4567 | Email: contacto@lafayette.com.co",
      20,
      160,
      { maxWidth: 170 }
    );

    doc.text(fecha, 20, 180);
    doc.setLineWidth(0.5);
    doc.line(20, 190, 190, 190);
    doc.text(firma, 20, 200);
    doc.text("_______________________", 20, 205);
    doc.text("Representante autorizado", 20, 210);
    doc.rect(10, 10, 190, 280);

    doc.save(`certificado_${tipoCertificado}.pdf`);
  };

  return (
    <div className="bg-light min-vh-100 d-flex" style={{ transition: "all 3s ease" }}>
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-header bg-primary text-white text-center py-4">
            <h1 className="mb-0">
              {tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL"}
            </h1>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <p className="text-center">Cargando datos...</p>
            ) : (
              <>
                <p className="card-text mb-2"><strong>Rol:</strong> {userData?.rol || "No disponible"}</p>
                <p className="card-text mb-2"><strong>Departamento:</strong> {userData?.departamento || "No especificado"}</p>
                <p className="card-text mb-4"><strong>Fecha de ingreso:</strong> {userData?.fechaIngreso || "No disponible"}</p>
                <p className="card-text mb-4"><strong>Tipo de contrato:</strong> {userData?.contrato || "No especificado"}</p>
                <p className="card-text mb-4">
                  <strong>Certificación:</strong> {userData?.nombre || "Nombre del empleado"} pertenece a La Frayette como <strong>{userData?.rol || "rol no especificado"}</strong>.
                </p>
                {tipoCertificado === "arl" && (
                  <p className="card-text mb-4"><strong>Información ARL:</strong> El empleado cuenta con afiliación activa.</p>
                )}
                <p className="card-text mb-2"><strong>Fecha de emisión:</strong> {fechaEmision}</p>
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-secondary px-5 py-2" onClick={() => setTipoCertificado("laboral")}>
            Certificado Laboral
          </button>
          <button className="btn btn-secondary px-5 py-2 ms-3" onClick={() => setTipoCertificado("arl")}>
            Certificado ARL
          </button>
          <button className="btn btn-primary px-5 py-2 ms-3" onClick={handleDownload}>
            Descargar {tipoCertificado === "laboral" ? "Laboral" : "ARL"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
