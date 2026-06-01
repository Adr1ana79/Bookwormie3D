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

    // Променя избраното състояние на жанра при натискане
    genreButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("genre-option--selected");
        });
    });


    let originalData = {};

    // Събира текущите стойности от формата
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        return data;
    }

    // Възстановява стойностите във формата към подадените данни
    function restoreFormData(data) {
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = data[key];
        });
    }

    // Активира edit режим за допълнителната профилна информация
    section.addEventListener("enter-edit-mode", () => {

        originalData = collectFormData();
        section.dataset.mode = "edit";
    });

    // Обработва запазването на избраните жанрове
    saveBtn.addEventListener("click", async () => {

        const selectedGenres = section.querySelectorAll(
            ".genre-option.genre-option--selected"
        );

        const selectedIds = Array.from(selectedGenres)
            .map(btn => Number(btn.dataset.id));

        try {
            // Изпраща избраните жанрове към backend-а при активен endpoint
//            await saveGenres(selectedIds);
        } catch (err) {
            console.error(err);
        }
    });

    // Отказва редакцията и връща потребителя към профилния изглед
    cancelBtn.addEventListener("click", () => {

        restoreFormData(originalData);

        showAppLayout();

        const additionalView = document.getElementById("view-signup-additional");
        const profileView = document.getElementById("view-profile");
        switchView(additionalView, profileView);
    });

    // Изчиства всички полета във формата
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

    if (!response.ok) {
        throw new Error("Failed to update genres");
    }
}
