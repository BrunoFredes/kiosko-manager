const API = "https://localhost:7268/api";

export interface MovimientoStock {

    idMovimientoStock: number;

    fechaMovimiento: string;

    nombreProducto: string;

    nombreUsuario: string;

    tipoMovimiento: string;

    cantidad: number;

    stockAnterior: number;

    stockNuevo: number;

    observacion: string;

}

export async function obtenerMovimientos(): Promise<MovimientoStock[]> {

    const response = await fetch(`${API}/MovimientosStock`);

    if (!response.ok) {

        throw new Error(
            "No se pudieron cargar los movimientos"
        );

    }

    return await response.json();

}