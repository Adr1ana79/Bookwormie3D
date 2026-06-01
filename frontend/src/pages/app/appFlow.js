import { initSidebarNav, setActiveNav } from '../../ui-elements/navbar.js';

// Пази текущо активния екран в app layout-а
let currentView = null;

// Контейнерът, в който се поставя активният app view
let appMain = null;

// Обект с основните app екрани
let views = null;

export function initAppFlow() {
    initSidebarNav();

    const authWrapper = document.getElementById('auth-wrapper');
    const appLayout = document.querySelector('.app-layout');
    appMain = document.getElementById('app-main');

    // Запазваме референции към основните app view-та
    views = {
        shelves: document.getElementById('view-shelves'),
        shelf: document.getElementById('view-shelf'),
        profile: document.getElementById('view-profile'),
        settings: document.getElementById('view-settings'),
    };

    // При успешно влизане скриваме auth частта и показваме приложението
    document.addEventListener('auth:login-success', () => {
        authWrapper.classList.add('hidden');
        appLayout.classList.remove('hidden');

        showView('shelves');
        setActiveNav('shelves');
    });

    // При logout връщаме потребителя към auth частта
    document.addEventListener('auth:logout', () => {
        appLayout.classList.add('hidden');
        authWrapper.classList.remove('hidden');

        currentView = null;
    });

    // Слуша за навигация между основните app екрани
    document.addEventListener('app:navigate', (e) => {
        const viewKey = e.detail;
        showView(viewKey);
        setActiveNav(viewKey);
    });

    // При избор на конкретна етажерка се отваря shelf view
    document.addEventListener('app:open-shelf', () => {
        showView('shelf');
    });

    // Обработва клик върху линкове към секции в settings страницата
    document.addEventListener("click", (e) => {

        const link =
            e.target.closest(".terms-title");

        if (!link) return;

        e.preventDefault();


        // Предотвратява автоматичното връщане най-горе при смяна на view
        sessionStorage.setItem(
            "skipScrollReset",
            "true"
        );

        const targetId =
            link.dataset.target;

        // Навигира към settings view
        document.dispatchEvent(
            new CustomEvent("app:navigate", {
                detail: "settings"
            })
        );

        // Изчаква view-то да бъде добавено в DOM, преди да скролира към секцията
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                const target =
                    document.getElementById(targetId);

                console.log(target);

                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            });

        });
    });
}

// Изчиства класовете, които могат да пречат при повторно показване на view
function resetViewState(view) {
    view.classList.remove(
        'hidden',
        'is-visible',
        'is-fading-out'
    );
}

function showView(viewKey) {
    const nextView = views[viewKey];
    if (!nextView || !appMain) return;
    if (currentView === viewKey) return;

    // Премахва стария активен екран от app контейнера
    appMain.innerHTML = '';

    // Възстановява нормалното състояние на следващия екран
    resetViewState(nextView);

    // Добавя избрания view в основния app контейнер
    appMain.appendChild(nextView);

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            const scrollContainer =
                nextView.querySelector(".shelves-page-content");

            if (!scrollContainer) return;

            const shouldRestore =
                sessionStorage.getItem("restoreShelvesScroll");

            // Ако се връщаме към shelves след отваряне на конкретна етажерка,
            // възстановяваме предишната scroll позиция
            if (
                shouldRestore === "true" &&
                viewKey === "shelves"
            ) {

                const savedScroll =
                    sessionStorage.getItem("shelvesScrollPosition");

                if (savedScroll) {

                    window.scrollTo({
                        top: parseInt(savedScroll, 10),
                        behavior: "instant"
                    });

                    console.log(
                        "RESTORED:",
                        scrollContainer.scrollTop
                    );
                }

                sessionStorage.removeItem("restoreShelvesScroll");

            } else {
                const skipReset =
                    sessionStorage.getItem("skipScrollReset");

                // Ако навигираме към конкретна секция, не връщаме страницата най-горе
                if (skipReset === "true") {
                    sessionStorage.removeItem("skipScrollReset");
                } else {
                    window.scrollTo(0, 0);
                }
            }

        });

    });

    currentView = viewKey;

    // Проверява дали трябва да възстановим scroll позицията
    // на shelves страницата
    const shouldRestore =
        sessionStorage.getItem("restoreShelvesScroll");

    // Възстановяване се прави само при връщане към shelves view
    if (
        shouldRestore === "true" &&
        viewKey === "shelves"
    ) {

        // Взима последно запазената scroll позиция
        const savedScroll =
            sessionStorage.getItem("shelvesScrollPosition");

        // Изчаква DOM и layout-ът да се обновят напълно,
        // преди да приложи scroll позицията
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                window.scrollTo({
                    top: parseInt(savedScroll || 0, 10),
                    behavior: "instant"
                });

            });

        });

        // Изчиства флага след успешно възстановяване
        sessionStorage.removeItem("restoreShelvesScroll");

    } else {
        // При нормална навигация страницата започва отгоре
        window.scrollTo(0, 0);
    }
}

// Помощна функция за влизане в app layout-а чрез съществуващото auth събитие
export function enterApp() {
    document.dispatchEvent(new Event('auth:login-success'));
}

// Връща потребителя към auth екрана
export function goToAuth() {
    const authWrapper = document.getElementById("auth-wrapper");
    const appLayout = document.querySelector(".app-layout");
    const authView = document.getElementById("view-auth");

    if (!authWrapper || !appLayout || !authView) return;

    // Показва auth layout-а
    authWrapper.classList.remove("hidden");

    // Скрива основния app layout
    appLayout.classList.add("hidden");

    // Нулира видимостта на всички view-та
    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("is-visible");
    });

    // Активира началния auth екран
    authView.classList.add("is-visible");
}


