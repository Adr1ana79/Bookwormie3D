import { switchView } from '../viewManager.js';
import { enterApp } from '../app/appFlow.js';
import { login } from '../../api/auth.js';

export function initLogin() {
    const loginView = document.getElementById('view-login');
    if (!loginView) return;

    const buttons = loginView.querySelectorAll('.button-group .button');
    const signupButton = buttons[0];
    const continueButton = buttons[1];

    const signupView = document.getElementById('view-signup');

    // Пренасочва потребителя към екрана за регистрация
    signupButton.addEventListener('click', () => {
        if (!signupView) return;
        switchView(loginView, signupView);
    });

    // Обработва изпращането на login формата към backend-а
    continueButton.addEventListener('click', async () => {
        const emailInput = loginView.querySelector('#login-email');
        const passwordInput = loginView.querySelector('#login-password');

        const email = emailInput.value.trim(); // Премахва празното пространство от началото и края на string-а
        const password = passwordInput.value.trim();

        // Проверява дали и двете задължителни полета са празни
        if (!email && !password) {
            showFieldError(emailInput, "Email is required");
            showFieldError(passwordInput, "Password is required");
            return;
        }

        // Проверява дали е въведен email
        if (!email) {
            showFieldError(emailInput, "Email is required");
            return;
        }

        // Проверява дали е въведена парола
        if (!password) {
            showFieldError(passwordInput, "Password is required");
            return;
        }

        // Премахва съобщенията за грешка при промяна на въведените данни
        emailInput.addEventListener("input", () => clearFieldError(emailInput));
        passwordInput.addEventListener("input", () => clearFieldError(passwordInput));

        try {
            // Изпраща въведените данни към login endpoint-а
            const result = await login(email, password);

            if (result.access_token) {
                // Зарежда основната част на приложението при успешен вход
                enterApp();
            } else {
                // Показва грешка при невалидни потребителски данни
                showFieldError(emailInput, "Invalid email or password");
                showFieldError(passwordInput, "");
            }
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

    // Променя визуалното състояние на полето към състояние за грешка
    if (formField) {
        formField.classList.remove("form-field--default");
        formField.classList.remove("form-field--warning");
        formField.classList.add("form-field--error");
    }

    // Показва помощния текст с конкретното съобщение за грешка
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
    // Преминава през елемента и неговите родителски елементи (в посока към корена на документа), докато не открие възел, който отговаря на зададения CSS селектор
    const errorId = input.getAttribute("aria-describedby");
    const errorElement = document.getElementById(errorId);

    // Връща визуалното състояние на полето към стандартно
    if (formField) {
        formField.classList.remove("form-field--error");
        formField.classList.add("form-field--default");
    }

    // Скрива съобщението за грешка
    if (errorElement) {
        errorElement.classList.add("hidden");
    }
}