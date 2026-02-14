import { switchView } from "../viewManager.js";
import { openConfirmModal } from "../../ui-elements/confirmModal.js";
import { goToAuth } from "./appFlow.js";

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
                description: "\"You will be signed out of your account. You can log back in at any time.",
                confirmText: "Log out",
                onConfirm: () => {
                    console.log("Going to auth");
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

                onConfirm: () => {
                    console.log("Delete confirm triggered");

                    const user = JSON.parse(localStorage.getItem("currentUser"));
                    console.log("User:", user);

                    if (user) {
                        const users = JSON.parse(localStorage.getItem("users")) || [];
                        const updatedUsers = users.filter(u => u.id !== user.id);
                        localStorage.setItem("users", JSON.stringify(updatedUsers));
                    }

                    localStorage.removeItem("currentUser");
                    goToAuth();
                }

            });
        }
    });
}
