import { switchView, showAppLayout } from "../viewManager.js";

export function initAdditionalEditMode() {

    const section = document.getElementById("view-signup-additional");
    if (!section) return;

    const saveBtn = section.querySelector(".edit-save");
    const cancelBtn = section.querySelector(".edit-cancel");
    const cleanBtn = section.querySelector(".edit-clean");

    const form = section.querySelector("#signup-additional-form");

    let originalData = {};

    function collectFormData() {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        return data;
    }

    function restoreFormData(data) {
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = data[key];
        });
    }

    // Enter edit mode
    section.addEventListener("enter-edit-mode", () => {

        originalData = collectFormData();
        section.dataset.mode = "edit";
    });

    // Save
    saveBtn.addEventListener("click", () => {

        const newData = collectFormData();

        // Тук можеш да update-неш profile
        console.log("Saved additional info:", newData);

        section.dataset.mode = "signup";
    });

    // Cancel
    cancelBtn.addEventListener("click", () => {

        restoreFormData(originalData);

        showAppLayout();

        const profileView = document.getElementById("view-profile");
        const additionalView = document.getElementById("view-signup-additional");

        switchView(additionalView, profileView);
    });

    // Clean
    cleanBtn.addEventListener("click", () => {

        form.reset();
    });

    saveBtn.addEventListener("click", () => {

        showAppLayout();

        const profileView = document.getElementById("view-profile");
        const additionalView = document.getElementById("view-signup-additional");

        switchView(additionalView, profileView);
    });

}
