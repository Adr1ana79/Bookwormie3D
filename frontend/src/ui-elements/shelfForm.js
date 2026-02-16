export function initShelfForm(onCreate) {
    const modal = document.getElementById("add-shelf-modal");
    if (!modal) return;

    const form = modal.querySelector(".add-shelf-form");
    const titleInput = form.querySelector('input[name="shelf-title"]');
    const overlay = modal.querySelector(".modal__overlay");
    const cancelBtn = form.querySelector("[data-close]");

    function open() {
        // reset form
        form.reset();

        // default title
        titleInput.value = "My shelf";

        modal.hidden = false;
        titleInput.focus();
        titleInput.select();
    }

    function close() {
        modal.hidden = true;
    }

    cancelBtn.onclick = close;
    overlay.onclick = close;

    form.onsubmit = (e) => {
        e.preventDefault();

        const data = new FormData(form);

        const shelf = {
            title: data.get("shelf-title")?.trim() || "My shelf",
            design: data.get("design"),
            size: data.get("size")
        };

        if (typeof onCreate === "function") {
            onCreate(shelf);
        }

        close();
    };

    return { open };
}

