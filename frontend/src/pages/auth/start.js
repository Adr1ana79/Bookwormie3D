import { switchView } from '../viewManager.js';

const INTRO_DURATION = 2000;
const LOADING_DURATION = 1500;

export function initStart() {
    const startView = document.getElementById('view-start');
    const loadingView = document.getElementById('view-loading');
    const authView = document.getElementById('view-auth');

    if (!startView || !loadingView || !authView) return;

    setTimeout(() => {
        switchView(startView, loadingView);

        setTimeout(() => {
            switchView(loadingView, authView);
        }, LOADING_DURATION);

    }, INTRO_DURATION);
}
