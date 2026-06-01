import { switchView } from '../viewManager.js';
import { enterApp } from '../app/appFlow.js';
import { signupData } from './signup.js';
import { showFieldError } from "./login.js";

export function initSignupAdditional() {
    const additionalView =
        document.getElementById('view-signup-additional');
    if (!additionalView) return;

    const buttons =
        additionalView.querySelectorAll('.button-group--two .button');

    const returnButton = buttons[0];
    const createProfileButton = buttons[1];

    const signupView = document.getElementById('view-signup');

    // Връща потребителя към основната форма за регистрация
    returnButton.addEventListener('click', () => {
        if (!signupView) return;
        switchView(additionalView, signupView);
    });

    // Изпраща данните за регистрация към backend-а и създава профил
    createProfileButton.addEventListener('click', async () => {
        try {
            // Изпраща временно съхранените данни от регистрацията
            const result = await signup(signupData);

            // Запазва получения access token и отваря основната част на приложението
            localStorage.setItem("access_token", result.access_token);
            enterApp();

        } catch (error) {

            // Връща потребителя към регистрацията при вече заето потребителско име
            if (error.message.includes("Username")) {
                switchView(additionalView, signupView);
                showFieldError(
                    document.querySelector('#signup-username'),
                    "Username already exists"
                );
            }

            // Връща потребителя към регистрацията при вече зает email адрес
            if (error.message.includes("email")) {
                switchView(additionalView, signupView);
                showFieldError(
                    document.querySelector('#signup-email'),
                    "Email already exists"
                );
            }
        }
    });
}

// Изпраща заявка към backend-а за създаване на нов потребителски профил
async function signup(data) {
    const response = await fetch("http://localhost:8000/profiles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    // Прекъсва регистрацията, ако backend-ът върне грешка
    if (!response.ok) {
        throw new Error(result.detail || "Signup failed");
    }

    return result;
}
