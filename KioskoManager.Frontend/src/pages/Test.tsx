import { useEffect } from "react";
import { obtenerProductos } from "../services/productoService";

function Test() {

    useEffect(() => {

        obtenerProductos()
            .then(console.log)
            .catch(console.error);

    }, []);

    return (
        <h1>Conectando con la API...</h1>
    );

}

export default Test;