-- PostgreSQL version of script_labs

-- Drop tables if exists (untuk keperluan reimport)
DROP TABLE IF EXISTS labs;
DROP TABLE IF EXISTS users;

-- Tabel Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Tabel Labs
CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  user_id INTEGER,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Data untuk tabel users
INSERT INTO users (id, username, password) VALUES
  (4, 'hendri', '$2b$10$3iv/ey.C5bTjC0um0zeqB.dZ/TWGpS1Qstz9QGZwG74IpVVgaIGC2'),
  (5, 'wahyu', '$2b$10$F8geU7ryMcNjrYAKFsyOh.ZrFwtXuITdCSn4OtEQ842qnFsGa2et.'),
  (6, 'budi', '$2b$10$DAS63YHwl3ASaFNAph2XAOp0nykrzn4RPFAXrWJD08Ye0//YOlH9K'),
  (8, 'santi', '$2b$10$puxe3deN8PxKtFhrVtaiRuTVQH4b5EyPXHQCD2wt3y8cAP4G2mZX.');

-- Data untuk tabel labs
INSERT INTO labs (id, title, author, user_id) VALUES
  (14, 'lab menari', 'jojo', 4),
  (15, 'lab mewarnai', 'santi', 4),
  (17, 'bahaso', 'darwin', 4),
  (18, 'lab gambar', 'budiman', 4);

-- Reset sequence (karena id manual dimasukkan)
SELECT setval('users_id_seq', 8, true);
SELECT setval('labs_id_seq', 18, true);


