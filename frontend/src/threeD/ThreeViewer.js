import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";

import { designConfig } from "./designConfig.js";
import { renderBooks, setBookLabelsVisible } from "./bookManager.js";
import { testBooks, openBookContentModal } from "../pages/app/book.js";
import { getShelfLayout } from "./shelfLayout.js";

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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let hoveredBook = null;
    let hoverTimeout = null;
    let hoveredBookOriginalZ = null;

    // lights
    const ambient = new THREE.AmbientLight(0xfff1d6, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe3b0, 1.1);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // zoom state
    let targetModelY = 0;
    let targetZ = zoomConfig.defaultZ;

    let currentLevel = 3;

    let model = null;

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

    function zoomToLevel(index) {
        currentLevel = Math.max(
            0,
            Math.min(index, shelfLevels.length - 1)
        );

        targetModelY = -shelfLevels[currentLevel];
        targetZ = zoomConfig.zoomZ;

        setBookLabelsVisible(shelfGroup, true);
    }

    function resetZoom() {
        currentLevel = 2;

        targetModelY = 0;
        targetZ = zoomConfig.defaultZ;

        setBookLabelsVisible(shelfGroup, false);
    }

    // interactions
    container.addEventListener("wheel", (event) => {

        event.preventDefault();

        if (event.deltaY > 0) {
            zoomToLevel(currentLevel + 1);
        } else {
            zoomToLevel(currentLevel - 1);
        }

    }, { passive: false });

    container.addEventListener("dblclick", resetZoom);

    function getTooltipStars(rating) {
        const numericRating = Number(rating) || 0;
        const roundedRating = Math.round(numericRating * 2) / 2;

        let stars = "";

        for (let i = 1; i <= 5; i++) {
            if (roundedRating >= i) {
                stars += "★";
            } else if (roundedRating === i - 0.5) {
                stars += "⯪";
            } else {
                stars += "☆";
            }
        }

        return stars;
    }

    function getIntersectedBook(event) {

        const rect =
            renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects =
            raycaster.intersectObjects(
                shelfGroup.children,
                true
            );

        for (const intersect of intersects) {

            let object = intersect.object;

            while (object) {

                if (object.userData.type === "book") {
                    return object;
                }

                object = object.parent;
            }
        }

        return null;
    }

    function positionTooltip(tooltip, mouseX, mouseY) {
        const offset = 18;

        tooltip.hidden = false;

        const tooltipRect = tooltip.getBoundingClientRect();

        let left = mouseX + offset;
        let top = mouseY + offset;

        if (left + tooltipRect.width > window.innerWidth) {
            left = mouseX - tooltipRect.width - offset;
        }

        if (top + tooltipRect.height > window.innerHeight) {
            top = mouseY - tooltipRect.height - offset;
        }

        tooltip.style.left = `${Math.max(8, left)}px`;
        tooltip.style.top = `${Math.max(8, top)}px`;
    }


    function showBookTooltip(book, x, y) {

        const tooltip = document.querySelector("#book-info-tooltip");

        tooltip.querySelector(".tooltip__book-title").textContent =
            book.title || "Untitled";

        tooltip.querySelector(".tooltip__author-name").textContent =
            book.author || "Unknown author";

        tooltip.querySelector(".tooltip__book-status").textContent =
            book.status || "Unread";

        tooltip.querySelector(".tooltip__book-rating").textContent =
            book.rating ?? "0.0";

        tooltip.querySelector(".tooltip__stars").textContent =
            getTooltipStars(book.rating);

        tooltip.querySelector(".tooltip__page-count").textContent =
            book.pages ?? "—";

        positionTooltip(tooltip, x, y);

        tooltip.hidden = false;
    }

    function hideTooltip() {

        const tooltip =
            document.querySelector("#book-info-tooltip");

        tooltip.hidden = true;
    }

    function pullBookForward(bookMesh) {
        if (hoveredBookOriginalZ === null) {
            hoveredBookOriginalZ = bookMesh.position.z;
        }

        bookMesh.userData.targetZ = bookMesh.userData.baseZ + 0.03;
    }

    function resetPulledBook() {
        if (hoveredBook && hoveredBookOriginalZ !== null) {
            hoveredBook.userData.targetZ = hoveredBook.userData.baseZ;
        }

        hoveredBookOriginalZ = null;
    }

    container.addEventListener("mousemove", (event) => {

        const bookMesh =
            getIntersectedBook(event);

        if (!bookMesh) {

            resetPulledBook();
            hoveredBook = null;

            clearTimeout(hoverTimeout);

            hideTooltip();

            return;
        }

        if (hoveredBook === bookMesh) {
            return;
        }

        resetPulledBook();

        hoveredBook = bookMesh;

        pullBookForward(bookMesh);

        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
            const book = bookMesh.userData.book;

            showBookTooltip(
                book,
                event.clientX,
                event.clientY
            );
        }, 700);

    });



    // function openBookContentModal(book) {
    //     const modal = document.querySelector("#book-content-modal");
    //
    //     if (!modal) {
    //         return;
    //     }
    //
    //     modal.querySelector(".book-content__title").textContent =
    //         book.title || "Untitled";
    //
    //     modal.querySelector(".book-content__author").textContent =
    //         book.author || "Unknown author";
    //
    //     modal.hidden = false;
    // }

    container.addEventListener("click", (event) => {
        console.log("Shelf clicked");

        const bookMesh = getIntersectedBook(event);

        console.log("Clicked book mesh:", bookMesh);

        if (!bookMesh) return;

        clearTimeout(hoverTimeout);
        hideTooltip();

        openBookContentModal(bookMesh.userData.book);
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

        await renderBooks(testBooks, shelfGroup, size, design);
    });

    // animation loop
    function animate() {

        requestAnimationFrame(animate);

        // smooth model movement
        if (model) {

            shelfGroup.position.y += (
                targetModelY - shelfGroup.position.y
            ) * 0.2;

        }

        // smooth zoom
        camera.position.z += (
            targetZ - camera.position.z
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
        renderer
        // getModel: () => model
    };
}