let modal;
let titleEl;
let descriptionEl;
let confirmBtn;
let cancelBtn;
let overlay;

let confirmCallback = null;

// =========================
// INIT (runs once on import)
// =========================
function initModalElements() {
    modal = document.querySelector(".modal--confirmation");
    if (!modal) return;

    titleEl = modal.querySelector("#confirmation-title");
    descriptionEl = modal.querySelector("#confirmation-description");
    confirmBtn = modal.querySelector("[data-confirm]");
    cancelBtn = modal.querySelector("[data-close]");
    overlay = modal.querySelector(".modal__overlay");

    // Confirm click
    confirmBtn?.addEventListener("click", () => {
        if (typeof confirmCallback === "function") {
            confirmCallback();
        }
        closeConfirmModal();
    });

    // Cancel click
    cancelBtn?.addEventListener("click", closeConfirmModal);

    // Overlay click
    overlay?.addEventListener("click", closeConfirmModal);

    // ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.hidden) {
            closeConfirmModal();
        }
    });
}

// Run after DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModalElements);
} else {
    initModalElements();
}

// =========================
// OPEN
// =========================
export function openConfirmModal({
                                     title,
                                     description,
                                     confirmText,
                                     onConfirm
                                 }) {
    if (!modal) return;

    titleEl.textContent = title;
    descriptionEl.textContent = description;
    confirmBtn.textContent = confirmText;

    confirmCallback = onConfirm;

    modal.hidden = false;
}

// =========================
// CLOSE
// =========================
export function closeConfirmModal() {
    if (!modal) return;

    modal.hidden = true;
    confirmCallback = null;
}
