import { switchView, showAppLayout } from "../viewManager.js";
import { loadProfileData } from "../app/profile.js";

export async function initAdditionalEditMode() {

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
    saveBtn.addEventListener("click", async () => {

        const selectedGenres = section.querySelectorAll(
            ".genre-option.genre-option--selected"
        );

        const selectedIds = Array.from(selectedGenres)
            .map(btn => Number(btn.dataset.id));

        try {
//            await saveGenres(selectedIds);
        } catch (err) {
            console.error(err);
        }
    });

    // Cancel
    cancelBtn.addEventListener("click", () => {

        restoreFormData(originalData);

        showAppLayout();

        const additionalView = document.getElementById("view-signup-additional");
        const profileView = document.getElementById("view-profile");
        switchView(additionalView, profileView);
    });

    // Clean
    cleanBtn.addEventListener("click", () => {

        form.reset();
    });
}


async function saveGenres(selectedIds) {

    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/me/genres", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            genres: selectedIds
        })
    });

    console.log("AUTH HEADER:", `Bearer ${token}`);
    console.log("TOKEN:", localStorage.getItem("access_token"));


    if (!response.ok) {
        throw new Error("Failed to update genres");
    }
}
