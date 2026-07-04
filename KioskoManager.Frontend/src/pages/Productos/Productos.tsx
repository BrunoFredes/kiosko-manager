import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { obtenerTodosProductos, buscarProductos } from "../../services/productoService";
import { cambiarEstadoProducto } from "../../services/productoService";

import "./Productos.css";
import ProductoModal from "./ProductoModal";

interface Producto {
    idProducto: number;
    nombreProducto: string;
    codigoBarras: string;
    precioCompra: number;
    precioVenta: number;
    activo: boolean;
    stockActual: number;
    stockMinimo: number;
}

function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [busqueda, setBusqueda] = useState<string>("");

    const searchInputRef = useRef<HTMLInputElement>(null);

    async function cargarProductos() {
        try {
            if (busqueda.trim() === "") {
                const data = await obtenerTodosProductos();
                setProductos(data);
            } else {
                const data = await buscarProductos(busqueda);
                setProductos(data);
            }
        } catch (error) {
            toast.error("Error al cargar productos");
            console.error("Error al cargar productos:", error);
        }
    }

    async function toggleActivo(id: number) {
        try {
            await cambiarEstadoProducto(id);
            await cargarProductos();
            toast.success("Estado del producto cambiado");
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            toast.error("No se pudo cambiar el estado del producto");
        }
    }

    // ← Al presionar Enter en el input → solo seleccionar el campo
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();           // Evita comportamiento por defecto
            searchInputRef.current?.select();   // Selecciona todo el texto
            // Opcional: también puedes hacer focus
            // searchInputRef.current?.focus();
        }
    };

    useEffect(() => {
        cargarProductos();
    }, [busqueda]);

    // Enfocar el input al cargar la página
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    return (
        <div className="productos-page">
            <div className="productos-header">
                <h2>Productos</h2>
                
                <input
                    ref={searchInputRef}
                    className="buscar-producto"
                    placeholder="Buscar por nombre o código... (Escanea aquí)"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="btn-agregar"
                    onClick={() => {
                        setProductoSeleccionado(null);
                        setMostrarModal(true);
                    }}
                >
                    + Agregar producto
                </button>
            </div>

            <div className="tabla-container">
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Activo</th>
                            <th>Código</th>
                            <th>Compra</th>
                            <th>Venta</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.idProducto}>
                                <td>{producto.nombreProducto}</td>

                                <td>
                                    <label className="switch-toggle">
                                        <input
                                            type="checkbox"
                                            checked={producto.activo}
                                            onChange={() => toggleActivo(producto.idProducto)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>

                                <td>{producto.codigoBarras}</td>
                                <td>${producto.precioCompra}</td>
                                <td>${producto.precioVenta}</td>
                                <td className={producto.stockActual <= producto.stockMinimo ? "stock-bajo" : "stock-normal"}>
                                    {producto.stockActual}
                                </td>

                                <td>
                                    <button
                                        className="btn-editar"
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setMostrarModal(true);
                                        }}
                                    >
                                        ✏ Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductoModal
                abierto={mostrarModal}
                producto={productoSeleccionado}
                onCerrar={() => {
                    setMostrarModal(false);
                    setProductoSeleccionado(null);
                }}
                onGuardado={() => {
                    cargarProductos();
                    setMostrarModal(false);
                    setProductoSeleccionado(null);
                }}
            />
        </div>
    );
}

export default Productos;