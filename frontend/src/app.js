import { initStart } from './pages/auth/start.js';
import { initAuth } from "./pages/auth/auth.js";
import { initLogin } from "./pages/auth/login.js";
import { initSignup } from "./pages/auth/signup.js";
import { initSignupAdditional } from "./pages/auth/signupAdditional.js";

import {initAppFlow } from "./pages/app/appFlow.js";
import { initShelves } from "./pages/app/shelves.js";
import { initShelf } from "./pages/app/shelf.js";
import { initProfile } from "./pages/app/profile.js";
import { initSettings } from "./pages/app/settings.js";

import { getToken } from "./api/auth.js";

document.addEventListener('DOMContentLoaded', async () => {

    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();

    initAppFlow();
    initShelves();
    initShelf();
    await initProfile();
    initSettings();

    const token = getToken();

    if (token) {
        try {
            document.dispatchEvent(
                new Event('auth:login-success')
            );

            await loadAndRenderProfile();

        } catch (error) {
            console.log("Token invalid");
            localStorage.removeItem("access_token");
        }
    }
});

