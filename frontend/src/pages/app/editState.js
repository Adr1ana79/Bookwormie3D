// Превключва дадена секция в edit режим
export function enableEditMode(section) {
    section.dataset.mode = "edit";
}

// Връща секцията обратно в режим за преглед
export function disableEditMode(section) {
    section.dataset.mode = "view";
}

// Инициализира общата логика за edit state управление
export function initEditState({
                                  section,
                                  mainButtonSelector,
                                  saveButtonSelector,
                                  cancelButtonSelector
                              }) {

    // Основният бутон за активиране на edit режим
    const mainBtn = section.querySelector(mainButtonSelector);

    const saveBtn = section.querySelector(saveButtonSelector);
    const cancelBtn = section.querySelector(cancelButtonSelector);

    // Прекратява инициализацията, ако липсва някой от необходимите елементи
    if (!mainBtn || !saveBtn || !cancelBtn) return;

    /* ENABLE EDIT MODE */
    mainBtn.addEventListener("click", () => {
        // Активира edit режима за секцията
        enableEditMode(section);
    });

    saveBtn.addEventListener("click", () => {
        // Връща секцията в view режим след save
        disableEditMode(section);
    });

    cancelBtn.addEventListener("click", () => {
        // Връща секцията в view режим при cancel
        disableEditMode(section);
    });
}
