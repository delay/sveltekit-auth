-- Fonction pour initialiser et marquer les produits utilisés
-- 1. Initialise tous les produits à used = false
-- 2. Marque comme used = true les produits liés à un producteur
-- 3. Marque récursivement tous les parents de ces produits

CREATE OR REPLACE FUNCTION public.update_products_used()
RETURNS void AS $$
DECLARE
    affected_rows INTEGER;
    iteration INTEGER := 0;
    max_iterations INTEGER := 100; -- Protection contre les boucles infinies
BEGIN
    -- Étape 1: Initialiser tous les produits à used = false
    UPDATE products SET used = false;
    RAISE NOTICE 'Étape 1: Tous les produits initialisés à used = false';

    -- Étape 2: Marquer comme used = true les produits liés à un producteur
    UPDATE products
    SET used = true
    WHERE id IN (
        SELECT DISTINCT product_id
        FROM producers_products
    );
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RAISE NOTICE 'Étape 2: % produits marqués comme utilisés (liés à des producteurs)', affected_rows;

    -- Étape 3: Marquer récursivement tous les parents
    -- On continue tant qu'on trouve de nouveaux parents à marquer
    LOOP
        iteration := iteration + 1;
        
        -- Marquer les parents des produits déjà marqués comme used
        UPDATE products
        SET used = true
        WHERE id IN (
            SELECT DISTINCT pr.parent_id
            FROM product_relationships pr
            INNER JOIN products p ON pr.child_id = p.id
            WHERE p.used = true
              AND pr.parent_id IS NOT NULL
        )
        AND used = false; -- Seulement les produits pas encore marqués
        
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        RAISE NOTICE 'Étape 3 - Itération %: % parents marqués comme utilisés', iteration, affected_rows;
        
        -- Si aucun nouveau produit n'a été marqué, on arrête
        EXIT WHEN affected_rows = 0;
        
        -- Protection contre les boucles infinies
        IF iteration >= max_iterations THEN
            RAISE WARNING 'Nombre maximum d''itérations atteint (%)', max_iterations;
            EXIT;
        END IF;
    END LOOP;

    RAISE NOTICE 'Fonction terminée après % itérations', iteration;
END;
$$ LANGUAGE plpgsql;

-- Commentaire sur la fonction
COMMENT ON FUNCTION update_products_used() IS 
'Initialise used à false pour tous les produits, puis marque comme used = true les produits liés à un producteur et tous leurs parents de manière récursive';

