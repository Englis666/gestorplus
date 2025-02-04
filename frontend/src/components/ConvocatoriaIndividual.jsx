import React , {useEffect,useState} from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ConvocatoriaIndividual = () => {

    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const handleClick = (convocatorias) => {
        const token = getCookie("auth_token");
        if(token){
            navigate("/aspirante/DetallesDeTrabajo");
        }else{
            navigate("/Login");
        }

    }


    useEffect(() => {
    axios.get('http://localhost/gestorplus/backend/', {
        params: {
            action: 'obtenerConvocatorias',
        },
    })
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
         <section className="jobs-container container-fluid py-5">
            <h1>Convocatorias</h1>
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
                            type="button"
                            onClick={() => handleClick(convocatoria)}
                            >Detalles del trabajo</a>
                        </div>

                    </div>
                </div>
            ))}
            </div>

         
        </section>
        <Footer/>
        </div>
        
    );
}

export default ConvocatoriaIndividual;
