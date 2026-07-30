const API = "https://localhost:7268/api";

export interface Movimiento {

    fecha: string;

    tipo: string;

    usuario: string;

    monto: number | null;

    descripcion: string;

    idReferencia: number;

    idVenta?: number;
    idMovimientoStock?: number;
}

export async function obtenerMovimientos(): Promise<Movimiento[]> {

    const response = await fetch(`${API}/Movimientos`);

    if (!response.ok) {

        throw new Error(
            "No se pudieron cargar los movimientos."
        );

    }

    return await response.json();

}