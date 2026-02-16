export function initShelfContextMenu({
                                         onOpen,
                                         onEdit,
                                         onRelocate,
                                         onDelete
                                     }) {

    const menu = document.querySelector(".shelves-context-menu");
    if (!menu) return;
    const submenu = document.querySelector(".context-submenu");


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
        submenu.classList.add("hidden");
    });


    /* ACTIONS */
    menu.addEventListener("click", (e) => {

        const btn = e.target.closest("button");
        if (!btn || !activeShelf) return;

        const action = btn.dataset.action;

        e.stopPropagation();

        if (action === "open") onOpen?.(activeShelf);
        if (action === "edit") onEdit?.(activeShelf);
        if (action === "relocate") {
            onRelocate?.(activeShelf, {
                left: menu.style.left,
                top: menu.style.top
            });
        }
        if (action === "delete") onDelete?.(activeShelf);

        menu.classList.add("hidden");
    });
}
