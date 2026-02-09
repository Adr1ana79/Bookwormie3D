export function initShelves() {
    const shelvesView = document.getElementById('view-shelves');
    if (!shelvesView) return;

    shelvesView.addEventListener('click', (e) => {
        const card = e.target.closest('.shelf-card');
        if (!card) return;

        document.dispatchEvent(
            new CustomEvent('app:open-shelf', {
                detail: { shelfId: card.dataset.id }
            })
        );
    });
}
