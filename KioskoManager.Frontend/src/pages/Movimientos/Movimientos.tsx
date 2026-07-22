import { useEffect, useState } from "react";
import "./Movimientos.css";

import {
    obtenerMovimientos,
    type MovimientoStock
} from "../../services/movimientoService";

function Movimientos() {

    const [movimientos,
        setMovimientos] =
        useState<MovimientoStock[]>([]);

    useEffect(() => {

        cargarMovimientos();

    }, []);

    async function cargarMovimientos() {

        try {

            const data =
                await obtenerMovimientos();

            setMovimientos(data);

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="movimientos-page">

            <h2>Movimientos</h2>

            <div className="tabla-container">

                <table className="tabla-movimientos">

                    <thead>

                        <tr>

                            <th>Fecha</th>

                            <th>Producto</th>

                            <th>Usuario</th>

                            <th>Tipo</th>

                            <th>Cantidad</th>

                            <th>Stock</th>

                            <th>Observación</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            movimientos.map(m => (

                                <tr key={m.idMovimientoStock}>

                                    <td>

                                        {new Date(
                                            m.fechaMovimiento
                                        ).toLocaleString()}

                                    </td>

                                    <td>{m.nombreProducto}</td>

                                    <td>{m.nombreUsuario}</td>

                                    <td>{m.tipoMovimiento}</td>

                                    <td>{m.cantidad}</td>

                                    <td>

                                        {m.stockAnterior}

                                        {" → "}

                                        {m.stockNuevo}

                                    </td>

                                    <td>{m.observacion}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Movimientos;