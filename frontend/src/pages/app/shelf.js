import { initThreeViewer } from "../../threeD/ThreeViewer.js";
import { switchView } from "../viewManager.js";

export function initShelf() {
    const shelfView = document.getElementById('view-shelf');
    if (!shelfView) return;

    const threeContainer = shelfView.querySelector("#three-container");

    const backButton =
        document.querySelector(".back-button");

    backButton.onclick = (e) => {

        e.preventDefault();

        document.dispatchEvent(
            new CustomEvent('app:navigate', {
                detail: 'shelves'
            })
        );

        const shelvesView =
            document.getElementById("view-shelves");

        const scrollContainer =
            shelvesView?.querySelector(".shelves-page-content");

        const savedScroll =
            sessionStorage.getItem("shelvesScrollPosition");

        if (savedScroll && scrollContainer) {

            requestAnimationFrame(() => {

                scrollContainer.scrollTop =
                    parseInt(savedScroll, 10);
            });
        }
    };

    document.addEventListener("app:open-shelf", (event) => {
        const { design, size } = event.detail;

        const modelPath = `assets/models/shelves/${design}/${design}-${size}.glb`;

        initThreeViewer(threeContainer, modelPath, design, size);
    });
}
