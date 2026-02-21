import { openConfirmModal } from "../../ui-elements/confirmModal.js";
import { goToAuth } from "./appFlow.js";
import { getToken } from "../../api/auth.js";


export function initSettings() {
    const settingsView = document.getElementById("view-settings");
    if (!settingsView) return;

    // =========================
    // THEME LOGIC
    // =========================

    const radios = settingsView.querySelectorAll(
        'input[name="color-mode"]'
    );

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);

        radios.forEach((radio) => {
            radio.checked = radio.value === savedTheme;
        });
    }

    radios.forEach((radio) => {
        radio.addEventListener("change", () => {
            const theme = radio.value;

            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        });
    });

    // =========================
    // BUTTON ACTIONS
    // =========================

    settingsView.addEventListener("click", (e) => {

        if (e.target.closest("#logout-btn")) {
            openConfirmModal({
                title: "Log out?",
                description: "You will be signed out of your account.",
                confirmText: "Log out",
                onConfirm: () => {
                    localStorage.removeItem("access_token");
                    goToAuth();
                }
            });
        }

        if (e.target.closest("#delete-account-btn")) {
            openConfirmModal({
                title: "Delete profile?",
                description:
                    "This action is irreversible. All your data will be permanently deleted.",
                confirmText: "Delete",

                onConfirm: async () => {

                    try {

                        const token = getToken();

                        await fetch("http://127.0.0.1:8000/me", {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        localStorage.removeItem("access_token");

                        goToAuth();

                    } catch (error) {
                        console.error("Delete failed:", error);
                        alert("Failed to delete profile");
                    }
                }
            });
        }
    });
}
