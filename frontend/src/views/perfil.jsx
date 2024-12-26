import React , {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Perfil = () => {

    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        
        </div>
        
    );
}

export default Perfil;
