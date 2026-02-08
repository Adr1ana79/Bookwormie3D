import { switchView } from '../viewManager.js';

export function initAuth() {
    const authView = document.getElementById('view-auth');
    if (!authView) return;

    const options = authView.querySelectorAll('.auth-option');

    let currentMode = 'login';

    function setMode(mode) {
        if (currentMode === mode) return;

        currentMode = mode;

        authView.classList.toggle(
            'auth-screen--login',
            mode === 'login'
        );
        authView.classList.toggle(
            'auth-screen--signup',
            mode === 'signup'
        );

        options.forEach(button => {
            const isActive = button.dataset.mode === mode;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    options.forEach(button => {
        const mode = button.dataset.mode;

        // hover / focus → preview
        button.addEventListener('mouseenter', () => {
            setMode(mode);
        });

        button.addEventListener('focus', () => {
            setMode(mode);
        });

        // click → избор + навигация
        button.addEventListener('click', () => {
            setMode(mode);

            const targetView = document.getElementById(
                mode === 'login' ? 'view-login' : 'view-signup'
            );

            if (targetView) {
                switchView(authView, targetView);
            }
        });
    });

    // initial state
    setMode(currentMode);
}
