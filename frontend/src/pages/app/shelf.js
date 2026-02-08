export function initShelf() {
    const shelfView = document.getElementById('view-shelf');
    const shelvesView = document.getElementById('view-shelves');

    if (!shelfView || !shelvesView) return;

    const backLink =
        shelfView.querySelector('.local_navigation a');

    if (!backLink) return;

    backLink.addEventListener('click', event => {
        event.preventDefault();

        // крием single shelf
        shelfView.classList.add('hidden');

        // показваме shelves
        shelvesView.classList.remove('hidden');
    });
}
