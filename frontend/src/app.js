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

document.addEventListener('DOMContentLoaded', () => {

    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();

    initAppFlow();
    initShelves();
    initShelf();
    initProfile();
    initSettings();

    if (getToken()) {
        document.dispatchEvent(new Event('auth:login-success'));
    } else {
        console.log("User is not logged in");
    }
});

