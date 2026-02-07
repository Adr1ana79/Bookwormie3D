import { showView, showApp } from '../viewManager.js';

export function initSignupAdditional() {
    const buttons = document.querySelectorAll('#view-signup-additional .button');

    buttons[0].addEventListener('click', () => {
        showView('view-signup');
    });

    buttons[1].addEventListener('click', () => {
        showApp();
        showView('view-shelves');
    });
}
