import { useEffect, useState } from "react";
import {
    buscarPorCodigo,
    buscarProductos,
    buscarPorCategoria,
    obtenerTodosProductos
} from "../../services/productoService";

import "./Caja.css";
import { obtenerCategorias } from "../../services/categoriaService";

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

    const [categorias, setCategorias] =
        useState<any[]>([]);

    const [categoriaSeleccionada,
        setCategoriaSeleccionada] =
        useState<number | null>(null);

    const [textoBusqueda, setTextoBusqueda] =
        useState("");

    const [productosEncontrados, setProductosEncontrados] =
        useState<Producto[]>([]);

    const [carrito, setCarrito] =
        useState<ItemCarrito[]>([]);

    useEffect(() => {

        obtenerCategorias()

            .then(setCategorias)

            .catch(console.error);

    }, []);

    useEffect(() => {

        if (textoBusqueda.length < 2) {

            setProductosEncontrados([]);

            return;

        }

        buscarProductos(textoBusqueda)

            .then(setProductosEncontrados);

    }, [textoBusqueda]);

    useEffect(() => {

    if (categoriaSeleccionada == null) {

            obtenerTodosProductos()

                .then(setProductosEncontrados)

                .catch(console.error);

            return;

        }

        buscarPorCategoria(categoriaSeleccionada)

            .then(setProductosEncontrados)

            .catch(console.error);

    }, [categoriaSeleccionada]);
    function agregarProducto(producto: Producto) {

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
                            cantidad:
                                item.cantidad + 1
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

    }

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

        agregarProducto(producto);

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

                    placeholder="Escanear codigo..."

                    value={codigo}

                    onChange={(e) =>
                        setCodigo(e.target.value)
                    }

                    onKeyDown={handleBuscar}

                />

                <input

                        className="buscar-producto mt-3"

                        placeholder="Buscar producto..."

                        value={textoBusqueda}

                        onChange={(e)=>{

                            setCategoriaSeleccionada(null);

                            setTextoBusqueda(e.target.value);

                        }}
                    />
        <div className="mt-3 d-flex flex-wrap gap-2">

        <button

            className="btn btn-primary"

            onClick={() => {

                setCategoriaSeleccionada(null);

                setTextoBusqueda("");

            }}
        >

            Todas

        </button>

        {

            categorias.map(categoria => (

                <button

                    key={categoria.idCategoria}

                    className="btn btn-outline-primary"

                    onClick={() =>

                        setCategoriaSeleccionada(

                            categoria.idCategoria

                        )

                    }

                >

                    {categoria.nombreCategoria}

                </button>

            ))

        }

    </div>
                <div className="lista-busqueda mt-3">

                    {

                        productosEncontrados.map(

                            producto => (

                                <div

                                    key={producto.idProducto}

                                    className="producto-busqueda"

                                >

                                    <div>

                                        <strong>

                                            {producto.nombreProducto}

                                        </strong>

                                        <br />

                                        $

                                        {producto.precioVenta}

                                    </div>

                                    <button

                                        className="btn btn-success"

                                        onClick={() => {

                                            agregarProducto(producto);

                                            setTextoBusqueda("");

                                            setProductosEncontrados([]);

                                        }}

                                    >

                                        +

                                    </button>

                                </div>

                            )

                        )

                    }

                </div>

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

                    Total: ${total}

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