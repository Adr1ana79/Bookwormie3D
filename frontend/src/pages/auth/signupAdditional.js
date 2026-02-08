import { switchView } from '../viewManager.js';
import { enterApp } from '../app/appFlow.js';

export function initSignupAdditional() {
    const additionalView =
        document.getElementById('view-signup-additional');
    if (!additionalView) return;

    const buttons =
        additionalView.querySelectorAll('.button-group--two .button');

    const returnButton = buttons[0];
    const createProfileButton = buttons[1];

    const signupView = document.getElementById('view-signup');

    // secondary → back to signup
    returnButton.addEventListener('click', () => {
        if (!signupView) return;
        switchView(additionalView, signupView);
    });

    // primary → app (fake success)
    createProfileButton.addEventListener('click', () => {
        // ТУК по-късно:
        // - save profile data
        // - call API
        // - show app layout

        enterApp();
    });
}
