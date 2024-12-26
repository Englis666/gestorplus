import React, { useEffect, useState } from "react";
import axios from "axios";

const SidebarChat = () => {
  const [usuariosRRHH, setUsuariosRRHH] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/gestorplus/backend/", {
        params: { action: "obtenerRRHH" },
      })
      .then((response) => {
        const rrhhData = response.data.RRHH;

        if (Array.isArray(rrhhData)) {
          setUsuariosRRHH(rrhhData);
        }   else {
            console.error("La respuesta no contiene un arreglo válido:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
  }, []); 

  return (
    <div
      style={{
        background: "#fff",
        width: "400px",
        maxWidth: "400px",
        marginTop: "50px",
        borderRadius: "16px",
        boxShadow:
          "0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5)",
        marginRight: "40px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "70vh",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Usuarios Activos
      </h3>
      <div>
        {/* Mapeo de usuarios */}
        {usuariosRRHH.length > 0 ? (
          usuariosRRHH.map((usuario) => (
            <div key={usuario.num_doc}>
              <p>{usuario.nombres} - {usuario.nombreRol}</p>
            </div>
          ))
        ) : (
          <p>No hay usuarios disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarChat;
