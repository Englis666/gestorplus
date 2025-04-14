import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'animate.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import './utils/handleAlerts';

// Importaciones de vistas
import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/perfil';
import Layout from './views/Layout';

// Aspirante
import Trabajo from './views/aspirante/Trabajo';
import DetallesDeTrabajo from './views/aspirante/DetallesTrabajo';
import InicioEmpleado from './views/empleado/InicioEmpleado';
import MisPostulaciones from './views/aspirante/MisPostulaciones';

// Otras vistas
import Jornadas from './views/Jornadas';
import Ausencias from './views/Ausencias';
import Quejas from './views/Quejas';
import Empleados from './views/Empleados';
import Entrevistas from './views/Entrevistas';
import Certificados from './views/Certificados';
import Convocatorias from './views/Convocatorias';
import HorasExtra from './views/HorasExtra';
import Vacaciones from './views/Vacaciones';
import Postulaciones from './views/Postulaciones';
import Cargos from './views/Cargos';
import Contratos from './views/Contratos';
import SistemaDeGestion from './views/SistemaDeGestion';
import Permisos from './views/Permisos';
import Publicaciones from './views/Publicaciones';
// Vistas Administrador
import InicioAdmin from './views/administrador/InicioAdmin';

// Vistas Recursos Humanos
import InicioRRHH from './views/recursoshumanos/InicioRRHH';
import InicioAspirante from './views/aspirante/InicioAspirante';
import PazySalvo from './views/PazYSalvos';

// Hooks y Componentes de Seguridad
import useAuthRedirect from './hook/useAuthRedirect';
import PrivateRoute from './components/PrivateRoute';



function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        {/* El componente AuthCheck solo se ejecuta dentro del contexto del enrutador */}

        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registro" element={<Registro />} />

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/Perfil" element={<Perfil />} />
              <Route path="/aspirante/inicio" element={<InicioAspirante />} />
              <Route path="/aspirante/Trabajo" element={<Trabajo />} />
              <Route path="/aspirante/DetallesDeTrabajo" element={<DetallesDeTrabajo />} />
              <Route path="/aspirante/MisPostulaciones" element={<MisPostulaciones />} />
              <Route path="/empleado/InicioEmpleado" element={<InicioEmpleado />} />
              <Route path="/Jornadas" element={<Jornadas />} />
              <Route path="/HorasExtra" element={<HorasExtra />} />
              <Route path="/Ausencias" element={<Ausencias />} />
              <Route path="/Permisos" element={<Permisos/>}/>
              <Route path="/Publicaciones" element={<Publicaciones/>}/>
              <Route path="/Vacaciones" element={<Vacaciones />} />
              <Route path="/Quejas" element={<Quejas />} />
              <Route path="/Empleados" element={<Empleados />} />
              <Route path="/Entrevistas" element={<Entrevistas />} />
              <Route path="/Convocatorias" element={<Convocatorias />} />
              <Route path="/Postulaciones" element={<Postulaciones />} />
              <Route path="/Contratos" element={<Contratos />} />
              <Route path="/SistemaDeGestion" element={<SistemaDeGestion />} />
              <Route path="/Cargos" element={<Cargos />} />
              <Route path="/PazYsalvo" element={<PazySalvo />} />
              <Route path="/Certificados" element={<Certificados />} />
              <Route path="/" element={<PrivateRoute />} />

              {/* Administrador y RRHH */}
              <Route path="/administrador/InicioAdmin" element={<InicioAdmin />} />
              <Route path="/recursoshumanos/InicioRRHH" element={<InicioRRHH />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
