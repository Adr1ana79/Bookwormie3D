import { fadeInView, fadeOutView } from '../viewManager.js';

export function initStart() {
    const startView = document.getElementById('view-start');
    const loadingView = document.getElementById('view-loading');
    const authView = document.getElementById('view-auth');

    fadeInView(startView);

    setTimeout(() => {
        fadeOutView(startView, () => {
            fadeInView(loadingView);
        });
    }, 2000);

    setTimeout(() => {
        fadeOutView(loadingView, () => {
            fadeInView(authView);
        });
    }, 4000);
}
