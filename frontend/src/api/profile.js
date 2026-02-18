const BASE_URL = "http://127.0.0.1:8000";

export async function getProfiles() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/profiles`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.json();
}
