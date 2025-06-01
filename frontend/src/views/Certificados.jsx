/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import NavbarClosed from "../componentsClosed/Navbar";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../config";

const Certificados = () => {
  const fechaEmision = new Date().toLocaleDateString("es-ES");
  const [tipoCertificado, setTipoCertificado] = useState("laboral");
  const [userData, setUserData] = useState([]);
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

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerDatosParaCertificado" },
        });

        console.log(response.data);

        if (
          response.data?.Certificado &&
          response.data.Certificado.length > 0
        ) {
          setUserData(response.data.Certificado);
        } else {
          console.error("Los datos del usuario no están en la respuesta");
          setUserData([]);
        }
      } catch (err) {
        console.error("Error al obtener los datos para el certificado", err);
        setUserData([]);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const marginLeft = 25;
    const lineHeight = 7;
    const startY = 30; // Punto de inicio del contenido
    let currentY = startY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - marginLeft * 2; // Máximo ancho del texto

    const titulo =
      tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL";

    // **Título centrado**
    doc.setFont("Times", "bold").setFontSize(14);
    doc.text(titulo.toUpperCase(), pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 10; // Espacio después del título

    // **Datos de la empresa**
    doc.setFont("Times", "normal").setFontSize(12);
    const empresaInfo = [
      "La Fayette S.A.S.",
      "NIT: 900.123.456-7",
      "Dirección: Calle 123 # 45-67, Bogotá, Colombia",
      "Teléfono: (1) 123 4567",
      "Email: contacto@lafayette.com.co",
      `Bogotá, ${fechaEmision}`,
    ];

    empresaInfo.forEach((line) => {
      doc.text(line, marginLeft, currentY);
      currentY += lineHeight;
    });

    currentY += 5; // Espacio antes del contenido principal

    // **Encabezado de destinatario**
    doc.text("A quien corresponda:", marginLeft, currentY);
    currentY += lineHeight + 3;

    // **Contenido del certificado**
    let contenido = "";

    if (tipoCertificado === "laboral") {
      contenido = `Por la presente, La Fayette S.A.S. certifica que ${
        userData[0]?.nombres || "[Nombre del empleado]"
      },
identificado(a) con cédula de ciudadanía número ${
        userData[0]?.num_doc || "[Número de documento]"
      },
ha trabajado en nuestra empresa en calidad de ${
        userData[0]?.nombreCargo || "[Cargo]"
      } desde el ${
        userData[0]?.fechaInicio || "[Fecha de inicio]"
      } hasta la fecha, con las siguientes condiciones:

Cargo desempeñado: ${userData[0]?.nombreCargo || "[Nombre del cargo]"}
Departamento o área: ${
        userData[0]?.nombreConvocatoria || "[Nombre del departamento o área]"
      }
Tipo de contrato: ${userData[0]?.tipoContrato || "[Tipo de contrato]"}
Jornada laboral: Tiempo completo
Salario mensual: ${userData[0]?.salario}
Fecha de inicio: ${userData[0]?.fechaInicio || "[Fecha de inicio]"}
Fecha de término: ${userData[0]?.fechaFin}

Durante su tiempo en la empresa, el(a) Sr(a). ${
        userData[0]?.nombres || "[Nombre del empleado]"
      } ha demostrado un desempeño profesional acorde con las expectativas del cargo.`;
    } else if (tipoCertificado === "arl") {
      contenido = `Por la presente, certificamos que el empleado ${
        userData[0]?.nombres || "[Nombre del empleado]"
      },
identificado(a) con cédula de ciudadanía número ${
        userData[0]?.documento || "[Número de documento]"
      },
se encuentra afiliado(a) a una Administradora de Riesgos Laborales (ARL) bajo las normativas vigentes.

Información de afiliación ARL:
- ARL: [Nombre de la ARL]
- Fecha de afiliación: [Fecha de afiliación]
- Nivel de riesgo: [Nivel de riesgo]

Este certificado se emite para los fines que el interesado estime convenientes.`;
    }

    // **Dividir texto en líneas manejables y evitar espacios**
    let splitText = doc.splitTextToSize(contenido, maxWidth);

    // **Escribir cada línea correctamente**
    splitText.forEach((line) => {
      doc.text(line, marginLeft, currentY);
      currentY += lineHeight; // Simulación de interlineado doble
      if (currentY > 260) {
        // Salto de página si se sale del límite
        doc.addPage();
        currentY = 30; // Reiniciar posición
      }
    });

    currentY += 10; // Espacio antes del cierre

    // **Cierre del documento**
    let cierre =
      "Este certificado es expedido a solicitud del interesado para los fines que estime convenientes.";
    let splitCierre = doc.splitTextToSize(cierre, maxWidth);

    splitCierre.forEach((line) => {
      doc.text(line, marginLeft, currentY);
      currentY += lineHeight;
    });

    currentY += 15; // Espacio antes de la firma

    // **Firma y contacto**
    doc.text("Atentamente,", marginLeft, currentY);
    currentY += lineHeight + 5;
    doc.text("_______________________", marginLeft, currentY);
    currentY += lineHeight;
    doc.text("[Nombre del firmante]", marginLeft, currentY);
    currentY += lineHeight;
    doc.text("Cargo: [Cargo del firmante]", marginLeft, currentY);
    currentY += lineHeight;
    doc.text("Teléfono: (1) [Número de teléfono]", marginLeft, currentY);

    // **Línea separadora y marco**
    doc.setLineWidth(0.5);
    doc.line(25, currentY + 10, 185, currentY + 10);
    doc.rect(20, 20, 180, 250); // Marco del documento

    doc.save(`certificado_${tipoCertificado}.pdf`);
  };

  return (
    <div
      className="bg-light min-vh-100 d-flex main-layout"
      style={{ transition: "all 3s ease" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4 main-content"
        style={{ backgroundColor: "#ECF0F1" }}
      >
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-header bg-primary text-white text-center py-4">
            <h1 className="mb-0">
              {tipoCertificado === "laboral"
                ? "Certificado Laboral"
                : "Certificado ARL"}
            </h1>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <p className="text-center">Cargando datos...</p>
            ) : (
              <>
                {userData && userData.length > 0 ? (
                  <div>
                    <p className="card-text mb-2">
                      <strong>Rol:</strong>{" "}
                      {userData[0]?.nombreRol || "No disponible"}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Departamento:</strong>{" "}
                      {userData[0]?.nombreConvocatoria || "No especificado"}
                    </p>
                    <p className="card-text mb-4">
                      <strong>Fecha de ingreso:</strong>{" "}
                      {userData[0]?.fechaInicio || "No disponible"}
                    </p>
                    <p className="card-text mb-4">
                      <strong>Tipo de contrato:</strong>{" "}
                      {userData[0]?.tipoContrato || "No especificado"}
                    </p>
                    <p className="card-text mb-4">
                      <strong>Certificación:</strong>{" "}
                      {userData[0]?.nombres || "Nombre del empleado"} pertenece
                      a La Frayette como{" "}
                      <strong>
                        {userData[0]?.nombreCargo || "rol no especificado"}
                      </strong>
                      .
                    </p>
                    {tipoCertificado === "arl" && (
                      <p className="card-text mb-4">
                        <strong>Información ARL:</strong> El empleado cuenta con
                        afiliación activa.
                      </p>
                    )}
                    <p className="card-text mb-2">
                      <strong>Fecha de emisión:</strong> {fechaEmision}
                    </p>
                  </div>
                ) : (
                  <p>No se encontraron datos.</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-secondary px-5 py-2"
            onClick={() => setTipoCertificado("laboral")}
          >
            Certificado Laboral
          </button>
          {/* Desabilitado por tiempo (No hubo implementacion en la bd) 
            <button className="btn btn-secondary px-5 py-2 ms-3" onClick={() => setTipoCertificado("arl")}>
            Certificado ARL
          </button> */}
          <button
            className="btn btn-primary px-5 py-2 ms-3"
            onClick={handleDownload}
          >
            Descargar {tipoCertificado === "laboral" ? "Laboral" : "ARL"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
