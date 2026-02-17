export function initSearch({ onSearch }) {

    const input = document.querySelector(".search-bar__input");
    const searchBar = document.querySelector(".search-bar");

    const dropdown = document.createElement("div");
    dropdown.className = "search-suggestions hidden";

    let activeIndex = -1;
    let currentResults = [];

    searchBar.appendChild(dropdown);

    input.addEventListener("input", async () => {

        const query = input.value.trim();

        if (!query) {
            dropdown.classList.add("hidden");
            return;
        }

        const results = await fetchSuggestions(query);

        renderSuggestions(results);
    });

    input.addEventListener("keydown", (e) => {

        const buttons = dropdown.querySelectorAll("button");

        if (e.key === "ArrowDown") {
            e.preventDefault();

            activeIndex = (activeIndex + 1) % buttons.length;
            updateActive(buttons);
        }

        else if (e.key === "ArrowUp") {
            e.preventDefault();

            activeIndex =
                (activeIndex - 1 + buttons.length) % buttons.length;
            updateActive(buttons);
        }

        else if (e.key === "Enter") {
            e.preventDefault();

            if (activeIndex >= 0) {
                selectSuggestion(activeIndex);
            } else {
                const query = input.value.trim();
                if (!query) return;

                dropdown.classList.add("hidden");
                input.blur();
                onSearch(query);
            }
        }

        else if (e.key === "Escape") {
            dropdown.classList.add("hidden");
            activeIndex = -1;
        }
    });


    function renderSuggestions(results) {

        dropdown.innerHTML = "";
        activeIndex = -1;
        currentResults = results;

        if (!results.length) {
            dropdown.classList.add("hidden");
            return;
        }

        results.forEach((item, index) => {

            const btn = document.createElement("button");
            btn.textContent = item.title;

            btn.addEventListener("click", () => {
                selectSuggestion(index);
            });

            dropdown.appendChild(btn);
        });

        dropdown.classList.remove("hidden");
    }

    function selectSuggestion(index) {

        const selected = currentResults[index];
        if (!selected) return;

        input.value = selected.title;

        dropdown.classList.add("hidden");

        input.blur();

        onSearch(selected.title);
    }

    function updateActive(buttons) {

        buttons.forEach(btn =>
            btn.classList.remove("active")
        );

        if (buttons[activeIndex]) {
            buttons[activeIndex].classList.add("active");
        }
    }

    async function fetchSuggestions(query) {
        // TODO: replace with real DB call
        const allShelves = document.querySelectorAll(".shelf-card p");

        return Array.from(allShelves)
            .map(p => ({ title: p.textContent }))
            .filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
    }
}
