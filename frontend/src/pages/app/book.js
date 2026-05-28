import { openConfirmModal } from "../../ui-elements/confirmModal.js";

export const testBooks = [

    {
        id: "book-1",
        title: "The Silent Forest",
        author: "Elena Brooks",
        status: "Read",
        rating: 4.1,
        pages: 312,
        height: "medium",
        color: "yellow",
        font: "normal",
        row: 0,
        index: 0,
        genres: ["Science fiction", "Graphic novels"],
        review: "„Сянката на вятъра“ не е просто роман; тя е любовно писмо към самата литература. Историята ни пренася в мъгливата, меланхолична Барселона от първата половина на XX век. Младият Даниел Семпере е отведен от баща си в Гробището на забравените книги – тайно място, където се съхраняват томове, обречени на забвение. Даниел има право да избере една книга и да обещае, че ще я пази с живота си. Изборът му пада върху „Сянката на вятъра“ от мистериозния автор Хулиан Каракс. От този момент нататък животът на момчето се преплита с мрачната и трагична съдба на самия писател.\n" +
            "\n" +
            "Сафон превръща Барселона в жив персонаж. Описанията на сенчестите улички, постоянният дъжд и старинните имения създават готическа, почти хипнотизираща атмосфера. Начинът, по който авторът изгражда мистерията около Каракс, държи читателя в постоянно напрежение, балансирайки между детективски роман и класическа трагедия."
    },

    {
        id: "book-2",
        title: "Ashes of Winter",
        author: "Daniel Hart",
        status: "Reading",
        pages: 1200,
        rating: 4.7,
        height: "high",
        color: "green",
        font: "gothic",
        row: 0,
        index: 1,
        genres: ["History", "Romance"],
        review: "„Дюн“ е основополагащ стълб в научната фантастика, чието влияние може да бъде сравнено само с това на „Властелинът на пръстените“ във фентъзито. Хърбърт създава невероятно сложна и детайлна вселена, управлявана от феодални касти, космически гилдии и религиозни ордени. В центъра на този свят е пустинната планета Аракис (Дюн) – единственият източник на „подправката“, най-ценният ресурс в галактиката, който позволява междузвездното пътуване и удължава човешкия живот.\n" +
            "\n" +
            "Това, което прави „Дюн“ шедьовър, е не просто екшънът или технологичният напредък (който всъщност е съзнателно ограничен в света на Хърбърт), а детайлното изследване на екологията, религията и политиката. Аракис е суров, безмилостен свят, и Хърбърт описва оцеляването на него толкова реалистично, че читателят почти може да усети пясъка между зъбите си и жаждата на героите."
    },

    {
        id: "book-3",
        title: "Moonlight Harbor",
        author: "Sophia Lane",
        status: "Read",
        rating: 3.4,
        pages: 876,
        height: "short",
        color: "red",
        font: "elegant",
        row: 0,
        index: 2,
        genres: ["History", "Romance"],
        review: "Нора Сийд е млада жена, която се чувства напълно провалена. Загубила работата си, котката си, най-добрата си приятелка и брат си (в емоционален смисъл), тя решава, че за никого няма значение дали съществува. В полунощ, на границата между живота и смъртта, Нора се озовава в безкрайна библиотека. Книгите по рафтовете съдържат историите на всички животи, които тя би могла да изживее, ако беше направила други избори – ако не беше се отказала от плуването, ако беше останала с бившия си годеник, ако беше станала рок звезда или учен в Арктика.\n" +
            "\n" +
            "Нора получава шанса да изпробва тези паралелни реалности, за да намери „перфектния“ живот и да задраска всички съжаления от своята „Книга на съжаленията“."
    },

    {
        id: "book-4",
        title: "Forgotten Kingdom",
        author: "Oliver Hayes",
        status: "Read",
        rating: 4.5,
        pages: 524,
        height: "medium",
        color: "blue",
        font: "manuscript",
        row: 0,
        index: 3,
        genres: ["History", "Romance"],
        review: "Действието се развива през 1327 г. в едно уединено и богато бенедиктинско абатство в Северна Италия. Францисканският монах Уилям от Баскервил и неговият млад послушник Адсон от Мелк пристигат в манастира, за да присъстват на важна богословска среща. Престоят им обаче е засенчен от поредица от зловещи и мистериозни убийства на монаси. Уилям, който притежава остър ум, дедуктивни способности (напомнящи за Шерлок Холмс) и познания по наука, е натоварен от абата да разследва случая.\n" +
            "\n" +
            "Еко, който е световноизвестен професор по семиотика (наука за знаците), превръща романа в огромен интелектуален пъзел. Разследването се върти около манастирската библиотека – изключителен лабиринт, в който се съхраняват редки и забранени книги."
    },

    {
        id: "book-5",
        title: "Fragments",
        author: "Mila Carter",
        status: "Reading",
        rating: 3.7,
        pages: 1800,
        height: "high",
        color: "brown",
        font: "typewriter",
        row: 0,
        index: 4
    },

    {
        id: "book-6",
        title: "The Last Lantern",
        author: "Emily Reed",
        height: "short",
        color: "violet",
        font: "creepy",
        row: 0,
        index: 5
    },

    {
        id: "book-7",
        title: "Golden Tides",
        author: "Noah Bennett",
        height: "medium",
        color: "peach",
        font: "normal",
        row: 0,
        index: 6
    },

    {
        id: "book-8",
        title: "Velvet Nights",
        author: "Grace Miller",
        height: "high",
        color: "coral",
        font: "elegant",
        row: 1,
        index: 0
    },

    {
        id: "book-9",
        title: "Echoes Below",
        author: "Lucas Hayes",
        height: "medium",
        color: "cyan",
        font: "typewriter",
        row: 1,
        index: 1
    },

    {
        id: "book-10",
        title: "The Hollow Path",
        author: "Charlotte Green",
        height: "short",
        color: "yellow",
        font: "gothic",
        row: 1,
        index: 2
    },

    {
        id: "book-11",
        title: "Crimson River",
        author: "Henry Brooks",
        height: "high",
        color: "red",
        font: "manuscript",
        row: 1,
        index: 3
    },

    {
        id: "book-12",
        title: "Fading Stars",
        author: "Amelia Stone",
        height: "medium",
        color: "green",
        font: "normal",
        row: 1,
        index: 4
    },

    {
        id: "book-13",
        title: "Paper Wings",
        author: "Jack Turner",
        height: "short",
        color: "blue",
        font: "elegant",
        row: 1,
        index: 5
    },

    {
        id: "book-14",
        title: "The Broken Tower",
        author: "Isabella Moore",
        height: "medium",
        color: "brown",
        font: "gothic",
        row: 1,
        index: 6
    },

    {
        id: "book-15",
        title: "Midnight Bloom",
        author: "Ava Mitchell",
        height: "high",
        color: "violet",
        font: "creepy",
        row: 2,
        index: 0
    },

    {
        id: "book-16",
        title: "Dust and Light",
        author: "Ethan Cole",
        height: "medium",
        color: "peach",
        font: "normal",
        row: 2,
        index: 1
    },

    {
        id: "book-17",
        title: "Whispers",
        author: "Lily Adams",
        height: "short",
        color: "coral",
        font: "manuscript",
        row: 2,
        index: 2
    },

    {
        id: "book-18",
        title: "The Iron Gate",
        author: "James Foster",
        height: "high",
        color: "cyan",
        font: "typewriter",
        row: 2,
        index: 3
    },

    {
        id: "book-19",
        title: "Frostbound",
        author: "Ella Ward",
        height: "medium",
        color: "yellow",
        font: "elegant",
        row: 2,
        index: 4
    },

    {
        id: "book-20",
        title: "The Glass City",
        author: "Benjamin Scott",
        height: "short",
        color: "green",
        font: "normal",
        row: 2,
        index: 5
    },

    // --- Още 10 книги за РЕД 0 (row: 0, индекси от 6 до 15) ---
    { id: "book-22", title: "The Crimson Tide", author: "Clara Thorne", height: "medium", color: "red", font: "normal", row: 0, index: 7 },
    { id: "book-23", title: "Midnight Sun", author: "Marcus Aurel", height: "short", color: "bronze", font: "elegant", row: 0, index: 8 },
    { id: "book-24", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 0, index: 9 },
    { id: "book-25", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 0, index: 10 },
    { id: "book-26", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 0, index: 11 },
    { id: "book-27", title: "Whispers of Wind", author: "Oliver Gale", height: "medium", color: "cyan", font: "normal", row: 0, index: 12 },
    { id: "book-28", title: "Golden Horizon", author: "Aurora Dawn", height: "high", color: "peach", font: "elegant", row: 0, index: 13 },
    { id: "book-29", title: "The Obsidian Key", author: "Damon Knight", height: "short", color: "violet", font: "gothic", row: 0, index: 14 },
    { id: "book-30", title: "Coral Reefs", author: "Marina deep", height: "medium", color: "coral", font: "normal", row: 0, index: 15 },

    { id: "book-71", title: "Echoes of the Past", author: "Julian Vance", height: "high", color: "navy", font: "gothic", row: 0, index: 16 },
    { id: "book-72", title: "The Crimson Tide", author: "Clara Thorne", height: "medium", color: "red", font: "normal", row: 0, index: 17 },
    { id: "book-73", title: "Midnight Sun", author: "Marcus Aurel", height: "short", color: "bronze", font: "elegant", row: 0, index: 18 },
    { id: "book-74", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 0, index: 19 },
    { id: "book-75", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 0, index: 20 },
    { id: "book-76", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 0, index: 21 },
    { id: "book-77", title: "Whispers of Wind", author: "Oliver Gale", height: "medium", color: "cyan", font: "normal", row: 0, index: 22 },
    { id: "book-78", title: "Golden Horizon", author: "Aurora Dawn", height: "high", color: "peach", font: "elegant", row: 0, index: 23 },
    { id: "book-79", title: "The Obsidian Key", author: "Damon Knight", height: "short", color: "violet", font: "gothic", row: 0, index: 24 },
    { id: "book-80", title: "Coral Reefs", author: "Marina deep", height: "medium", color: "coral", font: "normal", row: 0, index: 25 },

    { id: "book-81", title: "Echoes of the Past", author: "Julian Vance", height: "high", color: "navy", font: "gothic", row: 0, index: 26 },
    { id: "book-82", title: "The Crimson Tide", author: "Clara Thorne", height: "medium", color: "red", font: "normal", row: 0, index: 27 },
    { id: "book-83", title: "Midnight Sun", author: "Marcus Aurel", height: "short", color: "bronze", font: "elegant", row: 0, index: 28 },
    { id: "book-84", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 0, index: 29 },
    { id: "book-85", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 0, index: 30 },
    { id: "book-86", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 0, index: 31 },
    { id: "book-87", title: "Whispers of Wind", author: "Oliver Gale", height: "medium", color: "cyan", font: "normal", row: 0, index: 32 },
    { id: "book-88", title: "Golden Horizon", author: "Aurora Dawn", height: "high", color: "peach", font: "elegant", row: 0, index: 33 },
    { id: "book-89", title: "The Obsidian Key", author: "Damon Knight", height: "short", color: "violet", font: "gothic", row: 0, index: 34 },

    // --- РЕД 1 (row: 1) ---
    { id: "book-32", title: "The Iron Crown", author: "Fiona Sterling", height: "medium", color: "bronze", font: "normal", row: 1, index: 7 },
    { id: "book-33", title: "Secrets of the Oasis", author: "Amir Khan", height: "short", color: "yellow", font: "elegant", row: 1, index: 8 },
    { id: "book-34", title: "Deep Blue Sea", author: "Robert Ocean", height: "high", color: "blue", font: "normal", row: 1, index: 9 },
    { id: "book-35", title: "Autumn Leaves", author: "Hazel Wood", height: "medium", color: "brown", font: "elegant", row: 1, index: 10 },
    { id: "book-36", title: "The Neon Grid", author: "Cyborg Rex", height: "short", color: "cyan", font: "gothic", row: 1, index: 11 },
    { id: "book-37", title: "Silent Witness", author: "Rachel Cross", height: "medium", color: "navy", font: "normal", row: 1, index: 12 },
    { id: "book-38", title: "Peachy Keen", author: "Chloe Sweet", height: "short", color: "peach", font: "elegant", row: 1, index: 13 },
    { id: "book-39", title: "The Dragon's Lair", author: "Ignis Fatuus", height: "high", color: "red", font: "gothic", row: 1, index: 14 },
    { id: "book-40", title: "Violet Dreams", author: "Iris Lavender", height: "medium", color: "violet", font: "normal", row: 1, index: 15 },

    // --- РЕД 2 (row: 2) ---
    { id: "book-41", title: "The Emerald Tablet", author: "Hermes Trism", height: "high", color: "green", font: "gothic", row: 2, index: 6 },
    { id: "book-42", title: "Chasing Shadows", author: "Blake Noir", height: "medium", color: "black", font: "normal", row: 2, index: 7 },
    { id: "book-43", title: "Coral Kingdom", author: "Nerida Shore", height: "short", color: "coral", font: "elegant", row: 2, index: 8 },
    { id: "book-44", title: "The Bronze Age", author: "Arthur Pendelton", height: "high", color: "bronze", font: "normal", row: 2, index: 9 },
    { id: "book-45", title: "Skyline", author: "Miles High", height: "medium", color: "blue", font: "elegant", row: 2, index: 10 },
    { id: "book-97", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 2, index: 11 },
    { id: "book-98", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 2, index: 12 },
    { id: "book-99", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 2, index: 13 },
    { id: "book-100", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 2, index: 14 },
    { id: "book-101", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 2, index: 15 },
    { id: "book-102", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 2, index: 16 },
    { id: "book-103", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 2, index: 17 },
    { id: "book-104", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 2, index: 18 },
    { id: "book-105", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 2, index: 19 },
    { id: "book-106", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 2, index: 20 },
    { id: "book-107", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 2, index: 21 },
    { id: "book-108", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 2, index: 22 },


    // --- РЕД 3 (row: 3) ---
    { id: "book-46", title: "The Forgotten Realm", author: "Eldrin Lore", height: "high", color: "navy", font: "gothic", row: 3, index: 0 },
    { id: "book-47", title: "Sunflowers", author: "Vincent Field", height: "medium", color: "yellow", font: "normal", row: 3, index: 1 },
    { id: "book-48", title: "Urban Jungle", author: "Leo Park", height: "short", color: "green", font: "normal", row: 3, index: 2 },
    { id: "book-49", title: "Bloodline", author: "Sanguine V.", height: "high", color: "red", font: "gothic", row: 3, index: 3 },
    { id: "book-50", title: "The Cyber Codex", author: "Ada Byte", height: "medium", color: "cyan", font: "elegant", row: 3, index: 4 },
    { id: "book-51", title: "Dust and Bone", author: "Kemp Bones", height: "short", color: "brown", font: "normal", row: 3, index: 5 },
    { id: "book-52", title: "Twilight Hours", author: "Eve Shade", height: "medium", color: "violet", font: "elegant", row: 3, index: 6 },
    { id: "book-53", title: "The Merchant's Tale", author: "Trade Wind", height: "high", color: "peach", font: "normal", row: 3, index: 7 },
    { id: "book-54", title: "Deep Dark", author: "Vanta Black", height: "short", color: "black", font: "gothic", row: 3, index: 8 },
    { id: "book-55", title: "Coral Symphony", author: "Aria Sea", height: "medium", color: "coral", font: "elegant", row: 3, index: 9 },
    { id: "book-56", title: "Naval History", author: "Admiral Fleet", height: "high", color: "navy", font: "normal", row: 3, index: 10 },
    { id: "book-57", title: "The Bronze Shield", author: "Homer Greek", height: "short", color: "bronze", font: "gothic", row: 3, index: 11 },
    { id: "book-109", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 3, index: 12 },
    { id: "book-110", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 3, index: 13 },
    { id: "book-111", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 3, index: 14 },
    { id: "book-112", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 3, index: 15 },
    { id: "book-113", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 3, index: 16 },
    { id: "book-114", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 3, index: 17 },
    { id: "book-115", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 3, index: 18 },
    { id: "book-116", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 3, index: 19 },
    { id: "book-117", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 3, index: 20 },
    { id: "book-118", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 3, index: 21 },
    { id: "book-119", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 3, index: 22 },


    // --- РЕД 4 (row: 4) ---
    { id: "book-58", title: "Whispering Woods", author: "Silas Green", height: "medium", color: "green", font: "elegant", row: 4, index: 0 },
    { id: "book-59", title: "The Red Planet", author: "Elon Rust", height: "high", color: "red", font: "normal", row: 4, index: 1 },
    { id: "book-60", title: "Electric Dreams", author: "Philip K.", height: "short", color: "cyan", font: "gothic", row: 4, index: 2 },
    { id: "book-61", title: "The Coffee Bean", author: "Arabica Roast", height: "medium", color: "brown", font: "normal", row: 4, index: 3 },
    { id: "book-62", title: "Stormy Seas", author: "Captain Tempest", height: "high", color: "blue", font: "elegant", row: 4, index: 4 },
    { id: "book-63", title: "The Lemon Grove", author: "Citrus Grove", height: "short", color: "yellow", font: "normal", row: 4, index: 5 },
    { id: "book-64", title: "Velvet Nights", author: "Silky Smooth", height: "medium", color: "violet", font: "gothic", row: 4, index: 6 },
    { id: "book-65", title: "Peach Cobbler", author: "Baker Street", height: "high", color: "peach", font: "elegant", row: 4, index: 7 },
    { id: "book-66", title: "The Onyx Tower", author: "Garrison Dark", height: "short", color: "black", font: "normal", row: 4, index: 8 },
    { id: "book-67", title: "Anchor Point", author: "Sailor Blue", height: "medium", color: "navy", font: "gothic", row: 4, index: 9 },
    { id: "book-68", title: "Coral Sunset", author: "Sol Aurora", height: "high", color: "coral", font: "elegant", row: 4, index: 10 },
    { id: "book-69", title: "The Copper Mine", author: "Dusty Miner", height: "short", color: "bronze", font: "normal", row: 4, index: 11 },
    { id: "book-70", title: "Verdant Fields", author: "Gaia Earth", height: "medium", color: "green", font: "elegant", row: 4, index: 12 },


    { id: "book-90", title: "Coral Reefs", author: "Marina deep", height: "medium", color: "coral", font: "normal", row: 5, index: 0 },
    { id: "book-91", title: "Echoes of the Past", author: "Julian Vance", height: "high", color: "navy", font: "gothic", row: 5, index: 1 },

    { id: "book-92", title: "The Crimson Tide", author: "Clara Thorne", height: "medium", color: "red", font: "normal", row: 6, index: 0 },
    { id: "book-93", title: "Midnight Sun", author: "Marcus Aurel", height: "short", color: "bronze", font: "elegant", row: 6, index: 1 },

    { id: "book-94", title: "Shadows in the Mist", author: "Sophia Reed", height: "high", color: "black", font: "normal", row: 7, index: 32 },
    { id: "book-95", title: "The Last Alchemist", author: "Victor Crane", height: "medium", color: "brown", font: "gothic", row: 7, index: 33 },
    { id: "book-96", title: "Starlight Voyage", author: "Diana Moon", height: "short", color: "blue", font: "elegant", row: 7, index: 34 }

];


