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


export function initThreeViewer(container, modelPath, design, size) {

    container.innerHTML = "";

    const scene = new THREE.Scene();
    const config = designConfig[design] || designConfig.basic;


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

    const zoomConfig =
        sizeZoomConfig[size] || sizeZoomConfig.standard;


    scene.background = new THREE.Color(config.background);


    // renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);


    // camera
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(0, 0, zoomConfig.defaultZ);
    camera.lookAt(0, 0, 0);


    // lights
    const ambient = new THREE.AmbientLight(0xfff1d6, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe3b0, 1.1);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);



    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    let model = null;
    let books = [...testBooks];

    const shelfGroup = new THREE.Group();
    scene.add(shelfGroup);


    const shelfLevelConfig = {

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

    const shelfLevels =
        shelfLevelConfig[size] || shelfLevelConfig.standard;


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
            books = deleteBookAndReflow(
                books,
                book.id,
                size,
                design
            );

            await refreshBooks();
        }
    });

    const bookSearch = initBookSearch({
        shelfGroup,
        updateBookTargetZ: bookInteractions.updateBookTargetZ
    });


    // zoom state
    const shelfZoom = initShelfZoom({
        container,
        shelfGroup,
        shelfLevels,
        zoomConfig,
        isSearchActive: bookSearch.isSearchActive
    });


    // functions
    async function refreshBooks(shouldResetInteractions = false) {
        if (shouldResetInteractions) {
            bookInteractions.resetInteractionState();
        }

        const oldObjects = [];

        shelfGroup.traverse((child) => {
            if (child.userData.type === "book") {
                oldObjects.push(child);
            }
        });

        oldObjects.forEach((object) => {
            object.parent?.remove(object);
        });

        await renderBooks(books, shelfGroup, size, design);

        updateAddBookButtonState();
    }

    function updateAddBookButtonState() {
        const freeSlot = findFirstFreeBookSlot(books, size, design);

        if (addBookButton) {
            addBookButton.hidden = !freeSlot;
        }
    }



    const addBookButton = document.querySelector("[data-add-book]");

    setCreateBookHandler(async (newBook) => {
        const hasManualSlot =
            newBook.row !== "" &&
            newBook.index !== "";

        const slot = hasManualSlot
            ? {
                row: Number(newBook.row),
                index: Number(newBook.index)
            }
            : findFirstFreeBookSlot(books, size, design);

        if (!slot) return;

        books = [
            ...books,
            {
                ...newBook,
                id: `book-${Date.now()}`,
                row: slot.row,
                index: slot.index,
                status: "Unread",
                rating: 0,
                pages: 0,
                genres: [],
                review: ""
            }
        ];

        await refreshBooks();
    });

    setUpdateBookHandler(async (updatedBook) => {
        books = books.map((book) =>
            book.id === updatedBook.id
                ? updatedBook
                : book
        );

        await refreshBooks(true);
    });


    // loader
    const loader = new GLTFLoader();

    loader.load(modelPath, async (gltf) => {

        model = gltf.scene;

        // materials
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

        // centering
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());
        const modelSize = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        // auto scale
        const maxDim = Math.max(
            modelSize.x,
            modelSize.y,
            modelSize.z
        );

        const scale = 2 / maxDim;

        model.scale.setScalar(scale);

        // orientation
        model.rotation.x = -Math.PI / 2;
        model.rotation.z = Math.PI;

        // fine positioning
        model.position.y += 0.2;
        model.position.x = 0;

        // flip
        model.scale.z *= -1;

        shelfGroup.add(model);

        const layout = getShelfLayout(size, design);

        if (layout.modelOffset) {
            model.position.x += layout.modelOffset.x || 0;
            model.position.y += layout.modelOffset.y || 0;
            model.position.z += layout.modelOffset.z || 0;
        }

        await document.fonts.ready;

        await refreshBooks();
        updateAddBookButtonState();
    });


    // animation loop
    function animate() {

        requestAnimationFrame(animate);

        // smooth model movement
        if (model) {

            shelfGroup.position.y += (
                shelfZoom.getTargetModelY() - shelfGroup.position.y
            ) * 0.2;

        }

        // smooth zoom
        camera.position.z += (
            shelfZoom.getTargetZ() - camera.position.z
        ) * 0.2;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

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

    animate();

    return {
        scene,
        camera,
        renderer,
        clearBookSearch: bookSearch.clearBookSearch
    };
}