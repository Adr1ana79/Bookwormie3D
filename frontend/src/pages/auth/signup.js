import { switchView } from '../viewManager.js';

export const signupData = {};

export function initSignup() {
    const signupView = document.getElementById('view-signup');
    if (!signupView) return;

    const buttons = signupView.querySelectorAll('.button-group .button');
    const loginButton = buttons[0];
    const continueButton = buttons[1];

    const loginView = document.getElementById('view-login');
    const signupAdditionalView =
        document.getElementById('view-signup-additional');

    // Взимаме input-ите
    const emailInput = signupView.querySelector('input[name="email"]');
    const passwordInput = signupView.querySelector('input[name="password"]');
    const usernameInput = signupView.querySelector('input[name="username"]');

    // secondary → login
    loginButton.addEventListener('click', () => {
        if (!loginView) return;
        switchView(signupView, loginView);
    });

    // primary → signup + backend
    continueButton.addEventListener('click', (event) => {
        event.preventDefault();

        signupData.username = usernameInput.value.trim();
        signupData.email = emailInput.value.trim();
        signupData.password = passwordInput.value.trim();

        if (!signupAdditionalView) return;
        switchView(signupView, signupAdditionalView);
    });

}
