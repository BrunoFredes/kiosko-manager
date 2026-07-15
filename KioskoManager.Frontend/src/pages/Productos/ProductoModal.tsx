import { useEffect, useState, useRef } from "react";
import "./ProductoModal.css";
import toast from "react-hot-toast";
import {
    crearProducto,
    actualizarProducto,
} from "../../services/productoService";

import { obtenerCategorias } from "../../services/categoriaService";

interface Producto {
    idProducto?: number;
    nombreProducto: string;
    codigoBarras?: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    idCategoria: number;
    activo?: boolean;
}

interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
}

interface Props {
    abierto: boolean;
    producto: Producto | null;
    onCerrar: () => void;
    onGuardado: () => void;
}

const productoVacio: Producto = {
    nombreProducto: "",
    codigoBarras: "",
    precioCompra: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 5,
    idCategoria: 1,
};

function ProductoModal({ abierto, producto, onCerrar, onGuardado }: Props) {

    const esEdicion = !!producto;

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [formData, setFormData] = useState<Producto>(productoVacio);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Control para doble Enter
    const lastEnterTime = useRef(0);

    useEffect(() => {
        if (!abierto) return;

        obtenerCategorias()
            .then(setCategorias)
            .catch(console.error);

        if (producto) {
            setFormData(producto);
        } else {
            setFormData(productoVacio);
        }

        setError(null);
        lastEnterTime.current = 0;
    }, [abierto, producto]);

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {

    const { name, value } = e.target;

    // Campos decimales
    if (name === "precioCompra" || name === "precioVenta") {

        // Solo números y un punto decimal
        if (!/^\d*\.?\d*$/.test(value)) return;

    }

    // Campos enteros
    if (
        name === "stockActual" ||
        name === "stockMinimo" ||
        name === "idCategoria"
    ) {

        if (!/^\d*$/.test(value)) return;

    }

    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

    // ←=== CONTROL ANTI LECTOR DE CÓDIGO DE BARRAS ===←
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            const now = Date.now();
            const diff = now - lastEnterTime.current;

            if (diff < 700) {
                // Doble Enter → Guardar
                e.preventDefault();
                handleSubmit(e);
            } else {
                // Primer Enter → solo prevenir submit normal
                e.preventDefault();
                lastEnterTime.current = now;
            }
        }
    };
    const productoEnviar = {

        ...formData,

        precioCompra: Number(formData.precioCompra),

        precioVenta: Number(formData.precioVenta),

        stockActual: Number(formData.stockActual),

        stockMinimo: Number(formData.stockMinimo),

        idCategoria: Number(formData.idCategoria)

    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            if (esEdicion && producto?.idProducto !== undefined) {
                await actualizarProducto(producto.idProducto, productoEnviar);
            } else {
                await crearProducto(productoEnviar);
            }

            onGuardado();
            onCerrar();
            toast.success(`Producto ${esEdicion ? "actualizado" : "creado"} exitosamente`);
        } catch (err: any) {
            toast.error(`Error: ${err.message || "No se pudo guardar el producto"}`);
            setError(err.message || "No se pudo guardar el producto");
        } finally {
            setLoading(false);
        }
    };

    if (!abierto) return null;

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{esEdicion ? "Editar Producto" : "Nuevo Producto"}</h3>
                    <button className="btn-cerrar" onClick={onCerrar}>✕</button>
                </div>

                <form 
                    onSubmit={handleSubmit} 
                    onKeyDown={handleKeyDown}
                >
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                name="nombreProducto"
                                value={formData.nombreProducto}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>Categoría *</label>
                            <select name="idCategoria" value={formData.idCategoria} onChange={handleChange} required>
                                {categorias.map(cat => (
                                    <option key={cat.idCategoria} value={cat.idCategoria}>
                                        {cat.nombreCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio Compra *</label>
                                <input type="text" inputMode="decimal" name="precioCompra"
                                    value={formData.precioCompra} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Precio Venta *</label>
                                <input type="text" inputMode="decimal" name="precioVenta"
                                    value={formData.precioVenta} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Stock Actual *</label>
                                <input type="text" inputMode="decimal" name="stockActual"
                                    value={formData.stockActual} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Stock Mínimo *</label>
                                <input type="text" inputMode="decimal" name="stockMinimo"
                                    value={formData.stockMinimo} onChange={handleChange} required />
                            </div>
                        </div>

                        
                        <div className="form-group">
                            <label>Código de Barras</label>
                            <input
                                name="codigoBarras"
                                value={formData.codigoBarras || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={onCerrar} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar" disabled={loading}>
                            {loading ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Producto"}
                        </button>
                    </div>
                </form>

                <small style={{ display: 'block', textAlign: 'center', margin: '10px 0', color: '#555' }}>
                    Presiona <strong>Enter dos veces</strong> para guardar
                </small>
            </div>
        </div>
    );
}

export default ProductoModal;