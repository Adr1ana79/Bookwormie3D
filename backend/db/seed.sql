INSERT INTO profiles (username, email, password_hash) VALUES
  ('ivan_reader', 'ivan.p@example.com', 'hash_secret_123'),
  ('maria_books', 'maria.k@example.com', 'hash_secret_456'),
  ('georgi_tech', 'gogo.g@example.com', 'hash_secret_789'),
  ('elena_fantasy', 'eli.popova@example.com', 'hash_secret_000'),
  ('alex_history', 'alex.h@example.com', 'hash_secret_111'),
  ('kalina_art', 'kalina.v@example.com', 'hash_secret_222');


INSERT INTO profile_settings (profile_id, language, color_mode, receive_newsletter) VALUES
(1, 'en', 'light', TRUE),
(2, 'en', 'dark', FALSE),
(3, 'en', 'dark', TRUE),
(4, 'en', 'light', TRUE),
(5, 'en', 'light', FALSE),
(6, 'en', 'dark', TRUE);


INSERT INTO profile_genres (profile_id, genre_id) VALUES
  (1, 1), (1, 6),
  (2, 9), (2, 8),
  (3, 17), (3, 24),
  (4, 2), (4, 10),
  (5, 3), (5, 15),
  (6, 22), (6, 13);


INSERT INTO sections (section_name) VALUES
-- За Ivan (Sections 1-3)
('Home Library'), ('Office Shelf'), ('Weekend Reads'),
-- За Maria (Sections 4-5)
('Living Room'), ('Bedroom Sanctuary'),
-- За Georgi (Sections 6-8)
('Tech Hub'), ('Startup Resources'), ('Kindle Archive'),
-- За Elena (Sections 9-11)
('Fantasy World'), ('Dark Academy'), ('TBR Pile'),
-- За Alex (Sections 12-14)
('Ancient History'), ('Modern Warfare'), ('Political Science'),
-- За Kalina (Sections 15-16)
('Art Studio'), ('Comics & Manga');

INSERT INTO profile_sections (profile_id, section_id) VALUES
  (1, 1), (1, 2), (1, 3),
  (2, 4), (2, 5),
  (3, 6), (3, 7), (3, 8),
  (4, 9), (4, 10), (4, 11),
  (5, 12), (5, 13), (5, 14),
  (6, 15), (6, 16);


INSERT INTO shelves (section_id, shelf_name, design, size) VALUES

-- === USER 1: IVAN (General Reader) ===
-- Section 1: Home Library
(1, 'All Time Favorites', 'modern', 'standard'),
(1, 'Sci-Fi Collection', 'basic', 'standard'),
(1, 'Thrillers', 'basic', 'standard'),
-- Section 2: Office Shelf
(2, 'Professional Dev', 'basic', 'standard'),
(2, 'References', 'basic', 'mini'),
-- Section 3: Weekend Reads
(3, 'Light Novels', 'bright', 'mini'),

-- === USER 2: MARIA (Romance/Drama) ===
-- Section 4: Living Room
(4, 'Coffee Table Books', 'elegant', 'standard'),
(4, 'Best Sellers 2024', 'bright', 'standard'),
-- Section 5: Bedroom Sanctuary
(5, 'Romance Novels', 'elegant', 'standard'),
(5, 'Poetry', 'basic', 'mini'),
(5, 'Comfort Reads', 'bright', 'mini'),

-- === USER 3: GEORGI (Tech/Business) ===
-- Section 6: Tech Hub
(6, 'Programming (Python)', 'modern', 'standard'),
(6, 'Databases & SQL', 'modern', 'standard'),
(6, 'AI & Machine Learning', 'modern', 'standard'),
-- Section 7: Startup Resources
(7, 'Biographies', 'basic', 'standard'),
(7, 'Marketing Strategy', 'modern', 'mini'),
-- Section 8: Kindle Archive
(8, 'E-books Backup', 'basic', 'mini'),

-- === USER 4: ELENA (Fantasy/Gothic) ===
-- Section 9: Fantasy World
(9, 'Harry Potter Complete', 'gothic', 'standard'),
(9, 'Lord of the Rings', 'gothic', 'standard'),
(9, 'Dragons & Magic', 'gothic', 'standard'),
-- Section 10: Dark Academy
(10, 'Vampire Chronicles', 'gothic', 'standard'),
(10, 'Dystopian Futures', 'modern', 'standard'),
-- Section 11: TBR Pile (To Be Read)
(11, 'Gifts Unread', 'basic', 'mini'),
(11, 'Library Loans', 'basic', 'mini'),

-- === USER 5: ALEX (History/Non-fiction) ===
-- Section 12: Ancient History
(12, 'Rome & Greece', 'elegant', 'standard'),
(12, 'Egyptology', 'elegant', 'standard'),
-- Section 13: Modern Warfare
(13, 'World War I', 'basic', 'standard'),
(13, 'World War II', 'basic', 'standard'),
(13, 'Cold War Era', 'basic', 'mini'),
-- Section 14: Political Science
(14, 'Philosophy', 'elegant', 'standard'),
(14, 'Sociology', 'basic', 'standard'),

-- === USER 6: KALINA (Art/Comics) ===
-- Section 15: Art Studio
(15, 'Master Painters', 'bright', 'standard'),
(15, 'Sketchbooks', 'basic', 'mini'),
(15, 'Color Theory', 'bright', 'mini'),
(15, 'Photography', 'modern', 'standard'),
-- Section 16: Comics & Manga
(16, 'Marvel Collection', 'bright', 'standard'),
(16, 'DC Universe', 'gothic', 'standard'),
(16, 'Manga Series', 'basic', 'mini');
