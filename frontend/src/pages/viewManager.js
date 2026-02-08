const FADE_DURATION = 600;

export function fadeInView(view) {
    if (!view) return;

    requestAnimationFrame(() => {
        view.classList.add('is-visible');
    });
}

export function fadeOutView(view, callback) {
    if (!view) return;

    view.classList.add('is-fading-out');

    setTimeout(() => {
        view.classList.remove('is-fading-out');
        view.classList.remove('is-visible');

        if (typeof callback === 'function') {
            callback();
        }
    }, FADE_DURATION);
}

export function switchView(fromView, toView) {
    if (fromView === toView) return;

    fadeOutView(fromView, () => {
        fadeInView(toView);
    });
}
