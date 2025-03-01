import React from "react";

const TablaContratos = () => {
    const [vinculaciones, setVinculaciones] = useState([])


    return(
        <div className="container-fluid">
            <h1 className="mb-4">Vinculaciones</h1>
            
            <div className="row">
                    <div className="card shadow-sm border- mb-4">
                        <div className="card-body">
                             <p>Vinculaciones de la empressa</p>
                             <div className="table-responsive">
                                <div className="table table-hover">
                                    <thead className="text-center">
                                        <tr>
                                            <th>Numero de documento</th>
                                            <th>Nombre y Apellido del usuario</th>
                                            <th>Fecha de inicio de vinculacion</th>
                                            <th>Fecha Fin de la vinculacion</th>
                                            <th>Tipo de contrato</th>
                                            <th>Salario</th>
                                            <th>Estado del contrato</th>
                                            <th>Fecha De firma</th>
                                            <th>Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <button className="btn btn-danger">
                                                Desactivacion de contrato y realizacion de paz y salvo
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </div>
                             </div>
                    </div>
                </div>
            </div>


        </div>
    
    )

}


export default TablaContratos;