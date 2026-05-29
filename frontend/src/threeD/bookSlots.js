import { getShelfLayout, isSlotBlocked } from "./shelfLayout.js";

const DEFAULT_SLOTS_PER_ROW = 35;

function getSlotsPerRow(layout) {
    return layout.slotsPerRow ||
        layout.slotCount ||
        layout.slots?.perRow ||
        DEFAULT_SLOTS_PER_ROW;
}

export function getShelfSlots(shelfSize, shelfDesign) {
    const layout = getShelfLayout(shelfSize, shelfDesign);

    const rowCount = layout.baseRows.length;
    const slotsPerRow = getSlotsPerRow(layout);

    const slots = [];

    for (let row = 0; row < rowCount; row++) {
        for (let index = 0; index < slotsPerRow; index++) {
            if (!isSlotBlocked(layout, row, index)) {
                slots.push({ row, index });
            }
        }
    }

    return slots;
}

export function findFirstFreeBookSlot(books, shelfSize, shelfDesign) {
    const slots = getShelfSlots(shelfSize, shelfDesign);

    return slots.find((slot) => {
        return !books.some((book) =>
            book.row === slot.row &&
            book.index === slot.index
        );
    });
}


export function deleteBookAndReflow(books, bookId, shelfSize, shelfDesign) {
    const deletedBook = books.find((book) => book.id === bookId);
    if (!deletedBook) return books;

    const layout = getShelfLayout(shelfSize, shelfDesign);

    const rowBooks = books.filter((book) => book.row === deletedBook.row);

    const maxBookIndex = Math.max(
        ...rowBooks.map((book) => book.index),
        getSlotsPerRow(layout) - 1
    );

    const rowSlots = [];

    for (let index = 0; index <= maxBookIndex; index++) {
        if (!isSlotBlocked(layout, deletedBook.row, index)) {
            rowSlots.push(index);
        }
    }

    const occupiedIndexes = new Set(
        rowBooks.map((book) => book.index)
    );

    const leftFree = [...rowSlots]
        .filter((index) =>
            index < deletedBook.index &&
            !occupiedIndexes.has(index)
        )
        .pop();

    const rightFree = rowSlots.find((index) =>
        index > deletedBook.index &&
        !occupiedIndexes.has(index)
    );

    const updatedBooks = books.filter((book) => book.id !== bookId);

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

    return updatedBooks;
}


// export function findRowEdgeFreeSlots(books, row, shelfSize, shelfDesign) {
//     const slots = getShelfSlots(shelfSize, shelfDesign)
//         .filter((slot) => slot.row === row);
//
//     const occupied = new Set(
//         books
//             .filter((book) => book.row === row)
//             .map((book) => book.index)
//     );
//
//     const firstFree = slots.find((slot) => !occupied.has(slot.index));
//     const lastFree = [...slots].reverse().find((slot) => !occupied.has(slot.index));
//
//     return {
//         first: firstFree || null,
//         last: lastFree || null
//     };
// }

