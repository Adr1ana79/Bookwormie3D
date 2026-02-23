const BASE_URL = "http://127.0.0.1:8000";

export async function login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username: email,
            password: password
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
    }

    return data;
}

export function logout() {
    localStorage.removeItem("access_token");
}

export function getToken() {
    return localStorage.getItem("access_token");
}

