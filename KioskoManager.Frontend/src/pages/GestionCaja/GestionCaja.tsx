import {
    useEffect,
    useState
} from "react";

import "./GestionCaja.css";

import {
    obtenerCajaActual,
    abrirCaja,
    registrarMovimientoCaja,
    cerrarCaja,
    type Caja
} from "../../services/cajaService";

type ModalVista =
    | "CAJA"
    | "INGRESO"
    | "EGRESO"
    | "CIERRE";

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

    const [modalVista, setModalVista] =
        useState<ModalVista>("CAJA");

    const [montoInicial, setMontoInicial] =
        useState("");

    const [montoMovimiento, setMontoMovimiento] =
        useState("");

    const [descripcionMovimiento, setDescripcionMovimiento] =
        useState("");

    const [montoFinal, setMontoFinal] =
        useState("");

    const [observacionCierre, setObservacionCierre] =
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

            setModalVista("CAJA");

        }

    }, [abierto]);

    // =====================================================
    // ABRIR CAJA
    // =====================================================

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

    // =====================================================
    // INGRESO / EGRESO
    // =====================================================

    async function handleRegistrarMovimiento() {

        if (!caja)
            return;

        const monto =
            Number(montoMovimiento);

        if (
            !Number.isFinite(monto) ||
            monto <= 0
        ) {

            alert(
                "Ingresá un monto mayor a 0."
            );

            return;
        }

        const tipo =
            modalVista === "INGRESO"
                ? "INGRESO"
                : "EGRESO";

        try {

            await registrarMovimientoCaja({

                tipoMovimiento: tipo,

                monto,

                descripcion:
                    descripcionMovimiento.trim()
                        || undefined

            });

            setMontoMovimiento("");

            setDescripcionMovimiento("");

            setModalVista("CAJA");

            await cargarCaja();

        }
        catch (error) {

            console.error(
                "ERROR REGISTRANDO MOVIMIENTO:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo registrar el movimiento."
            );
        }
    }

    // =====================================================
    // CERRAR CAJA
    // =====================================================

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
                        observacionCierre.trim()
                            || undefined
                }
            );

            setMontoFinal("");

            setObservacionCierre("");

            await cargarCaja();

            setModalVista("CAJA");

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
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="gestion-caja-header">

                    <div>

                        <h2>
                            Caja
                        </h2>

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
                        type="button"
                        className="btn-cerrar-modal"
                        onClick={onCerrar}
                    >
                        ×
                    </button>

                </div>


                {/* =====================================================
                    LOADING
                ===================================================== */}

                {cargando ? (

                    <div className="gestion-caja-loading">

                        Cargando caja...

                    </div>

                ) : modalVista === "CAJA" ? (

                    /* =====================================================
                       VISTA PRINCIPAL
                    ===================================================== */

                    caja ? (

                        <>

                            <div className="caja-datos-grid">

                                <div className="caja-dato">

                                    <span>
                                        Usuario
                                    </span>

                                    <strong>
                                        {caja.usuarioApertura}
                                    </strong>

                                </div>

                                <div className="caja-dato">

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

                                <div className="caja-resumen-item">

                                    <span>
                                        Monto inicial
                                    </span>

                                    <strong>
                                        $
                                        {caja.montoInicial.toFixed(2)}
                                    </strong>

                                </div>

                                <div className="caja-resumen-item destacado">

                                    <span>
                                        Efectivo esperado
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


                            <div className="caja-botones">

                                <button
                                    type="button"
                                    className="btn-ingreso"
                                    onClick={() =>
                                        setModalVista(
                                            "INGRESO"
                                        )
                                    }
                                >
                                    + Ingreso
                                </button>

                                <button
                                    type="button"
                                    className="btn-egreso"
                                    onClick={() =>
                                        setModalVista(
                                            "EGRESO"
                                        )
                                    }
                                >
                                    − Egreso
                                </button>

                            </div>


                            <div className="caja-botones-secundarios">

                                <button
                                    type="button"
                                    className="btn-actualizar"
                                    onClick={
                                        cargarCaja
                                    }
                                >
                                    Actualizar
                                </button>

                                <button
                                    type="button"
                                    className="btn-cerrar-caja"
                                    onClick={() =>
                                        setModalVista(
                                            "CIERRE"
                                        )
                                    }
                                >
                                    Cerrar caja
                                </button>

                            </div>

                        </>

                    ) : (

                        /* =====================================================
                           CAJA CERRADA
                        ===================================================== */

                        <div className="caja-sin-abrir">

                            <h3>
                                No hay una caja abierta
                            </h3>

                            <p>
                                Ingresá el dinero con el
                                que comienza la jornada.
                            </p>

                            <label>
                                Monto inicial
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={montoInicial}
                                onChange={(event) =>
                                    setMontoInicial(
                                        event.target.value
                                    )
                                }
                                placeholder="0.00"
                                autoFocus
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

                    )

                ) : modalVista === "INGRESO" || modalVista === "EGRESO" ? (

                    /* =====================================================
                       INGRESO / EGRESO
                    ===================================================== */

                    <div className="caja-form">

                        <h3>
                            {modalVista === "INGRESO"
                                ? "Agregar ingreso"
                                : "Registrar egreso"}
                        </h3>

                        <p className="form-ayuda">

                            {modalVista === "INGRESO"
                                ? "Dinero que entra físicamente a la caja."
                                : "Dinero que sale físicamente de la caja."}

                        </p>

                        <label>
                            Monto
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={montoMovimiento}
                            onChange={(event) =>
                                setMontoMovimiento(
                                    event.target.value
                                )
                            }
                            placeholder="0.00"
                            autoFocus
                        />

                        <label>
                            Concepto
                        </label>

                        <textarea
                            value={
                                descripcionMovimiento
                            }
                            onChange={(event) =>
                                setDescripcionMovimiento(
                                    event.target.value
                                )
                            }
                            placeholder={
                                modalVista === "INGRESO"
                                    ? "Ej: Dinero aportado por el dueño"
                                    : "Ej: Pago a proveedor"
                            }
                        />

                        <div className="modal-acciones">

                            <button
                                type="button"
                                className="btn-volver"
                                onClick={() => {

                                    setMontoMovimiento("");

                                    setDescripcionMovimiento("");

                                    setModalVista("CAJA");

                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className={
                                    modalVista === "INGRESO"
                                        ? "btn-ingreso"
                                        : "btn-egreso"
                                }
                                onClick={
                                    handleRegistrarMovimiento
                                }
                            >
                                {modalVista === "INGRESO"
                                    ? "Registrar ingreso"
                                    : "Registrar egreso"}
                            </button>

                        </div>

                    </div>

                ) : (

                    /* =====================================================
                       CIERRE
                    ===================================================== */

                    <div className="caja-form">

                        <h3>
                            Cerrar caja
                        </h3>

                        <div className="cierre-esperado">

                            <span>
                                Efectivo esperado
                            </span>

                            <strong>
                                $
                                {(
                                    caja?.montoEsperado
                                    ?? 0
                                ).toFixed(2)}
                            </strong>

                        </div>

                        <label>
                            Dinero contado
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={montoFinal}
                            onChange={(event) =>
                                setMontoFinal(
                                    event.target.value
                                )
                            }
                            placeholder="0.00"
                            autoFocus
                        />

                        <label>
                            Observación
                        </label>

                        <textarea
                            value={
                                observacionCierre
                            }
                            onChange={(event) =>
                                setObservacionCierre(
                                    event.target.value
                                )
                            }
                            placeholder="Opcional"
                        />

                        <div className="modal-acciones">

                            <button
                                type="button"
                                className="btn-volver"
                                onClick={() => {

                                    setMontoFinal("");

                                    setObservacionCierre("");

                                    setModalVista("CAJA");

                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-cerrar-caja"
                                onClick={
                                    handleCerrarCaja
                                }
                            >
                                Confirmar cierre
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
}

export default GestionCaja;