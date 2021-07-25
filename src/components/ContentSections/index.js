import React from "react";
import "./styles.css"

function ContentSections() {
    return(
        <div>
            <div className="section__wrapper">
                <span style={{position: 'relative', zIndex: 1, fontSize: 42}}>. . .</span>
                <div style={{paddingTop: '7rem', paddingLeft: '10rem', paddingRight: '10rem', paddingBottom: '7rem'}}>
                    <p style={{position: "relative", zIndex: 1, textAlign: "center"}}>
                        Somos un equipo que le damos sentido a la vida de nuestras creaciones.<br/>
                        Somos cada uno y cada cero de cada programa que hacemos.
                    </p>
                </div>
                <div className="section__skill section__flex__right">
                    <h2>{`Creativos`}</h2>
                    <p style={{textAlign: 'justify'}}>
                        Estamos fascinados por la manera en la que podemos convertir los números,
                        la lógica y las formulas en algo artístico. No nos gusta pensar cuadrado,
                        al contrario, exploramos ideas fuera de la caja para darle más 
                        formas y color a nuestros resultados.
                    </p>
                </div>
                <div className="section__skill section__flex__left">
                    <h2>{`Experimentales`}</h2>
                    <p style={{textAlign: 'justify'}}>
                        Disfrutamos aprender cosas usando todo lo que esta a nuestro alcance
                        para tener un mejor resultado. Amamos crear e implementar nuevos inventos, nuevas
                        librerías y poner a prueba lo que diseñamos. La mejor manera de progresar,
                        es jugando y equivocandose.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ContentSections;