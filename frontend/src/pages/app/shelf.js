import { initThreeViewer } from "../../threeD/ThreeViewer.js";
import { initBookForm } from "../../ui-elements/bookForm.js";

let currentViewer = null;

export function initShelf() {
    const shelfView = document.getElementById("view-shelf");
    if (!shelfView) return;

    const threeContainer = shelfView.querySelector("#three-container");
    const backButton = shelfView.querySelector(".back-button");

    backButton.onclick = (e) => {
        e.preventDefault();

        if (currentViewer?.clearBookSearch) {
            currentViewer.clearBookSearch();
        }

        sessionStorage.setItem("restoreShelvesScroll", "true");

        document.dispatchEvent(
            new CustomEvent("app:navigate", {
                detail: "shelves"
            })
        );
    };

    document.addEventListener("app:open-shelf", (event) => {
        const shelfTitle =
            shelfView.querySelector(".local_navigation strong");

        const { design, size, shelfName, sectionName } = event.detail;

        if (backButton && sectionName) {
            backButton.textContent = sectionName;
        }

        if (shelfTitle && shelfName) {
            shelfTitle.textContent = shelfName;
        }

        const modelPath =
            `assets/models/shelves/${design}/${design}-${size}.glb`;

        currentViewer =
            initThreeViewer(threeContainer, modelPath, design, size);

        initBookForm();
    });
}

