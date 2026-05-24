import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";

import { designConfig } from "./designConfig.js";
import { renderBooks } from "./bookManager.js";
import { testBooks} from "../pages/app/book.js";

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
    }

    function resetZoom() {

        currentLevel = 2;

        targetModelY = 0;
        targetZ = zoomConfig.defaultZ;
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

    // loader
    const loader = new GLTFLoader();

    loader.load(modelPath, (gltf) => {

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

        renderBooks(testBooks, shelfGroup, size);
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
    }

    animate();

    return {
        scene,
        camera,
        renderer
        // getModel: () => model
    };
}