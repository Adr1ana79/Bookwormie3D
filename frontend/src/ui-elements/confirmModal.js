export function openConfirmModal({
                                     title,
                                     description,
                                     confirmText,
                                     onConfirm
                                 }) {
    const modal = document.querySelector(".modal--confirmation");
    if (!modal) {
        console.error("Confirmation modal not found");
        return;
    }

    const titleEl = modal.querySelector("#confirmation-title");
    const descriptionEl = modal.querySelector("#confirmation-description");
    const confirmBtn = modal.querySelector("[data-confirm]");
    const cancelBtn = modal.querySelector("[data-close]");
    const overlay = modal.querySelector(".modal__overlay");

    titleEl.textContent = title;
    descriptionEl.textContent = description;
    confirmBtn.textContent = confirmText;

    const close = () => {
        modal.hidden = true;
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        overlay.onclick = null;
    };

    confirmBtn.onclick = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
        }
        close();
    };

    cancelBtn.onclick = close;
    overlay.onclick = close;

    modal.hidden = false;
}