function setBookModalMode(modal, mode) {
    modal.dataset.mode = mode;
}

function isBookModalInEditMode(modal) {
    return modal.dataset.mode === "edit";
}

function disableBookEditing(modal) {
    const reviewField = modal.querySelector(".book-details--review");

    if (reviewField) {
        reviewField.disabled = true;
    }
}

function clampNumber(value, min, max) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return min;
    }

    return Math.min(Math.max(number, min), max);
}

function bindGenreEdit(modal, book) {
    const editGenresBtn = modal.querySelector("[data-edit-genres]");

    if (!editGenresBtn) return;

    editGenresBtn.onclick = () => {
        openBookGenresModal(book, modal);
    };
}

function openBookGenresModal(book, bookModal) {
    const genresModal = document.querySelector("#book-genres-modal");
    if (!genresModal) return;

    const options = genresModal.querySelectorAll(".genre-option");
    const saveBtn = genresModal.querySelector("[data-genres-save]");
    const cancelBtn = genresModal.querySelector("[data-genres-cancel]");

    let selectedGenres = [...(book.genres || [])];

    options.forEach((option) => {
        const genre = option.textContent.trim();

        option.classList.toggle(
            "genre-option--selected",
            selectedGenres.includes(genre)
        );

        option.onclick = () => {
            const isSelected = selectedGenres.includes(genre);

            if (isSelected) {
                selectedGenres = selectedGenres.filter(item => item !== genre);
                option.classList.remove("genre-option--selected");
            } else {
                selectedGenres.push(genre);
                option.classList.add("genre-option--selected");
            }
        };
    });

    saveBtn.onclick = () => {
        book.genres = selectedGenres;

        renderBookGenres(bookModal, book.genres);

        genresModal.hidden = true;
    };

    cancelBtn.onclick = () => {
        genresModal.hidden = true;
    };

    genresModal.hidden = false;
}

