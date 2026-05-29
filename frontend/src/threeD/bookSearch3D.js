function normalize(value) {
    return String(value || "").toLowerCase().trim();
}

export function initBookSearch({
                                   shelfGroup,
                                   updateBookTargetZ
                               }) {
    const searchInput = document.querySelector(".search-bar__input");
    const statusTags = document.querySelector(".status-tags");
    const statusButtons = document.querySelectorAll(".status-tags__label");

    let activeStatusFilter = null;

    function isSearchActive() {
        const query =
            searchInput?.value?.trim() || "";

        return query.length > 0 ||
            activeStatusFilter !== null;
    }

    function updateShelfActionsState() {
        const shelfView = document.querySelector("#view-shelf");
        if (!shelfView) return;

        shelfView.classList.toggle(
            "is-searching-books",
            isSearchActive()
        );
    }

    function applyBookSearch(query, statusFilter) {
        const searchValue = normalize(query);
        const hasSearch = Boolean(searchValue || statusFilter);

        shelfGroup.traverse((child) => {
            if (child.userData.type !== "book") return;

            const book = child.userData.book;

            const matchesText =
                !searchValue ||
                normalize(book.title).includes(searchValue) ||
                normalize(book.author).includes(searchValue);

            const matchesStatus =
                !statusFilter ||
                normalize(book.status || "Unread") === normalize(statusFilter);

            const isMatch = matchesText && matchesStatus;

            child.userData.isSearchMatch = isMatch && hasSearch;

            updateBookTargetZ(child);

            child.traverse((part) => {
                if (!part.isMesh || part.userData.type === "book-label") return;

                part.material.transparent = hasSearch && !isMatch;
                part.material.opacity = hasSearch && !isMatch ? 0.25 : 1;
            });

            child.traverse((part) => {
                if (part.userData.type === "book-label") {
                    part.visible = isMatch && hasSearch;
                }
            });
        });
    }

    function clearBookSearch() {
        if (searchInput) {
            searchInput.value = "";
        }

        activeStatusFilter = null;

        statusButtons.forEach((button) => {
            button.classList.remove(
                "is-active",
                "status-tags__label--active"
            );

            const icon = button.querySelector(".status-tags__active-icon");
            if (icon) icon.hidden = true;
        });

        if (statusTags) {
            statusTags.hidden = true;
        }

        applyBookSearch("", null);
        updateShelfActionsState();
    }

    if (searchInput) {
        searchInput.value = "";
    }

    if (statusTags) {
        statusTags.hidden = true;
    }

    updateShelfActionsState();

    if (searchInput && statusTags) {
        searchInput.addEventListener("input", () => {
            statusTags.hidden =
                searchInput.value.trim() === "" &&
                !activeStatusFilter;

            applyBookSearch(searchInput.value, activeStatusFilter);
            updateShelfActionsState();
        });

        searchInput.addEventListener("focus", () => {
            statusTags.hidden = false;
        });

        searchInput.addEventListener("blur", () => {
            setTimeout(() => {
                const hasQuery = searchInput.value.trim() !== "";
                const hasStatus = Boolean(activeStatusFilter);

                if (!hasQuery && !hasStatus) {
                    statusTags.hidden = true;
                }
            }, 200);
        });
    }

    statusButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedStatus = button.dataset.status;

            activeStatusFilter =
                activeStatusFilter === selectedStatus
                    ? null
                    : selectedStatus;

            statusButtons.forEach((btn) => {
                const isActive = btn.dataset.status === activeStatusFilter;

                btn.classList.toggle("is-active", isActive);

                const icon = btn.querySelector(".status-tags__active-icon");
                if (icon) icon.hidden = !isActive;
            });

            if (statusTags && searchInput) {
                statusTags.hidden =
                    searchInput.value.trim() === "" &&
                    !activeStatusFilter;

                applyBookSearch(searchInput.value, activeStatusFilter);
                updateShelfActionsState();
            }
        });
    });

    document.addEventListener("click", (event) => {
        const navigationTarget =
            event.target.closest("[data-view], a[href^='#view-']");

        if (!navigationTarget) return;

        const targetView =
            navigationTarget.dataset.view ||
            navigationTarget.getAttribute("href")?.replace("#", "");

        if (targetView !== "view-shelf") {
            clearBookSearch();
        }
    });

    return {
        isSearchActive,
        clearBookSearch,
        applyBookSearch
    };
}