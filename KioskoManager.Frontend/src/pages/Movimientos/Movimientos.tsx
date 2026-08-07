import { useEffect, useState } from "react";
import "./Movimientos.css";

import {
    obtenerMovimientos,
    type Movimiento
} from "../../services/movimientoService";

function obtenerNumeroVenta(descripcion: string) {
    const match = descripcion.match(/Venta #(\d+)/);
    return match ? match[1] : null;
}

function esCabeceraVenta(m: Movimiento) {
    return (
        m.tipo === "VENTA" &&
        /^Venta #\d+$/.test(m.descripcion)
    );
}

function Movimientos() {

    const [movimientos, setMovimientos] =
        useState<Movimiento[]>([]);

    const [ventaExpandida, setVentaExpandida] =
        useState<string | null>(null);

    const [movimientoExpandido, setMovimientoExpandido] =
    useState<number | null>(null);

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

                            movimientos.map((m, index) => {

                                // CABECERA DE VENTA
                                if (esCabeceraVenta(m)) {

                                    const numeroVenta =
                                        obtenerNumeroVenta(m.descripcion)!;

                                    const abierta =
                                        ventaExpandida === numeroVenta;

                                    const detalles = movimientos.filter(x =>
                                        x.tipo === "VENTA" &&
                                        !esCabeceraVenta(x) &&
                                        obtenerNumeroVenta(x.descripcion) === numeroVenta
                                    );

                                    return (

                                        <>

                                            <tr key={index} className="fila-venta">

                                                <td>

                                                    {new Date(
                                                        m.fecha
                                                    ).toLocaleString()}

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn-expandir"
                                                        onClick={() =>

                                                            setVentaExpandida(

                                                                abierta
                                                                    ? null
                                                                    : numeroVenta

                                                            )

                                                        }
                                                    >

                                                        {abierta ? "▼" : "▶"} Venta

                                                    </button>

                                                </td>

                                                <td>{m.usuario}</td>

                                                <td>{m.descripcion}</td>

                                                <td>

                                                    {m.monto != null
                                                        ? `$${m.monto.toFixed(2)}`
                                                        : "-"}

                                                </td>

                                            </tr>

                                            {

                                                abierta &&

                                                detalles.map((d, i) => (

                                                    <tr
                                                        key={`${index}-${i}`}
                                                        className="detalle-venta"
                                                    >

                                                        <td></td>

                                                        <td
                                                            style={{
                                                                paddingLeft: "30px"
                                                            }}
                                                        >

                                                            • Producto

                                                        </td>

                                                        <td></td>

                                                        <td>

                                                            {d.descripcion}

                                                        </td>

                                                        <td>

                                                            {d.monto != null
                                                                ? `$${d.monto.toFixed(2)}`
                                                                : "-"}

                                                        </td>

                                                    </tr>

                                                ))

                                            }

                                        </>

                                    );

                                }

                                // INGRESOS / EGRESOS
                                if (m.tipo !== "VENTA") {

                                    const abierto =
                                        movimientoExpandido === m.idReferencia;

                                    return (
                                        <>
                                            <tr key={m.idReferencia}>

                                                <td>
                                                    {new Date(m.fecha).toLocaleString()}
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn-expandir"
                                                        onClick={() =>
                                                            setMovimientoExpandido(
                                                                abierto
                                                                    ? null
                                                                    : m.idReferencia
                                                            )
                                                        }
                                                    >
                                                        {abierto ? "▼" : "▶"} {m.tipo}
                                                    </button>

                                                </td>

                                                <td>{m.usuario}</td>

                                                <td>
                                                    {m.nombreProducto ?? "-"}
                                                </td>

                                                <td
                                                    className={
                                                        m.tipo === "INGRESO"
                                                            ? "positivo"
                                                            : "negativo"
                                                    }
                                                >
                                                    {m.tipo === "INGRESO" ? "+" : "-"}
                                                    {m.cantidad}
                                                </td>

                                            </tr>

                                            {
                                                abierto &&

                                                <tr className="detalle-venta">

                                                    <td></td>

                                                    <td
                                                        style={{
                                                            paddingLeft: "30px"
                                                        }}
                                                    >
                                                        Observación
                                                    </td>

                                                    <td></td>

                                                    <td colSpan={2}>
                                                        {m.descripcion}
                                                    </td>

                                                </tr>
                                            }

                                        </>
                                    );

                                }

                                

                                // LOS DETALLES DE VENTA NO SE PINTAN AQUÍ
                                return null;

                            })

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Movimientos;