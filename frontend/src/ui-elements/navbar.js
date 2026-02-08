export function initSidebarNav() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const items = sidebar.querySelectorAll('.sidebar__item');
    const appViews = document.querySelectorAll(
        '#view-shelves, #view-profile, #view-settings'
    );

    items.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();

            const link = item.querySelector('a');
            if (!link) return;

            const targetId = link.getAttribute('href')?.replace('#', '');
            if (!targetId) return;

            const targetView = document.getElementById(targetId);
            if (!targetView) return;

            items.forEach(i =>
                i.classList.remove('sidebar__item--active')
            );

            item.classList.add('sidebar__item--active');

            appViews.forEach(view =>
                view.classList.add('hidden')
            );

            targetView.classList.remove('hidden');
        });
    });
}
