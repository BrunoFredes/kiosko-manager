const API = "https://localhost:7268/api";

export async function buscarPorCodigo(codigo: string) {

    const response = await fetch(
        `${API}/Productos/codigo/${codigo}`
    );

    if (!response.ok) {

        return null;

    }

    return await response.json();

}
export async function buscarProductos(texto:string){

    const response =
        await fetch(
            `${API}/Productos/buscar?texto=${texto}`
        );

    return await response.json();

}
export async function buscarPorCategoria(idCategoria: number) {

    const response =
        await fetch(
            `${API}/Productos/categoria/${idCategoria}`
        );

    if (!response.ok)
        throw new Error("Error al cargar productos");

    return await response.json();

}
export async function obtenerTodosProductos() {

    const response =
        await fetch(`${API}/Productos/activos`);

    if (!response.ok)
        throw new Error("Error");

    return await response.json();

}