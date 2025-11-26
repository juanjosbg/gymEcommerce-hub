-- Seed products with local catalog data used for ProductImages mapping
truncate table public.products;

insert into public.products (id, name, description, price, image_url, category, stock) values
(gen_random_uuid(), 'cbum5peat', 'CBUM Thavage pre-entreno', 10000, null, 'Pre-entrenamiento', 25),
(gen_random_uuid(), 'PEACHBUM', 'Thavage Pre-Workout Peach Bum', 10000, null, 'Pre-entrenamiento', 25),
(gen_random_uuid(), 'VEMON', 'Venom pre-entreno', 199, null, 'Pre-entrenamiento', 25),
(gen_random_uuid(), 'PSYCHOTIC', 'Psychotic pre-entreno', 280, null, 'Pre-Entrenamiento', 25),
(gen_random_uuid(), 'ISO 100', 'Iso 100 proteina', 950, null, 'Proteína', 25),
(gen_random_uuid(), 'CBUM Itholate Protein', 'CBUM proteina aislada', 1250, null, 'Proteína', 25),
(gen_random_uuid(), 'CBUM Itholate Protein Cake', 'CBUM proteina sabor cake', 1250, null, 'Proteína', 25),
(gen_random_uuid(), 'RAW Itholate - Menta Chispas', 'RAW Itholate menta chispas', 900, null, 'Proteína', 25),
(gen_random_uuid(), 'Gold Standard Chocolate', 'Gold Standard isolate chocolate', 1949, null, 'Suplementos', 25),
(gen_random_uuid(), 'Gold Standard - Whey Protein', 'Gold Standard whey protein', 20000, null, 'Proteína', 25),
(gen_random_uuid(), 'Creatine micronized', 'Creatina micronizada', 165, null, 'Suplementos', 25),
(gen_random_uuid(), 'ANINOX', 'Aminox BCAA', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Ryse', 'Ryse suplemento', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Pak', 'Animal Pak', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Muscletech', 'Muscletech suplemento', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Falcon', 'Falcon suplemento', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Bordan', 'Bordan suplemento', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Bcaas & Glutamina', 'Bcaas y glutamina', 145, null, 'Suplementos', 25),
(gen_random_uuid(), 'Modern EAA+', 'Modern EAA aminoacidos', 699, null, 'Aminoácidos', 25),
(gen_random_uuid(), 'Omega-3 90 Softgels', 'Omega 3 softgels', 299, null, 'Omega 3', 25),
(gen_random_uuid(), 'Creatina Monohidratada Birdman 450g', 'Creatina Birdman', 499, null, 'Creatina', 25),
(gen_random_uuid(), 'Creatina Dragon', 'Creatina Dragon Pharma', 749, null, 'Creatina', 25),
(gen_random_uuid(), 'Glutamina + Creatina 600g', 'Glutamina con creatina', 579, null, 'Glutamina', 25);
