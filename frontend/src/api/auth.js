const BASE_URL = "http://127.0.0.1:8000";

export async function login(username, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.access_token);
    }

    return data;
}
