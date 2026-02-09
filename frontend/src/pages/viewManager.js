const FADE_DURATION = 600;

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
