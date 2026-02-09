import { initSidebarNav, setActiveNav } from '../../ui-elements/navbar.js';
import { switchView } from '../viewManager.js';

let currentView = null;

export function initAppFlow() {
    initSidebarNav();

    const authWrapper = document.getElementById('auth-wrapper');
    const appLayout = document.querySelector('.app-layout');

    const views = {
        shelves: document.getElementById('view-shelves'),
        profile: document.getElementById('view-profile'),
        settings: document.getElementById('view-settings'),
    };

    // 🔐 login success
    document.addEventListener('auth:login-success', () => {
        authWrapper.classList.add('hidden');
        appLayout.classList.remove('hidden');

        showView(views.shelves, 'shelves');
    });

    // 🚪 logout
    document.addEventListener('auth:logout', () => {
        appLayout.classList.add('hidden');
        authWrapper.classList.remove('hidden');

        currentView = null;
    });

    // 🧭 sidebar nav
    document.addEventListener('app:navigate', (e) => {
        const viewKey = e.detail;
        const nextView = views[viewKey];

        if (nextView) {
            showView(nextView, viewKey);
        }
    });
}

function showView(nextView, viewKey) {
    if (!nextView) return;

    nextView.classList.remove('hidden');

    if (!currentView) {
        nextView.classList.add('is-visible');
    } else {
        switchView(currentView, nextView);
    }

    setActiveNav(viewKey);

    currentView = nextView;
}


export function enterApp() {
    document.dispatchEvent(new Event('auth:login-success'));
}
