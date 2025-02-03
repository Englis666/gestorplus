import React, { useState } from "react";
import { jsPDF } from "jspdf"; // Importar jsPDF
import NavbarClosed from "../componentsClosed/Navbar";

const Certificados = () => {
  const fechaEmision = new Date().toLocaleDateString("es-ES");
  const [tipoCertificado, setTipoCertificado] = useState("laboral"); 
  const [userData, setUserData] = useState({
  
  });

  const handleDownload = () => {
    const doc = new jsPDF();
    const titulo = tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL";
    const fecha = `Fecha de emisión: ${fechaEmision}`;
    const firma = "Firma autorizada: La Frayette";

    // Cargar fuente
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Agregar título (centrado y en negrita, con un tamaño grande)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(titulo, 105, 20, null, null, "center");

    // Agregar sección de certificado con formato
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Documento de certificación La Frayette", 20, 40);

    // Detalle de la certificación
    const contenido = `
      Rol ejercido: ${userData?.rol || "No disponible"}
      Departamento: ${userData?.departamento || "No especificado"}
      Fecha de ingreso: ${userData?.fechaIngreso || "No disponible"}
      Tipo de contrato: ${userData?.contrato || "No especificado"}
      Certificación: Esta hoja certifica que ${userData?.nombre || "Nombre del empleado"} pertenece a la empresa La Frayette como ${userData?.rol || "rol no especificado"}.
      Este certificado tiene valor de acuerdo con las normativas de La Frayette en Colombia, siendo válido en los procesos internos de la organización.
    `;

    // Organizar el contenido en el PDF con márgenes adecuados
    doc.text(contenido, 20, 50, { maxWidth: 170 });

    // Información adicional (si es ARL, agregar detalles específicos)
    if (tipoCertificado === "arl") {
      doc.text("\nInformación ARL: El empleado cuenta con afiliación activa a una ARL bajo las normativas vigentes.", 20, 90);
    }

    // Detalles adicionales (Normativas vigentes en Colombia para 2025)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(
      "Normativas aplicables en Colombia, Bogotá 2025: Este certificado es válido de acuerdo con la legislación colombiana vigente y las normativas internas de La Frayette. En caso de que sea requerido para otros fines, deberá consultar las leyes y disposiciones oficiales en el Ministerio de Trabajo y el Departamento de Salud.",
      20,
      120,
      { maxWidth: 170 }
    );

    // Información sobre la empresa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      "Para más información o para verificar la autenticidad de este documento, por favor contacte a La Frayette.",
      20,
      150,
      { maxWidth: 170 }
    );

    doc.text(
      "Teléfono: (1) 123 4567 | Correo electrónico: contacto@lafayette.com.co | Dirección: Calle 123 #45-67, Bogotá, Colombia.",
      20,
      160,
      { maxWidth: 170 }
    );

    // Fecha de emisión y firma al final
    doc.setFontSize(12);
    doc.text(fecha, 20, 180);

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(20, 190, 190, 190);

    // Firma
    doc.setFont("helvetica", "normal");
    doc.text(firma, 20, 200);
    doc.text("_______________________", 20, 205);
    doc.text("Representante autorizado", 20, 210);

    // Crear un borde como si fuera una tarjeta (simulando Bootstrap)
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 280); // Rectángulo alrededor de la tarjeta

    // Descargar el PDF con el nombre adecuado
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
            <p className="card-text mb-2">
              <strong>Documento de certificación La Frayette</strong>
            </p>
            <p className="card-text mb-2">
              <strong>Rol ejercido del empleado:</strong> {userData?.rol || "No disponible"}
            </p>
            <p className="card-text mb-2">
              <strong>Departamento:</strong> {userData?.departamento || "No especificado"}
            </p>
            <p className="card-text mb-4">
              <strong>Fecha de ingreso:</strong> {userData?.fechaIngreso || "No disponible"}
            </p>
            <p className="card-text mb-4">
              <strong>Tipo de contrato:</strong> {userData?.contrato || "No especificado"}
            </p>
            <p className="card-text mb-4">
              <strong>Certificación:</strong> Esta hoja certifica que <strong>{userData?.nombre || "Nombre del empleado"}</strong> pertenece a la empresa La Frayette como <strong>{userData?.rol || "rol no especificado"}</strong>. 
              Este certificado tiene valor de acuerdo con las normativas de La Frayette en Colombia, siendo válido en los procesos internos de la organización.
            </p>
            {tipoCertificado === "arl" && (
              <p className="card-text mb-4">
                <strong>Información ARL:</strong> El empleado cuenta con afiliación activa a una ARL bajo las normativas vigentes.
              </p>
            )}
            <p className="card-text mb-2">
              <strong>Fecha de emisión:</strong> {fechaEmision}
            </p>
          </div>
        </div>

        {/* Botones de control */}
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
