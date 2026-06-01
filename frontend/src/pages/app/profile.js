import { initEditState } from "./editState.js";
import { initProfilePictureModal } from "../../ui-elements/profilePicture.js";
import { initAdditionalEditMode } from "../auth/additionalEdit.js";
import { switchView, showAuthLayout } from "../viewManager.js";
import { getCurrentUser } from "../../api/profile.js";
import { getToken } from "../../api/auth.js";

// Инициализира profile view-то и всички свързани функционалности
export async function initProfile() {

    // Намира основната profile секция
    const profileSection = document.getElementById("view-profile");

    // Зарежда данните на потребителя в профила
    await loadProfileData(profileSection);

    if (!profileSection) return;

    // По подразбиране профилът започва в режим за преглед
    profileSection.dataset.mode = "view";

    // Инициализира общата edit логика за profile секцията
    initEditState({
        section: profileSection,
        mainButtonSelector: ".profile-main-edit-button",
        saveButtonSelector: ".icon-button-group--submenu-button .icon-save",
        cancelButtonSelector: ".icon-button-group--submenu-button .icon-cancel"
    });

    // Инициализира modal-а за смяна на профилна снимка
    initProfilePictureModal();

    initProfileNameEdit(profileSection);

    // Инициализира edit режима за допълнителната profile информация
    await initAdditionalEditMode();

    // При успешно влизане презарежда profile данните
    document.addEventListener("auth:login-success", async () => {
        const profileSection = document.getElementById("view-profile");
        if (!profileSection) return;

        await loadProfileData(profileSection);
    });

}

// Управлява редакцията на потребителското име в profile страницата
function initProfileNameEdit(profileSection) {

    // Контейнерът за profile name секцията
    const container = profileSection.querySelector(".profile-name-container");
    if (!container) return;

    // Елементът за визуализация на името
    const nameDisplay = container.querySelector(".profile-name");
    // Input полето за редакция
    const nameInput = container.querySelector(".profile-name-input");

    const editBtn = container.querySelector(".edit-secondary");
    const saveBtn = container.querySelector(".icon-save");
    const cancelBtn = container.querySelector(".icon-cancel");

    // Прекратява инициализацията, ако липсва някой от необходимите елементи
    if (!editBtn || !saveBtn || !cancelBtn || !nameInput || !nameDisplay) return;

    // Пази оригиналната стойност,
    // за да може да се възстанови при Cancel
    let originalValue = nameDisplay.textContent.trim();


    editBtn.addEventListener("click", () => {
        // Редакция е позволена само в глобален edit режим
        if (profileSection.dataset.mode !== "edit") return;

        originalValue = nameDisplay.textContent.trim();

        // Зарежда текущото име в input полето
        nameInput.value = originalValue;

        // Превключва name container-а в edit режим
        container.dataset.nameMode = "edit";

        // Автоматично фокусира и маркира текста
        nameInput.focus();
        nameInput.select();
    });

    saveBtn.addEventListener("click", (e) => {
        // Предотвратява активиране на parent click handlers
        e.stopPropagation();

        const newValue = nameInput.value.trim();
        // Записва новото име само ако не е празно
        if (newValue.length > 0) {
            nameDisplay.textContent = newValue;
        }

        // Връща контейнера в view режим
        container.dataset.nameMode = "view";
    });

    cancelBtn.addEventListener("click", () => {
        // Възстановява оригиналната стойност
        nameInput.value = originalValue;
        container.dataset.nameMode = "view";
    });

    nameInput.addEventListener("keydown", (e) => {
        // Enter = Save
        if (e.key === "Enter") saveBtn.click();
        // Escape = Cancel
        if (e.key === "Escape") cancelBtn.click();
    });

    // Бутонът за редакция на допълнителната информация
    const editAdditionalBtn = profileSection.querySelector("#edit-additional-button");

    if (editAdditionalBtn) {
        editAdditionalBtn.addEventListener("click", () => {

            const profileView = document.getElementById("view-profile");
            const additionalView = document.getElementById("view-signup-additional");

            // Показва auth layout-а, в който се намира additional screen-ът
            showAuthLayout();

            // Деактивира всички auth екрани
            document
                .querySelectorAll(".auth-view")
                .forEach(view => view.classList.remove("active"));

            // Активира само additional view-то
            additionalView.classList.add("active");

            // Преминава от profile към additional screen
            switchView(profileView, additionalView);

            // Стартира additional screen-а директно в edit режим
            additionalView.dataset.mode = "edit";

            // Изпраща custom event за инициализация на edit state
            additionalView.dispatchEvent(new Event("enter-edit-mode"));
        });
    }
}


export async function loadProfileData(profileSection) {

    if (!profileSection) return;

    const token = getToken();
    if (!token) return;

    try {

        // Извлича информацията за текущия потребител
        const user = await getCurrentUser();

        // Визуализира потребителските данни в профилния изглед
        renderProfile(profileSection, user);

    } catch (err) {

        console.error("Failed to load profile:", err);
    }
}


export function renderProfile(section, user) {

    const nameEl = section.querySelector(".profile-name");
    const emailEl = section.querySelector(".profile-email");

    // Визуализира потребителското име
    if (nameEl) {
        nameEl.textContent = user.username || "";
    }

    // Визуализира email адреса
    if (emailEl) {
        emailEl.textContent = user.email || "";
    }
}