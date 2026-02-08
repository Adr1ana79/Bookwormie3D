import { switchView } from '../viewManager.js';
import { enterApp } from '../app/appFlow.js';

export function initLogin() {
    const loginView = document.getElementById('view-login');
    if (!loginView) return;

    const buttons = loginView.querySelectorAll('.button-group .button');
    const signupButton = buttons[0];
    const continueButton = buttons[1];

    const signupView = document.getElementById('view-signup');

    // secondary → signup
    signupButton.addEventListener('click', () => {
        if (!signupView) return;
        switchView(loginView, signupView);
    });

    // primary → app (засега fake success)
    continueButton.addEventListener('click', () => {
        // ТУК по-късно ще има:
        // - validation
        // - authService.login()
        // - show app layout
        enterApp();
    });
}

