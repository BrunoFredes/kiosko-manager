import { useEffect, useState } from "react";
import "./ArticuloManualModal.css";

interface ArticuloManual {
    nombreProducto: string;
    precioVenta: number;
    cantidad: number;
    idProducto: null;
    esManual: true;
}

interface Props {
    abierto: boolean;
    onCerrar: () => void;
    onAgregar: (articulo: ArticuloManual) => void;
}

function ArticuloManualModal({
    abierto,
    onCerrar,
    onAgregar
}: Props) {

    const [descripcion, setDescripcion] = useState("");
    const [importe, setImporte] = useState("");

    useEffect(() => {

        if (abierto) {

            setDescripcion("");
            setImporte("");

        }

    }, [abierto]);

    function agregarArticulo() {

        if (descripcion.trim() === "") {

            alert("Ingrese una descripción.");

            return;

        }

        const precio = Number(importe);

        if (isNaN(precio) || precio <= 0) {

            alert("Ingrese un importe válido.");

            return;

        }

        onAgregar({

            idProducto: null,

            nombreProducto: descripcion.trim(),

            precioVenta: precio,

            cantidad: 1,

            esManual: true

        });

        onCerrar();

    }

    if (!abierto) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-articulo">

                <div className="modal-articulo-header">

                    <h2>

                        Agregar artículo manual

                    </h2>

                    <button

                        className="btn-cerrar"

                        onClick={onCerrar}

                    >

                        ✕

                    </button>

                </div>

                <div className="modal-articulo-body">

                    <label>

                        Descripción

                    </label>

                    <input

                        type="text"

                        placeholder="Ej: Paleta"

                        value={descripcion}

                        onChange={(e) =>

                            setDescripcion(e.target.value)

                        }

                        autoFocus

                    />

                    <label>

                        Importe

                    </label>

                    <input

                        type="number"

                        placeholder="0"

                        value={importe}

                        onChange={(e) =>

                            setImporte(e.target.value)

                        }

                    />

                </div>

                <div className="modal-articulo-footer">

                    <button

                        className="btn-cancelar"

                        onClick={onCerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        className="btn-confirmar"

                        onClick={agregarArticulo}

                    >

                        Agregar

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ArticuloManualModal;