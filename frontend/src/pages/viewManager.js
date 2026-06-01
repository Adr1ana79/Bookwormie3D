export function fadeInView(view) {
    if (!view) return;

    // Показва подадения изглед чрез добавяне на CSS клас за видимост
    view.classList.add('is-visible');
}


export function fadeOutView(view, callback) {
    if (!view) return;

    // Скрива подадения изглед чрез премахване на CSS класа за видимост
    view.classList.remove('is-visible');

    // Изпълнява допълнителна функция след скриването, ако такава е подадена
    if (typeof callback === 'function') {
        callback();
    }
}

export function switchView(fromView, toView) {
    if (fromView === toView) return;

    // Скрива текущия изглед и след това показва следващия
    fadeOutView(fromView, () => {
        fadeInView(toView);
    });
}

export function showAuthLayout() {
    // Показва началния/auth layout и скрива основната част на приложението
    document.getElementById("auth-wrapper").classList.remove("hidden");
    document.querySelector(".app-layout").classList.add("hidden");
}

export function showAppLayout() {
    // Скрива началния/auth layout и показва основната част на приложението
    document.getElementById("auth-wrapper").classList.add("hidden");
    document.querySelector(".app-layout").classList.remove("hidden");
}
