import NavbarClosed from "../componentsClosed/Navbar";
import TablaJornadas from "../componentsClosed/tables/TablaJornadas";

const Jornadas = () => {
  return (
    <div
      className="bg-light min-vh-100 d-flex"
      style={{ transition: "all 0.5s ease" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#ECF0F1", width: "100%" }}
      >
        <div className="d-flex flex-column flex-lg-row" style={{ gap: "1rem" }}>
          <div className="flex-fill mb-3 mb-lg-0" style={{ flex: 2 }}>
            <TablaJornadas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jornadas;
