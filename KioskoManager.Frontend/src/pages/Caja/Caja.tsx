import { useState } from "react";
import { buscarPorCodigo } from "../../services/productoService";
import "./Caja.css";

interface Producto {

    idProducto: number;
    nombreProducto: string;
    precioVenta: number;
    codigoBarras: string;

}

interface ItemCarrito {

    producto: Producto;
    cantidad: number;

}

function Caja() {

    const [codigo, setCodigo] = useState("");

    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

    async function handleBuscar(
        e: React.KeyboardEvent<HTMLInputElement>
    ) {

        if (e.key !== "Enter") return;

        const producto =
            await buscarPorCodigo(codigo);

        if (!producto) {

            alert("Producto no encontrado");

            setCodigo("");

            return;

        }

        setCarrito((carritoActual) => {

            const existente =
                carritoActual.find(
                    item =>
                        item.producto.idProducto ===
                        producto.idProducto
                );

            if (existente) {

                return carritoActual.map(item =>

                    item.producto.idProducto ===
                    producto.idProducto

                        ? {
                            ...item,
                            cantidad: item.cantidad + 1
                        }

                        : item

                );

            }

            return [

                ...carritoActual,

                {
                    producto,
                    cantidad: 1
                }

            ];

        });

        setCodigo("");

    }

    function eliminarProducto(
        idProducto: number
    ) {

        setCarrito(

            carrito.filter(
                item =>
                    item.producto.idProducto !==
                    idProducto
            )

        );

    }

    const total =
        carrito.reduce(

            (acc, item) =>

                acc +
                item.producto.precioVenta *
                item.cantidad,

            0

        );

    return (

        <div className="caja-container">

            <div className="productos-panel">

                <h2>Caja</h2>

                <input

                    autoFocus

                    className="buscar-producto"

                    placeholder="Escanear código..."

                    value={codigo}

                    onChange={(e) =>
                        setCodigo(e.target.value)
                    }

                    onKeyDown={handleBuscar}

                />

            </div>

            <div className="venta-panel">

                <h2>Venta actual</h2>

                {

                    carrito.map(item => (

                        <div
                            key={item.producto.idProducto}
                            className="venta-item"
                        >

                            <div>

                                <strong>

                                    {item.producto.nombreProducto}

                                </strong>

                                <br />

                                x{item.cantidad}

                            </div>

                            <div>

                                $

                                {

                                    item.producto.precioVenta *

                                    item.cantidad

                                }

                            </div>

                            <button

                                onClick={() =>
                                    eliminarProducto(
                                        item.producto.idProducto
                                    )
                                }

                            >

                                ❌

                            </button>

                        </div>

                    ))

                }

                <hr />

                <h2>

                    Total:

                    ${total}

                </h2>

                <button
                    className="btn-confirmar"
                >

                    Confirmar venta

                </button>

            </div>

        </div>

    );

}

export default Caja;