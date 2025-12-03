-- Migration: Add occasion tags system for filtering drinks
-- This replaces the serving_occasion text field with a proper tagging system

-- =====================================================
-- 1. Create occasion_tags table
-- =====================================================

CREATE TABLE IF NOT EXISTS occasion_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '📅',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_occasion_tags_name ON occasion_tags(name);

-- Enable RLS
ALTER TABLE occasion_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON occasion_tags;
CREATE POLICY "Enable all access for all users" ON occasion_tags FOR ALL USING (true);

-- =====================================================
-- 2. Create drink_occasions junction table
-- =====================================================

CREATE TABLE IF NOT EXISTS drink_occasions (
  drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
  occasion_tag_id UUID REFERENCES occasion_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (drink_id, occasion_tag_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drink_occasions_drink_id ON drink_occasions(drink_id);
CREATE INDEX IF NOT EXISTS idx_drink_occasions_occasion_tag_id ON drink_occasions(occasion_tag_id);

-- Enable RLS
ALTER TABLE drink_occasions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON drink_occasions;
CREATE POLICY "Enable all access for all users" ON drink_occasions FOR ALL USING (true);

-- =====================================================
-- 3. Insert common occasion tags
-- =====================================================

INSERT INTO occasion_tags (name, icon) VALUES
  ('Aperitif', '🍷'),
  ('Digestif', '🥃'),
  ('Sommardrink', '☀️'),
  ('Vinterdrink', '❄️'),
  ('Festdrink', '🎉'),
  ('After work', '🍸'),
  ('Cocktailparty', '🥂'),
  ('Elegant middag', '🍽️'),
  ('Casual', '😎'),
  ('Brunch', '🥞'),
  ('Eftermiddag', '☕'),
  ('Kväll', '🌙'),
  ('Romantisk', '💕'),
  ('Juldrink', '🎄'),
  ('Påskdrink', '🐣')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. Migrate existing serving_occasion data
-- =====================================================

DO $$
DECLARE
  drink_record RECORD;
  occasion_name TEXT;
  occasion_id UUID;
BEGIN
  -- Loop through all drinks with serving_occasion
  FOR drink_record IN
    SELECT id, serving_occasion
    FROM drinks
    WHERE serving_occasion IS NOT NULL
    AND serving_occasion != ''
  LOOP
    -- Split the serving_occasion by comma and process each
    FOR occasion_name IN
      SELECT TRIM(unnest(string_to_array(drink_record.serving_occasion, ',')))
    LOOP
      -- Find or create the occasion tag
      SELECT id INTO occasion_id
      FROM occasion_tags
      WHERE name = occasion_name
      LIMIT 1;

      -- If occasion doesn't exist, create it
      IF occasion_id IS NULL THEN
        INSERT INTO occasion_tags (name, icon)
        VALUES (occasion_name, '📅')
        RETURNING id INTO occasion_id;
      END IF;

      -- Link drink to occasion (ignore if already exists)
      INSERT INTO drink_occasions (drink_id, occasion_tag_id)
      VALUES (drink_record.id, occasion_id)
      ON CONFLICT (drink_id, occasion_tag_id) DO NOTHING;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Migration of serving_occasion data complete';
END $$;

-- =====================================================
-- 5. Optional: Drop the old serving_occasion column
-- =====================================================

-- Uncomment this if you want to remove the old column completely
-- ALTER TABLE drinks DROP COLUMN IF EXISTS serving_occasion;

-- =====================================================
-- Migration complete
-- =====================================================

-- Verify the migration
SELECT
  d.name as drink_name,
  COALESCE(
    string_agg(ot.name, ', ' ORDER BY ot.name),
    'No occasions'
  ) as occasions
FROM drinks d
LEFT JOIN drink_occasions dro ON d.id = dro.drink_id
LEFT JOIN occasion_tags ot ON dro.occasion_tag_id = ot.id
GROUP BY d.id, d.name
ORDER BY d.name;
