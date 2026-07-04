import { useEffect, useState, useRef } from "react";
import {
    buscarPorCodigo,
    buscarProductos,
    buscarPorCategoria,
    obtenerProductosActivos
} from "../../services/productoService";
import ConfirmarVentaModal from "../../components/venta/ConfirmarVentaModal";
import toast from "react-hot-toast";
import "./Caja.css";
import { obtenerCategorias } from "../../services/categoriaService";

interface Producto {
    idProducto: number;
    nombreProducto: string;
    precioVenta: number;
    codigoBarras: string;
    stockActual: number;
}

interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

function Caja() {
    const [codigo, setCodigo] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [productosEncontrados, setProductosEncontrados] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

    const inputEscaneoRef = useRef<HTMLInputElement>(null);
    const lastEnterTime = useRef<number>(0);

    // Cargar categorías
    useEffect(() => {
        obtenerCategorias()
            .then(setCategorias)
            .catch(console.error);
          
    }, []);

    // Búsqueda por texto
    useEffect(() => {
        if (textoBusqueda.length < 2) {
            setProductosEncontrados([]);
            return;
        }
        buscarProductos(textoBusqueda).then(setProductosEncontrados);
    }, [textoBusqueda]);

    // Búsqueda por categoría
    useEffect(() => {
        if (categoriaSeleccionada === null) {
            obtenerProductosActivos()
                .then(setProductosEncontrados)
                .catch(console.error);
         
            return;
        }
        buscarPorCategoria(categoriaSeleccionada)
            .then(setProductosEncontrados)
            .catch(console.error);
    }, [categoriaSeleccionada]);

    // ==================== MANEJO DE ENTER (Invertido) ====================
    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key !== "Enter") return;

            const now = Date.now();
            const isDoubleEnter = now - lastEnterTime.current < 400;

            lastEnterTime.current = now;

            if (isDoubleEnter) {
                // DOBLE ENTER → Confirmar Venta
                if (carrito.length > 0) {
                    e.preventDefault();
                    setMostrarModal(true);
                }
            } else {
                // ENTER SIMPLE → Enfocar el lector
                inputEscaneoRef.current?.focus();
                setCodigo("");
            }
        };

        window.addEventListener("keydown", handleEnter);
        return () => window.removeEventListener("keydown", handleEnter);
    }, [carrito.length]);

    // ==================== ESCANEO DE CÓDIGO ====================
    async function handleEscaneo(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") return;

        const codigoActual = codigo.trim();
        if (!codigoActual) return;

        const producto = await buscarPorCodigo(codigoActual);

        if (producto) {
            agregarProducto(producto);
        } else {
            toast.error("Producto no encontrado");
        }

        setCodigo("");
    }

    function agregarProducto(producto: Producto) {
        setCarrito((carritoActual) => {
            const existente = carritoActual.find(
                item => item.producto.idProducto === producto.idProducto
            );

            if (existente) {
                if (existente.cantidad >= producto.stockActual) {
                    toast.error("No hay suficiente stock para agregar más de este producto");
                    return carritoActual;
                }
                return carritoActual.map(item =>
                    item.producto.idProducto === producto.idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...carritoActual, { producto, cantidad: 1 }];
        });
    }

    function eliminarProducto(idProducto: number) {
        setCarrito((carritoActual) =>
            carritoActual.flatMap(item => {
                if (item.producto.idProducto !== idProducto) return item;
                if (item.cantidad > 1) return { ...item, cantidad: item.cantidad - 1 };
                return [];
            })
        );
    }

    function vaciarVenta() {
        if (window.confirm("¿Vaciar la venta actual?")) {
            setCarrito([]);
            toast.success("Venta vaciada");
        }
    }

    function confirmarVenta(metodoPago: string, recibido: number) {
        console.log({ carrito, metodoPago, recibido });
        setMostrarModal(false);
        setCarrito([]);
        setCodigo("");
    }

    const total = carrito.reduce(
        (acc, item) => acc + item.producto.precioVenta * item.cantidad,
        0
    );

    return (
        <div className="caja-container caja-theme">
            <div className="productos-panel">
                <h2>Caja</h2>

                <input
                    ref={inputEscaneoRef}
                    className="buscar-producto input-escaner"
                    placeholder="Escanear código de barras..."
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    onKeyDown={handleEscaneo}
                    autoFocus
                />

                <input
                    className="buscar-producto mt-3"
                    placeholder="Buscar producto..."
                    value={textoBusqueda}
                    onChange={(e) => {
                        setCategoriaSeleccionada(null);
                        setTextoBusqueda(e.target.value);
                    }}
                />

                <div className="mt-3 d-flex flex-wrap gap-2">
                    <button className="btn btn-primary" onClick={() => setCategoriaSeleccionada(null)}>
                        Todas
                    </button>
                    {categorias.map(categoria => (
                        <button
                            key={categoria.idCategoria}
                            className="btn btn-outline-primary"
                            onClick={() => setCategoriaSeleccionada(categoria.idCategoria)}
                        >
                            {categoria.nombreCategoria}
                        </button>
                    ))}
                </div>

                <div className="lista-busqueda mt-3">
                    {productosEncontrados.map(producto => (
                        <div key={producto.idProducto} className="producto-card">
                            <div>
                                <strong>{producto.nombreProducto}</strong><br />
                                ${producto.precioVenta}
                            </div>
                            <div className={`producto-stock ${producto.stockActual < 10 ? "stock-peligro" : ""}`}>
                                Stock: {producto.stockActual}
                            </div>
                            <button 
                                className="btn btn-success"
                                onClick={() => agregarProducto(producto)}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="venta-panel">
                <h2>Venta actual</h2>
                <div className="lista-carrito">
                    {carrito.map(item => (
                        <div key={item.producto.idProducto} className="venta-item">
                            <div className="venta-info">
                                <strong>{item.producto.nombreProducto}</strong>
                                <div className="precio-unitario">${item.producto.precioVenta} c/u</div>
                                <div className="cantidad-control">
                                    <button className="btn-cantidad" onClick={() => eliminarProducto(item.producto.idProducto)}>-</button>
                                    <span>{item.cantidad}</span>
                                    <button className="btn-cantidad" onClick={() => agregarProducto(item.producto)}>+</button>
                                </div>
                            </div>
                            <div className="venta-precio">
                                ${item.producto.precioVenta * item.cantidad}
                            </div>
                        </div>
                    ))}
                </div>

                <hr />
                <h2>Total: ${total}</h2>

                <div className="d-grid gap-2 mt-4">
                    <button className="btn btn-outline-danger" onClick={vaciarVenta}>
                        Vaciar venta
                    </button>
                    <button className="btn-confirmar" onClick={() => setMostrarModal(true)}>
                        Confirmar venta
                    </button>
                </div>
            </div>

            <ConfirmarVentaModal
                abierto={mostrarModal}
                carrito={carrito}
                onCerrar={() => setMostrarModal(false)}
                onConfirmar={confirmarVenta}
            />
        </div>
    );
}

export default Caja;