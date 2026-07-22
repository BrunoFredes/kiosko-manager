const API = "https://localhost:7268/api";

export async function obtenerTodosUsuarios() {

    const response = await fetch(`${API}/Usuarios`);

    if (!response.ok)
        throw new Error("No se pudieron obtener los usuarios.");

    return await response.json();
}

export async function buscarUsuarios(texto: string) {

    const response = await fetch(
        `${API}/Usuarios/buscar?texto=${encodeURIComponent(texto)}`
    );

    if (!response.ok)
        throw new Error("Error al buscar usuarios.");

    return await response.json();
}

export async function crearUsuario(usuario: any) {

    const response = await fetch(`${API}/Usuarios`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    if (!response.ok)
        throw new Error(await response.text());

    return await response.json();
}

export async function actualizarUsuario(id: number, usuario: any) {

    const response = await fetch(`${API}/Usuarios/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    if (!response.ok)
        throw new Error(await response.text());

    return await response.json();
}

export async function cambiarEstadoUsuario(id: number) {

    const response = await fetch(`${API}/Usuarios/${id}/activo`, {

        method: "PATCH"

    });

    if (!response.ok)
        throw new Error("No se pudo cambiar el estado.");

    return await response.json();
}