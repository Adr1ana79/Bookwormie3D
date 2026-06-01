import { switchView } from '../viewManager.js';

export function initAuth() {
    const authView = document.getElementById('view-auth');
    if (!authView) return;

    const options = authView.querySelectorAll('.auth-option');

    let currentMode = 'login';

    function setMode(mode) {
        if (currentMode === mode) return;

        // Запазва текущо избрания режим
        currentMode = mode;

        // Променя визуалното състояние на екрана според избрания режим
        authView.classList.toggle(
            'auth-screen--login',
            mode === 'login'
        );
        authView.classList.toggle(
            'auth-screen--signup',
            mode === 'signup'
        );

        // Обновява активното състояние и достъпността на бутоните
        options.forEach(button => {
            const isActive = button.dataset.mode === mode;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    options.forEach(button => {
        const mode = button.dataset.mode;

        // Променя режима при посочване с мишката
        button.addEventListener('mouseenter', () => {
            setMode(mode);
        });

        // Променя режима при фокусиране с клавиатура
        button.addEventListener('focus', () => {
            setMode(mode);
        });

        // Избира режима и отваря съответния изглед
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

    // Задава началното състояние на auth екрана
    setMode(currentMode);
}
