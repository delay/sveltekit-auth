-- ============================================
-- RELATIONS HIÉRARCHIQUES DES PRODUITS - VERSION FINALE
-- ============================================
-- 97 relations logiques créées
-- Hiérarchie : Niveau 3 (catégories) → 5 (sous-catégories) → 8 (intermédiaires) → 10+ (produits)

-- Nettoyer
TRUNCATE TABLE product_relationships CASCADE;

-- Ajuster les niveaux hiérarchiques
UPDATE products SET hierarchy_level = 5 WHERE id IN (
    12, 13, 14, 23, 25, 26, 27, 29, 49, 98,  -- Alimentaire
    9, 10, 11, 17, 22, 24, 39, 40, 44, 46,   -- Habillement
    15, 28,                                    -- Métaux
    31, 32, 33, 64,                           -- Bois
    16, 21, 38, 41, 43, 47,                   -- Pierre
    61, 62, 71,                                -- Beauté
    34                                         -- Electronique
);

UPDATE products SET hierarchy_level = 8 WHERE id IN (
    66, 57, 58, 54, 70, 86, 74  -- Produits intermédiaires avec enfants
);

-- Créer les relations
INSERT INTO product_relationships (parent_id, child_id, relationship_type) VALUES
-- ALIMENTAIRE (3 → 5)
(7, 12, 'category'), (7, 13, 'category'), (7, 14, 'category'), (7, 23, 'category'),
(7, 25, 'category'), (7, 26, 'category'), (7, 27, 'category'), (7, 29, 'category'),
(7, 30, 'category'), (7, 35, 'category'), (7, 42, 'category'), (7, 49, 'category'),
(7, 50, 'category'), (7, 18, 'category'), (7, 19, 'category'), (7, 20, 'category'), (7, 98, 'category'),
-- Légumes (5 → 10)
(12, 36, 'variant'), (12, 37, 'variant'), (12, 69, 'variant'),
-- Fruits (5 → 8/10)
(13, 66, 'variant'), (13, 102, 'variant'),
(66, 76, 'variant'), (66, 77, 'variant'), (66, 78, 'variant'),
-- Viande (5 → 8 → 10+)
(14, 57, 'variant'), (14, 58, 'variant'), (14, 59, 'variant'), (14, 86, 'variant'), (14, 87, 'variant'),
(58, 101, 'variant'), (57, 103, 'variant'), (86, 95, 'variant'),
-- Céréales (5 → 10)
(23, 19, 'variant'), (23, 73, 'variant'), (23, 60, 'variant'),
-- Alcohol (5 → 8 → 10)
(26, 54, 'variant'), (26, 55, 'variant'), (26, 56, 'variant'),
(54, 79, 'variant'),
-- Produits laitiers (5 → 8 → 10)
(27, 63, 'variant'), (27, 68, 'variant'), (27, 70, 'variant'),
(70, 93, 'variant'),
-- Sucreries (5 → 10)
(29, 30, 'variant'), (29, 65, 'variant'),
-- Epices (5 → 10)
(49, 48, 'variant'), (49, 82, 'variant'), (49, 85, 'variant'), (49, 88, 'variant'), (49, 90, 'variant'),
-- Huile (5 → 10)
(98, 99, 'variant'), (98, 100, 'variant'),
-- HABILLEMENT (3 → 5 → 10)
(6, 9, 'category'), (6, 10, 'category'), (6, 11, 'category'), (6, 17, 'category'),
(6, 22, 'category'), (6, 24, 'category'), (6, 39, 'category'), (6, 44, 'category'),
(6, 46, 'category'), (6, 40, 'category'),
(17, 81, 'variant'), (17, 84, 'variant'),
(22, 94, 'variant'),
(44, 45, 'variant'), (44, 72, 'variant'),
(46, 97, 'variant'), (46, 52, 'variant'),
-- MÉTAUX (3 → 5 → 8 → 10)
(1, 15, 'category'), (1, 28, 'category'),
(15, 74, 'variant'),
(28, 51, 'variant'), (28, 53, 'variant'), (28, 67, 'variant'),
(74, 96, 'variant'),
-- BOIS (3 → 5 → 10)
(4, 31, 'category'), (4, 33, 'category'), (4, 32, 'category'), (4, 64, 'category'),
(32, 83, 'variant'), (32, 89, 'variant'), (32, 91, 'variant'),
-- PIERRE (3 → 5 → 10)
(5, 38, 'category'), (5, 21, 'category'), (5, 41, 'category'), (5, 43, 'category'),
(5, 47, 'category'), (5, 16, 'category'),
(38, 80, 'variant'), (38, 92, 'variant'),
(43, 75, 'variant'),
-- BEAUTÉ (3 → 5)
(3, 71, 'category'), (3, 61, 'category'), (3, 62, 'category'),
-- ELECTRONIQUE (3 → 5)
(8, 34, 'category');
