import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";

import { designConfig } from "./designConfig.js";
import { renderBooks } from "./bookRenderer.js";
import { findFirstFreeBookSlot, deleteBookAndReflow } from "./bookSlots.js";
import { getShelfLayout } from "./shelfLayout.js";
import { initShelfZoom } from "./shelfZoom.js";
import { initBookInteractions } from "./bookInteractions.js";
import { initBookSearch } from "./bookSearch3D.js";

import { testBooks, openBookContentModal } from "../pages/app/book.js";
import { openEditBookFormModal,  setCreateBookHandler, setUpdateBookHandler } from "../ui-elements/bookForm.js";

// Инициализира 3D визуализацията на избраната етажерка
export function initThreeViewer(container, modelPath, design, size) {

    // Изчиства предишна 3D сцена, ако вече е имало зареден viewer
    container.innerHTML = "";

    // Създава нова Three.js сцена
    const scene = new THREE.Scene();

    // Взима настройките за избрания дизайн
    // Ако дизайнът липсва, използва basic като fallback
    const config = designConfig[design] || designConfig.basic;


    // Настройки за разстоянието на камерата според размера на етажерката
    const sizeZoomConfig = {

        mini: {
            defaultZ: 2.3,
            zoomZ: 1
        },

        standard: {
            defaultZ: 1.9,
            zoomZ: 0.7
        }

    };

    // Избира правилните zoom настройки според размера
    const zoomConfig =
        sizeZoomConfig[size] || sizeZoomConfig.standard;


    // Задава background цвета на сцената според дизайна
    scene.background = new THREE.Color(config.background);


    /* RENDERER */

    // Създава WebGL renderer за визуализацията
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    // Ограничава pixel ratio, за да няма излишно тежък render на по-силни дисплеи
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Задава размера на renderer-а според контейнера
    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    // Настройки за по-добро осветяване и цветове
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.outputColorSpace = THREE.SRGBColorSpace;


    // Добавя canvas елемента на renderer-а в контейнера
    container.appendChild(renderer.domElement);


    /* CAMERA */

    // Създава perspective камера за 3D сцената
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    // Поставя камерата на начална zoom позиция
    camera.position.set(0, 0, zoomConfig.defaultZ);
    // Насочва камерата към центъра на сцената
    camera.lookAt(0, 0, 0);


    /* LIGHTS */

    // Основна мека светлина за цялата сцена
    const ambient = new THREE.AmbientLight(0xfff1d6, 0.8);
    scene.add(ambient);

    // Основна насочена светлина
    const keyLight = new THREE.DirectionalLight(0xffe3b0, 1.1);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    // Допълнителна запълваща светлина,
    // която омекотява сенките
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);


    /* RAYCASTING */

    // Raycaster-ът се използва за засичане на клик върху 3D обекти
    const raycaster = new THREE.Raycaster();

    // Координати на мишката в normalized device coordinates
    const mouse = new THREE.Vector2();

    // Текущо зареденият 3D модел на етажерката
    let model = null;

    // Временно копие на тестовите книги
    let books = [...testBooks];

    // Обща група за модела на етажерката и книгите
    const shelfGroup = new THREE.Group();
    scene.add(shelfGroup);


    // Y позициите на редовете според размера на етажерката
    const shelfZoomLevelConfig = {

        mini: [
            0.45,
            0.2,
            0,
            -0.2,
            -0.45
        ],

        standard: [
            0.75,
            0.4,
            0,
            -0.4,
            -0.75
        ]

    };

    // Избира правилните нива на редовете
    const shelfLevels =
        shelfZoomLevelConfig[size] || shelfZoomLevelConfig.standard;


    /* BOOK INTERACTIONS */

    // Инициализира интеракциите с книгите: отваряне, редакция, изтриване и hover движение
    const bookInteractions = initBookInteractions({
        container,
        renderer,
        camera,
        raycaster,
        mouse,
        shelfGroup,
        openBook: openBookContentModal,
        editBook: openEditBookFormModal,
        deleteBook: async (book) => {
            // Изтрива книгата и пренарежда останалите книги
            books = deleteBookAndReflow(
                books,
                book.id,
                size,
                design
            );

            // Пререндерира книгите след промяната
            await refreshBooks();
        }
    });


    /* BOOK SEARCH */

    const bookSearch = initBookSearch({
        shelfGroup,
        updateBookTargetZ: bookInteractions.updateBookTargetZ
    });


    /* SHELF ZOOM */

    // Инициализира zoom логиката между редовете на етажерката
    const shelfZoom = initShelfZoom({
        container,
        shelfGroup,
        shelfLevels,
        zoomConfig,

        // Не позволява zoom навигация, докато има активно търсене
        isSearchActive: bookSearch.isSearchActive
    });


    /* FUNCTIONS */

    // Пререндерира книгите върху етажерката
    async function refreshBooks(shouldResetInteractions = false) {
        // При нужда нулира hover/edit interaction state-а,
        // за да не остане активна стара книга след промяна
        if (shouldResetInteractions) {
            bookInteractions.resetInteractionState();
        }

        const oldObjects = [];

        // Намира всички текущо рендерирани book обекти в shelfGroup
        shelfGroup.traverse((child) => {
            if (child.userData.type === "book") {
                oldObjects.push(child);
            }
        });

        // Премахва старите book обекти от сцената
        oldObjects.forEach((object) => {
            object.parent?.remove(object);
        });

        // Рендерира книгите от актуалния books масив
        await renderBooks(books, shelfGroup, size, design);

        // Обновява видимостта на бутона за добавяне на книга
        updateAddBookButtonState();
    }

    // Проверява дали има свободно място за нова книга
    function updateAddBookButtonState() {
        const freeSlot = findFirstFreeBookSlot(books, size, design);

        // Ако няма свободен слот, скрива бутона за добавяне
        if (addBookButton) {
            addBookButton.hidden = !freeSlot;
        }
    }

    // Бутонът за добавяне на нова книга към текущата етажерка
    const addBookButton = document.querySelector("[data-add-book]");

    /* CREATE BOOK */

    // Подаваме callback към book form-а,
    // който се изпълнява при създаване на нова книга
    setCreateBookHandler(async (newBook) => {

        // Проверява дали потребителят е избрал ръчно row/index
        const hasManualSlot =
            newBook.row !== "" &&
            newBook.index !== "";

        // Ако има ръчно избран слот, използва него
        // Ако няма, намира първия свободен слот автоматично
        const slot = hasManualSlot
            ? {
                row: Number(newBook.row),
                index: Number(newBook.index)
            }
            : findFirstFreeBookSlot(books, size, design);


        // Ако няма свободно място, прекратява добавянето
        if (!slot) return;

        // Добавя новата книга към локалния books масив
        books = [
            ...books,
            {
                ...newBook,

                // Временно генерира уникално id
                id: `book-${Date.now()}`,

                row: slot.row,
                index: slot.index,

                // Стойности по подразбиране за нова книга
                status: "Unread",
                rating: 0,
                pages: 0,
                genres: [],
                review: ""
            }
        ];

        // Пререндерира книгите след добавянето
        await refreshBooks();
    });

    /* UPDATE BOOK */

    // Подаваме callback към book form-а, който се изпълнява при редакция на книга
    setUpdateBookHandler(async (updatedBook) => {

        // Заменя старата версия на книгата с обновената
        books = books.map((book) =>
            book.id === updatedBook.id
                ? updatedBook
                : book
        );

        // Пререндерира книгите и нулира interaction state-а
        await refreshBooks(true);
    });

    /* LOADER */

    // Създава loader за .glb/.gltf модели
    const loader = new GLTFLoader();

    // Зарежда избрания 3D модел на етажерката
    loader.load(modelPath, async (gltf) => {

        model = gltf.scene;

        /* MATERIALS */

        // Обхожда всички mesh обекти в модела
        // и им задава материал според избрания дизайн
        model.traverse((child) => {

            if (child.isMesh) {

                child.material = new THREE.MeshStandardMaterial({
                    color: config.modelColor,
                    roughness: 0.3,
                    metalness: 0.0,
                    side: THREE.DoubleSide
                });

            }

        });

        /* CENTERING */

        // Изчислява bounding box-а на модела
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());
        const modelSize = box.getSize(new THREE.Vector3());


        // Центрира модела спрямо неговия geometric center
        model.position.sub(center);

        /* AUTO SCALE */

        // Намира най-голямото измерение на модела
        const maxDim = Math.max(
            modelSize.x,
            modelSize.y,
            modelSize.z
        );

        // Скалира модела до сходен визуален размер в сцената
        const scale = 2 / maxDim;

        model.scale.setScalar(scale);

        /* ORIENTATION */

        // Завърта модела, за да застане правилно към камерата
        model.rotation.x = -Math.PI / 2;
        model.rotation.z = Math.PI;


        /* FINE POSITIONING */

        // Малка корекция на позицията след центриране и завъртане
        model.position.y += 0.2;
        model.position.x = 0;

        // Обръща модела по Z, за да гледа към потребителя
        model.scale.z *= -1;

        // Добавя модела към общата група на етажерката
        shelfGroup.add(model);


        // Взима layout настройките за текущия дизайн и размер
        const layout = getShelfLayout(size, design);

        // Прилага допълнителни offset корекции,
        // ако конкретният модел има нужда от тях
        if (layout.modelOffset) {
            model.position.x += layout.modelOffset.x || 0;
            model.position.y += layout.modelOffset.y || 0;
            model.position.z += layout.modelOffset.z || 0;
        }

        // Изчаква зареждането на шрифтовете,
        // за да може текстът върху книгите да се рендерира коректно
        await document.fonts.ready;

        // Рендерира книгите след зареждане на модела
        await refreshBooks();

        // Проверява дали бутонът за добавяне трябва да е видим
        updateAddBookButtonState();
    });


    /* ANIMATION LOOP */

    function animate() {

        requestAnimationFrame(animate);

        /* SMOOTH MODEL MOVEMENT */

        if (model) {

            // Плавно премества shelfGroup-а към активния zoom ред
            shelfGroup.position.y += (
                shelfZoom.getTargetModelY() - shelfGroup.position.y
            ) * 0.2;

        }

        /* SMOOTH ZOOM */

        // Плавно приближава/отдалечава камерата
        camera.position.z += (
            shelfZoom.getTargetZ() - camera.position.z
        ) * 0.2;

        camera.lookAt(0, 0, 0);

        // Рендерира текущия кадър
        renderer.render(scene, camera);

        // Плавно анимира изтеглянето/връщането на book обекти по Z
        shelfGroup.traverse((child) => {

            if (
                child.userData.type === "book" &&
                child.userData.targetZ !== undefined
            ) {
                child.position.z += (
                    child.userData.targetZ -
                    child.position.z
                ) * 0.11;
            }
        });
    }

    // Стартира render loop-а
    animate();

    // Връща основни обекти и функция за изчистване на book search
    return {
        scene,
        camera,
        renderer,
        clearBookSearch: bookSearch.clearBookSearch
    };
}