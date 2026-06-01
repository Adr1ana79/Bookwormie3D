import { openBookContentModal } from "../pages/app/book.js";
import { showBookTooltip, hideBookTooltip } from "../ui-elements/bookTooltip.js";
import { openBookContextMenu, closeBookContextMenu } from "../ui-elements/bookContextMenu.js";

// Инициализира всички интеракции с книгите в 3D сцената
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
    // Текущата книга, върху която е мишката
    let hoveredBook = null;

    // Timeout за забавяне при показване на tooltip
    let hoverTimeout = null;

    // Следи дали контекстното меню е отворено
    let isContextMenuOpen = false;


    // Намира 3D книгата, върху която е кликнато или посочено с мишката
    function getIntersectedBook(event) {
        const rect =
            renderer.domElement.getBoundingClientRect();

        // Преобразува позицията на мишката към координати,
        // подходящи за Three.js raycasting
        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Изпраща ray от камерата към позицията на мишката
        raycaster.setFromCamera(mouse, camera);

        // Проверява кои обекти от shelfGroup са пресечени
        const intersects =
            raycaster.intersectObjects(
                shelfGroup.children,
                true
            );

        for (const intersect of intersects) {
            let object = intersect.object;

            // Върви нагоре по parent йерархията,
            // защото книгата може да е група с няколко mesh-а
            while (object) {
                if (object.userData.type === "book") {
                    return object;
                }

                object = object.parent;
            }
        }

        return null;
    }

    // Изчислява крайната Z позиция на книга според нейното състояние
    function getBookTargetZ(bookMesh) {
        const baseZ = bookMesh.userData.baseZ || 0;

        // Ако книгата е резултат от търсене,
        // леко се изтегля напред
        const searchOffset = bookMesh.userData.isSearchMatch
            ? 0.03
            : 0;

        // Ако книгата е hover-ната се изтегля напред
        const hoverOffset = bookMesh.userData.isHovered
            ? bookMesh.userData.isSearchMatch
                ? 0.01
                : 0.03
            : 0;

        return baseZ + searchOffset + hoverOffset;
    }

    // Обновява targetZ стойността, към която книгата плавно ще се анимира
    function updateBookTargetZ(bookMesh) {
        bookMesh.userData.targetZ = getBookTargetZ(bookMesh);
    }

    // Маркира книга като hover-ната и я издърпва напред
    function pullBookForward(bookMesh) {
        bookMesh.userData.isHovered = true;
        updateBookTargetZ(bookMesh);
    }

    // Връща hover-натата книга към нормалната й позиция
    function resetPulledBook() {
        if (!hoveredBook) return;

        hoveredBook.userData.isHovered = false;
        updateBookTargetZ(hoveredBook);

        hoveredBook = null;
    }

    // Нулира всички активни interaction състояния
    function resetInteractionState() {
        clearTimeout(hoverTimeout);

        if (hoveredBook) {
            hoveredBook.userData.isHovered = false;
            updateBookTargetZ(hoveredBook);
            hoveredBook = null;
        }

        isContextMenuOpen = false;

        // Скрива tooltip-а
        hideBookTooltip();

        // Затваря context menu-то, ако такава функция е налична
        if (typeof closeBookContextMenu === "function") {
            closeBookContextMenu();
        }
    }



    container.addEventListener("mousemove", (event) => {
        // Проверява дали мишката е върху 3D книга
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) {
            // Ако няма книга под мишката,
            // връща предишната hover-ната книга назад
            resetPulledBook();

            clearTimeout(hoverTimeout);
            hideBookTooltip();
            return;
        }

        // Докато context menu-то е отворено,
        // tooltip-ът не трябва да се показва
        if (isContextMenuOpen) {
            hideBookTooltip();
            return;
        }

        // Ако мишката е все още върху същата книга,
        // не рестартира hover логиката
        if (hoveredBook === bookMesh) {
            return;
        }

        // Нулира предишната hover-ната книга
        resetPulledBook();

        // Запазва новата hover-ната книга
        hoveredBook = bookMesh;
        pullBookForward(bookMesh);

        clearTimeout(hoverTimeout);

        // Показва tooltip след кратко задържане върху книгата
        hoverTimeout = setTimeout(() => {
            showBookTooltip(
                bookMesh.userData.book,
                event.clientX,
                event.clientY
            );
        }, 700);
    });


    container.addEventListener("contextmenu", (event) => {
        // Проверява дали десният клик е върху книга
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) return;

        // Спира стандартното browser context menu
        event.preventDefault();
        event.stopPropagation();

        clearTimeout(hoverTimeout);
        hideBookTooltip();

        // Отваря custom context menu за книгата
        openBookContextMenu(
            bookMesh.userData.book,
            event.clientX,
            event.clientY,
            {
                onDelete: deleteBook,
                onOpen: openBook,
                onEdit: editBook,

                // Маркира context menu-то като отворено,
                // за да не се показва tooltip едновременно с него
                onMenuOpen: () => {
                    isContextMenuOpen = true;
                }
            }
        );
    });


    container.addEventListener("click", (event) => {
        // Проверява дали кликът е върху книга
        const bookMesh = getIntersectedBook(event);

        if (!bookMesh) return;

        clearTimeout(hoverTimeout);
        hideBookTooltip();

        // Отваря modal-а с информация за книгата
        openBookContentModal(bookMesh.userData.book);
    });

    /* Global context menu close */
    setTimeout(() => {
        document.addEventListener("click", (event) => {
            const menu = document.querySelector(".book-context-menu");

            // Ако кликът е вътре в context menu-то,
            // менюто остава отворено
            if (menu && menu.contains(event.target)) {
                return;
            }

            // При клик извън менюто го затваря
            closeBookContextMenu();

            isContextMenuOpen = false;
        });
    }, 0);


    /* SAFETY RESET */

    // Нулира interaction state-а при загуба на фокус от прозореца
    window.addEventListener("blur", resetInteractionState);

    // Нулира interaction state-а, когато табът стане неактивен
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            resetInteractionState();
        }
    });

    // Връща функции, които други модули използват
    return {
        updateBookTargetZ,
        resetInteractionState
    };}