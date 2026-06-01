import { setBookLabelsVisible } from "./bookMesh.js";

export function initShelfZoom({
                                  container,
                                  shelfGroup,
                                  shelfLevels,
                                  zoomConfig,
                                  isSearchActive
                              }) {

    // Текущият активен ред от етажерката
    let currentLevel = 3;

    // Целева Y позиция на shelfGroup-а
    let targetModelY = 0;

    // Целева Z позиция на камерата
    let targetZ = zoomConfig.defaultZ;

    // Приближава камерата към конкретен ред
    function zoomToLevel(index) {

        // Ограничава индекса в рамките на наличните редове
        currentLevel = Math.max(
            0,
            Math.min(index, shelfLevels.length - 1)
        );

        // Премества модела така, че избраният ред да застане в центъра
        targetModelY = -shelfLevels[currentLevel];

        // Прилага zoom позицията на камерата
        targetZ = zoomConfig.zoomZ;

        // Показва заглавията на книгите при zoom
        setBookLabelsVisible(
            shelfGroup,
            true,
            isSearchActive()
        );
    }

    // Връща етажерката към началното zoom състояние
    function resetZoom() {
        currentLevel = 2;

        targetModelY = 0;
        targetZ = zoomConfig.defaultZ;

        // Скрива заглавията, освен ако search режимът не изисква друго
        setBookLabelsVisible(
            shelfGroup,
            false,
            isSearchActive()
        );
    }

    // Скролът премества фокуса между редовете на етажерката
    container.addEventListener("wheel", (event) => {

        event.preventDefault();

        if (event.deltaY > 0) {
            zoomToLevel(currentLevel + 1);
        } else {
            zoomToLevel(currentLevel - 1);
        }

    }, { passive: false });

    // Double click връща към общ изглед
    container.addEventListener("dblclick", resetZoom);

    // Връща target стойности, които animation loop-ът използва
    return {
        getTargetModelY: () => targetModelY,
        getTargetZ: () => targetZ
    };
}