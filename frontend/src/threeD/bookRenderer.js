// Book Renderer

// - рендериране на всички книги върху етажерката
// - пропускане на блокирани позиции
// - прилагане на scale според layout-а
// - позициониране на всяка книга

// -------------------------------

import { getShelfLayout, isSlotBlocked } from "./shelfLayout.js";
import { createBookMesh, positionBook } from "./bookMesh.js";

export async function renderBooks(
    books,
    shelfGroup,
    shelfSize,
    shelfDesign
) {
    // Взимаме layout конфигурацията за текущия дизайн и размер
    const layout = getShelfLayout(
        shelfSize,
        shelfDesign
    );

    // Минаваме през всички книги
    for (const book of books) {

        // Ако слотът е блокиран, пропускаме книгата
        if (
            isSlotBlocked(
                layout,
                book.row,
                book.index
            )
        ) {
            continue;
        }

        // Създаваме 3D mesh за книгата
        const mesh = await createBookMesh(book);

        // Прилагаме глобален scale от layout-а, ако има такъв
        if (layout.bookScale) {
            mesh.scale.multiplyScalar(
                layout.bookScale
            );
        }

        // Позиционираме книгата върху конкретния слот
        positionBook(
            mesh,
            book,
            shelfSize,
            shelfDesign
        );

        // Добавяме mesh-а към shelf group-а
        shelfGroup.add(mesh);
    }
}





