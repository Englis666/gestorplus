import React from "react";

const Banner = () => {
    return (
        <article className="home-container py-5" style={{ background: "url('path-to-your-image.jpg') center center/cover, rgba(0, 0, 0, 0.7)" }}>
            <section className="home d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <form action="" className="bg-white p-4 rounded shadow-sm">
                        <h3 className="mb-3" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>Busca una convocatoria</h3>
                        <p className="text-left" style={{ fontSize: '1.6rem', color: '#777', paddingTop: '1rem' }}>
                            Tipo de trabajo <span style={{ color: 'red' }}>*</span>
                        </p>
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="Palabra clave, categoría o cargo"  
                            required 
                            maxLength="200" 
                            className="form-control mb-3" 
                            style={{ padding: '1.4rem', borderRadius: '0.5rem' }}
                        />
                        <input 
                            type="submit" 
                            value="Buscar" 
                            name="search" 
                            className="btn btn-primary btn-lg w-100" 
                            style={{ fontSize: '1.4rem', textTransform: 'capitalize' }} 
                        />
                    </form>
                </div>
            </section>
        </article>
    );
}

export default Banner;
