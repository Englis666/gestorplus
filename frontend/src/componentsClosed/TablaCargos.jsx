import React from "react";

const TablaCargos = () =>  {

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Cargos de el sistema</h1>

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <p>Cargos que estan cargados en el sistema</p>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="]text-center">
                                        <tr>
                                            <th className="py-3 px-4">Nombre del cargo</th>
                                            <th>Estado del cargo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">EJEMPLO DE CARGO</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">EJEMPLO DE ESTADO</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 container  card shadow-sm border-0 mb-5">
                <form action="">
                    <h2>Formulario para agregar mas cargos al sistema</h2>
                    <p>Recuerda que cuando agregas un cargo es para una convocatoria, entonces eso significa que ese cargo se habilitara para una seleccion de convocatoria. Realmente es sencillo solo debes colocar el nombre que usaras del cargo para poder usarlo en las siguientes postulaciones o convocatorias que crearas</p>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label text-dark" >Nombre del cargo</label>
                        <input type="text" 
                        value=""
                        className="form-control"
                        />
                    </div>
                </form>
            </div>
            </div>
           
        </div>


    )

}

export default TablaCargos;
