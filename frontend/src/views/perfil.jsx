import React , {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Perfil = () => {


    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Se usa useEffect que ya definido en la importacion de ract
    useEffect(() => {
    axios.get('http://localhost/gestorplus/backend/', {
        params: {
            action: 'obtenerConvocatorias',
        },
    })
        .then(response => {
            if(Array.isArray(response.data.convocatorias)){
                setConvocatorias(response.data.convocatorias);
            }else{
                console.error('Convocatorias no es un array');
                setConvocatorias([]);
            }
            setLoading(false);
        })
        .catch(err => {
            //Manejo de errores
            setError('Error al cargar las convocatorias');
            setLoading(false);
            console.log('Error fetch ' , err);
        });
    }, []); //Aqui va a ir el array cuando se ejecute (se crea un espacio)

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
