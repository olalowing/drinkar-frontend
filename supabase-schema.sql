-- Drinkar Web App - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  alcohol_content DECIMAL(5,2),
  image_url TEXT,
  notes TEXT DEFAULT '',
  systembolaget_number TEXT DEFAULT '',
  has_at_home BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drinks table
CREATE TABLE drinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  glass_type TEXT DEFAULT 'Cocktail',
  serving_type TEXT DEFAULT 'Shaker',
  garnish TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  spritbas TEXT DEFAULT 'Övrigt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drink images table (supports multiple images per drink)
CREATE TABLE drink_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drink ingredients junction table
CREATE TABLE drink_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  amount TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Drink instructions table
CREATE TABLE drink_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
  instruction TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drink tags junction table
CREATE TABLE drink_tags (
  drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (drink_id, tag_id)
);

-- Indexes for better performance
CREATE INDEX idx_drinks_spritbas ON drinks(spritbas);
CREATE INDEX idx_drinks_created_at ON drinks(created_at DESC);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_has_at_home ON ingredients(has_at_home);
CREATE INDEX idx_drink_images_drink_id ON drink_images(drink_id);
CREATE INDEX idx_drink_ingredients_drink_id ON drink_ingredients(drink_id);
CREATE INDEX idx_drink_instructions_drink_id ON drink_instructions(drink_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_drinks_updated_at
  BEFORE UPDATE ON drinks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at
  BEFORE UPDATE ON ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_tags ENABLE ROW LEVEL SECURITY;

-- Public access policies (modify based on your authentication requirements)
-- For now, allowing all operations for public access
CREATE POLICY "Enable read access for all users" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON ingredients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON ingredients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON drinks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON drinks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON drinks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON drinks FOR DELETE USING (true);

CREATE POLICY "Enable all access for all users" ON drink_images FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON drink_ingredients FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON drink_instructions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON tags FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON drink_tags FOR ALL USING (true);

-- Insert sample data
INSERT INTO ingredients (name, category, description, alcohol_content, has_at_home) VALUES
  ('Enkel sockelag', 'syrup', 'Grundläggande sockelag i förhållandet 1:1', NULL, false),
  ('Cointreau', 'liqueur', 'Premium triple sec från Frankrike', 40.0, false),
  ('Färskpressad limejuice', 'juice', 'Nypressad juice från lime', NULL, false);

INSERT INTO drinks (name, description, glass_type, serving_type, garnish, spritbas) VALUES
  ('Gimlet', 'Gimlet kännetecknas av en specifik ingrediens: Rose''s lime juice.', 'Cocktail', 'Shaker', 'Limeskiva', 'Gin');

-- Get the drink ID for Gimlet
DO $$
DECLARE
  gimlet_id UUID;
BEGIN
  SELECT id INTO gimlet_id FROM drinks WHERE name = 'Gimlet';
  
  INSERT INTO drink_ingredients (drink_id, ingredient_name, amount, sort_order) VALUES
    (gimlet_id, 'gin', '6 cl', 0),
    (gimlet_id, 'Rose''s lime juice', '2 cl', 1);
  
  INSERT INTO drink_instructions (drink_id, instruction, sort_order) VALUES
    (gimlet_id, 'Skaka alla ingredienser med is.', 0),
    (gimlet_id, 'Sila upp i ett kylt cocktailglas och garnera.', 1);
END $$;
