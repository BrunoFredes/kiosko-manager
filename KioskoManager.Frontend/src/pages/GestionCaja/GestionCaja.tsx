import { useEffect, useState } from "react";
import "./GestionCaja.css";

import {
    obtenerCajaActual,
    abrirCaja,
    cerrarCaja,
    type Caja
} from "../../services/cajaService";

interface Props {
    abierto: boolean;
    onCerrar: () => void;
}

function GestionCaja({
    abierto,
    onCerrar
}: Props) {

    const [caja, setCaja] =
        useState<Caja | null>(null);

    const [cargando, setCargando] =
        useState(false);

    const [montoInicial, setMontoInicial] =
        useState("");

    const [montoFinal, setMontoFinal] =
        useState("");

    const [observacion, setObservacion] =
        useState("");

    async function cargarCaja() {

        try {

            setCargando(true);

            const data =
                await obtenerCajaActual();

            setCaja(
                data.abierta
                    ? data.caja
                    : null
            );

        }
        catch (error) {

            console.error(
                "Error al cargar caja:",
                error
            );

        }
        finally {

            setCargando(false);

        }
    }

    useEffect(() => {

        if (abierto) {
            cargarCaja();
        }

    }, [abierto]);

    async function handleAbrirCaja() {

        const monto =
            Number(montoInicial);

        if (
            !Number.isFinite(monto) ||
            monto < 0
        ) {

            alert(
                "Ingresá un monto inicial válido."
            );

            return;
        }

        try {

            await abrirCaja({
                montoInicial: monto
            });

            setMontoInicial("");

            await cargarCaja();

        }
        catch (error) {

            console.error(error);

            alert(
                "No se pudo abrir la caja."
            );

        }
    }

    async function handleCerrarCaja() {

        if (!caja)
            return;

        const monto =
            Number(montoFinal);

        if (
            !Number.isFinite(monto) ||
            monto < 0
        ) {

            alert(
                "Ingresá el dinero contado."
            );

            return;
        }

        try {

            await cerrarCaja(
                caja.idCaja,
                {
                    montoFinal: monto,
                    observacion:
                        observacion.trim() || undefined
                }
            );

            setMontoFinal("");
            setObservacion("");

            await cargarCaja();

        }
        catch (error) {

            console.error(error);

            alert(
                "No se pudo cerrar la caja."
            );

        }
    }

    if (!abierto)
        return null;

    return (

        <div
            className="gestion-caja-overlay"
            onClick={onCerrar}
        >

            <div
                className="gestion-caja-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="gestion-caja-header">

                    <div>

                        <h2>Caja</h2>

                        <span
                            className={
                                caja
                                    ? "estado-caja abierta"
                                    : "estado-caja cerrada"
                            }
                        >
                            {caja
                                ? "● Caja abierta"
                                : "● Caja cerrada"}
                        </span>

                    </div>

                    <button
                        className="btn-cerrar-modal"
                        onClick={onCerrar}
                        type="button"
                    >
                        ×
                    </button>

                </div>

                {cargando ? (

                    <div className="gestion-caja-loading">
                        Cargando...
                    </div>

                ) : caja ? (

                    <>

                        <div className="caja-datos">

                            <div>
                                <span>
                                    Usuario
                                </span>

                                <strong>
                                    {caja.usuarioApertura}
                                </strong>
                            </div>

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

                        </div>

                        <div className="caja-resumen">

                            <div>
                                <span>
                                    Inicial
                                </span>

                                <strong>
                                    $
                                    {caja.montoInicial
                                        .toFixed(2)}
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

                        </div>

                        <div className="caja-acciones">

                            <button
                                type="button"
                                className="btn-controlar"
                                onClick={cargarCaja}
                            >
                                Actualizar caja
                            </button>

                            <button
                                type="button"
                                className="btn-cerrar-caja"
                                onClick={handleCerrarCaja}
                            >
                                Cerrar caja
                            </button>

                        </div>

                        <div className="cierre-form">

                            <label>
                                Dinero contado al cerrar
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={montoFinal}
                                onChange={(e) =>
                                    setMontoFinal(
                                        e.target.value
                                    )
                                }
                                placeholder="Solo completar al cerrar"
                            />

                            <label>
                                Observación
                            </label>

                            <textarea
                                value={observacion}
                                onChange={(e) =>
                                    setObservacion(
                                        e.target.value
                                    )
                                }
                                placeholder="Opcional"
                            />

                        </div>

                    </>

                ) : (

                    <div className="caja-sin-abrir">

                        <h3>
                            No hay una caja abierta
                        </h3>

                        <p>
                            Ingresá el dinero con el
                            que comienza la jornada.
                        </p>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={montoInicial}
                            onChange={(e) =>
                                setMontoInicial(
                                    e.target.value
                                )
                            }
                            placeholder="Monto inicial"
                        />

                        <button
                            type="button"
                            className="btn-abrir-caja"
                            onClick={
                                handleAbrirCaja
                            }
                        >
                            Abrir caja
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}

export default GestionCaja;