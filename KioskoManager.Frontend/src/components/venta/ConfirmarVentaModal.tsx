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
    onConfirmar: (metodoPago: string, recibido: number) => void;
}

function ConfirmarVentaModal({ abierto, carrito, onCerrar, onConfirmar }: Props) {

    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [recargo, setRecargo] = useState(10);
    const [recibido, setRecibido] = useState("");

    const total = useMemo(() => {
        return carrito.reduce((acc, item) => acc + item.producto.precioVenta * item.cantidad, 0);
    }, [carrito]);

    const recargoCalculado = metodoPago === "CREDITO" ? total * (recargo / 100) : 0;
    const totalFinal = total + recargoCalculado;

    const vuelto = metodoPago === "EFECTIVO" ? Number(recibido) - totalFinal : 0;

    // ==================== IMPRIMIR TICKET ====================
    // Dentro del componente ConfirmarVentaModal.tsx

const imprimirTicket = () => {
    const fecha = new Date().toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });

    const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ticket</title>
            <style>
                @page {
                    size: 80mm auto;
                    margin: 0;
                }
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 14px;           /* ← Cambiado de 12px a 14px */
                    line-height: 1.3;          /* Mejora la separación entre líneas */
                    width: 80mm;
                    margin: 0 auto;
                    padding: 5mm;
                }
                .center { text-align: center; }
                .right { text-align: right; }
                hr { border: 1px dashed #000; margin: 8px 0; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 3px 0; }     /* Un poco más de espacio vertical */
                
                .total { 
                    font-weight: bold; 
                    font-size: 15px;           /* Un poco más grande que el resto */
                }
                .footer { 
                    margin-top: 15px; 
                    font-size: 12px;           /* Footer un poco más grande también */
                }
                
                h2 {
                    font-size: 18px;
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="center">
                <h2>MI KIOSCO</h2>
                <p>Av. Ejemplo 123 - Tel: 1234-5678</p>
                <p>${fecha}</p>
            </div>
            <hr>
            
            <table>
                <thead>
                    <tr>
                        <th align="left">Producto</th>
                        <th align="center">Cant</th>
                        <th align="right">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    ${carrito.map(item => `
                        <tr>
                            <td>${item.producto.nombreProducto}</td>
                            <td align="center">${item.cantidad}</td>
                            <td align="right">$${(item.producto.precioVenta * item.cantidad).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <hr>
            <div class="right">
                <p>Subtotal: $${total.toFixed(2)}</p>
                ${recargoCalculado > 0 ? `<p>Recargo (${recargo}%): $${recargoCalculado.toFixed(2)}</p>` : ''}
                <p class="total">TOTAL: $${totalFinal.toFixed(2)}</p>
                
                ${metodoPago === "EFECTIVO" && Number(recibido) > 0 ? `
                    <p>Recibido: $${Number(recibido).toFixed(2)}</p>
                    <p>Vuelto: $${Math.max(0, Number(recibido) - totalFinal).toFixed(2)}</p>
                ` : ''}
            </div>
            
            <hr>
            <div class="center footer">
                <p>¡Gracias por su compra!</p>
                <p>Método: ${metodoPago}</p>
                <small> ticket #${Date.now().toString().slice(-6)}</small>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', 'Ticket', 'width=400,height=600');
    if (printWindow) {
        printWindow.document.write(ticketHTML);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 600);
    } else {
        alert("Bloqueador de ventanas emergentes detectado. Permite pop-ups para imprimir tickets.");
    }
};

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCerrar();
        };
        if (abierto) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [abierto, onCerrar]);

    if (!abierto) return null;

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Venta</h2>

                <div className="modal-grid">
                    <div className="lista-productos">
                        {carrito.map(item => (
                            <div className="item-producto" key={item.producto.idProducto}>
                                <h5>{item.producto.nombreProducto}</h5>
                                <small>{item.cantidad} × ${item.producto.precioVenta}</small>
                                <div>
                                    <strong>${(item.cantidad * item.producto.precioVenta).toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="panel-pago">
                        <label>Método de pago</label>
                        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="DEBITO">Tarjeta Débito</option>
                            <option value="CREDITO">Tarjeta Crédito</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                        </select>

                        {metodoPago === "CREDITO" && (
                            <>
                                <label>Recargo %</label>
                                <input
                                    type="number"
                                    value={recargo}
                                    onChange={(e) => setRecargo(Number(e.target.value))}
                                />
                            </>
                        )}

                        {metodoPago === "EFECTIVO" && (
                            <>
                                <label>Recibido</label>
                                <input
                                    type="number"
                                    value={recibido}
                                    onChange={(e) => setRecibido(e.target.value)}
                                />
                                <div className="vuelto">
                                    <span>Vuelto</span>
                                    <strong>${vuelto >= 0 ? vuelto.toFixed(2) : "0.00"}</strong>
                                </div>
                            </>
                        )}

                        <div className="resumen">
                            <span>Subtotal</span>
                            <strong>${total.toFixed(2)}</strong>
                        </div>
                        <div className="resumen">
                            <span>Recargo</span>
                            <strong>${recargoCalculado.toFixed(2)}</strong>
                        </div>
                        <div className="total-final">
                            <span>TOTAL FINAL</span>
                            <h2>${totalFinal.toFixed(2)}</h2>
                        </div>

                        {/* Botón de Imprimir Ticket */}
                        <button 
                            className="btn-imprimir-ticket"
                            onClick={imprimirTicket}
                            type="button"
                        >
                            🖨️ Imprimir Ticket
                        </button>
                    </div>
                </div>

                <div className="acciones">
                    <button className="btn-cancelar" onClick={onCerrar}>
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirmar"
                        onClick={() => onConfirmar(metodoPago, Number(recibido))}
                    >
                        Confirmar Venta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmarVentaModal;