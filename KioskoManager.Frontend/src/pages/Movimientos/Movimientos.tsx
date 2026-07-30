import { useEffect, useState } from "react";
import "./Movimientos.css";

import {
    obtenerMovimientos,
    type Movimiento
} from "../../services/movimientoService";

function Movimientos() {

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const [ventasAbiertas, setVentasAbiertas] =
        useState<number[]>([]);

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

    function toggleVenta(idVenta: number) {

        if (ventasAbiertas.includes(idVenta)) {

            setVentasAbiertas(
                ventasAbiertas.filter(x => x !== idVenta)
            );

        } else {

            setVentasAbiertas([
                ...ventasAbiertas,
                idVenta
            ]);

        }

    }

    // Ventas "padre" (las que tienen monto)
    const ventas = movimientos.filter(m =>
        m.tipo === "VENTA" &&
        m.monto != null
    );

    // Ingresos / egresos
    const otrosMovimientos = movimientos.filter(m =>
        m.tipo !== "VENTA"
    );

    return (

        <div className="movimientos-page">

            <h2>Historial</h2>

            <div className="tabla-container">

                <table className="tabla-movimientos">

                    <thead>

                        <tr>

                            <th>Fecha</th>

                            <th>Tipo</th>

                            <th>Usuario</th>

                            <th>Descripción</th>

                            <th>Monto</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            ventas.map(venta => {

                                const productos =
                                    movimientos.filter(p =>
                                        p.tipo === "VENTA" &&
                                        p.monto == null &&
                                        p.idVenta === venta.idVenta
                                    );

                                const abierta =
                                    ventasAbiertas.includes(
                                        venta.idVenta!
                                    );

                                return (

                                    <>
                                        <tr

                                            key={venta.idVenta}

                                            className="fila-venta"

                                            onClick={() =>
                                                toggleVenta(
                                                    venta.idVenta!
                                                )
                                            }

                                        >

                                            <td>

                                                {
                                                    new Date(
                                                        venta.fecha
                                                    ).toLocaleString()
                                                }

                                            </td>

                                            <td>

                                                {abierta ? "▼" : "▶"} Venta

                                            </td>

                                            <td>

                                                {venta.usuario}

                                            </td>

                                            <td>

                                                {venta.descripcion}

                                            </td>

                                            <td>

                                                ${
                                                    venta.monto?.toFixed(2)
                                                }

                                            </td>

                                        </tr>

                                        {

                                            abierta &&

                                            productos.map(prod => (

                                                <tr

                                                    key={prod.idMovimientoStock}

                                                    className="detalle-venta"

                                                >

                                                    <td></td>

                                                    <td
                                                        colSpan={3}
                                                    >

                                                        {prod.descripcion}

                                                    </td>

                                                    <td>

                                                        -

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </>

                                );

                            })

                        }

                        {

                            otrosMovimientos.map((m, index) => (

                                <tr key={index}>

                                    <td>

                                        {
                                            new Date(
                                                m.fecha
                                            ).toLocaleString()
                                        }

                                    </td>

                                    <td>

                                        {m.tipo}

                                    </td>

                                    <td>

                                        {m.usuario}

                                    </td>

                                    <td>

                                        {m.descripcion}

                                    </td>

                                    <td>

                                        -

                                    </td>

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