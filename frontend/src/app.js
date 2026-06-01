// Инициализира всички модули за удостоверяване, приложения и специфични
// за страницата модули след като HTML документът се зареди напълно

import { initStart } from './pages/auth/start.js';
import { initAuth } from "./pages/auth/auth.js";
import { initLogin } from "./pages/auth/login.js";
import { initSignup } from "./pages/auth/signup.js";
import { initSignupAdditional } from "./pages/auth/signupAdditional.js";

import { initAppFlow } from "./pages/app/appFlow.js";
import { initShelves } from "./pages/app/shelves.js";
import { initShelf } from "./pages/app/shelf.js";
import { initProfile } from "./pages/app/profile.js";
import { initSettings } from "./pages/app/settings.js";

import { getToken } from "./api/auth.js";

document.addEventListener('DOMContentLoaded', async () => {

    // Инициализиране на процеса на удостоверяване
    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();

    // Инициализиране на основните екрани и функционалности на приложението
    initAppFlow();
    initShelves();
    initShelf();
    await initProfile();
    initSettings();


    // Проверява дали токенът за удостоверяване вече е запазен локално
    const token = getToken();

    if (token) {
        try {

            // Изисква данните за текущо автентифицирания потребител от сървъра
            // Ако токенът е валиден, приложението възстановява състоянието на влизане в системата
            const user = await getCurrentUser();

            document.dispatchEvent(
                new CustomEvent('auth:login-success', {
                    detail: user
                })
            );

        } catch (error) {

            // Премахва невалидни или изтекли токени за удостоверяване
            console.log("Token invalid");
            localStorage.removeItem("access_token");
        }
    }
});

