-- Migration: Changer la clé primaire de producers de TEXT vers INTEGER auto-increment
-- Date: 2025-10-13
-- Description: Cette migration transforme l'ID de la table producers d'un UUID (TEXT) 
--              vers un entier auto-increment (SERIAL) pour simplifier la gestion

-- ============================================
-- ÉTAPE 1: Créer une colonne temporaire pour le nouvel ID
-- ============================================

-- Ajouter une nouvelle colonne id_new de type SERIAL
ALTER TABLE producers ADD COLUMN id_new SERIAL;

-- ============================================
-- ÉTAPE 2: Créer une table de mapping pour la migration
-- ============================================

-- Table temporaire pour mapper les anciens IDs vers les nouveaux
CREATE TEMP TABLE producer_id_mapping AS
SELECT id AS old_id, id_new AS new_id
FROM producers;

-- ============================================
-- ÉTAPE 3: Mettre à jour la table users
-- ============================================

-- Ajouter une colonne temporaire pour le nouveau producer_id
ALTER TABLE users ADD COLUMN producer_id_new INTEGER;

-- Mettre à jour avec les nouveaux IDs
UPDATE users u
SET producer_id_new = m.new_id
FROM producer_id_mapping m
WHERE u.producer_id = m.old_id;

-- ============================================
-- ÉTAPE 4: Mettre à jour la table producers_products
-- ============================================

-- Ajouter une colonne temporaire pour le nouveau producer_id
ALTER TABLE producers_products ADD COLUMN producer_id_new INTEGER;

-- Mettre à jour avec les nouveaux IDs
UPDATE producers_products pp
SET producer_id_new = m.new_id
FROM producer_id_mapping m
WHERE pp.producer_id = m.old_id;

-- ============================================
-- ÉTAPE 5: Supprimer les anciennes contraintes et colonnes
-- ============================================

-- Supprimer la contrainte de clé étrangère dans users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_producer_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_producer_id_unique;

-- Supprimer la contrainte de clé étrangère dans producers_products
ALTER TABLE producers_products DROP CONSTRAINT IF EXISTS producer_id_fk;

-- Supprimer la contrainte de clé primaire dans producers
ALTER TABLE producers DROP CONSTRAINT IF EXISTS producers_pkey;

-- Supprimer les anciennes colonnes
ALTER TABLE users DROP COLUMN producer_id;
ALTER TABLE producers_products DROP COLUMN producer_id;
ALTER TABLE producers DROP COLUMN id;

-- ============================================
-- ÉTAPE 6: Renommer les nouvelles colonnes
-- ============================================

-- Renommer les colonnes temporaires
ALTER TABLE producers RENAME COLUMN id_new TO id;
ALTER TABLE users RENAME COLUMN producer_id_new TO producer_id;
ALTER TABLE producers_products RENAME COLUMN producer_id_new TO producer_id;

-- ============================================
-- ÉTAPE 7: Recréer les contraintes
-- ============================================

-- Recréer la clé primaire sur producers
ALTER TABLE producers ADD PRIMARY KEY (id);

-- Recréer la contrainte unique sur users.producer_id
ALTER TABLE users ADD CONSTRAINT users_producer_id_unique UNIQUE (producer_id);

-- Recréer la contrainte de clé étrangère dans users
ALTER TABLE users ADD CONSTRAINT users_producer_id_fkey 
    FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE;

-- Recréer la contrainte de clé étrangère dans producers_products
ALTER TABLE producers_products ADD CONSTRAINT producer_id_fk 
    FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE;

-- ============================================
-- ÉTAPE 8: Vérifications
-- ============================================

-- Vérifier que toutes les données ont été migrées correctement
DO $$
DECLARE
    user_count INTEGER;
    producer_product_count INTEGER;
BEGIN
    -- Vérifier que tous les users ont un producer_id valide
    SELECT COUNT(*) INTO user_count
    FROM users u
    LEFT JOIN producers p ON u.producer_id = p.id
    WHERE u.producer_id IS NOT NULL AND p.id IS NULL;
    
    IF user_count > 0 THEN
        RAISE EXCEPTION 'Migration échouée: % users ont un producer_id invalide', user_count;
    END IF;
    
    -- Vérifier que tous les producers_products ont un producer_id valide
    SELECT COUNT(*) INTO producer_product_count
    FROM producers_products pp
    LEFT JOIN producers p ON pp.producer_id = p.id
    WHERE pp.producer_id IS NOT NULL AND p.id IS NULL;
    
    IF producer_product_count > 0 THEN
        RAISE EXCEPTION 'Migration échouée: % producers_products ont un producer_id invalide', producer_product_count;
    END IF;
    
    RAISE NOTICE 'Migration réussie! Tous les IDs ont été migrés correctement.';
END $$;

-- ============================================
-- RÉSUMÉ DE LA MIGRATION
-- ============================================
-- 1. Colonne producers.id: TEXT → INTEGER (SERIAL)
-- 2. Colonne users.producer_id: TEXT → INTEGER
-- 3. Colonne producers_products.producer_id: TEXT → INTEGER
-- 4. Toutes les contraintes ont été recréées
-- 5. Les données ont été préservées avec un mapping automatique

