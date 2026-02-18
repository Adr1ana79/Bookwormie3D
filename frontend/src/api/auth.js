const BASE_URL = "http://127.0.0.1:8000";

export async function login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username: email,  // OAuth2 изисква да се казва username
            password: password
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
    }

    return data;
}

export async function getProfiles() {
    const token = getToken();

    const response = await fetch("http://127.0.0.1:8000/profiles", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.json();
}


export function logout() {
    localStorage.removeItem("token");
}

export function getToken() {
    return localStorage.getItem("access_token");
}

