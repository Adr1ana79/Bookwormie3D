import { openConfirmModal } from "../../ui-elements/confirmModal.js";
import { initShelfForm } from "../../ui-elements/shelfForm.js";
import { initShelfContextMenu } from "../../ui-elements/shelfContextMenu.js";
import { initSearch } from "../../ui-elements/search.js";

export function initShelves() {

    const shelvesView = document.getElementById("view-shelves");
    if (!shelvesView) return;

    const container = shelvesView.querySelector(".shelves-page-content");

    const editBtn = shelvesView.querySelector(".icon-edit.large-icon-button");
    const addBtn = shelvesView.querySelector(".icon-add.large-icon-button");
    const submenu = shelvesView.querySelector(".icon-button-group--submenu-button");

    let isDirty = false;

    let originalState =  container.innerHTML;

    let activeSection = null;

    const shelfForm = initShelfForm({
        onCreate: (shelfData) => {
            if (!activeSection) return;
            createShelfCard(activeSection, shelfData);
        },
        onUpdate: updateShelfCard
    });

    const searchBar = document.querySelector(".search-bar");
    const searchInput = document.querySelector(".search-bar__input");

    function setMode(mode) {
        shelvesView.dataset.mode = mode;

        const isView = mode === "view";
        const isEdit = mode === "edit";
        const isAdd = mode === "add";
        const isSearch = mode === "search";

        // SEARCH BAR disable logic (само за edit/add)
        if (searchBar && searchInput) {
            if (isEdit || isAdd) {
                searchBar.classList.add("is-disabled");
                searchInput.disabled = true;
            } else {
                searchBar.classList.remove("is-disabled");
                searchInput.disabled = false;
            }
        }

        // EDIT / ADD buttons
        editBtn.disabled = isAdd || isSearch;
        addBtn.disabled = !isView;

        // NAVIGATION disable при search
        document.body.classList.toggle("search-active", isSearch);
    }


    function clearRenaming() {
        container.querySelectorAll(".is-renaming")
            .forEach(section => section.classList.remove("is-renaming"));
    }

    /* ------------------------------------
       CLICK DELEGATION
    ------------------------------------ */

    shelvesView.addEventListener("click", (e) => {

        /* OPEN SHELF (само във view mode) */
        const card = e.target.closest(".shelf-card");

        if (card && !card.classList.contains("add-shelf-placeholder")) {

            const img = card.querySelector("img");
            if (!img) return;

            const fileName = img.src.split("/").pop().replace(".png", "");
            const [design, size] = fileName.split("-");


            if (!design || !size) {
                console.warn("Missing design or size:", card);
                return;
            }

            document.dispatchEvent(
                new CustomEvent("app:open-shelf", {
                    detail: { design, size }
                })
            );

            return;
        }



        /* -----------------------------
           START RENAME
        ----------------------------- */
        if (e.target.closest(".section-edit-controls.edit-only .icon-edit")) {

            const section = e.target.closest(".shelves-section");
            if (!section || section.classList.contains("shelves-section--default")) return;

            clearRenaming();
            section.classList.add("is-renaming");

            const input = section.querySelector(".rename-only input");

            input.focus();
            input.select();

            return;
        }

        /* SAVE RENAME */
        if (e.target.closest(".rename-only.section-edit-controls .icon-save")) {

            const section = e.target.closest(".shelves-section");
            const input = section.querySelector(".rename-only input");
            const titleEl = section.querySelector(".section-header--title");

            const value = input.value.trim() || "New Section";

            titleEl.textContent = value;
            input.value = value;

            section.classList.remove("is-renaming");
            isDirty = true;

            return;
        }

        /* CANCEL RENAME */
        if (e.target.closest(".rename-only.section-edit-controls .icon-cancel")) {

            const section = e.target.closest(".shelves-section");
            const input = section.querySelector(".rename-only input");
            const titleEl = section.querySelector(".section-header--title");

            input.value = titleEl.textContent;

            section.classList.remove("is-renaming");

            return;
        }


        /* -----------------------------
           DELETE SECTION
        ----------------------------- */
        if (e.target.closest(".section-edit-controls .icon-delete")) {

            const section = e.target.closest(".shelves-section");
            if (!section || section.classList.contains("shelves-section--default")) return;

            openConfirmModal({
                title: "Delete section?",
                description: "This section and all shelves inside it will be permanently deleted.",
                confirmText: "Delete",
                onConfirm: () => {
                    section.remove();
                    isDirty = true;
                }
            });

            return;
        }

        /* GLOBAL SAVE */
        if (e.target.closest(".icon-button-group--submenu-button .icon-save")) {

            clearRenaming();

            setMode("view");
            isDirty = false;

            return;
        }

        /* GLOBAL CANCEL */
        if (e.target.closest(".icon-button-group--submenu-button .icon-cancel")) {

            container.innerHTML = originalState;

            setMode("view");
            isDirty = false;

            return;
        }

        /* -----------------------------
           ADD SHELF
         ----------------------------- */

        if (e.target.closest(".add-shelf-button")) {
            activeSection = e.target.closest(".shelves-section");
            shelfForm.openCreate();
            return;
        }

        /* -----------------------------
           SAVE NEW SECTION (ADD MODE)
        ----------------------------- */
        if (e.target.closest(".shelves-section.add-only .icon-save")) {

            const addSection = shelvesView.querySelector(".shelves-section.add-only");
            const input = addSection.querySelector("input");

            const title = input.value.trim() || "New Section";

            createNewSection(title);

            input.value = "";
            setMode("view");
            return;
        }

        /* CANCEL ADD */
        if (e.target.closest(".shelves-section.add-only .icon-cancel")) {

            const addSection = shelvesView.querySelector(".shelves-section.add-only");
            const input = addSection.querySelector("input");

            input.value = "";
            setMode("view");
        }
    });

    initShelfContextMenu({
        onOpen: (element) => {

            const card = element.closest(".shelf-card");
            if (!card) return;

            const img = card.querySelector("img");
            if (!img) return;

            const fileName = img.src.split("/").pop().replace(".png", "");
            const [design, size] = fileName.split("-");

            if (!design || !size) {
                console.warn("Could not extract design/size from image:", img.src);
                return;
            }

            document.dispatchEvent(
                new CustomEvent("app:open-shelf", {
                    detail: { design, size }
                })
            );
        },


        onEdit: (shelf) => {
            shelfForm.openEdit(shelf);
        },

            onRelocate: (shelf, position) => {
                openRelocateMenu(shelf, position);
        },

        onDelete: (shelf) => {

            openConfirmModal({
                title: "Delete shelf?",
                description: "This shelf will be permanently deleted.",
                confirmText: "Delete",
                onConfirm: () => {
                    shelf.remove();
                }
            });
        }
    });

    initSearch({
        onSearch: (query) => {
            performSearch(query);
        }
    });

    searchInput.addEventListener("input", () => {

        if (!searchInput.value.trim() &&
            shelvesView.dataset.mode === "search") {

            container.innerHTML = originalState;
            setMode("view");
        }
    });


    shelvesView.addEventListener("keydown", (e) => {

        if (e.target.closest(".shelves-section.add-only input")) {

            if (e.key === "Enter") {
                shelvesView.querySelector(".shelves-section.add-only .icon-save").click();
            }

            if (e.key === "Escape") {
                shelvesView.querySelector(".shelves-section.add-only .icon-cancel").click();
            }
        }
    });


    /* ------------------------------------
       KEYBOARD (RENAME)
    ------------------------------------ */

    shelvesView.addEventListener("keydown", (e) => {

        if (!e.target.matches(".rename-only input")) return;

        const section = e.target.closest(".shelves-section");

        if (e.key === "Enter") {
            section.querySelector(".rename-only .icon-save").click();
        }

        if (e.key === "Escape") {
            section.querySelector(".rename-only .icon-cancel").click();
        }
    });

    /* ------------------------------------
       GLOBAL EDIT BUTTON
    ------------------------------------ */

    editBtn.addEventListener("click", () => {
        if (shelvesView.dataset.mode !== "view") return;

        originalState = container.innerHTML;

        setMode("edit");
        submenu.classList.remove("hidden");
    });

    /* ------------------------------------
       ADD MODE
    ------------------------------------ */

    addBtn.addEventListener("click", () => {

        if (isDirty) return;

        setMode("add");

        const defaultSection = container.querySelector(".shelves-section--default");
        const addSection = container.querySelector(".shelves-section.add-only");

        container.insertBefore(addSection, defaultSection.nextElementSibling);

        const input = addSection.querySelector("input");

        input.value = "New Section";
        input.focus();
        input.select();
    });

    /* ------------------------------------
       CREATE NEW SECTION
    ------------------------------------ */

    function createNewSection(title) {

        const defaultSection = container.querySelector(".shelves-section--default");

        const section = document.createElement("section");
        section.className = "shelves-section shelves-section--editable";

        section.innerHTML = `
            <div class="section-header__edit">

                <div class="section-header">
                    <img class="section-header--ribbon"
                         src="assets/images/design-elements/section-label-secondary.svg"
                         alt="">

                    <span class="section-header--title">${title}</span>

                    <div class="section__title-input rename-only">
                        <input type="text"
                               class="section__title-placeholder"
                               value="${title}">
                    </div>
                </div>

                <div class="icon-button-group edit-only section-edit-controls">
                    <button type="button"
                            class="icon-button icon-edit green-icon-button small-icon-button"></button>

                    <button type="button"
                            class="icon-button icon-delete red-icon-button small-icon-button"></button>
                </div>

                <div class="icon-button-group rename-only section-edit-controls">
                    <button type="button"
                            class="icon-button icon-save green-icon-button small-icon-button"></button>

                    <button type="button"
                            class="icon-button icon-cancel red-icon-button small-icon-button"></button>
                </div>
            </div>

            <ul class="shelves-grid">
                <li class="shelf-card edit-only add-shelf-placeholder">
                    <button type="button"
                            class="add-shelf-button"
                            aria-label="Add shelf">
                        <img src="assets/images/design-elements/add-shelf.svg" alt="">
                    </button>
                </li>
            </ul>
        `;

        container.insertBefore(section, defaultSection.nextElementSibling);

        return section;
    }


    function createShelfCard(section, shelf) {

        const grid = section.querySelector(".shelves-grid");

        const li = document.createElement("li");
        li.className = "shelf-card";

        li.dataset.design = shelf.design || "basic";
        li.dataset.size = shelf.size || "standard";

        const imagePath = `assets/images/shelf-thumbnails/${shelf.design}-${shelf.size}.png`;
        const uniqueTitle = generateUniqueShelfName(section, shelf.title);

        li.innerHTML = `
        <img src="${imagePath}" alt="">
        <p>${uniqueTitle}</p>
        `;

        // добавяме преди placeholder-а
        const placeholder = grid.querySelector(".add-shelf-placeholder");

        grid.insertBefore(li, placeholder);

        isDirty = true;
    }

    function generateUniqueShelfName(section, baseName) {

        const existingTitles = Array.from(
            section.querySelectorAll(".shelf-card p")
        ).map(p => p.textContent.trim());

        if (!existingTitles.includes(baseName)) {
            return baseName;
        }

        let counter = 2;
        let newName = `${baseName} ${counter}`;

        while (existingTitles.includes(newName)) {
            counter++;
            newName = `${baseName} ${counter}`;
        }

        return newName;
    }


    function openRelocateMenu(shelf, position) {

        const submenu = document.querySelector(".context-submenu");
        if (!submenu) return;

        submenu.style.left = position.left;
        submenu.style.top = position.top;

        submenu.classList.remove("hidden");

        const sections = Array.from(
            container.querySelectorAll(".shelves-section")
        ).filter(sec => !sec.classList.contains("add-only"));

        const currentSection = shelf.closest(".shelves-section");

        submenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // изчистваме старите dynamic бутони
        submenu.innerHTML = "";

        sections.forEach(section => {

            const title =
                section.querySelector(".section-header--title")?.textContent || "Section";

            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("role", "menuitem");
            btn.textContent = title;

            if (section === currentSection) {
                btn.classList.add("active-option");
            }

            btn.addEventListener("click", () => {

                if (section === currentSection) return;

                const targetGrid = section.querySelector(".shelves-grid");
                const placeholder = targetGrid.querySelector(".add-shelf-placeholder");

                targetGrid.insertBefore(shelf, placeholder);

                closeContextMenus();
            });

            submenu.appendChild(btn);
        });

        // separator
        const hr = document.createElement("hr");
        hr.className = "shelf-context-menu__separator";
        submenu.appendChild(hr);

        // new section option
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "add-option";
        addBtn.textContent = "New section";

        addBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            const wrapper = document.createElement("div");
            wrapper.className = "relocate-input-wrapper";

            const input = document.createElement("input");
            input.type = "text";
            input.className = "relocate-input";
            input.placeholder = "New section name";

            const submitBtn = document.createElement("button");
            submitBtn.className = "relocate-submit";
            submitBtn.innerHTML = "→";

            wrapper.appendChild(input);
            wrapper.appendChild(submitBtn);

            addBtn.replaceWith(wrapper);

            input.focus();

            function createSection() {

                const name = input.value.trim();
                if (!name) return;

                const newSection = createNewSection(name);

                const targetGrid = newSection.querySelector(".shelves-grid");
                const placeholder = targetGrid.querySelector(".add-shelf-placeholder");

                targetGrid.insertBefore(shelf, placeholder);

                newSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                submenu.classList.add("hidden");
                closeContextMenus();
            }

            submitBtn.addEventListener("click", createSection);

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") createSection();
                if (e.key === "Escape") submenu.classList.add("hidden");
            });
        });


        submenu.appendChild(addBtn);

        // позициониране
        submenu.style.left = menu.style.left;
        submenu.style.top = menu.style.top;

        submenu.classList.remove("hidden");
    }


    function closeContextMenus() {
        const menu = document.querySelector(".shelves-context-menu");
        const submenu = document.querySelector(".context-submenu");

        menu?.classList.add("hidden");
        submenu?.classList.add("hidden");
    }


    function performSearch(query) {

        // създаваме временен DOM от оригиналното shelves
        const temp = document.createElement("div");
        temp.innerHTML = originalState;

        const allShelves = Array.from(
            temp.querySelectorAll(".shelf-card")
        );

        const matches = allShelves.filter(card => {

            // игнорираме placeholder-а
            if (card.classList.contains("add-shelf-placeholder")) {
                return false;
            }

            const titleEl = card.querySelector("p");
            if (!titleEl) return false;

            return titleEl.textContent
                .toLowerCase()
                .includes(query.toLowerCase());
        });


        if (matches.length === 0) {
            container.innerHTML = `
        <section class="search-results empty">
            <h2>No results found</h2>
            <p>Try a different title or author.</p>
        </section>
    `;
        } else {
            container.innerHTML = `
        <section class="search-results">
            <h2>Results (${matches.length})</h2>
            <ul class="shelves-grid"></ul>
        </section>
    `;
        }


        const grid = container.querySelector(".shelves-grid");

        matches.forEach(card => {
            grid.appendChild(card.cloneNode(true));
        });

        setMode("search");
    }


    function updateShelfCard(shelfElement, data) {

        const section = shelfElement.closest(".shelves-section");

        const uniqueTitle = generateUniqueShelfName(section, data.title);

        shelfElement.querySelector("p").textContent = uniqueTitle;

        isDirty = true;
    }

}
