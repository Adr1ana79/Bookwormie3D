import { switchView } from '../viewManager.js';
import {enterApp } from '../app/appFlow.js';
import { login } from '../../api/auth.js';

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

    // primary → backend login
    continueButton.addEventListener('click', async () => {
        const emailInput = loginView.querySelector('#login-email');
        const passwordInput = loginView.querySelector('#login-password');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const result = await login(email, password);

            if (result.access_token) {
                enterApp();
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error");
        }
    });
}