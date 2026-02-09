export function initSidebarNav() {
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-view]');
        if (!btn) return;

        document.dispatchEvent(
            new CustomEvent('app:navigate', {
                detail: btn.dataset.view
            })
        );
    });
}

// ui-elements/navbar.js
export function setActiveNav(viewKey) {
    document
        .querySelectorAll('.sidebar__item')
        .forEach(li => li.classList.remove('sidebar__item--active'));

    document
        .querySelector(`[data-view="${viewKey}"]`)
        ?.closest('.sidebar__item')
        ?.classList.add('sidebar__item--active');
}

