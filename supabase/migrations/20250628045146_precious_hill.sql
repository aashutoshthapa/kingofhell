/*
  # Create clan members table

  1. New Tables
    - `clan_members`
      - `id` (uuid, primary key)
      - `player_name` (text, not null) - Player's display name
      - `player_tag` (text, unique, not null) - Player's unique tag
      - `discord_handle` (text, nullable) - Discord username
      - `current_trophies` (integer, default 0) - Current trophy count
      - `total_trophies` (integer, default 0) - All-time highest trophies
      - `current_donations` (integer, default 0) - Current season donations
      - `total_donations` (integer, default 0) - All-time donations
      - `clan_games_points` (integer, default 0) - Current clan games points
      - `total_clan_games` (integer, default 0) - All-time clan games points
      - `raid_1_gold` (integer, default 0) - Raid week 1 gold contribution
      - `raid_2_gold` (integer, default 0) - Raid week 2 gold contribution
      - `raid_3_gold` (integer, default 0) - Raid week 3 gold contribution
      - `raid_4_gold` (integer, default 0) - Raid week 4 gold contribution
      - `total_raid_gold` (integer, default 0) - Total raid gold (calculated)
      - `perfect_wars` (integer, default 0) - Number of perfect wars
      - `wars_missed` (integer, default 0) - Number of wars missed
      - `perfect_month` (boolean, default false) - Perfect month achievement
      - `cwl_performance` (text, nullable) - CWL performance notes
      - `trophy_tickets` (integer, default 0) - Tickets from trophies
      - `donation_tickets` (integer, default 0) - Tickets from donations
      - `clan_games_tickets` (integer, default 0) - Tickets from clan games
      - `raid_tickets` (integer, default 0) - Tickets from raids
      - `total_tickets` (integer, default 0) - Total tickets earned
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `clan_members` table
    - Add policy for public read access (for dashboard viewing)
    - Add policy for authenticated users to manage data
*/

CREATE TABLE IF NOT EXISTS clan_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  player_tag text UNIQUE NOT NULL,
  discord_handle text,
  current_trophies integer DEFAULT 0,
  total_trophies integer DEFAULT 0,
  current_donations integer DEFAULT 0,
  total_donations integer DEFAULT 0,
  clan_games_points integer DEFAULT 0,
  total_clan_games integer DEFAULT 0,
  raid_1_gold integer DEFAULT 0,
  raid_2_gold integer DEFAULT 0,
  raid_3_gold integer DEFAULT 0,
  raid_4_gold integer DEFAULT 0,
  total_raid_gold integer DEFAULT 0,
  perfect_wars integer DEFAULT 0,
  wars_missed integer DEFAULT 0,
  perfect_month boolean DEFAULT false,
  cwl_performance text,
  trophy_tickets integer DEFAULT 0,
  donation_tickets integer DEFAULT 0,
  clan_games_tickets integer DEFAULT 0,
  raid_tickets integer DEFAULT 0,
  total_tickets integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access for the dashboard
CREATE POLICY "Anyone can read clan members"
  ON clan_members
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can manage clan members"
  ON clan_members
  FOR ALL
  TO authenticated
  USING (true);

-- Create an index on player_tag for faster lookups
CREATE INDEX IF NOT EXISTS idx_clan_members_player_tag ON clan_members(player_tag);

-- Create an index on total_tickets for faster sorting
CREATE INDEX IF NOT EXISTS idx_clan_members_total_tickets ON clan_members(total_tickets DESC);

-- Insert sample data for demonstration
INSERT INTO clan_members (
  player_name, player_tag, discord_handle, current_trophies, total_trophies, 
  current_donations, total_donations, clan_games_points, total_clan_games,
  raid_1_gold, raid_2_gold, raid_3_gold, raid_4_gold, perfect_wars, wars_missed
) VALUES 
  ('DragonSlayer', '#2PP0Y9GUV', 'dragonslayer#1234', 6100, 6200, 8500, 45000, 4000, 25000, 18000, 16500, 17200, 19000, 12, 0),
  ('ClanMaster', '#2QR8VJCL', 'clanmaster#5678', 5950, 6050, 7200, 38000, 3800, 22000, 15500, 14200, 16800, 17500, 10, 1),
  ('WarriorKing', '#8YGV2CJQ', 'warrior_king#9012', 5850, 5900, 6800, 35000, 3600, 20000, 14000, 15200, 15800, 16200, 8, 2),
  ('MagicArcher', '#L9PRCV8Q', 'magic_archer#3456', 5750, 5800, 5500, 28000, 3200, 18000, 12500, 13800, 14500, 15000, 7, 1),
  ('GiantSlayer', '#2YUL8CRG', 'giant_slayer#7890', 5650, 5700, 4800, 25000, 2800, 16000, 11000, 12500, 13200, 14200, 6, 3),
  ('LightningWiz', '#PLV82GYC', 'lightning_wiz#2345', 5550, 5600, 4200, 22000, 2400, 14000, 9500, 11000, 12000, 13000, 5, 2),
  ('RageBarb', '#8QGY2VJC', 'rage_barb#6789', 5450, 5500, 3800, 20000, 2000, 12000, 8000, 9500, 10500, 11500, 4, 4),
  ('HealerQueen', '#L0V8CRGP', 'healer_queen#0123', 5350, 5400, 3200, 18000, 1600, 10000, 6500, 8000, 9000, 10000, 3, 3),
  ('PekkaKnight', '#2RG8VJPL', 'pekka_knight#4567', 5250, 5300, 2800, 15000, 1200, 8000, 5000, 6500, 7500, 8500, 2, 5),
  ('WizardTower', '#8CJL9PRC', 'wizard_tower#8901', 5150, 5200, 2400, 12000, 800, 6000, 3500, 5000, 6000, 7000, 1, 6);