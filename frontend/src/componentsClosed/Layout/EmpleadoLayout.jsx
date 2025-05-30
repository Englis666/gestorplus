import { Outlet } from "react-router-dom";
import NavbarClosed from "../Navbar";

const EmpleadoLayout = () => {
  return (
    <>
      <NavbarClosed />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default EmpleadoLayout;
