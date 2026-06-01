import { initThreeViewer } from "../../threeD/ThreeViewer.js";
import { initBookForm } from "../../ui-elements/bookForm.js";

// Пази текущата активна 3D визуализация на отворената етажерка
let currentViewer = null;

export function initShelf() {
    // Намира view-то за конкретна етажерка
    const shelfView = document.getElementById("view-shelf");
    if (!shelfView) return;

    // Контейнерът, в който се зарежда Three.js сцената
    const threeContainer = shelfView.querySelector("#three-container");

    // Бутонът за връщане към страницата с етажерки
    const backButton = shelfView.querySelector(".back-button");

    backButton.onclick = (e) => {
        e.preventDefault();

        // Изчиства активното търсене на книги, ако viewer-ът поддържа такава функция
        if (currentViewer?.clearBookSearch) {
            currentViewer.clearBookSearch();
        }

        // Записва флаг, че при връщане към shelves view
        // трябва да се възстанови предишната scroll позиция
        sessionStorage.setItem("restoreShelvesScroll", "true");

        // Навигира обратно към страницата с всички етажерки
        document.dispatchEvent(
            new CustomEvent("app:navigate", {
                detail: "shelves"
            })
        );
    };

    // Слуша за събитие за отваряне на конкретна етажерка
    document.addEventListener("app:open-shelf", (event) => {

        // Заглавието в локалната навигация на shelf view-то
        const shelfTitle =
            shelfView.querySelector(".local_navigation strong");

        // Данните идват от избраната shelf card
        const { design, size, shelfName, sectionName } = event.detail;

        // Показва името на секцията върху back бутона
        if (backButton && sectionName) {
            backButton.textContent = sectionName;
        }

        // Показва името на конкретната етажерка като заглавие
        if (shelfTitle && shelfName) {
            shelfTitle.textContent = shelfName;
        }

        // Сглобява пътя към правилния .glb модел според design и size
        const modelPath =
            `assets/models/shelves/${design}/${design}-${size}.glb`;

        // Инициализира Three.js viewer-а за избраната етажерка
        currentViewer =
            initThreeViewer(threeContainer, modelPath, design, size);

        // Инициализира формата за добавяне/редактиране на книги
        initBookForm();
    });
}

