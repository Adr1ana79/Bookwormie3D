export function initBookForm() {
    const addBookButton = document.querySelector("[data-add-book]");
    const modal = document.querySelector("#add-edit-book-modal");

    if (!addBookButton || !modal) return;

    addBookButton.addEventListener("click", () => {
        openAddBookModal();
    });
}

export function openAddBookModal() {
    const modal = document.querySelector("#add-edit-book-modal");
    const form = modal?.querySelector("#add-edit-book-form");
    const title = modal?.querySelector("#add-edit-book-title");

    if (!modal || !form) return;

    modal.dataset.mode = "add";
    title.textContent = "Add book";

    form.reset();

    modal.hidden = false;
    bindBookFormClose(modal);
}


function bindBookFormClose(modal) {
    const closeButtons = modal.querySelectorAll("[data-close]");
    const overlay = modal.querySelector(".modal__overlay");

    closeButtons.forEach((button) => {
        button.onclick = () => {
            modal.hidden = true;
        };
    });

    if (overlay) {
        overlay.onclick = () => {
            modal.hidden = true;
        };
    }
}


export function openEditBookFormModal(book) {
    const modal = document.querySelector("#add-edit-book-modal");
    const form = modal?.querySelector("#add-edit-book-form");
    const title = modal?.querySelector("#add-edit-book-title");

    if (!modal || !form) return;

    modal.dataset.mode = "edit";
    title.textContent = "Edit book";

    form.elements["height"].value = book.height || "medium";
    form.elements["font"].value = book.font || "normal";
    form.elements["color"].value = book.color || "yellow";

    if (form.elements["book-title"]) {
        form.elements["book-title"].value = book.title || "";
    }

    if (form.elements["book-author"]) {
        form.elements["book-author"].value = book.author || "";
    }

    modal.hidden = false;
    bindBookFormClose(modal);
}
