import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';


//Importaciones de vistas
import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/perfil';
import Layout from './views/Layout';
//Aspirante
import Trabajo from './views/aspirante/Trabajo';
import DetallesDeTrabajo from './views/aspirante/DetallesTrabajo';
import InicioEmpleado from './views/empleado/InicioEmpleado';

import Jornadas from './views/Jornadas';
import Ausencias from './views/Ausencias';
import Quejas from './views/Quejas';
import Empleados from './views/Empleados';
import Entrevistas from './views/Entrevistas';
import Certificados from './views/Certificados';
import Convocatorias from './views/Convocatorias';

//VISTAS ADMIN
import InicioAdmin from './views/administrador/InicioAdmin';
//VISTAS RRH
import InicioRRHH from './views/recursoshumanos/InicioRRHH';
import InicioAspirante from './views/aspirante/InicioAspirante';
import PazySalvo from './views/PazYSalvos';
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
    <div className="App">
        <Routes>
          
          <Route path='/' element={<Layout/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Registro' element={<Registro/>}/>
          <Route path='/Perfil' element={<Perfil/>}/>
          <Route path='/aspirante/inicio' element={<InicioAspirante/>}/>
          <Route path='/aspirante/Trabajo' element={<Trabajo/>}/>
          <Route path='/aspirante/DetallesDeTrabajo' element={<DetallesDeTrabajo/>}/>
          <Route path='/empleado/InicioEmpleado' element={<InicioEmpleado/>}/>
          <Route path='/Jornadas' element={<Jornadas/>}/>
          <Route path='/Ausencias' element={<Ausencias/>}/>
          <Route path='/Quejas' element={<Quejas/>}/>
          <Route path='/Empleados' element={<Empleados/>}/>
          <Route path='/Entrevistas' element={<Entrevistas/>}/>
          <Route path="/Convocatorias" element={<Convocatorias/>}/>
          <Route path='/PazYsalvo' element={<PazySalvo/>}/>
          <Route path='/Certificados' element={<Certificados/>}/>
          <Route path='/administrador/InicioAdmin' element={<InicioAdmin/>}/>
          <Route path='/recursoshumanos/InicioRRHH' element={<InicioRRHH/>}/>

        </Routes>
    </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
