import axios from "axios";
import React , { useState, useEffect} from "react";


const CategoriaDeTrabajo = () => {
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
        if(loading){
            return <div>Cargando</div>
        }
        if(error){
            return <div>{error}</div>
        }
    
    
    return (
        <section className="category py-5" style={{ color: '#fff' }}>
            <h1 className="heading text-center mb-5 text-black">Categorías de trabajo</h1>
            <div className="box-container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 justify-content-center">
                {convocatorias.map(convocatoria =>(

                <div key={convocatoria.idcargo} className="col">
                <div className="box bg-white p-4 rounded shadow-sm border">
                    <div className="ms-3">
                        <h3 className="fs-5 text-capitalize text-dark mb-2">{convocatoria.nombreCargo}</h3>
                        <span className="text-muted" style={{ fontSize: "1.3rem" }}>Convocatorias disponibles: {convocatoria.cantidadConvocatoria}</span>
                    </div>
                </div>
                </div>
                ))}
                
            </div>
        </section>
    );
}

export default CategoriaDeTrabajo;
