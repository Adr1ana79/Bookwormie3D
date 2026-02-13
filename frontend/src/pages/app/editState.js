export function enableEditMode(section) {
    section.dataset.mode = "edit";
}

export function disableEditMode(section) {
    section.dataset.mode = "view";
}

export function initEditState({
                                  section,
                                  mainButtonSelector,
                                  saveButtonSelector,
                                  cancelButtonSelector
                              }) {

    const mainBtn = section.querySelector(mainButtonSelector);
    const saveBtn = section.querySelector(saveButtonSelector);
    const cancelBtn = section.querySelector(cancelButtonSelector);

    if (!mainBtn || !saveBtn || !cancelBtn) return;

    mainBtn.addEventListener("click", () => {
        enableEditMode(section);
    });

    saveBtn.addEventListener("click", () => {
        disableEditMode(section);
    });

    cancelBtn.addEventListener("click", () => {
        disableEditMode(section);
    });
}
