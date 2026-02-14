import { initEditState } from "./editState.js";
import { initProfilePictureModal } from "../../ui-elements/profilePicture.js";
import { initAdditionalEditMode } from "../auth/additionalEdit.js";
import { switchView, showAuthLayout } from "../viewManager.js";


export function initProfile() {

    const profileSection = document.getElementById("view-profile");

    if (!profileSection) return;

    // Уверяваме се, че по default е в view режим
    profileSection.dataset.mode = "view";

    // Инициализиране на edit state логиката
    initEditState({
        section: profileSection,
        mainButtonSelector: ".profile-main-edit-button",
        saveButtonSelector: ".icon-button-group--submenu-button .icon-save",
        cancelButtonSelector: ".icon-button-group--submenu-button .icon-cancel"
    });

    initProfilePictureModal();
    initProfileNameEdit(profileSection);
    initAdditionalEditMode();
}

function initProfileNameEdit(profileSection) {

    const container = profileSection.querySelector(".profile-name-container");
    if (!container) return;

    const nameDisplay = container.querySelector(".profile-name");
    const nameInput = container.querySelector(".profile-name-input");

    const editBtn = container.querySelector(".edit-secondary");
    const saveBtn = container.querySelector(".icon-save");
    const cancelBtn = container.querySelector(".icon-cancel");

    if (!editBtn || !saveBtn || !cancelBtn || !nameInput || !nameDisplay) return;

    let originalValue = nameDisplay.textContent.trim();

    editBtn.addEventListener("click", () => {
        if (profileSection.dataset.mode !== "edit") return;

        originalValue = nameDisplay.textContent.trim();

        nameInput.value = originalValue;
        container.dataset.nameMode = "edit";

        nameInput.focus();
        nameInput.select();
    });

    saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const newValue = nameInput.value.trim();
        if (newValue.length > 0) {
            nameDisplay.textContent = newValue;
        }

        container.dataset.nameMode = "view";
    });

    cancelBtn.addEventListener("click", () => {
        nameInput.value = originalValue;
        container.dataset.nameMode = "view";
    });

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveBtn.click();
        if (e.key === "Escape") cancelBtn.click();
    });

    const editAdditionalBtn = document.getElementById("edit-additional-button");

    if (editAdditionalBtn) {
        editAdditionalBtn.addEventListener("click", () => {

            const profileView = document.getElementById("view-profile");
            const additionalView = document.getElementById("view-signup-additional");

            showAuthLayout();
            switchView(profileView, additionalView);

            additionalView.dataset.mode = "edit";
        });
    }
}

