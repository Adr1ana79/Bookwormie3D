import { fadeOutView, fadeInView } from '../viewManager.js';

export function initLogin() {
    const view = document.getElementById('view-login');
    if (!view) return;

    const [btnSignup, btnContinue] =
        view.querySelectorAll('.button-group .button');

    // secondary → signup
    btnSignup.addEventListener('click', () => {
        fadeOutView(view, () => {
            fadeInView(document.getElementById('view-signup'));
        });
    });

    // primary → app (засега само log)
    btnContinue.addEventListener('click', e => {
        e.preventDefault(); // ⬅️ КРИТИЧНО
        console.log('Login success → shelves (later)');
    });
}
