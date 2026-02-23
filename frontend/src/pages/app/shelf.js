import { initThreeViewer } from "../../threeD/ThreeViewer.js";

export function initShelf() {
    const shelfView = document.getElementById('view-shelf');
    if (!shelfView) return;

    const threeContainer = shelfView.querySelector("#three-container");

    document.addEventListener("app:open-shelf", (event) => {
        const { design, size } = event.detail;

        const modelPath = `assets/models/shelves/${design}/${design}-${size}.glb`;

        initThreeViewer(threeContainer, modelPath, design);
    });
}
