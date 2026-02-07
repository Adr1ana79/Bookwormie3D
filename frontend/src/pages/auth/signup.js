import { fadeOutView, fadeInView } from '../viewManager.js';

export function initSignup() {
    const view = document.getElementById('view-signup');
    if (!view) return;

    const [btnLogin, btnContinue] =
        view.querySelectorAll('.button-group .button');

    // secondary → login
    btnLogin.addEventListener('click', () => {
        fadeOutView(view, () => {
            fadeInView(document.getElementById('view-login'));
        });
    });

    // primary → signup-additional (ще го добавим по-късно)
    btnContinue.addEventListener('click', e => {
        e.preventDefault();
        console.log('Signup → additional (later)');
    });
}
