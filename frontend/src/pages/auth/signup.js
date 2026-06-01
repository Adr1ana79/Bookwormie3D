import { switchView } from '../viewManager.js';
import { showFieldError, clearFieldError } from './login.js';

// Съхранява временно основните данни от регистрацията,
// докато потребителят премине към следващата стъпка
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

    // Взима input полетата от формата за регистрация
    // querySelector - връща първия елемент в документа, който съответства на зададения CSS селектор
    const emailInput = signupView.querySelector('input[name="email"]');
    const passwordInput = signupView.querySelector('input[name="password"]');
    const usernameInput = signupView.querySelector('input[name="username"]');
    const confirmPasswordInput = signupView.querySelector('input[name="confirm-password"]');
    const termsCheckbox = signupView.querySelector('#accept-terms');

    // Изчиства съобщението за грешка при промяна на стойността в полето
    [usernameInput, emailInput, passwordInput, confirmPasswordInput]
        .forEach(input => {
            input.addEventListener("input", () => {
                clearFieldError(input);
            });
        });

    // Пренасочва потребителя към екрана за вход
    loginButton.addEventListener('click', () => {
        if (!loginView) return;
        switchView(signupView, loginView);
    });


    // Премахва визуалната грешка при маркиране на checkbox-а
    if (termsCheckbox) {
        termsCheckbox.addEventListener("change", () => {
            const checkboxGroup = termsCheckbox.closest(".checkbox-group");
            checkboxGroup.classList.remove("checkbox-group-error");
        });
    }

    // Валидира формата за регистрация и преминава към допълнителната стъпка
    continueButton.addEventListener("click", (e) => {
        e.preventDefault();
        //Спира стандартното действие на браузъра, за да можете да изпълни следващия JS код вместо това

        const isUsernameValid = validateUsername(usernameInput);
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        const isConfirmValid = validateConfirmPassword(passwordInput, confirmPasswordInput);
        const isCheckboxValid = validateCheckbox(termsCheckbox);

        if (!isUsernameValid ||
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

// Проверява дали потребителското име е попълнено и съдържа позволени символи
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

// Проверява дали email адресът е попълнен и има валиден формат
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

// Проверява дали паролата е попълнена и покрива минималната дължина
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

    return true;
}

// Проверява дали повторената парола съвпада с основната парола
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

// Проверява дали потребителят е приел условията за ползване
function validateCheckbox(checkbox) {
    const group = checkbox.closest(".checkbox-group");

    if (!checkbox) return false;

    if (!checkbox.checked) {
        group.classList.add("checkbox-group-error");
        return false;
    }

    group.classList.remove("checkbox-group-error");
    return true;
}


// Показва предупредително съобщение към поле от формата
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