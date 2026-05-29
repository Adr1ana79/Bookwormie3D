import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module";
import { getShelfLayout, isSlotBlocked } from "./shelfLayout.js";

const BOOK_MODEL_PATH = "assets/models/book/book-1.glb";

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

export function setBookLabelsVisible(shelfGroup, isVisible) {
    shelfGroup.traverse((child) => {

        const isSearchActive =
            Boolean(searchInput?.value?.trim()) ||
            Boolean(activeStatusFilter);

        if (child.userData.type === "book-label") {

            const bookMesh = child.parent;

            child.visible = isSearchActive
                ? bookMesh.userData.isSearchMatch
                : isVisible;
        }
    });
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
    mesh.userData.book = book;
    mesh.userData.targetZ = 0;

    const label = createBookLabel(book);
    label.visible = false;
    mesh.add(label);

    return mesh;
}

function createBookTitleTexture(book) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;

    const fontMap = {
        normal: "BookNormal",
        elegant: "BookElegant",
        gothic: "BookGothic",
        creepy: "BookCreepy",
        typewriter: "BookTypewriter",
        manuscript: "BookManuscript"
    };

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    const fontFamily = fontMap[book.font] || fontMap.normal;
    ctx.font = `bold 90px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const titleLimitMap = {
        short: {
            max: 13,
            slice: 11
        },
        medium: {
            max: 18,
            slice: 15
        },
        high: {
            max: 22,
            slice: 18
        }
    };

    const titleLimit =
        titleLimitMap[book.height] || titleLimitMap.medium;

    const title =
        book.title.length > titleLimit.max
            ? book.title.slice(0, titleLimit.slice) + "..."
            : book.title;

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(title, 0, 0);

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return texture;
}

function createBookLabel(book) {
    const texture = createBookTitleTexture(book);

    const labelSizeMap = {
        short: { width: 0.28, height: 0.40 },
        medium: { width: 0.28, height: 0.40 },
        high: { width: 0.28, height: 0.42 }
    };

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const size = labelSizeMap[book.height] || labelSizeMap.medium;

    const geometry = new THREE.PlaneGeometry(
        size.width,
        size.height
    );

    const label = new THREE.Mesh(geometry, material);
    label.userData.type = "book-label";
    label.userData.bookId = book.id;
    label.position.set(0, 0, 0.18);
    label.raycast = () => {};

    return label;
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

    mesh.userData.baseZ = layout.z;
    mesh.userData.targetZ = layout.z;

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

