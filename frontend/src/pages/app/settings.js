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
                    const deletedBookId = book.id;

                    let books = deleteBookAndReflow(
                        books,
                        deletedBookId,
                        size,
                        design
                    );

                    console.table(
                        books
                            .filter((currentBook) => currentBook.row === book.row)
                            .map((currentBook) => ({
                                id: currentBook.id,
                                title: currentBook.title,
                                row: currentBook.row,
                                index: currentBook.index
                            }))
                    );

                    await refreshBooks();
                }
            });
        }
    });
}
