import { openConfirmModal } from "../../ui-elements/confirmModal.js";
import { goToAuth } from "./appFlow.js";


export function initSettings() {
    const settingsView = document.getElementById("view-settings");
    if (!settingsView) return;


    // THEME LOGIC

    // Всички radio бутони за избор на цветови режим
    const radios = settingsView.querySelectorAll(
        'input[name="color-mode"]'
    );

    // Взима последно избраната тема от localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {

        // Прилага запазената тема върху root елемента
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Маркира съответния radio бутон като избран
        radios.forEach((radio) => {
            radio.checked = radio.value === savedTheme;
        });
    }

    radios.forEach((radio) => {
        radio.addEventListener("change", () => {
            const theme = radio.value;

            // Прилага избраната тема
            document.documentElement.setAttribute("data-theme", theme);

            // Запазва избора, за да се възстанови при следващо зареждане
            localStorage.setItem("theme", theme);
        });
    });


    // BUTTON ACTIONS

    // Един общ listener за бутоните в settings страницата
    settingsView.addEventListener("click", (e) => {

        /* LOGOUT */
        if (e.target.closest("#logout-btn")) {
            openConfirmModal({
                title: "Log out?",
                description: "You will be signed out of your account.",
                confirmText: "Log out",
                onConfirm: () => {

                    // Премахва access token-а от localStorage
                    localStorage.removeItem("access_token");

                    // Връща приложението към auth екрана
                    goToAuth();
                }
            });
        }

        /* DELETE ACCOUNT */
        if (e.target.closest("#delete-account-btn")) {
            openConfirmModal({
                title: "Delete profile?",
                description:
                    "This action is irreversible. All your data will be permanently deleted.",
                confirmText: "Delete",

                onConfirm: async () => {
                    // Тук по-късно ще се извика заявка към backend-а
                    // за изтриване на текущия профил
                    //
                    // Например:
                    // await deleteCurrentProfile();
                    // localStorage.removeItem("access_token");
                    // goToAuth();

                    await refreshBooks();
                }
            });
        }
    });
}
