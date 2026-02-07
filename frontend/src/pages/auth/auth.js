import { fadeOutView, fadeInView } from '../viewManager.js';

export function initAuth() {
    const authView = document.getElementById('view-auth');
    if (!authView) return;

    const options = document.querySelectorAll('.auth-option');
    const background = document.querySelector('.auth-selector__background');

    let currentMode = 'login';

    function setMode(mode) {
        currentMode = mode;

        authView.classList.toggle('auth-screen--login', mode === 'login');
        authView.classList.toggle('auth-screen--signup', mode === 'signup');

        background.classList.toggle(
            'auth-selector__background--login',
            mode === 'login'
        );
        background.classList.toggle(
            'auth-selector__background--signup',
            mode === 'signup'
        );

        options.forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    function navigateToMode(mode) {
        fadeOutView(authView, () => {
            fadeInView(
                document.getElementById(
                    mode === 'login' ? 'view-login' : 'view-signup'
                )
            );
        });
    }

    options.forEach(btn => {
        btn.addEventListener('mouseenter', () =>
            setMode(btn.dataset.mode)
        );

        btn.addEventListener('focus', () =>
            setMode(btn.dataset.mode)
        );

        btn.addEventListener('click', () =>
            navigateToMode(btn.dataset.mode)
        );
    });

    setMode('login');
}


/*
import { initStart } from './start.js';
import { initLogin } from './login.js';
import { initSignup } from './signup.js';
import { initSignupAdditional } from './signupAdditional.js';
import { initAuth } from './auth.js';

export function initAuthFlow() {
    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();
}
 */