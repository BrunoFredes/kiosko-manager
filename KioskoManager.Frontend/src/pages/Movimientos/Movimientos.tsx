import {
    Fragment,
    useEffect,
    useState
} from "react";

import "./Movimientos.css";

import {
    obtenerMovimientos,
    type Movimiento
} from "../../services/movimientoService";

import GestionCaja
    from "../GestionCaja/GestionCaja";

function obtenerNumeroVenta(
    descripcion: string
) {
    const match =
        descripcion.match(/Venta #(\d+)/);

    return match
        ? match[1]
        : null;
}

function esCabeceraVenta(
    movimiento: Movimiento
) {
    return (
        movimiento.tipo === "VENTA" &&
        /^Venta #\d+$/.test(
            movimiento.descripcion
        )
    );
}

function Movimientos() {

    const [
        movimientos,
        setMovimientos
    ] = useState<Movimiento[]>([]);

    const [
        ventaExpandida,
        setVentaExpandida
    ] = useState<string | null>(null);

    const [
        gestionCajaAbierta,
        setGestionCajaAbierta
    ] = useState(false);

    const [
        movimientoExpandido,
        setMovimientoExpandido
    ] = useState<number | null>(null);

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

            console.error(
                "Error al cargar movimientos:",
                error
            );

        }
    }

    /*
     * Evita que una misma venta se renderice
     * más de una vez si por algún motivo el
     * backend devuelve registros duplicados.
     */
    const ventasMostradas =
        new Set<number>();

    return (

        <div className="movimientos-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="movimientos-header">

                <h2>
                    Historial
                </h2>

                <button
                    type="button"
                    className="btn-ver-caja"
                    onClick={() =>
                        setGestionCajaAbierta(true)
                    }
                >
                    💰 Ver caja
                </button>

            </div>

            <GestionCaja
                abierto={gestionCajaAbierta}
                onCerrar={() =>
                    setGestionCajaAbierta(false)
                }
            />

            {/* =========================================
                TABLA DE MOVIMIENTOS
            ========================================= */}

            <div className="tabla-container">

                <table className="tabla-movimientos">

                    <thead>

                        <tr>

                            <th>
                                Fecha
                            </th>

                            <th>
                                Tipo
                            </th>

                            <th>
                                Usuario
                            </th>

                            <th>
                                Descripción
                            </th>

                            <th>
                                Monto
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {movimientos.map(
                            (movimiento, index) => {

                                // =====================================
                                // CABECERA DE VENTA
                                // =====================================

                                if (
                                    esCabeceraVenta(
                                        movimiento
                                    )
                                ) {

                                    const numeroVenta =
                                        obtenerNumeroVenta(
                                            movimiento.descripcion
                                        );

                                    if (!numeroVenta) {
                                        return null;
                                    }

                                    const idVenta =
                                        Number(
                                            numeroVenta
                                        );

                                    /*
                                     * Si ya mostramos esta venta,
                                     * no la volvemos a renderizar.
                                     */
                                    if (
                                        ventasMostradas.has(
                                            idVenta
                                        )
                                    ) {
                                        return null;
                                    }

                                    ventasMostradas.add(
                                        idVenta
                                    );

                                    const abierta =
                                        ventaExpandida ===
                                        numeroVenta;

                                    /*
                                     * Buscamos únicamente los
                                     * detalles pertenecientes
                                     * a esta venta.
                                     */
                                    const detalles =
                                        movimientos.filter(
                                            (detalle) =>
                                                detalle.tipo === "VENTA" &&
                                                !esCabeceraVenta(
                                                    detalle
                                                ) &&
                                                obtenerNumeroVenta(
                                                    detalle.descripcion
                                                ) === numeroVenta
                                        );

                                    return (

                                        <Fragment
                                            key={
                                                `venta-${idVenta}-${index}`
                                            }
                                        >

                                            <tr
                                                className="fila-venta"
                                            >

                                                <td>

                                                    {new Date(
                                                        movimiento.fecha
                                                    ).toLocaleString()}

                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="btn-expandir"
                                                        onClick={() =>
                                                            setVentaExpandida(
                                                                abierta
                                                                    ? null
                                                                    : numeroVenta
                                                            )
                                                        }
                                                    >

                                                        {abierta
                                                            ? "▼"
                                                            : "▶"}{" "}
                                                        Venta

                                                    </button>

                                                </td>

                                                <td>

                                                    {
                                                        movimiento.usuario
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        movimiento.descripcion
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        movimiento.monto != null
                                                            ? `$${movimiento.monto.toFixed(2)}`
                                                            : "-"
                                                    }

                                                </td>

                                            </tr>


                                            {/* =================================
                                                DETALLES DE LA VENTA
                                            ================================= */}

                                            {abierta &&
                                                detalles.map(
                                                    (
                                                        detalle,
                                                        detalleIndex
                                                    ) => (

                                                        <tr
                                                            key={
                                                                `detalle-${idVenta}-${detalleIndex}`
                                                            }
                                                            className="detalle-venta"
                                                        >

                                                            <td />

                                                            <td
                                                                style={{
                                                                    paddingLeft:
                                                                        "30px"
                                                                }}
                                                            >
                                                                • Producto
                                                            </td>

                                                            <td />

                                                            <td>

                                                                {
                                                                    detalle.descripcion
                                                                }

                                                            </td>

                                                            <td>

                                                                {
                                                                    detalle.monto != null
                                                                        ? `$${detalle.monto.toFixed(2)}`
                                                                        : "-"
                                                                }

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </Fragment>

                                    );
                                }


                                // =====================================
                                // INGRESOS / EGRESOS / OTROS MOVIMIENTOS
                                // =====================================

                                if (
                                    movimiento.tipo !== "VENTA"
                                ) {

                                    const abierto =
                                        movimientoExpandido ===
                                        movimiento.idReferencia;

                                    return (

                                        <Fragment
                                            key={
                                                `mov-${movimiento.idReferencia}-${index}`
                                            }
                                        >

                                            <tr>

                                                <td>

                                                    {new Date(
                                                        movimiento.fecha
                                                    ).toLocaleString()}

                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="btn-expandir"
                                                        onClick={() =>
                                                            setMovimientoExpandido(
                                                                abierto
                                                                    ? null
                                                                    : movimiento.idReferencia
                                                            )
                                                        }
                                                    >

                                                        {abierto
                                                            ? "▼"
                                                            : "▶"}{" "}
                                                        {
                                                            movimiento.tipo
                                                        }

                                                    </button>

                                                </td>

                                                <td>

                                                    {
                                                        movimiento.usuario
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        movimiento.nombreProducto ??
                                                        "-"
                                                    }

                                                </td>

                                                <td
                                                    className={
                                                        movimiento.tipo ===
                                                        "INGRESO"
                                                            ? "positivo"
                                                            : "negativo"
                                                    }
                                                >

                                                    {
                                                        movimiento.tipo ===
                                                        "INGRESO"
                                                            ? "+"
                                                            : "-"
                                                    }

                                                    {
                                                        movimiento.cantidad
                                                    }

                                                </td>

                                            </tr>


                                            {/* =================================
                                                OBSERVACIÓN
                                            ================================= */}

                                            {abierto && (

                                                <tr
                                                    className="detalle-venta"
                                                >

                                                    <td />

                                                    <td
                                                        style={{
                                                            paddingLeft:
                                                                "30px"
                                                        }}
                                                    >
                                                        Observación
                                                    </td>

                                                    <td />

                                                    <td colSpan={2}>

                                                        {
                                                            movimiento.descripcion ||
                                                            "Sin observación"
                                                        }

                                                    </td>

                                                </tr>

                                            )}

                                        </Fragment>

                                    );
                                }


                                // =====================================
                                // DETALLES DE VENTA
                                // NO SE RENDERIZAN DIRECTAMENTE
                                // =====================================

                                return null;

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default Movimientos;