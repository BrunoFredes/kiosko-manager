import {
    useEffect,
    useState
} from "react";

import "./HistorialCajas.css";

import {
    obtenerHistorialCajas,
    type Caja
} from "../../services/cajaService";

interface Props {
    abierto: boolean;
    onCerrar: () => void;
}

function HistorialCajas({
    abierto,
    onCerrar
}: Props) {

    const [cajas, setCajas] =
        useState<Caja[]>([]);

    const [cargando, setCargando] =
        useState(false);

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

                        {cajas.map((caja) => {

                            const diferencia =
                                caja.diferencia ?? 0;

                            const claseDiferencia =
                                diferencia > 0
                                    ? "diferencia-positiva"
                                    : diferencia < 0
                                        ? "diferencia-negativa"
                                        : "diferencia-cero";

                            return (

                                <div
                                    key={caja.idCaja}
                                    className="historial-caja-item"
                                >

                                    <div className="historial-caja-item-header">

                                        <strong>
                                            Caja #{caja.idCaja}
                                        </strong>

                                        <span
                                            className={
                                                caja.estado === "CERRADA"
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
                                                Usuario
                                            </span>

                                            <strong>
                                                {
                                                    caja.usuarioApertura
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    {caja.estado === "CERRADA" && (

                                        <div className="historial-caja-montos">

                                            <div>

                                                <span>
                                                    Inicial
                                                </span>

                                                <strong>
                                                    $
                                                    {caja.montoInicial.toFixed(2)}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Esperado
                                                </span>

                                                <strong>
                                                    $
                                                    {(
                                                        caja.montoEsperado
                                                        ?? 0
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Contado
                                                </span>

                                                <strong>
                                                    $
                                                    {(
                                                        caja.montoFinal
                                                        ?? 0
                                                    ).toFixed(2)}
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

                                                    {diferencia > 0
                                                        ? "+"
                                                        : diferencia < 0
                                                            ? "-"
                                                            : ""}

                                                    $
                                                    {Math.abs(
                                                        diferencia
                                                    ).toFixed(2)}

                                                </strong>

                                            </div>

                                        </div>

                                    )}

                                    {caja.estado === "CERRADA" && (

                                        <div className="historial-caja-footer">

                                            <span>

                                                Cierre:
                                                {" "}
                                                {caja.fechaCierre
                                                    ? new Date(
                                                        caja.fechaCierre
                                                    ).toLocaleString()
                                                    : "-"}

                                            </span>

                                            <span>

                                                Cerró:
                                                {" "}
                                                {caja.usuarioCierre ?? "-"}

                                            </span>

                                        </div>

                                    )}

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>

    );
}

export default HistorialCajas;