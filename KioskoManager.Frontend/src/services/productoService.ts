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

export async function buscarProductos(texto: string) {
    const response = await fetch(
        `${API}/Productos/buscar?texto=${texto}`
    );

    if (!response.ok)
        throw new Error("Error al buscar productos");

    return await response.json();
}

export async function buscarPorCategoria(idCategoria: number) {
    const response = await fetch(
        `${API}/Productos/categoria/${idCategoria}`
    );

    if (!response.ok)
        throw new Error("Error al cargar productos");

    return await response.json();
}

export async function obtenerProductosActivos() {

    const response = await fetch(`${API}/Productos/activos`);

    if (!response.ok)
        throw new Error("Error");

    return await response.json();
}

export async function obtenerTodosProductos() {

    const response = await fetch(`${API}/Productos/todos`);

    if (!response.ok)
        throw new Error("Error");

    return await response.json();
}
export async function editarProducto(
    id: number,
    producto: any
) {

    const response = await fetch(
        `${API}/Productos/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        }
    );

    if (!response.ok)
        throw new Error("No se pudo editar el producto");

    return await response.json();
}

export async function eliminarProducto(id: number) {

    const response = await fetch(
        `${API}/Productos/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok)
        throw new Error("No se pudo eliminar el producto");
}
export async function crearProducto(producto: any) {

    const response = await fetch(`${API}/Productos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    if (!response.ok) {

        const error = await response.text();
        throw new Error(error);

    }

    return await response.json();

}

export async function actualizarProducto(
    id: number,
    producto: any
) {

    const response = await fetch(`${API}/Productos/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(producto)

    });

    if (!response.ok) {

        const error = await response.text();
        throw new Error(error);

    }

    return await response.json();

}
export async function cambiarEstadoProducto(id:number){

    const response =
        await fetch(

            `${API}/Productos/${id}/activo`,

            {

                method:"PATCH"

            }

        );

    if(!response.ok)

        throw new Error("No se pudo cambiar el estado");

    return await response.json();

}