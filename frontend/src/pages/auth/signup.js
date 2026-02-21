import { switchView } from '../viewManager.js';
import { showFieldError, clearFieldError } from './login.js';

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
    const confirmPasswordInput = signupView.querySelector('input[name="confirm-password"]');
    const termsCheckbox = signupView.querySelector('#accept-terms');

    [usernameInput, emailInput, passwordInput, confirmPasswordInput]
        .forEach(input => {
            input.addEventListener("input", () => {
                clearFieldError(input);
            });
        });

    // secondary → login
    loginButton.addEventListener('click', () => {
        if (!loginView) return;
        switchView(signupView, loginView);
    });


    if (termsCheckbox) {
        termsCheckbox.addEventListener("change", () => {
            const checkboxGroup = termsCheckbox.closest(".checkbox-group");
            checkboxGroup.classList.remove("checkbox-group-error");
        });
    }

    // primary → signup + backend
    continueButton.addEventListener("click", (e) => {
        e.preventDefault();

        const isUsernameValid = validateUsername(usernameInput);
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        const isConfirmValid = validateConfirmPassword(passwordInput, confirmPasswordInput);
        const isCheckboxValid = validateCheckbox(termsCheckbox);

        if (
            !isUsernameValid ||
            !isEmailValid ||
            !isPasswordValid ||
            !isConfirmValid ||
            !isCheckboxValid
        ) {
            return;
        } else {
            signupData.username = usernameInput.value.trim();
            signupData.email = emailInput.value.trim();
            signupData.password = passwordInput.value.trim();

            switchView(signupView, signupAdditionalView);
        }
    });

}

function validateUsername(input) {
    const value = input.value.trim();
    const allowed = /^[\p{L}0-9'-]+$/u;
    clearFieldError(input);

    if (!value) {
        showFieldError(input, "Username is required");
        return false;
    }

    if (!allowed.test(value)) {
        showFieldError(input, "Only letters, numbers, (-) and (')");
        return false;
    }

    if (value.length > 50) {
        showFieldError(input, "Maximum 50 characters allowed");
        return false;
    }

    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    clearFieldError(input);

    if (!value) {
        showFieldError(input, "Email is required");
        return false;
    }

    if (!emailRegex.test(value)) {
        showFieldError(input, "Invalid email format");
        return false;
    }

    return true;
}

function validatePassword(input) {
    const value = input.value.trim();

    clearFieldError(input);

    if (!value) {
        showFieldError(input, "Password is required");
        return false;
    }

    if (value.length < 8) {
        showFieldError(input, "Password must be at least 8 characters");
        return false;
    }

    if (value.length < 10) {
        showFieldWarning(input, "Password strength: weak");
    }

    return true; // 🔥 винаги true ако няма error
}

function validateConfirmPassword(passwordInput, confirmInput) {

    clearFieldError(confirmInput);

    const passwordField = passwordInput.closest(".form-field");

    if (passwordField.classList.contains("form-field--error")) {
        return false;
    }

    if (!confirmInput.value) {
        showFieldError(confirmInput, "Please confirm your password");
        return false;
    }

    if (confirmInput.value !== passwordInput.value) {
        showFieldError(confirmInput, "Passwords do not match");
        return false;
    }

    return true;
}

function validateCheckbox(checkbox) {

    const group = checkbox.closest(".checkbox-group");

    if (!checkbox.checked) {
        group.classList.add("checkbox-group-error");
        return false;
    }

    group.classList.remove("checkbox-group-error");
    return true;
}



function showFieldWarning(input, message) {
    const formField = input.closest(".form-field");
    const errorId = input.getAttribute("aria-describedby");
    const helpEl = document.getElementById(errorId);

    if (formField) {
        formField.classList.remove("form-field--default");
        formField.classList.remove("form-field--error");
        formField.classList.add("form-field--warning");
    }

    if (helpEl) {
        helpEl.classList.remove("hidden");
        helpEl.classList.remove("form-field__help--error");
        helpEl.classList.add("form-field__help--warning");

        const text = helpEl.querySelector(".form-field__help-text");
        if (text) text.textContent = message;
    }
}