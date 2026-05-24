import { initThreeViewer } from "../../threeD/ThreeViewer.js";

import { renderBooks } from "../../threeD/bookManager.js";
import { testBooks } from "./book.js";

export function initShelf() {
    const shelfView = document.getElementById('view-shelf');
    if (!shelfView) return;

    const threeContainer = shelfView.querySelector("#three-container");

    const backButton =
        document.querySelector(".back-button");

    backButton.onclick = (e) => {

        e.preventDefault();

        sessionStorage.setItem(
            "restoreShelvesScroll",
            "true"
        );

        document.dispatchEvent(
            new CustomEvent('app:navigate', {
                detail: 'shelves'
            })
        );
    };

    document.addEventListener("app:open-shelf", (event) => {
        const backButton =
            shelfView.querySelector(".back-button");

        const shelfTitle =
            shelfView.querySelector(".local_navigation strong");


        const { design, size } = event.detail;
        const {
            shelfName,
            sectionName
        } = event.detail;


        if (backButton && sectionName) {
            backButton.textContent = sectionName;
        }

        if (shelfTitle && shelfName) {
            shelfTitle.textContent = shelfName;
        }

        const modelPath = `assets/models/shelves/${design}/${design}-${size}.glb`;

        const viewer = initThreeViewer(threeContainer, modelPath, design, size);

        initThreeViewer(threeContainer, modelPath, design, size);
    });
}
