import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";

export function initThreeViewer(container, modelPath) {

    container.innerHTML = "";

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;


    scene.background = new THREE.Color(0xfcdac7);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    container.appendChild(renderer.domElement);

    camera.position.z = 3;

    // Ambient – запълва сенките
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // Основна светлина
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    // Контра светлина за depth
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);


    const loader = new GLTFLoader();

    loader.load(modelPath, (gltf) => {

        const model = gltf.scene;
        // override material (както вече направихме)
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xb0815b,
                    roughness: 0.7,
                    metalness: 0.1
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
