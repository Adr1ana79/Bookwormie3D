import { initSidebarNav } from '../../ui-elements/navbar.js';
import { initShelves } from './shelves.js';
import { initProfile } from './profile.js';
import { initSettings } from './settings.js';

export function initAppFlow() {
    initSidebarNav();
    initShelves();
    initProfile();
    initSettings();
}

export function enterApp() {
    const authWrapper = document.getElementById('auth-wrapper');
    const appLayout = document.querySelector('.app-layout');
    const shelvesView = document.getElementById('view-shelves');

    if (authWrapper) {
        authWrapper.style.display = 'none';
    }

    if (appLayout) {
        appLayout.classList.remove('hidden');
    }

    if (shelvesView) {
        shelvesView.classList.remove('hidden');
    }
}
