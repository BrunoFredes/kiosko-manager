import {
    useEffect,
    useState
} from "react";

import "./HistorialCajas.css";

import {
    obtenerHistorialCajas,
    obtenerDetalleCaja,
    type Caja,
    type CajaDetalleDto,
    type MovimientoCajaDto
} from "../../services/cajaService";

interface Props {
    abierto: boolean;
    onCerrar: () => void;
}

function HistorialCajas({
    abierto,
    onCerrar
}: Props) {

    const [
        cajas,
        setCajas
    ] = useState<Caja[]>([]);

    const [
        cargando,
        setCargando
    ] = useState(false);

    const [
        cajaExpandida,
        setCajaExpandida
    ] = useState<number | null>(null);

    const [
        detalles,
        setDetalles
    ] = useState<
        Record<number, CajaDetalleDto>
    >({});

    const [
        cargandoDetalle,
        setCargandoDetalle
    ] = useState<number | null>(null);

    useEffect(() => {

        if (!abierto)
            return;

        cargarHistorial();

    }, [abierto]);

    async function cargarHistorial() {

        try {

            setCargando(true);

            const data =
                await obtenerHistorialCajas();

            setCajas(data);

            setCajaExpandida(null);

        }
        catch (error) {

            console.error(
                "Error al cargar historial de cajas:",
                error
            );

        }
        finally {

            setCargando(false);

        }
    }

    async function toggleCaja(
        idCaja: number
    ) {

        if (
            cajaExpandida === idCaja
        ) {

            setCajaExpandida(null);

            return;

        }

        setCajaExpandida(idCaja);

        if (detalles[idCaja])
            return;

        try {

            setCargandoDetalle(idCaja);

            const detalle =
                await obtenerDetalleCaja(
                    idCaja
                );

            setDetalles(
                anteriores => ({
                    ...anteriores,
                    [idCaja]: detalle
                })
            );

        }
        catch (error) {

            console.error(
                "Error al cargar detalle de caja:",
                error
            );

        }
        finally {

            setCargandoDetalle(null);

        }
    }

    if (!abierto)
        return null;

    return (

        <div
            className="historial-cajas-overlay"
            onClick={onCerrar}
        >

            <div
                className="historial-cajas-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="historial-cajas-header">

                    <div>

                        <h2>
                            Historial de cajas
                        </h2>

                        <p>
                            Aperturas y cierres registrados
                        </p>

                    </div>

                    <button
                        type="button"
                        className="historial-cajas-cerrar"
                        onClick={onCerrar}
                    >
                        ×
                    </button>

                </div>

                {cargando ? (

                    <div className="historial-cajas-loading">
                        Cargando...
                    </div>

                ) : cajas.length === 0 ? (

                    <div className="historial-cajas-vacio">
                        No hay cajas registradas.
                    </div>

                ) : (

                    <div className="historial-cajas-lista">

                        {cajas.map(
                            (caja) => {

                                const diferencia =
                                    caja.diferencia ?? 0;

                                const claseDiferencia =
                                    diferencia > 0
                                        ? "diferencia-positiva"
                                        : diferencia < 0
                                            ? "diferencia-negativa"
                                            : "diferencia-cero";

                                const expandida =
                                    cajaExpandida ===
                                    caja.idCaja;

                                const detalle =
                                    detalles[
                                        caja.idCaja
                                    ];

                                return (

                                    <div
                                        key={
                                            caja.idCaja
                                        }
                                        className={
                                            expandida
                                                ? "historial-caja-item expandida"
                                                : "historial-caja-item"
                                        }
                                    >

                                        <button
                                            type="button"
                                            className="historial-caja-clickable"
                                            onClick={() =>
                                                toggleCaja(
                                                    caja.idCaja
                                                )
                                            }
                                        >

                                            <div className="historial-caja-item-header">

                                                <div className="historial-caja-titulo">

                                                    <span className="historial-caja-flecha">
                                                        {expandida
                                                            ? "▼"
                                                            : "▶"}
                                                    </span>

                                                    <strong>
                                                        Caja #
                                                        {
                                                            caja.idCaja
                                                        }
                                                    </strong>

                                                </div>

                                                <span
                                                    className={
                                                        caja.estado ===
                                                        "CERRADA"
                                                            ? "badge-cerrada"
                                                            : "badge-abierta"
                                                    }
                                                >
                                                    {caja.estado}
                                                </span>

                                            </div>

                                            <div className="historial-caja-info">

                                                <div>

                                                    <span>
                                                        Apertura
                                                    </span>

                                                    <strong>
                                                        {new Date(
                                                            caja.fechaApertura
                                                        ).toLocaleString()}
                                                    </strong>

                                                </div>

                                                <div>

                                                    <span>
                                                        Abrió
                                                    </span>

                                                    <strong>
                                                        {
                                                            caja.usuarioApertura
                                                        }
                                                    </strong>

                                                </div>

                                                {caja.estado ===
                                                    "CERRADA" && (

                                                    <>

                                                        <div>

                                                            <span>
                                                                Cierre
                                                            </span>

                                                            <strong>
                                                                {caja.fechaCierre
                                                                    ? new Date(
                                                                        caja.fechaCierre
                                                                    ).toLocaleString()
                                                                    : "-"}
                                                            </strong>

                                                        </div>

                                                        <div>

                                                            <span>
                                                                Cerró
                                                            </span>

                                                            <strong>
                                                                {
                                                                    caja.usuarioCierre ??
                                                                    "-"
                                                                }
                                                            </strong>

                                                        </div>

                                                    </>

                                                )}

                                            </div>

                                            {caja.estado ===
                                                "CERRADA" && (

                                                <div className="historial-caja-montos">

                                                    <div>

                                                        <span>
                                                            Inicial
                                                        </span>

                                                        <strong>
                                                            $
                                                            {caja.montoInicial.toFixed(
                                                                2
                                                            )}
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Esperado
                                                        </span>

                                                        <strong>
                                                            $
                                                            {(
                                                                caja.montoEsperado ??
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Contado
                                                        </span>

                                                        <strong>
                                                            $
                                                            {(
                                                                caja.montoFinal ??
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Diferencia
                                                        </span>

                                                        <strong
                                                            className={
                                                                claseDiferencia
                                                            }
                                                        >

                                                            {diferencia >
                                                            0
                                                                ? "+"
                                                                : diferencia <
                                                                    0
                                                                    ? "-"
                                                                    : ""}

                                                            $
                                                            {Math.abs(
                                                                diferencia
                                                            ).toFixed(
                                                                2
                                                            )}

                                                        </strong>

                                                    </div>

                                                </div>

                                            )}

                                        </button>

                                        {expandida && (

                                            <div className="historial-caja-detalle">

                                                {cargandoDetalle ===
                                                caja.idCaja ? (

                                                    <div className="historial-detalle-loading">
                                                        Cargando detalle...
                                                    </div>

                                                ) : detalle ? (

                                                    <>

                                                        <div className="historial-detalle-resumen">

                                                            <div>

                                                                <span>
                                                                    Ingresos
                                                                </span>

                                                                <strong className="detalle-positivo">
                                                                    +
                                                                    $
                                                                    {detalle.totalIngresos.toFixed(
                                                                        2
                                                                    )}
                                                                </strong>

                                                            </div>

                                                            <div>

                                                                <span>
                                                                    Egresos
                                                                </span>

                                                                <strong className="detalle-negativo">
                                                                    -
                                                                    $
                                                                    {detalle.totalEgresos.toFixed(
                                                                        2
                                                                    )}
                                                                </strong>

                                                            </div>

                                                        </div>

                                                        {caja.observacion && (

                                                            <div className="historial-observacion">

                                                                <span>
                                                                    Observación
                                                                </span>

                                                                <p>
                                                                    {
                                                                        caja.observacion
                                                                    }
                                                                </p>

                                                            </div>

                                                        )}

                                                        <div className="historial-movimientos-titulo">
                                                            Movimientos
                                                        </div>

                                                        {detalle.movimientos.length ===
                                                        0 ? (

                                                            <div className="historial-movimientos-vacio">
                                                                No hubo ingresos ni egresos manuales en esta caja.
                                                            </div>

                                                        ) : (

                                                            <div className="historial-movimientos-lista">

                                                                {detalle.movimientos.map(
                                                                    (
                                                                        movimiento
                                                                    ) => (
                                                                        <MovimientoItem
                                                                            key={
                                                                                movimiento.idMovimientoCaja
                                                                            }
                                                                            movimiento={
                                                                                movimiento
                                                                            }
                                                                        />
                                                                    )
                                                                )}

                                                            </div>

                                                        )}

                                                    </>

                                                ) : (

                                                    <div className="historial-detalle-error">
                                                        No se pudo cargar el detalle.
                                                    </div>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );
}

function MovimientoItem({
    movimiento
}: {
    movimiento: MovimientoCajaDto;
}) {

    const ingreso =
        movimiento.tipoMovimiento ===
        "INGRESO";

    return (

        <div className="historial-movimiento">

            <div className="historial-movimiento-icono">

                {ingreso
                    ? "+"
                    : "−"}

            </div>

            <div className="historial-movimiento-info">

                <strong>
                    {ingreso
                        ? "Ingreso"
                        : "Egreso"}
                </strong>

                <span>
                    {movimiento.descripcion ||
                        "Sin descripción"}
                </span>

                <small>
                    {new Date(
                        movimiento.fechaMovimiento
                    ).toLocaleString()}
                </small>

            </div>

            <strong
                className={
                    ingreso
                        ? "detalle-positivo"
                        : "detalle-negativo"
                }
            >

                {ingreso
                    ? "+"
                    : "-"}

                $
                {movimiento.monto.toFixed(
                    2
                )}

            </strong>

        </div>

    );
}

export default HistorialCajas;