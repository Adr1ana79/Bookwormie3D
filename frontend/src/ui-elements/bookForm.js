let onCreateBook = null;
let onUpdateBook = null;


export function setUpdateBookHandler(handler) {
    onUpdateBook = handler;
}

export function setCreateBookHandler(handler) {
    onCreateBook = handler;
}


export function initBookForm() {
    const addBookButton = document.querySelector("[data-add-book]");

    if (!addBookButton) return;

    addBookButton.disabled = false;

    if (addBookButton.dataset.initialized === "true") {
        return;
    }

    addBookButton.dataset.initialized = "true";

    addBookButton.addEventListener("click", () => {
        openAddBookModal();
    });
}


function collectBookFormData(form) {
    return {
        title: form.elements["book-title"]?.value.trim() || "Untitled",
        author: form.elements["book-author"]?.value.trim() || "Unknown author",
        height: form.elements["height"]?.value || "medium",
        font: form.elements["font"]?.value || "normal",
        color: form.elements["color"]?.value || "yellow"
    };
}

export function openAddBookModal(slot = null) {
    const modal = document.querySelector("#add-edit-book-modal");
    const form = modal?.querySelector("#add-edit-book-form");
    const title = modal?.querySelector("#add-edit-book-title");

    if (!modal || !form) return;

    modal.dataset.mode = "add";
    modal.dataset.row = slot?.row ?? "";
    modal.dataset.index = slot?.index ?? "";

    title.textContent = "Add book";

    form.reset();

    form.onsubmit = (event) => {
        event.preventDefault();

        const book = collectBookFormData(form);

        book.row = modal.dataset.row;
        book.index = modal.dataset.index;

        onCreateBook?.(book);

        modal.hidden = true;
    };

    modal.hidden = false;
    bindBookFormClose(modal);
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

    form.onsubmit = (event) => {
        event.preventDefault();

        const updatedBook = {
            ...book,
            ...collectBookFormData(form)
        };

        onUpdateBook?.(updatedBook);

        modal.hidden = true;
    };

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