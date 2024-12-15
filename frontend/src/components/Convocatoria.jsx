import React , {useEffect,useState} from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import CategoriaDeTrabajo from "./CategoriaDeTrabajo";
import axios from "axios";


const Convocatoria = () => {

    // Para almacenar las convocatorias toca hacerle un estado, eso significa que toca hacer una constante y dentor el nombre de lo que quiero y luego setYnombre de lo que quiero
    //Tambien debo meter en constante lo que es el loading y el error
    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    axios.get('http://localhost:8000/api/convocatorias')
        .then(response => {
            console.log("respuesta completa: ",response.data);
            if(Array.isArray(response.data.convocatorias)){
                setConvocatorias(response.data.convocatorias);
            }else{
                console.error('Convocatorias no es un array');
                setConvocatorias([]);
            }
            setLoading(false);
        })
        .catch(err => {
            setError('Error al cargar las convocatorias');
            setLoading(false);
            console.log('Error fetch ' , err);
        });
    }, []); 

    if (loading){
        return <div>Cargando convocatorias</div>;
    }
    if(error){
        return <div>{error}</div>;
    }


    return (
        <div className="bg-light">
        <CategoriaDeTrabajo></CategoriaDeTrabajo>
         <section className="jobs-container container-fluid py-5">
            <h1>Convocatorias recientes</h1>
            <div className="box-container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ms-4">
            {convocatorias.map(convocatoria =>(

                <div key={convocatoria.idconvocatoria} className="col">
                    <div className="box bg-white p-4 rounded shadow-sm border">
                        <div className="company d-flex align-items-center gap-3 mb-3">
                           

                            <div>
                         
                                <h3 
                                className="fs-4 text-dark mb-2 text-capitalize"
                                style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}> 
                                {convocatoria.nombreConvocatoria} 
                                </h3>
                                <p className="text-muted">Día de publicación</p>
                            </div>
                        </div>
                        <div className="tags d-flex flex-wrap gap-3 mb-4">
                            <p className="p-3 rounded bg-light">
                                <i className="fas fa-indian-rupee-sign me-2" style={{ color: "#777" }}></i>
                                <span>{convocatoria.salario}</span>
                            </p>
                            <p className="p-3 rounded bg-light">
                                <i className="fas fa-briefcase me-2" style={{ color: "#777" }}></i>
                                <span>Parte del tiempo</span>
                            </p>
                            <p className="p-3 rounded bg-light">
                                <i className="fas fa-briefcase me-2" style={{ color: "#777" }}></i>
                                <span>{convocatoria.nombreCargo}</span>
                            </p>

                        
                        </div>
        
                        <div className="mt-3">
                            <a 
                            className="btn btn-primary"
                            onClick={() => navigate('/Login')}
                            type="button">Detalles del trabajo</a>
                        </div>

                    </div>
                </div>
            ))}
            </div>

            <a 
            type="button"
            onClick={() => navigate('/aspirante/Trabajo')}
            className="btn btn-primary mt-5">Ver todas las convocatorias</a>
        </section>
        <Footer/>
        </div>
        
    );
}

export default Convocatoria;
