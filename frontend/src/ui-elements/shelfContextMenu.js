export function initShelfContextMenu({
                                         onOpen,
                                         onEdit,
                                         onRelocate,
                                         onDelete
                                     }) {

    const menu = document.querySelector(".shelves-context-menu");
    if (!menu) return;

    let activeShelf = null;

    /* RIGHT CLICK */
    document.addEventListener("contextmenu", (e) => {

        const shelf = e.target.closest(".shelf-card");
        if (!shelf) return;

        e.preventDefault();

        activeShelf = shelf;

        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        menu.classList.remove("hidden");
    });

    /* CLICK ANYWHERE CLOSES */
    document.addEventListener("click", () => {
        menu.classList.add("hidden");
    });

    /* ACTIONS */
    menu.addEventListener("click", (e) => {

        const action = e.target.closest("button");
        if (!action || !activeShelf) return;

        const text = action.textContent.trim();

        if (text === "Open") {
            onOpen?.(activeShelf);
        }

        if (text === "Edit") {
            onEdit?.(activeShelf);
        }

        if (text === "Relocate") {
            onRelocate?.(activeShelf);
        }

        if (text === "Delete") {
            onDelete?.(activeShelf);
        }

        menu.classList.add("hidden");
    });
}
