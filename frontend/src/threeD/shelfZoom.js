import { setBookLabelsVisible } from "./bookMesh.js";

export function initShelfZoom({
                                  container,
                                  shelfGroup,
                                  shelfLevels,
                                  zoomConfig,
                                  isSearchActive
                              }) {

    let currentLevel = 3;

    let targetModelY = 0;
    let targetZ = zoomConfig.defaultZ;

    function zoomToLevel(index) {
        currentLevel = Math.max(
            0,
            Math.min(index, shelfLevels.length - 1)
        );

        targetModelY = -shelfLevels[currentLevel];
        targetZ = zoomConfig.zoomZ;

        setBookLabelsVisible(
            shelfGroup,
            true,
            isSearchActive()
        );
    }

    function resetZoom() {
        currentLevel = 2;

        targetModelY = 0;
        targetZ = zoomConfig.defaultZ;

        setBookLabelsVisible(
            shelfGroup,
            false,
            isSearchActive()
        );
    }

    container.addEventListener("wheel", (event) => {

        event.preventDefault();

        if (event.deltaY > 0) {
            zoomToLevel(currentLevel + 1);
        } else {
            zoomToLevel(currentLevel - 1);
        }

    }, { passive: false });

    container.addEventListener("dblclick", resetZoom);

    return {
        getTargetModelY: () => targetModelY,
        getTargetZ: () => targetZ
    };
}