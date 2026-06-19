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