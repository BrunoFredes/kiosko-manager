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
    obtenerHistorialCajas,
    type Caja
} from "../../services/cajaService";

import HistorialCajas
    from "./HistorialCajas";

type Vista =
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

    const [ultimaCaja, setUltimaCaja] =
        useState<Caja | null>(null);

    const [cargando, setCargando] =
        useState(false);

    const [vista, setVista] =
        useState<Vista>("CAJA");

    const [historialAbierto, setHistorialAbierto] =
        useState(false);

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

            if (data.abierta) {

                setCaja(data.caja);

                setUltimaCaja(null);

                return;
            }

            setCaja(null);

            /*
             * Si no hay una caja abierta,
             * obtenemos la última caja cerrada
             * para mostrar información útil.
             */
            const historial =
                await obtenerHistorialCajas();

            if (historial.length > 0) {

                setUltimaCaja(
                    historial[0]
                );
            }
            else {

                setUltimaCaja(null);

            }

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

        if (!abierto)
            return;

        setVista("CAJA");

        cargarCaja();

    }, [abierto]);

    // =====================================================
    // ABRIR
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

        try {

            await registrarMovimientoCaja({

                tipoMovimiento:
                    vista === "INGRESO"
                        ? "INGRESO"
                        : "EGRESO",

                monto,

                descripcion:
                    descripcionMovimiento
                        .trim() || undefined

            });

            setMontoMovimiento("");

            setDescripcionMovimiento("");

            setVista("CAJA");

            await cargarCaja();

        }
        catch (error) {

            console.error(error);

            alert(
                "No se pudo registrar el movimiento."
            );

        }
    }

    // =====================================================
    // CERRAR
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
                        observacionCierre
                            .trim() || undefined
                }
            );

            setMontoFinal("");

            setObservacionCierre("");

            await cargarCaja();

            setVista("CAJA");

        }
        catch (error) {

            console.error(error);

            alert(
                "No se pudo cerrar la caja."
            );

        }
    }

    const montoContado =
        Number(montoFinal);

    const diferenciaCierre =
        caja &&
        Number.isFinite(montoContado)
            ? montoContado -
              (caja.montoEsperado ?? 0)
            : null;

    function volverCaja() {

        setMontoMovimiento("");

        setDescripcionMovimiento("");

        setMontoFinal("");

        setObservacionCierre("");

        setVista("CAJA");

    }

    if (!abierto)
        return null;

    return (

        <>

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

                    {/* =================================
                        HEADER
                    ================================= */}

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


                    {/* =================================
                        LOADING
                    ================================= */}

                    {cargando ? (

                        <div className="gestion-caja-loading">
                            Cargando...
                        </div>

                    ) : vista === "CAJA" ? (

                        /* =================================
                           VISTA CAJA
                        ================================= */

                        caja ? (

                            <>

                                <div className="caja-datos-grid">

                                    <div className="caja-dato">

                                        <span>
                                            Usuario
                                        </span>

                                        <strong>
                                            {
                                                caja.usuarioApertura
                                            }
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
                                            setVista(
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
                                            setVista(
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
                                            setVista(
                                                "CIERRE"
                                            )
                                        }
                                    >
                                        Cerrar caja
                                    </button>

                                </div>


                                <button
                                    type="button"
                                    className="btn-historial-cajas"
                                    onClick={() =>
                                        setHistorialAbierto(
                                            true
                                        )
                                    }
                                >
                                    Ver historial de cajas
                                </button>

                            </>

                        ) : (

                            /* =================================
                               CAJA CERRADA
                            ================================= */

                            <div className="caja-sin-abrir">

                                <h3>
                                    No hay una caja abierta
                                </h3>

                                {ultimaCaja ? (

                                    <div className="ultima-caja">

                                        <div>

                                            <span>
                                                Última caja
                                            </span>

                                            <strong>
                                                Caja #
                                                {
                                                    ultimaCaja.idCaja
                                                }
                                            </strong>

                                        </div>

                                        {ultimaCaja.diferencia != null && (

                                            <div>

                                                <span>
                                                    Diferencia
                                                </span>

                                                <strong
                                                    className={
                                                        ultimaCaja.diferencia > 0
                                                            ? "diferencia-positiva"
                                                            : ultimaCaja.diferencia < 0
                                                                ? "diferencia-negativa"
                                                                : "diferencia-cero"
                                                    }
                                                >

                                                    {ultimaCaja.diferencia > 0
                                                        ? "+"
                                                        : ""}

                                                    $
                                                    {ultimaCaja.diferencia.toFixed(2)}

                                                </strong>

                                            </div>

                                        )}

                                    </div>

                                ) : (

                                    <p>
                                        Todavía no hay cajas
                                        registradas.
                                    </p>

                                )}

                                <label>
                                    Monto inicial
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        montoInicial
                                    }
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

                                <button
                                    type="button"
                                    className="btn-historial-cajas"
                                    onClick={() =>
                                        setHistorialAbierto(
                                            true
                                        )
                                    }
                                >
                                    Ver historial de cajas
                                </button>

                            </div>

                        )

                    ) : vista === "INGRESO" || vista === "EGRESO" ? (

                        /* =================================
                           INGRESO / EGRESO
                        ================================= */

                        <div className="caja-form">

                            <h3>
                                {vista === "INGRESO"
                                    ? "Agregar ingreso"
                                    : "Registrar egreso"}
                            </h3>

                            <p className="form-ayuda">

                                {vista === "INGRESO"
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
                                value={
                                    montoMovimiento
                                }
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
                                    vista === "INGRESO"
                                        ? "Ej: Dinero aportado por el dueño"
                                        : "Ej: Pago a proveedor"
                                }
                            />

                            <div className="modal-acciones">

                                <button
                                    type="button"
                                    className="btn-volver"
                                    onClick={
                                        volverCaja
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className={
                                        vista === "INGRESO"
                                            ? "btn-ingreso"
                                            : "btn-egreso"
                                    }
                                    onClick={
                                        handleRegistrarMovimiento
                                    }
                                >
                                    {vista === "INGRESO"
                                        ? "Registrar ingreso"
                                        : "Registrar egreso"}
                                </button>

                            </div>

                        </div>

                    ) : (

                        /* =================================
                           CIERRE
                        ================================= */

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
                                value={
                                    montoFinal
                                }
                                onChange={(event) =>
                                    setMontoFinal(
                                        event.target.value
                                    )
                                }
                                placeholder="0.00"
                                autoFocus
                            />

                            {diferenciaCierre != null && (

                                <div
                                    className={
                                        diferenciaCierre > 0
                                            ? "cierre-diferencia positiva"
                                            : diferenciaCierre < 0
                                                ? "cierre-diferencia negativa"
                                                : "cierre-diferencia cero"
                                    }
                                >

                                    <span>
                                        Diferencia
                                    </span>

                                    <strong>

                                        {diferenciaCierre > 0
                                            ? "+"
                                            : ""}

                                        $
                                        {diferenciaCierre.toFixed(2)}

                                    </strong>

                                </div>

                            )}

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
                                    onClick={
                                        volverCaja
                                    }
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


            <HistorialCajas
                abierto={
                    historialAbierto
                }
                onCerrar={() =>
                    setHistorialAbierto(
                        false
                    )
                }
            />

        </>

    );
}

export default GestionCaja;