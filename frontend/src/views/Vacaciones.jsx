/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
import NavbarClosed from "../componentsClosed/Navbar";
import TablaVacaciones from "../componentsClosed/tables/TablaVacaciones";

const Vacaciones = () => {
  return (
    <div
      className="bg-light min-vh-100 main-layout"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4 main-content"
        style={{ backgroundColor: "#ECF0F1" }}
      >
        <TablaVacaciones />
      </div>
    </div>
  );
};

export default Vacaciones;