function fillBookEditFields(modal, book) {
    modal.querySelector('input[name="book-title"]').value =
        book.title || "";

    modal.querySelector('input[name="book-author"]').value =
        book.author || "";

    modal.querySelector('input[name="book-rating"]').value =
        book.rating ?? "";

    modal.querySelector('input[name="page-count"]').value =
        book.pages ?? "";

    const status = book.status || "unread";
    const statusInput = modal.querySelector(
        `input[name="book-status"][value="${status.toLowerCase()}"]`
    );

    if (statusInput) {
        statusInput.checked = true;
    }

    const reviewField = modal.querySelector(".book-details--review");
    reviewField.disabled = false;
}

function removeBookFromShelf(book) {
    console.log("Delete:", book);
}


function bindBookModalEditControls(modal, book) {
    const editBtn = modal.querySelector("[data-book-edit]");
    const saveBtn = modal.querySelector("[data-book-save]");
    const cancelBtn = modal.querySelector("[data-book-cancel]");
    const deleteBtn = modal.querySelector("[data-book-delete]");

    if (editBtn) {
        editBtn.onclick = () => {
            setBookModalMode(modal, "edit");
            fillBookEditFields(modal, book);
        };
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            const reviewField = modal.querySelector(".book-details--review");

            reviewField.disabled = true;
            fillBookViewFields(modal, book);
            setBookModalMode(modal, "view");
        };
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            const titleInput = modal.querySelector('input[name="book-title"]');
            const authorInput = modal.querySelector('input[name="book-author"]');
            const ratingInput = modal.querySelector('input[name="book-rating"]');
            const pagesInput = modal.querySelector('input[name="page-count"]');
            const statusInput = modal.querySelector('input[name="book-status"]:checked');
            const reviewField = modal.querySelector(".book-details--review");

            book.title = titleInput.value.trim() || "Untitled";
            book.author = authorInput.value.trim() || "Unknown author";
            book.rating = clampNumber(ratingInput.value, 0, 5);
            book.pages = clampNumber(pagesInput.value, 0, 2000);
            book.status = statusInput ? statusInput.value : "Unread";
            book.review = reviewField.value.trim();

            reviewField.disabled = true;

            fillBookViewFields(modal, book);
            setBookModalMode(modal, "view");
        };
    }


    if (deleteBtn) {
        deleteBtn.onclick = () => {
            openConfirmModal({
                title: "Delete book?",
                description: "This book will be permanently deleted.",
                confirmText: "Delete",
                onConfirm: () => {
                    console.log("Delete book:", book.id);

                    modal.hidden = true;
                }
            });
        };
    }
}


