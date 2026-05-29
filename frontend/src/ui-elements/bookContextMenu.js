import { openConfirmModal } from "./confirmModal.js";

export function openBookContextMenu(book, x, y, {
    onDelete,
    onOpen,
    onEdit,
    onMenuOpen
}) {
    const menu = document.querySelector(".book-context-menu");

    if (!menu) return;

    onMenuOpen?.();

    menu.onclick = (event) => {
        event.stopPropagation();
    };

    menu.oncontextmenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.classList.remove("hidden");

    menu.querySelector('[data-action="open"]').onclick = () => {
        menu.classList.add("hidden");
        onOpen?.(book);
    };

    menu.querySelector('[data-action="edit"]').onclick = () => {
        menu.classList.add("hidden");
        onEdit?.(book);
    };

    menu.querySelector('[data-action="delete"]').onclick = () => {
        menu.classList.add("hidden");

        openConfirmModal({
            title: "Delete book?",
            description: "This book will be permanently deleted.",
            confirmText: "Delete",
            onConfirm: async () => {
                await onDelete?.(book);
            }
        });
    };
}

