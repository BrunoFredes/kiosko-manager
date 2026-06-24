import { useEffect, useMemo, useState } from "react";
import "./ConfirmarVentaModal.css";

interface Producto {

    idProducto: number;
    nombreProducto: string;
    precioVenta: number;

}

interface ItemCarrito {

    producto: Producto;
    cantidad: number;

}

interface Props {

    abierto: boolean;

    carrito: ItemCarrito[];


    onCerrar: () => void;

    onConfirmar: (

        metodoPago: string,

        recibido: number

    ) => void;

}

function ConfirmarVentaModal({

    abierto,

    carrito,


    onCerrar,

    onConfirmar

}: Props) {

    const [metodoPago, setMetodoPago] =
        useState("EFECTIVO");

    const [recibido, setRecibido] =
        useState("");

       const total = useMemo(() => {

            return carrito.reduce(

                (acc, item) =>

                    acc +

                    item.producto.precioVenta *

                    item.cantidad,

                0

            );

        }, [carrito]);

    const vuelto = useMemo(() => {

        const dinero = Number(recibido);

        if (isNaN(dinero))
            return 0;

        return dinero - total;

    }, [recibido, total]);

    useEffect(() => {

        function handleEscape(e: KeyboardEvent) {

            if (e.key === "Escape")
                onCerrar();

        }

        if (abierto) {

            window.addEventListener(
                "keydown",
                handleEscape
            );

        }

        return () =>

            window.removeEventListener(
                "keydown",
                handleEscape
            );

    }, [abierto]);

    if (!abierto)
        return null;

    return (

        <div

            className="modal-overlay"

            onClick={onCerrar}

        >

            <div

                className="modal-confirmar"

                onClick={(e) =>
                    e.stopPropagation()
                }

            >

                <h2>

                    Confirmar venta

                </h2>

                <div className="resumen">

                    <span>

                        Productos

                    </span>

                    <span>

                        {

                            carrito.reduce(

                                (acc, item) =>

                                    acc +

                                    item.cantidad,

                                0

                            )

                        }

                    </span>

                </div>

                <div className="resumen">

                    <span>

                        Total

                    </span>

                    <strong>

                        ${total.toFixed(2)}

                    </strong>

                </div>

                <hr />

                <label>

                    Metodo de pago

                </label>

                <select

                    value={metodoPago}

                    onChange={(e) =>
                        setMetodoPago(
                            e.target.value
                        )
                    }

                >

                    <option value="EFECTIVO">

                        Efectivo

                    </option>

                    <option value="DEBITO">

                        Tarjeta Debito

                    </option>

                    <option value="CREDITO">

                        Tarjeta Credito

                    </option>

                    <option value="TRANSFERENCIA">

                        Transferencia

                    </option>

                </select>

                {

                    metodoPago === "EFECTIVO" && (

                        <>

                            <label>

                                Recibido

                            </label>

                            <input

                                type="number"

                                value={recibido}

                                onChange={(e) =>
                                    setRecibido(
                                        e.target.value
                                    )
                                }

                            />

                            <div className="vuelto">

                                Vuelto

                                <strong>

                                    ${

                                        vuelto >= 0

                                            ? vuelto.toFixed(2)

                                            : "0.00"

                                    }

                                </strong>

                            </div>

                        </>

                    )

                }

                <div className="acciones">

                    <button

                        className="btn-cancelar"

                        onClick={onCerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        className="btn-confirmar"

                        onClick={() =>

                            onConfirmar(

                                metodoPago,

                                Number(recibido)

                            )

                        }

                    >

                        Confirmar venta

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmarVentaModal;