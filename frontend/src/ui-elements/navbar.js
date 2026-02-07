import { showView } from '../pages/viewManager.js';

export function initSidebarNav() {
    document
        .querySelectorAll('.sidebar__nav a')
        .forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = link.getAttribute('href').replace('#', '');
                showView(target);
            });
        });
}
