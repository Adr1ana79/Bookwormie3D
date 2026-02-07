-- Profile -- 
CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    -- profile_image_url VARCHAR(255),

    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_networks (
    id SERIAL PRIMARY KEY,
    network_name VARCHAR(50) UNIQUE
);

INSERT INTO social_networks (network_name)
VALUES
    ('Instagram'),
    ('Goodreads'),
    ('Facebook'),
    ('LinkedIn'),
    ('Pinterest');


CREATE TABLE profile_social_networks (
     id SERIAL PRIMARY KEY,
     profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
     social_network_id INT REFERENCES social_networks(id),
     profile_name VARCHAR(100),
     UNIQUE(profile_id, social_network_id)
);

-- genres --

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    genre_name_en VARCHAR(50) UNIQUE,
    genre_name_bg VARCHAR(50) UNIQUE
);

INSERT INTO genres (genre_name_en, genre_name_bg) VALUES
    ('Science Fiction', 'Фантастика'),
    ('Fantasy', 'Фентъзи'),
    ('History', 'История'),
    ('Adventure', 'Приключенски'),
    ('Mystery', 'Мистерия'),
    ('Thriller', 'Трилър'),
    ('Crime', 'Криминален'),
    ('Drama', 'Драма'),
    ('Romance', 'Романтика'),
    ('Dystopia', 'Дистопия'),
    ('Horror', 'Хорър'),
    ('Satire', 'Сатира'),
    ('Graphic Novel', 'Графичен роман'),
    ('Biographies and Autobiographies', 'Биографии и автобиографии'),
    ('Historical Fiction', 'Историческа фантастика'),
    ('Nonfiction', 'Публицистика'),
    ('Science and Technology', 'Наука и технологии'),
    ('Philosophy', 'Философия'),
    ('Psychology', 'Психология'),
    ('Sociology', 'Социология'),
    ('Education', 'Образование'),
    ('Art and Culture', 'Изкуство и култура'),
    ('Religion and Spirituality', 'Религия и духовност'),
    ('Business and Economics', 'Бизнес и икономика');


CREATE TABLE profile_genres (
    profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id),
    PRIMARY KEY(profile_id, genre_id)
);

-- Settings --

CREATE TYPE color_mode AS ENUM ('light', 'dark', 'black-white');
CREATE TYPE language AS ENUM ('bg','en');

CREATE TABLE profile_settings (
    profile_id INT PRIMARY KEY REFERENCES profiles(id),

    language language DEFAULT 'en',
    color_mode color_mode DEFAULT 'light',

    -- quick_create_book_default_parameters BOOLEAN DEFAULT TRUE,
    -- deleting_book_current_bookshelf_without_asking BOOLEAN DEFAULT FALSE,
    -- quick_create_shelf_default_parameters BOOLEAN DEFAULT TRUE,

    receive_newsletter BOOLEAN DEFAULT FALSE
);

-- Section --

CREATE TYPE sorting AS ENUM ('A-Z', 'Z-A', 'date-from-newest', 'date-from-oldest');

CREATE TABLE sections(
    id SERIAL PRIMARY KEY,

    section_name VARCHAR(50),
    sorting sorting DEFAULT 'date-from-oldest',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile_sections(
    profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    section_id INT REFERENCES sections(id),
    PRIMARY KEY(profile_id, section_id)
);

-- Shelves --

CREATE TYPE design AS ENUM ('basic', 'bright', 'elegant', 'modern', 'gothic');
CREATE TYPE size AS ENUM ('standard', 'mini');

CREATE TABLE shelves (
     id SERIAL PRIMARY KEY,
     section_id INT REFERENCES sections(id) ON DELETE CASCADE, -- Връзка към секция
     shelf_name VARCHAR(50),
     design design DEFAULT 'basic',
     size size DEFAULT 'standard',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);