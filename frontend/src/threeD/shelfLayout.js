export function getShelfLayout(size) {

    const layouts = {
        mini: {

            startX: -0.86,

            slotWidth: 0.047,

            startY: 0.13,

            maxBooksPerRow: 10,

            bookScale: 1.3,

            baseRows: [
                0.14,
                -0.2,
                -0.54,
                -0.89
            ],

            z: 0.25

        },

        standard: {

            startX: -0.63,

            slotWidth: 0.047,

            startY: 0.16,

            maxBooksPerRow: 10,

            bookScale: 1,

            baseRows: [
                0.51,
                0.27,
                0.02,
                -0.23,
                -0.48
            ],

            z: 0.2

        }
    };

    return layouts[size] || layouts.standard;
}