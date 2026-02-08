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
});



/*
app.js
import { initStart } from './pages/auth/start.js';
import { initAuth } from './pages/auth/auth.js';
import { initLogin } from './pages/auth/login.js';
import { initSignup } from './pages/auth/signup.js';
import { initSignupAdditional } from './pages/auth/signupAdditional.js';
import { initAppFlow } from './pages/app/appFlow.js';

document.addEventListener('DOMContentLoaded', () => {
    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();
    initAppFlow();
});


viewManager.js
import { FADE_DURATION } from "../config.js";

export function showView(viewId) {
    sessionStorage.setItem("currentView", viewId);

    document.querySelectorAll(".view").forEach(v => {
        v.classList.remove("is-visible");
    });

    const view = document.getElementById(viewId);
    if (!view) return;

    view.classList.add("is-visible");
}

export function fadeOutView(view, callback) {
    view.classList.remove("is-visible");
    view.classList.add("is-fading-out");

    setTimeout(() => {
        view.classList.remove("is-fading-out");
        if (callback) callback();
    }, FADE_DURATION);
}

export function fadeInView(view) {
    requestAnimationFrame(() => {
        view.classList.add("is-visible");
    });
}

authFlow.js
import { initStart } from './start.js';
import { initLogin } from './login.js';
import { initSignup } from './signup.js';
import { initSignupAdditional } from './signupAdditional.js';
import { initAuth } from './auth.js';

export function initAuthFlow() {
    initStart();
    initAuth();
    initLogin();
    initSignup();
    initSignupAdditional();
}

start.js
import { showView } from '../viewManager.js';

export function initStart() {
    showView('view-start');

    setTimeout(() => {
        showView('view-loading');

        setTimeout(() => {
            showView('view-auth');
        }, 2000);
    }, 2000);
}

auth.js
export function initAuth() {
    const authView = document.getElementById('view-auth');
    const options = document.querySelectorAll('.auth-option');
    const background = document.querySelector('.auth-selector__background');

    let currentMode = 'login';
}

login.js
import { showView, showApp } from '../viewManager.js';

export function initLogin() {
    const buttons = document.querySelectorAll('#view-login .button');

    buttons[0].addEventListener('click', () => {
        showView('view-signup');
    });

    buttons[1].addEventListener('click', () => {
        showApp();
        showView('view-shelves');
    });
}

signup.js
import { showView } from '../viewManager.js';

export function initSignup() {
    const buttons = document.querySelectorAll('#view-signup .button');

    buttons[0].addEventListener('click', () => {
        showView('view-login');
    });

    buttons[1].addEventListener('click', () => {
        showView('view-signup-additional');
    });
}

signupAdditional.js
import { showView, showApp } from '../viewManager.js';

export function initSignupAdditional() {
    const buttons = document.querySelectorAll('#view-signup-additional .button');

    buttons[0].addEventListener('click', () => {
        showView('view-signup');
    });

    buttons[1].addEventListener('click', () => {
        showApp();
        showView('view-shelves');
    });
}

shelves.js
export function initShelves() {

    document
    .querySelectorAll('.shelf-card')
    .forEach(card => {
        card.addEventListener('click', () => {
            showView('view-shelf');
        });
    });

}

appFlow.js
import { initSidebarNav } from '../../ui-elements/navbar.js';

export function initAppFlow() {
    initSidebarNav();
}



 */