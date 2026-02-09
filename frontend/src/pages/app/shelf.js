// pages/app/shelf.js
export function initShelf() {
    const shelfView = document.getElementById('view-shelf');
    if (!shelfView) return;

    const backLink = shelfView.querySelector('.local_navigation a');
    if (!backLink) return;

    backLink.addEventListener('click', (event) => {
        event.preventDefault();

        document.dispatchEvent(
            new CustomEvent('app:back-to-shelves')
        );
    });
}
