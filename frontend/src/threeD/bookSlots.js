import { getShelfLayout, isSlotBlocked } from "./shelfLayout.js";

// Брой слотове по подразбиране за един ред
const DEFAULT_SLOTS_PER_ROW = 35;

// Взима броя слотове на ред от layout конфигурацията
function getSlotsPerRow(layout) {
    return layout.slotsPerRow ||
        layout.slotCount ||
        layout.slots?.perRow ||
        DEFAULT_SLOTS_PER_ROW;
}

// Връща всички свободно използваеми слотове за конкретна етажерка
export function getShelfSlots(shelfSize, shelfDesign) {
    const layout = getShelfLayout(shelfSize, shelfDesign);

    const rowCount = layout.baseRows.length;
    const slotsPerRow = getSlotsPerRow(layout);

    const slots = [];

    // Обхожда всички редове и всички позиции на всеки ред
    for (let row = 0; row < rowCount; row++) {
        for (let index = 0; index < slotsPerRow; index++) {

            // Добавя слота само ако не е блокиран от layout-а
            if (!isSlotBlocked(layout, row, index)) {
                slots.push({ row, index });
            }
        }
    }

    return slots;
}

// Намира първия свободен слот за нова книга
export function findFirstFreeBookSlot(books, shelfSize, shelfDesign) {
    const slots = getShelfSlots(shelfSize, shelfDesign);

    return slots.find((slot) => {

        // Свободен е слотът, който не е зает от съществуваща книга
        return !books.some((book) =>
            book.row === slot.row &&
            book.index === slot.index
        );
    });
}

// Изтрива книга и пренарежда останалите книги на същия ред
export function deleteBookAndReflow(books, bookId, shelfSize, shelfDesign) {

    // Намира книгата, която трябва да бъде изтрита
    const deletedBook = books.find((book) => book.id === bookId);
    if (!deletedBook) return books;

    // Взима layout настройките за текущата етажерка
    const layout = getShelfLayout(shelfSize, shelfDesign);

    // Взима всички книги от реда на изтритата книга
    const rowBooks = books.filter((book) => book.row === deletedBook.row);

    // Определя докъде трябва да се проверят слотовете на реда
    const maxBookIndex = Math.max(
        ...rowBooks.map((book) => book.index),
        getSlotsPerRow(layout) - 1
    );

    const rowSlots = [];

    // Събира всички използваеми, неблокирани слотове на същия ред
    for (let index = 0; index <= maxBookIndex; index++) {
        if (!isSlotBlocked(layout, deletedBook.row, index)) {
            rowSlots.push(index);
        }
    }

    // Записва заетите позиции на реда
    const occupiedIndexes = new Set(
        rowBooks.map((book) => book.index)
    );

    // Търси най-близкия свободен слот вляво от изтритата книга
    const leftFree = [...rowSlots]
        .filter((index) =>
            index < deletedBook.index &&
            !occupiedIndexes.has(index)
        )
        .pop();

    // Търси най-близкия свободен слот вдясно от изтритата книга
    const rightFree = rowSlots.find((index) =>
        index > deletedBook.index &&
        !occupiedIndexes.has(index)
    );

    // Премахва изтритата книга от масива
    const updatedBooks = books.filter((book) => book.id !== bookId);

    // Ако има свободен слот вляво,
    // книгите между него и изтритата книга се изместват надясно
    if (leftFree !== undefined) {
        return updatedBooks.map((book) => {
            if (
                book.row === deletedBook.row &&
                book.index > leftFree &&
                book.index < deletedBook.index
            ) {
                return { ...book, index: book.index + 1 };
            }

            return book;
        });
    }

    // Ако няма свободен слот вляво, но има вдясно,
    // книгите между изтритата книга и свободния слот се изместват наляво
    if (rightFree !== undefined) {
        return updatedBooks.map((book) => {
            if (
                book.row === deletedBook.row &&
                book.index > deletedBook.index &&
                book.index < rightFree
            ) {
                return { ...book, index: book.index - 1 };
            }

            return book;
        });
    }

    // Ако няма свободни слотове около изтритата книга,
    // просто връща масива без нея
    return updatedBooks;
}

