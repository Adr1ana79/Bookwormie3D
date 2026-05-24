import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { getShelfLayout } from "./shelfLayout.js";

export function createBookMesh(book) {
    const heightMap = {
        short: 0.14,
        medium: 0.165,
        high: 0.2
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


    const width = 0.035;
    const depth = 0.07;
    const height = heightMap[book.height] || heightMap.medium;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
        color: colorMap[book.color] || colorMap.yellow
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData.type = "book";
    mesh.userData.bookId = book.id;
    mesh.userData.bookHeight = height;

    return mesh;
}

export function positionBook(mesh, book, shelfSize) {
    const layout = getShelfLayout(shelfSize);

    const baseY =
        layout.startY +
        layout.baseRows[book.row];

    const x = layout.startX + book.index * layout.slotWidth;

    const y =
        baseY +
        (mesh.userData.bookHeight * mesh.scale.y) / 2;

    mesh.position.set(
        x,
        y,
        layout.z
    );
}

export function renderBooks(books, shelfGroup, shelfSize) {
    const layout = getShelfLayout(shelfSize);

    books.forEach(book => {
        const mesh = createBookMesh(book);

        mesh.scale.setScalar(layout.bookScale || 1);

        positionBook(mesh, book, shelfSize);

        shelfGroup.add(mesh);
    });
}