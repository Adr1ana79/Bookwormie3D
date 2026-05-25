export function getShelfLayout(size, design) {

    const layouts = {
        basic: {
            mini: {
                startX: -0.86,
                slotWidth: 0.05,

                startY: 0.13,
                maxBooksPerRow: 35,
                bookScale: 1.35,
                baseRows: [
                    0.14,
                    -0.2,
                    -0.53,
                    -0.86
                ],
                z: 0.25
            },

            standard: {
                startX: -0.63,
                slotWidth: 0.037,

                startY: 0.16,
                maxBooksPerRow: 35,
                bookScale: 1,
                baseRows: [
                    0.51,
                    0.27,
                    0.02,
                    -0.22,
                    -0.47,
                    -0.71,
                    -0.95,
                    -1.165
                ],
                z: 0.2
            }
        },

        bright: {
            mini: {
                startX: -0.86,
                slotWidth: 0.05,

                startY: 0.13,
                maxBooksPerRow: 35,
                bookScale: 1.35,
                baseRows: [
                    0.14,
                    -0.2,
                    -0.53,
                    -0.86
                ],
                z: 0.25,

                blockedSlots: [
                    { row: 1, from: 12, to: 23 },
                    { row: 2, from: 12, to: 12 },
                    { row: 2, from: 22, to: 23 }
                ]
            },

            standard: {
                startX: -0.63,
                slotWidth: 0.037,

                startY: 0.16,
                maxBooksPerRow: 35,
                bookScale: 1,
                baseRows: [
                    0.51,
                    0.27,
                    0.02,
                    -0.22,
                    -0.47,
                    -0.71,
                    -0.96,
                    -1.165
                ],
                z: 0.16,

                blockedSlots: [
                    { row: 2, from: 12, to: 23 },
                    { row: 3, from: 12, to: 12 },
                    { row: 3, from: 22, to: 23 }
                ]
            }
        },

        elegant: {
            mini: {
                startX: -0.86,
                slotWidth: 0.05,

                startY: 0.13,
                maxBooksPerRow: 35,
                bookScale: 1.35,
                baseRows: [
                    0.4,
                    0.06,
                    -0.27,
                    -0.6
                ],
                z: 0.25
            },

            standard: {
                startX: -0.63,
                slotWidth: 0.037,

                startY: 0.16,
                maxBooksPerRow: 35,
                bookScale: 1,
                baseRows: [
                    0.49,
                    0.25,
                    0,
                    -0.23,
                    -0.48,
                    -0.73
                ],
                z: 0.2
            }
        },

        modern: {
            mini: {
                startX: -0.79,
                slotWidth: 0.043,

                startY: 0.13,
                maxBooksPerRow: 35,
                bookScale: 1.16,
                baseRows: [
                    0.13,
                    -0.1,
                    -0.32,
                    -0.55
                ],
                z: 0.61,

                blockedSlots: [
                    { row: 0, from: 0, to: 5 },
                    { row: 1, from: 0, to: 5 },
                    { row: 2, from: 0, to: 5 },
                    { row: 3, from: 0, to: 5 },
                    { row: 0, from: 32, to: 34 },
                    { row: 1, from: 32, to: 34 },
                    { row: 2, from: 32, to: 34 },
                    { row: 3, from: 32, to: 34 }
                ]
            },

            standard: {
                startX: -0.63,
                slotWidth: 0.035,

                startY: 0.16,
                maxBooksPerRow: 35,
                bookScale: 0.98,
                baseRows: [
                    0.41,
                    0.20,
                    -0.01,
                    -0.23,
                    -0.43,
                    -0.65,
                    -0.86
                ],
                z: 0.2,

                blockedSlots: [
                    { row: 0, from: 0, to: 2 },
                    { row: 1, from: 0, to: 2 },
                    { row: 2, from: 0, to: 2 },
                    { row: 3, from: 0, to: 2 },
                    { row: 4, from: 0, to: 2 },
                    { row: 5, from: 0, to: 2 },
                    { row: 6, from: 0, to: 2 },

                    { row: 0, from: 33, to: 34 },
                    { row: 1, from: 33, to: 34 },
                    { row: 2, from: 33, to: 34 },
                    { row: 3, from: 33, to: 34 },
                    { row: 4, from: 33, to: 34 },
                    { row: 5, from: 33, to: 34 },
                    { row: 6, from: 33, to: 34 },
                ],

                modelOffset: {
                    x: 0,
                    y: 0,
                    z: -0.35
                }
            }
        },

        gothic: {
            mini: {
                startX: -0.86,
                slotWidth: 0.05,

                startY: 0.13,
                maxBooksPerRow: 35,
                bookScale: 1.35,
                baseRows: [
                    0.14,
                    -0.2,
                    -0.53,
                    -0.86
                ],
                z: 0.25
            },

            standard: {
                startX: -0.63,
                slotWidth: 0.037,

                startY: 0.16,
                maxBooksPerRow: 35,
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
        }
    };

    return layouts [design]?.[size] || layouts.basic.standard;
}

export function isSlotBlocked(layout, row, index) {
    return layout.blockedSlots?.some(slot =>
        slot.row === row &&
        index >= slot.from &&
        index <= slot.to
    ) || false;
}