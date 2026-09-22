const API = "https://localhost:7268/api";

export interface Caja {

    idCaja: number;

    idUsuarioApertura: number;

    usuarioApertura: string;

    fechaApertura: string;

    montoInicial: number;

    fechaCierre: string | null;

    montoEsperado: number | null;

    montoFinal: number | null;

    diferencia: number | null;

    estado: string;

    idUsuarioCierre: number | null;

    usuarioCierre: string | null;

    observacion: string | null;
}

export interface CajaDetalleDto {
    caja: Caja;
    totalIngresos: number;
    totalEgresos: number;
    movimientos: MovimientoCajaDto[];
}

export interface AbrirCajaDto {

    montoInicial: number;
}

export interface CrearMovimientoCajaDto {

    tipoMovimiento:
        | "INGRESO"
        | "EGRESO";

    monto: number;

    descripcion?: string;
}

export interface CerrarCajaDto {

    montoFinal: number;

    observacion?: string;
}

export interface MovimientoCajaDto {

    idMovimientoCaja: number;

    idCaja: number;

    tipoMovimiento:
        | "INGRESO"
        | "EGRESO";

    descripcion: string | null;

    monto: number;

    fechaMovimiento: string;
}

// =====================================================
// OBTENER CAJA ACTUAL
// =====================================================

export async function obtenerCajaActual() {

    const response =
        await fetch(
            `${API}/Cajas/actual`
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}

// =====================================================
// ABRIR CAJA
// =====================================================

export async function abrirCaja(
    dto: AbrirCajaDto
) {

    const response =
        await fetch(
            `${API}/Cajas/abrir`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(dto)
            }
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}

// =====================================================
// INGRESO / EGRESO
// =====================================================

export async function registrarMovimientoCaja(
    dto: CrearMovimientoCajaDto
) {

    const response =
        await fetch(
            `${API}/Cajas/movimiento`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(dto)
            }
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}

// =====================================================
// CERRAR CAJA
// =====================================================

export async function cerrarCaja(
    idCaja: number,
    dto: CerrarCajaDto
) {

    const response =
        await fetch(
            `${API}/Cajas/cerrar/${idCaja}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(dto)
            }
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}

// =====================================================
// HISTORIAL DE CAJAS
// =====================================================

export async function obtenerHistorialCajas() {

    const response =
        await fetch(
            `${API}/Cajas/historial`
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}



export async function obtenerDetalleCaja(
    idCaja: number
): Promise<CajaDetalleDto> {

    const response = await fetch(
        `${API}/Cajas/${idCaja}/detalle`
    );

    if (!response.ok) {
        const error =
            await response.text();

        throw new Error(error);
    }

    return await response.json();
}