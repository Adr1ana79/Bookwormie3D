import { switchView } from '../viewManager.js';

const INTRO_DURATION = 2000;
const LOADING_DURATION = 1500;

export function initStart() {
    const startView = document.getElementById('view-start');
    const loadingView = document.getElementById('view-loading');
    const authView = document.getElementById('view-auth');

    if (!startView || !loadingView || !authView) return;

    // Изчаква началната интро секция да бъде показана за зададеното време
    setTimeout(() => {
        // Превключва от началния екран към loading екрана
        switchView(startView, loadingView);

        // Изчаква loading екранът(анимацията) да бъде показан за зададеното време
        setTimeout(() => {
            // Превключва от loading екрана към екрана за избор между вход и регистрация
            switchView(loadingView, authView);
        }, LOADING_DURATION);

    }, INTRO_DURATION);
}
