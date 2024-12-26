import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';


//Importaciones de vistas
import Login from './views/Login';
import Registro from './views/Registro';
import Layout from './views/Layout';
import Trabajo from './views/aspirante/Trabajo';
//VISTAS EMPLEADO
import InicioEmpleado from './views/empleado/InicioEmpleado';
import Jornadas from './views/empleado/Jornadas';
import Ausencias from './views/empleado/Ausencias';
import Quejas from './views/empleado/Quejas';
//VISTAS ADMIN
import InicioAdmin from './views/administrador/InicioAdmin';
//VISTAS RRH
import InicioRRHH from './views/recursoshumanos/InicioRRHH';
import InicioAspirante from './views/aspirante/InicioAspirante';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
    <div className="App">
        <Routes>
          
          <Route path='/' element={<Layout/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Registro' element={<Registro/>}/>
          <Route path='/aspirante/inicio' element={<InicioAspirante/>}/>
          <Route path='/aspirante/Trabajo' element={<Trabajo/>}/>
          <Route path='/empleado/InicioEmpleado' element={<InicioEmpleado/>}/>
          <Route path='/empleado/Jornadas' element={<Jornadas/>}/>
          <Route path='/empleado/Ausencias' element={<Ausencias/>}/>
          <Route path='/empleado/Quejas' element={<Quejas/>}/>
          <Route path='/administrador/InicioAdmin' element={<InicioAdmin/>}/>
          <Route path='/recursoshumanos/InicioRRHH' element={<InicioRRHH/>}/>

        </Routes>
    </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
