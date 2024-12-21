import React, { useEffect } from "react";

const Injerto = () => {
  useEffect(() => {
    // Redirigir a una URL externa
    window.location.href = 'http://localhost/Adso/sin_usuario/index.php';
  }, []);

  return <div>Cargando...</div>;
};

export default Injerto;
