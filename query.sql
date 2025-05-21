ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT auth.role();

CREATE POLICY users_policy ON public.users
FOR ALL
TO public
USING (auth.uid() = id);

SELECT * FROM public.users LIMIT 1;

ALTER TABLE public.users DROP COLUMN id;

-- Jalankan perintah berikut untuk menghapus kolom id sekaligus menghapus semua foreign key yang bergantung padanya:
ALTER TABLE public.users DROP COLUMN id CASCADE;

ALTER TABLE public.users ADD COLUMN id uuid PRIMARY KEY;

ALTER TABLE public.users ADD COLUMN id uuid DEFAULT gen_random_uuid();

UPDATE public.users SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE public.users ADD PRIMARY KEY (id);

SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_name = 'users' 
  AND column_name = 'id';

---mengecek apakah table user masih menjadi foreign key
SELECT conname AS constraint_name
FROM pg_constraint
WHERE conrelid = 'books'::regclass;

SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM
    pg_constraint
WHERE
    conrelid = 'books'::regclass
    AND contype = 'f'; -- Hanya foreign key

ALTER TABLE books
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id);

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books' AND column_name = 'user_id';

ALTER TABLE books
ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;

TRUNCATE books;

ALTER TABLE books
ALTER COLUMN user_id TYPE uuid USING 'a0000000-0000-0000-0000-000000000000'::uuid;

-- Hapus foreign key dulu jika ada
ALTER TABLE books DROP CONSTRAINT IF EXISTS fk_user;

-- Hapus kolom user_id lama
ALTER TABLE books DROP COLUMN user_id;

-- Tambahkan kembali sebagai UUID
ALTER TABLE books ADD COLUMN user_id uuid NOT NULL;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';


SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books' AND column_name = 'user_id';

ALTER TABLE books DROP CONSTRAINT IF EXISTS fk_user;

ALTER TABLE books
ADD CONSTRAINT fk_user FOREIGN KEY (user_id)
REFERENCES auth.users(id);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY books_user_policy ON books
FOR ALL
TO public
USING (user_id = auth.uid());