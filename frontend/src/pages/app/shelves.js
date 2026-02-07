export function initShelves() {

    document
    .querySelectorAll('.shelf-card')
    .forEach(card => {
        card.addEventListener('click', () => {
            showView('view-shelf');
        });
    });

}