import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";

import { designConfig } from "./designConfig.js";

export function initThreeViewer(container, modelPath, design) {

    container.innerHTML = "";

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;  // пробвай 1.3 – 1.6
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const config = designConfig[design] || designConfig.basic;


    scene.background = new THREE.Color(config.background);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    container.appendChild(renderer.domElement);

    camera.position.z = 3;

    const ambient = new THREE.AmbientLight(0xfff1d6, 0.8); // топъл ambient
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe3b0, 1.1); // топла основна светлина
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4); // неутрален fill
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);



    const loader = new GLTFLoader();

    loader.load(modelPath, (gltf) => {

        const model = gltf.scene;
        // override material (както вече направихме)
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: config.modelColor,
                    roughness: 0.3,   // по-ниска roughness = по-светъл
                    metalness: 0.0
                });
            }
        });

        // 📦 Центрираме модела
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center); // центрираме в 0,0,0

        // 📏 Автоматичен scale
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);

        // Blender Z-up → Three Y-up
        model.rotation.x = -Math.PI / 2;

        // Обръщаме отпред
        model.rotation.z = Math.PI;

        model.position.y += 0.2; // леко надолу
        model.position.x = 0;    // гарантира центриране
        model.scale.z *= -1;


        scene.add(model);

    });



    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}
