export function initShelves() {
    const shelvesView = document.getElementById('view-shelves');
    const shelfView = document.getElementById('view-shelf');

    if (!shelvesView || !shelfView) return;

    const shelfCards = shelvesView.querySelectorAll('.shelf-card');

    shelfCards.forEach(card => {
        card.addEventListener('click', () => {
            // крием shelves
            shelvesView.classList.add('hidden');

            // показваме single shelf
            shelfView.classList.remove('hidden');
        });
    });
}
