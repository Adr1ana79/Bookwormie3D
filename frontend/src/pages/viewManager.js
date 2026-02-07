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
