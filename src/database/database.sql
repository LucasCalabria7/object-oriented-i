-- Active: 1675082494038@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime'))
);

INSERT INTO videos (id, title, duration)
VALUES("v001", "Choque da uva", 200),
("v002", "Tião do berranteiro", 400),
("v003", "Japones e a cunhada", 300);

