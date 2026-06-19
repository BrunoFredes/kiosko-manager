const API = "https://localhost:7268/api";

export async function login(email: string, password: string) {

    console.log(API);

    const response = await fetch(`${API}/Auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email,
            password,
        }),
    });

    console.log(response);

    return await response.json();
}