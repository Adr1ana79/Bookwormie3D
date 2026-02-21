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

        if (!email && !password) {
            showFieldError(emailInput, "Email is required");
            showFieldError(passwordInput, "Password is required");
            return;
        }

        if (!email) {
            showFieldError(emailInput, "Email is required");
            return;
        }

        if (!password) {
            showFieldError(passwordInput, "Password is required");
            return;
        }

        emailInput.addEventListener("input", () => clearFieldError(emailInput));
        passwordInput.addEventListener("input", () => clearFieldError(passwordInput));

        try {
            const result = await login(email, password);

            if (result.access_token) {
                enterApp();
            } else {
                showFieldError(emailInput, "Invalid email or password");
                showFieldError(passwordInput, "");            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error");
        }
    });
}


export function showFieldError(input, message) {
    const formField = input.closest(".form-field");
    const errorId = input.getAttribute("aria-describedby");
    const helpEl = document.getElementById(errorId);

    if (formField) {
        formField.classList.remove("form-field--default");
        formField.classList.remove("form-field--warning");
        formField.classList.add("form-field--error");
    }

    if (helpEl) {
        helpEl.classList.remove("hidden");
        helpEl.classList.remove("form-field__help--warning");
        helpEl.classList.add("form-field__help--error");

        const text = helpEl.querySelector(".form-field__help-text");
        if (text) text.textContent = message;
    }
}

export function clearFieldError(input) {
    const formField = input.closest(".form-field");
    const errorId = input.getAttribute("aria-describedby");
    const errorElement = document.getElementById(errorId);

    if (formField) {
        formField.classList.remove("form-field--error");
        formField.classList.add("form-field--default");
    }

    if (errorElement) {
        errorElement.classList.add("hidden");
    }
}