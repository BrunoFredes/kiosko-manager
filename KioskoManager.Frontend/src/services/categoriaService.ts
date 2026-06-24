const API = "https://localhost:7268/api";

export async function obtenerCategorias() {

    const response =
        await fetch(`${API}/Categorias`);

    return await response.json();

}