export function initSettings() {
    const radios = document.querySelectorAll(
        'input[name="color-mode"]'
    );

    if (!radios.length) return;

    // load saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute(
            'data-theme',
            savedTheme
        );

        radios.forEach(radio => {
            radio.checked = radio.value === savedTheme;
        });
    }

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const theme = radio.value;

            document.documentElement.setAttribute(
                'data-theme',
                theme
            );

            localStorage.setItem('theme', theme);
        });
    });
}
