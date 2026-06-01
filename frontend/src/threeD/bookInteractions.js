import { openBookContentModal } from "../pages/app/book.js";
import { showBookTooltip, hideBookTooltip } from "../ui-elements/bookTooltip.js";
import { openBookContextMenu, closeBookContextMenu } from "../ui-elements/bookContextMenu.js";


export function initBookInteractions({
                                         container,
                                         renderer,
                                         camera,
                                         raycaster,
                                         mouse,
                                         shelfGroup,
                                         openBook,
                                         editBook,
                                         deleteBook
                                     }) {
    let hoveredBook = null;
    let hoverTimeout = null;
    let isContextMenuOpen = false;

    function getIntersectedBook(event) {
        const rect =
            renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects =
            raycaster.intersectObjects(
                shelfGroup.children,
                true
            );

        for (const intersect of intersects) {
            let object = intersect.object;

            while (object) {
                if (object.userData.type === "book") {
                    return object;
                }

                object = object.parent;
            }
        }

        return null;
    }

    function getBookTargetZ(bookMesh) {
        const baseZ = bookMesh.userData.baseZ || 0;

        const searchOffset = bookMesh.userData.isSearchMatch
            ? 0.08
            : 0;

        const hoverOffset = bookMesh.userData.isHovered
            ? 0.05
            : 0;

        return baseZ + searchOffset + hoverOffset;
    }

    function updateBookTargetZ(bookMesh) {
        bookMesh.userData.targetZ = getBookTargetZ(bookMesh);
    }

    function pullBookForward(bookMesh) {
        bookMesh.userData.isHovered = true;
        updateBookTargetZ(bookMesh);
    }

    function resetPulledBook() {
        if (!hoveredBook) return;

        hoveredBook.userData.isHovered = false;
        updateBookTargetZ(hoveredBook);

        hoveredBook = null;
    }

    function resetInteractionState() {
        clearTimeout(hoverTimeout);

        if (hoveredBook) {
            hoveredBook.userData.isHovered = false;
            updateBookTargetZ(hoveredBook);
            hoveredBook = null;
        }

        isContextMenuOpen = false;

        hideBookTooltip();

        if (typeof closeBookContextMenu === "function") {
            closeBookContextMenu();
        }
    }


    container.addEventListener("mousemove", (event) => {
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) {
            resetPulledBook();
            clearTimeout(hoverTimeout);
            hideBookTooltip();
            return;
        }

        if (isContextMenuOpen) {
            hideBookTooltip();
            return;
        }

        if (hoveredBook === bookMesh) {
            return;
        }

        resetPulledBook();

        hoveredBook = bookMesh;
        pullBookForward(bookMesh);

        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
            showBookTooltip(
                bookMesh.userData.book,
                event.clientX,
                event.clientY
            );
        }, 700);
    });

    container.addEventListener("contextmenu", (event) => {
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) return;

        event.preventDefault();
        event.stopPropagation();

        clearTimeout(hoverTimeout);
        hideBookTooltip();

        openBookContextMenu(
            bookMesh.userData.book,
            event.clientX,
            event.clientY,
            {
                onDelete: deleteBook,
                onOpen: openBook,
                onEdit: editBook,
                onMenuOpen: () => {
                    isContextMenuOpen = true;
                }
            }
        );
    });

    container.addEventListener("click", (event) => {
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) return;

        clearTimeout(hoverTimeout);
        hideBookTooltip();

        openBookContentModal(bookMesh.userData.book);
    });

    setTimeout(() => {
        document.addEventListener("click", (event) => {
            const menu = document.querySelector(".book-context-menu");

            if (menu && menu.contains(event.target)) {
                return;
            }

            closeBookContextMenu();
            isContextMenuOpen = false;
        });
    }, 0);

    window.addEventListener("blur", resetInteractionState);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            resetInteractionState();
        }
    });

    return {
        updateBookTargetZ,
        resetInteractionState
    };}