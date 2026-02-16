export function initShelfForm({ onCreate, onUpdate }) {
    const modal = document.getElementById("add-shelf-modal");
    if (!modal) return;

    const form = modal.querySelector(".add-shelf-form");
    if (!form) return;

    const titleInput = form.querySelector('input[name="shelf-title"]');
    const overlay = modal.querySelector(".modal__overlay");
    const cancelBtn = form.querySelector("[data-close]");
    const titleHeading = modal.querySelector("#add-shelf-title");
    const shelfGroups = modal.querySelectorAll(".form-group--shelf");

    if (!titleInput) return;

    let mode = "create";
    let editingShelf = null;

    function close() {
        modal.hidden = true;
    }

    cancelBtn?.addEventListener("click", close);
    overlay?.addEventListener("click", close);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(form);

        const shelfData = {
            title: data.get("shelf-title")?.toString().trim() || "My shelf",
            design: data.get("design")?.toString(),
            size: data.get("size")?.toString()
        };

        if (mode === "create") {
            onCreate?.(shelfData);
        }

        if (mode === "edit" && editingShelf) {
            onUpdate?.(editingShelf, shelfData);
        }

        close();
    });

    function openCreate() {
        mode = "create";
        editingShelf = null;

        form.reset();
        titleInput.value = "My shelf";

        // показваме design и size
        shelfGroups.forEach(group => {
            group.style.display = "";
        });

        if (titleHeading) {
            titleHeading.textContent = "Create shelf";
        }

        modal.hidden = false;
        titleInput.focus();
        titleInput.select();
    }

    function openEdit(shelfElement) {
        mode = "edit";
        editingShelf = shelfElement;

        const title = shelfElement.querySelector("p")?.textContent || "";
        titleInput.value = title;

        // скриваме design и size
        shelfGroups.forEach(group => {
            group.style.display = "none";
        });

        if (titleHeading) {
            titleHeading.textContent = "Rename shelf";
        }

        modal.hidden = false;
        titleInput.focus();
        titleInput.select();
    }

    return {
        openCreate,
        openEdit
    };
}