export function getBookStars(rating) {
    const numericRating = Number(rating) || 0;
    const roundedRating = Math.round(numericRating * 2) / 2;

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (roundedRating >= i) {
            stars += "★";
        } else if (roundedRating === i - 0.5) {
            stars += "⯪";
        } else {
            stars += "☆";
        }
    }

    return stars;
}

function renderBookGenres(modal, genres) {
    const genresList = modal.querySelector("#book-content__info--genres .favourite-genres");

    genresList.innerHTML = "";

    if (!genres.length) {
        const emptyGenre = document.createElement("li");
        emptyGenre.className = "favourite-genres__item";
        emptyGenre.textContent = "No genre";
        genresList.appendChild(emptyGenre);
        return;
    }

    genres.forEach((genre) => {
        const item = document.createElement("li");
        item.className = "favourite-genres__item";
        item.textContent = genre;
        genresList.appendChild(item);
    });
}

function renderBookVisuals(modal, book) {
    const heightName = book.height || "medium";
    const fontName = book.font || "normal";
    const colorName = book.color || "yellow";

    const heightText = modal.querySelector("#book-content__visual--height .book-visual-element--option-name");
    const fontText = modal.querySelector("#book-content__visual--font .book-visual-element--option-name");
    const colorPreview = modal.querySelector(".book-color");
    const fontPreview = modal.querySelector("#font");
    const heightImage = modal.querySelector("#height");

    heightText.textContent = capitalize(heightName);
    fontText.textContent = capitalize(fontName);
    fontPreview.textContent = "Abc 123";
    fontPreview.dataset.font = fontName;

    heightImage.src = `assets/images/book-personalisation/height-${heightName}-active.png`;

    colorPreview.dataset.color = colorName;
    colorPreview.style.backgroundColor = getBookColor(colorName);
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getBookColor(color) {
    const colors = {
        black: "#41414D",
        navy: "#4D698B",
        green: "#536B4E",
        bronze: "#A97142",
        red: "#8C2238",
        brown: "#502323",
        blue: "#0078C9",
        violet: "#8196E5",
        cyan: "#1CC1BA",
        yellow: "#FFC529",
        peach: "#FE9784",
        coral: "#FF6F55"
    };

    return colors[color] || colors.yellow;
}


function fillBookViewFields(modal, book) {
    modal.querySelector(".book-content__title").textContent =
        book.title || "Untitled";

    modal.querySelector(".book-content__author").textContent =
        book.author || "Unknown author";

    modal.querySelector("#book-content__info--status .book-details--option").textContent =
        book.status || "Unread";

    modal.querySelector("#book-content__info--pages .book-details--option").textContent =
        book.pages ?? "—";

    modal.querySelector(".book-content__score").textContent =
        `Rate: ${book.rating ?? "0.0"}`;

    modal.querySelector(".book-content__stars").textContent =
        getBookStars(book.rating);

    modal.querySelector(".book-details--review").value =
        book.review || "";

    renderBookGenres(modal, book.genres || []);
    renderBookVisuals(modal, book);
}

export function openBookContentModal(book) {
    const modal = document.querySelector("#book-content-modal");

    if (!modal) return;

    fillBookViewFields(modal, book);
    setBookModalMode(modal, "view");
    bindBookModalEditControls(modal, book);
    bindGenreEdit(modal, book);

    const cancelBtn = modal.querySelector("[data-close]");
    const overlay =
        modal.querySelector(".modal__overlay");

    if (cancelBtn) {
        cancelBtn.onclick = () => {

            if (isBookModalInEditMode(modal)) {
                return;
            }

            modal.hidden = true;
        };
    }

    if (overlay) {
        overlay.onclick = () => {

            if (isBookModalInEditMode(modal)) {
                return;
            }

            modal.hidden = true;
        };
    }

    modal.hidden = false;
}