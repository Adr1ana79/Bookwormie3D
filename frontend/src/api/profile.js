import { getToken } from "./auth.js";

const BASE_URL = "http://127.0.0.1:8000";

export async function getProfiles() {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/profiles`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.json();
}

export async function getCurrentUser() {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Unauthorized");
    }

    return response.json();
}
