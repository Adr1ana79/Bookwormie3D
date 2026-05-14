import { initSidebarNav, setActiveNav } from '../../ui-elements/navbar.js';
import { renderProfile } from './profile.js';
import { getCurrentUser } from "../../api/profile.js";

let currentView = null;
let appMain = null;
let views = null;

export function initAppFlow() {
    initSidebarNav();

    const authWrapper = document.getElementById('auth-wrapper');
    const appLayout = document.querySelector('.app-layout');
    appMain = document.getElementById('app-main');

    views = {
        shelves: document.getElementById('view-shelves'),
        shelf: document.getElementById('view-shelf'),
        profile: document.getElementById('view-profile'),
        settings: document.getElementById('view-settings'),
    };

    // 🔐 login success
    document.addEventListener('auth:login-success', () => {
        authWrapper.classList.add('hidden');
        appLayout.classList.remove('hidden');

        showView('shelves');
        setActiveNav('shelves');
    });

    // 🚪 logout
    document.addEventListener('auth:logout', () => {
        appLayout.classList.add('hidden');
        authWrapper.classList.remove('hidden');

        currentView = null;
    });

    // 🧭 sidebar navigation
    document.addEventListener('app:navigate', (e) => {
        const viewKey = e.detail;
        showView(viewKey);
        setActiveNav(viewKey);
    });

    // 📚 shelves → shelf
    document.addEventListener('app:open-shelf', () => {
        showView('shelf');
    });
}

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

    // махаме стария екран
    appMain.innerHTML = '';

    // 🔑 ТУК я викаш
    resetViewState(nextView);

    // добавяме новия
    appMain.appendChild(nextView);

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            const scrollContainer =
                nextView.querySelector(".shelves-page-content");

            if (!scrollContainer) return;

            const shouldRestore =
                sessionStorage.getItem("restoreShelvesScroll");

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

                window.scrollTo(0, 0);
            }

        });

    });

    currentView = viewKey;

    const shouldRestore =
        sessionStorage.getItem("restoreShelvesScroll");

    if (
        shouldRestore === "true" &&
        viewKey === "shelves"
    ) {

        const savedScroll =
            sessionStorage.getItem("shelvesScrollPosition");

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                window.scrollTo({
                    top: parseInt(savedScroll || 0, 10),
                    behavior: "instant"
                });

            });

        });

        sessionStorage.removeItem("restoreShelvesScroll");

    } else {

        window.scrollTo(0, 0);
    }
}

export function enterApp() {
    document.dispatchEvent(new Event('auth:login-success'));
}


export function goToAuth() {
    const authWrapper = document.getElementById("auth-wrapper");
    const appLayout = document.querySelector(".app-layout");
    const authView = document.getElementById("view-auth");

    if (!authWrapper || !appLayout || !authView) return;

    // Показваме auth layout
    authWrapper.classList.remove("hidden");

    // Скриваме app layout
    appLayout.classList.add("hidden");

    // Нулираме всички view-та
    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("is-visible");
    });

    // Активираме auth screen (login/signup избор)
    authView.classList.add("is-visible");
}


