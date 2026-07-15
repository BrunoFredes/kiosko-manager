const API = "https://localhost:7268/api";

export interface DetalleVentaDto {

    idProducto: number;

    cantidad: number;

    nombreItem?: string;

}

export interface VentaDto {

    idUsuario: number;

    metodoPago: string;

    detalles: DetalleVentaDto[];

}

export async function crearVenta(venta: VentaDto) {

    const response = await fetch(`${API}/Ventas`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(venta)

    });

    if (!response.ok) {

    const error = await response.text();

    console.error(error);

    throw new Error(error);

}
    return await response.json();

}