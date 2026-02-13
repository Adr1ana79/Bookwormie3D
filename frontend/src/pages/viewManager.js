const FADE_DURATION = 500;

export function fadeInView(view) {
    if (!view) return;

    view.classList.add('is-visible');
}


export function fadeOutView(view, callback) {
    if (!view) return;

    view.classList.remove('is-visible');

    if (typeof callback === 'function') {
        callback();
    }
}


export function switchView(fromView, toView) {
    if (fromView === toView) return;

    fadeOutView(fromView, () => {
        fadeInView(toView);
    });
}

export function showAuthLayout() {
    document.getElementById("auth-wrapper").classList.remove("hidden");
    document.querySelector(".app-layout").classList.add("hidden");
}

export function showAppLayout() {
    document.getElementById("auth-wrapper").classList.add("hidden");
    document.querySelector(".app-layout").classList.remove("hidden");
}
