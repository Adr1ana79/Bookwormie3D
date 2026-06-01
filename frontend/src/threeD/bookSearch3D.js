// Нормализира стойностите за търсене и сравнение
function normalize(value) {
    return String(value || "").toLowerCase().trim();
}

// Инициализира 3D търсенето на книги върху етажерката
export function initBookSearch({
                                   shelfGroup,
                                   updateBookTargetZ
                               }) {

    // Основното поле за търсене
    const searchInput = document.querySelector(".search-bar__input");

    // Контейнерът с филтрите по статус
    const statusTags = document.querySelector(".status-tags");

    // Бутоните за отделните статуси
    const statusButtons = document.querySelectorAll(".status-tags__label");

    // Текущо активният status филтър
    let activeStatusFilter = null;


    // Проверява дали има активно търсене или филтър
    function isSearchActive() {
        const query =
            searchInput?.value?.trim() || "";

        return query.length > 0 ||
            activeStatusFilter !== null;
    }

    // Обновява състоянието на shelf view-то при активно търсене
    function updateShelfActionsState() {
        const shelfView = document.querySelector("#view-shelf");
        if (!shelfView) return;

        // Добавя CSS клас, чрез който могат да се скрият/променят actions
        shelfView.classList.toggle(
            "is-searching-books",
            isSearchActive()
        );
    }

    // Прилага търсене по текст и/или status филтър върху 3D книгите
    function applyBookSearch(query, statusFilter) {
        const searchValue = normalize(query);
        const hasSearch = Boolean(searchValue || statusFilter);

        shelfGroup.traverse((child) => {
            // Работи само върху book обектите
            if (child.userData.type !== "book") return;

            const book = child.userData.book;

            // Проверява дали заглавието или авторът съвпадат с търсенето
            const matchesText =
                !searchValue ||
                normalize(book.title).includes(searchValue) ||
                normalize(book.author).includes(searchValue);

            // Проверява дали статусът съвпада с избрания филтър
            const matchesStatus =
                !statusFilter ||
                normalize(book.status || "Unread") === normalize(statusFilter);

            const isMatch = matchesText && matchesStatus;

            // Маркира книгата като резултат от търсенето
            child.userData.isSearchMatch = isMatch && hasSearch;

            // Обновява targetZ, за да се изтеглят намерените книги напред
            updateBookTargetZ(child);

            // При активно търсене избледнява книгите,
            // които не отговарят на критериите
            child.traverse((part) => {
                if (!part.isMesh || part.userData.type === "book-label") return;

                part.material.transparent = hasSearch && !isMatch;
                part.material.opacity = hasSearch && !isMatch ? 0.25 : 1;
            });

            // Показва label само на намерените книги
            child.traverse((part) => {
                if (part.userData.type === "book-label") {
                    part.visible = isMatch && hasSearch;
                }
            });
        });
    }

    // Изчиства активното търсене и всички status филтри
    function clearBookSearch() {
        if (searchInput) {
            searchInput.value = "";
        }

        activeStatusFilter = null;

        // Премахва активното състояние от всички status бутони
        statusButtons.forEach((button) => {
            button.classList.remove(
                "is-active",
                "status-tags__label--active"
            );

            const icon = button.querySelector(".status-tags__active-icon");
            if (icon) icon.hidden = true;
        });

        // Скрива status tags контейнера
        if (statusTags) {
            statusTags.hidden = true;
        }

        // Връща всички книги към нормален изглед
        applyBookSearch("", null);

        updateShelfActionsState();
    }

    // Нулира input-а при първоначална инициализация
    if (searchInput) {
        searchInput.value = "";
    }

    // Скрива status филтрите по подразбиране
    if (statusTags) {
        statusTags.hidden = true;
    }

    // Обновява началното състояние на shelf actions
    updateShelfActionsState();

    if (searchInput && statusTags) {

        /* SEARCH INPUT */

        searchInput.addEventListener("input", () => {

            // Скрива status tags само ако няма нито текст,
            // нито активен status филтър
            statusTags.hidden =
                searchInput.value.trim() === "" &&
                !activeStatusFilter;

            // Прилага търсенето при всяка промяна в input-а
            applyBookSearch(searchInput.value, activeStatusFilter);

            updateShelfActionsState();
        });

        /* FOCUS */

        searchInput.addEventListener("focus", () => {
            // При фокус показва status филтрите
            statusTags.hidden = false;
        });


        /* BLUR */

        searchInput.addEventListener("blur", () => {

            // Малко забавяне, за да може клик върху status бутон
            // да се отчете преди tags контейнерът да се скрие
            setTimeout(() => {
                const hasQuery = searchInput.value.trim() !== "";
                const hasStatus = Boolean(activeStatusFilter);

                if (!hasQuery && !hasStatus) {
                    statusTags.hidden = true;
                }
            }, 200);
        });
    }

    /* STATUS FILTERS */

    statusButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedStatus = button.dataset.status;

            // Ако натиснем вече активния статус,
            // филтърът се изключва
            activeStatusFilter =
                activeStatusFilter === selectedStatus
                    ? null
                    : selectedStatus;

            // Обновява визуалното активно състояние на всички status бутони
            statusButtons.forEach((btn) => {
                const isActive = btn.dataset.status === activeStatusFilter;

                btn.classList.toggle("is-active", isActive);

                const icon = btn.querySelector(".status-tags__active-icon");
                if (icon) icon.hidden = !isActive;
            });

            if (statusTags && searchInput) {

                // Скрива tags контейнера само ако няма активно търсене
                statusTags.hidden =
                    searchInput.value.trim() === "" &&
                    !activeStatusFilter;

                // Прилага търсене с текущия текст и избрания статус
                applyBookSearch(searchInput.value, activeStatusFilter);

                updateShelfActionsState();
            }
        });
    });

    /* CLEAR SEARCH ON NAVIGATION */

    document.addEventListener("click", (event) => {

        // Засича навигационни елементи към други view-та
        const navigationTarget =
            event.target.closest("[data-view], a[href^='#view-']");

        if (!navigationTarget) return;

        const targetView =
            navigationTarget.dataset.view ||
            navigationTarget.getAttribute("href")?.replace("#", "");

        // Ако потребителят излиза от shelf view,
        // изчиства book search състоянието
        if (targetView !== "view-shelf") {
            clearBookSearch();
        }
    });

    // Връща функции за управление на търсенето отвън
    return {
        isSearchActive,
        clearBookSearch,
        applyBookSearch
    };
}