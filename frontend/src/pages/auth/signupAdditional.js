import { switchView } from '../viewManager.js';
import { enterApp } from '../app/appFlow.js';
import { signupData } from './signup.js';
import {showFieldError} from "./login.js";

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

    // primary → app
    createProfileButton.addEventListener('click', async () => {
        try {
            const result = await signup(signupData);

            localStorage.setItem("access_token", result.access_token);
            enterApp();

        } catch (error) {

            if (error.message.includes("Username")) {
                switchView(additionalView, signupView);
                showFieldError(
                    document.querySelector('#signup-username'),
                    "Username already exists"
                );
            }

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


async function signup(data) {
    const response = await fetch("http://localhost:8000/profiles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Signup failed");
    }

    return result;
}
