import { switchView } from '../viewManager.js';

export function initSignup() {
    const signupView = document.getElementById('view-signup');
    if (!signupView) return;

    const buttons = signupView.querySelectorAll('.button-group .button');
    const loginButton = buttons[0];
    const continueButton = buttons[1];

    const loginView = document.getElementById('view-login');
    const signupAdditionalView =
        document.getElementById('view-signup-additional');

    // secondary → login
    loginButton.addEventListener('click', () => {
        if (!loginView) return;
        switchView(signupView, loginView);
    });

    // primary → signup additional
    continueButton.addEventListener('click', event => {
        event.preventDefault(); 
        if (!signupAdditionalView) return;
        switchView(signupView, signupAdditionalView);
    });
}

