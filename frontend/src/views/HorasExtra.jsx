import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaHorasExtra from "../componentsClosed/tables/TablaHorasExtra";
import TablaMinutosTrabajados from "../componentsClosed/tables/TablaMinutosTrabajados";

const HorasExtra = () => {
  return (
    <div
      className=" min-vh-100 d-flex"
      style={{ overflow: "hidden" }}
    >
      {/* Sidebar fijo */}
      <div style={{ width: "250px", minWidth: "250px" }}>
        <NavbarClosed />
      </div>

      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap", 
            justifyContent: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: "400px" }}>
            <TablaHorasExtra />
          </div>
          <div style={{ flex: 1, minWidth: "400px" }}>
            <TablaMinutosTrabajados />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorasExtra;
