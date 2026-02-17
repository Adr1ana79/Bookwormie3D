import { switchView, showAppLayout } from "../viewManager.js";

export function initAdditionalEditMode() {

    const section = document.getElementById("view-signup-additional");
    if (!section) return;

    const saveBtn = section.querySelector(".edit-save");
    const cancelBtn = section.querySelector(".edit-cancel");
    const cleanBtn = section.querySelector(".edit-clean");

    const form = section.querySelector("#signup-additional-form");

    const genreButtons = section.querySelectorAll(".genre-option");

    genreButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("genre-option--selected");
        });
    });


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
        const profileView = document.getElementById("view-profile");

        // --- UPDATE SOCIALS ---
        const socialsList = profileView.querySelector(".profile-social-networks");
        socialsList.innerHTML = "";

        ["instagram", "Goodreads", "Facebook", "LinkedIn", "Pinterest"]
            .forEach(name => {

                if (newData[name]) {

                    const li = document.createElement("li");
                    li.className = "social-network__item";

                    li.innerHTML = `
                <img src="assets/images/icons/social-networks/${name.toLowerCase()}.svg" alt="${name}">
                <span>${newData[name]}</span>
            `;

                    socialsList.appendChild(li);
                }
            });

        // --- UPDATE GENRES ---
        const genresList = profileView.querySelector(".favourite-genres");
        genresList.innerHTML = "";

        const selectedGenres = section.querySelectorAll(".genre-option.genre-option--selected");

        selectedGenres.forEach(btn => {
            const li = document.createElement("li");
            li.className = "favourite-genres__item";
            li.textContent = btn.textContent.trim();
            genresList.appendChild(li);
        });

        showAppLayout();

        const additionalView = document.getElementById("view-signup-additional");
        switchView(additionalView, profileView);
    });


    // Cancel
    cancelBtn.addEventListener("click", () => {

        restoreFormData(originalData);

        showAppLayout();

        switchView(additionalView, profileView);
    });

    // Clean
    cleanBtn.addEventListener("click", () => {

        form.reset();
    });
}
