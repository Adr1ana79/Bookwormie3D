import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";
import { getShelfLayout, isSlotBlocked } from "./shelfLayout.js";

const BOOK_MODEL_PATH = "assets/models/book/book.glb";

let loadedBookModel = null;

async function loadBookModel() {
    if (loadedBookModel) {
        return loadedBookModel;
    }

    const loader = new GLTFLoader();

    const gltf = await loader.loadAsync(BOOK_MODEL_PATH);
    loadedBookModel = gltf.scene;

    return loadedBookModel;
}

export async function createBookMesh(book) {
    const heightMap = {
        short: 0.3,
        medium: 0.36,
        high: 0.42
    };

    const colorMap = {
        black: 0x41414D,
        navy: 0x4D698B,
        green: 0x536B4E,
        bronze: 0xA97142,
        red: 0x8C2238,
        brown: 0x502323,
        blue: 0x0078C9,
        violet: 0x8196E5,
        cyan: 0x1CC1BA,
        yellow: 0xFFC529,
        peach: 0xFE9784,
        coral: 0xFF6F55
    };

    const height = heightMap[book.height] || heightMap.medium;

    const bookTemplate = await loadBookModel();
    const mesh = bookTemplate.clone(true);

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: colorMap[book.color] || colorMap.yellow,
                roughness: 0.35,
                metalness: 0
            });
        }
    });

    mesh.scale.set(0.43, height, 0.12);

    mesh.userData.type = "book";
    mesh.userData.bookId = book.id;

    return mesh;
}

function alignBookToBaseY(mesh, baseY) {
    const box = new THREE.Box3().setFromObject(mesh);
    const bottomY = box.min.y;

    mesh.position.y += baseY - bottomY;
}

export function positionBook(mesh, book, shelfSize, shelfDesign) {
    const layout = getShelfLayout(shelfSize, shelfDesign);

    const baseY =
        layout.startY +
        layout.baseRows[book.row];

    const x =
        layout.startX +
        book.index * layout.slotWidth;

    mesh.position.set(
        x,
        0,
        layout.z
    );

    alignBookToBaseY(mesh, baseY);
}

export async function renderBooks(books, shelfGroup, shelfSize, shelfDesign) {
    const layout = getShelfLayout(shelfSize, shelfDesign);

    for (const book of books) {
        if (isSlotBlocked(layout, book.row, book.index)) {
            continue;
        }

        const mesh = await createBookMesh(book);

        if (layout.bookScale) {
            mesh.scale.multiplyScalar(layout.bookScale);
        }

        positionBook(mesh, book, shelfSize, shelfDesign);

        shelfGroup.add(mesh);
    }
}