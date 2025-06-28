/*
  # Add monthly tracking fields for donations and capital gold

  1. New Columns
    - `current_capital_gold` (integer, default 0) - Current month capital gold contribution
    - `current_clan_games` (integer, default 0) - Current month clan games points
    - `total_donations_achievement` (bigint, default 0) - Total from "Friend in Need" achievement
    - `total_capital_gold_achievement` (bigint, default 0) - Total from "Aggressive Capitalism" achievement  
    - `total_clan_games_achievement` (bigint, default 0) - Total from "Games Champion" achievement
    - `last_reset_donations` (bigint, default 0) - Donation total at last reset
    - `last_reset_capital_gold` (bigint, default 0) - Capital gold total at last reset
    - `last_reset_clan_games` (bigint, default 0) - Clan games total at last reset
    - `last_reset_date` (timestamptz, default now()) - Date of last monthly reset

  2. Changes
    - These fields enable monthly tracking with automatic reset functionality
    - Current month values = Total achievement value - Last reset value
*/

-- Add new columns for monthly tracking
DO $$
BEGIN
  -- Current month values
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'current_capital_gold'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN current_capital_gold integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'current_clan_games'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN current_clan_games integer DEFAULT 0;
  END IF;

  -- Total achievement values (for reset calculation)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'total_donations_achievement'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN total_donations_achievement bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'total_capital_gold_achievement'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN total_capital_gold_achievement bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'total_clan_games_achievement'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN total_clan_games_achievement bigint DEFAULT 0;
  END IF;

  -- Reset tracking values
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'last_reset_donations'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN last_reset_donations bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'last_reset_capital_gold'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN last_reset_capital_gold bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'last_reset_clan_games'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN last_reset_clan_games bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'last_reset_date'
  ) THEN
    ALTER TABLE clan_members ADD COLUMN last_reset_date timestamptz DEFAULT now();
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clan_members_last_reset_date ON clan_members(last_reset_date);
CREATE INDEX IF NOT EXISTS idx_clan_members_current_donations ON clan_members(current_donations DESC);
CREATE INDEX IF NOT EXISTS idx_clan_members_current_capital_gold ON clan_members(current_capital_gold DESC);