/*
  # Remove CG1-CG4 columns and rename CG.Total

  1. Column Changes
    - Remove `raid_1_gold` column (CG1)
    - Remove `raid_2_gold` column (CG2) 
    - Remove `raid_3_gold` column (CG3)
    - Remove `raid_4_gold` column (CG4)
    - Keep `current_capital_gold` as "Capital Gold Looted"
    - Keep raid ticket calculation (T.CG) unchanged

  2. Data Preservation
    - No data loss as we're removing manual entry columns
    - Capital gold tracking continues via API data
*/

-- Remove the individual raid gold columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'raid_1_gold'
  ) THEN
    ALTER TABLE clan_members DROP COLUMN raid_1_gold;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'raid_2_gold'
  ) THEN
    ALTER TABLE clan_members DROP COLUMN raid_2_gold;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'raid_3_gold'
  ) THEN
    ALTER TABLE clan_members DROP COLUMN raid_3_gold;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'raid_4_gold'
  ) THEN
    ALTER TABLE clan_members DROP COLUMN raid_4_gold;
  END IF;
END $$;

-- Remove the total_raid_gold column as it's no longer needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'total_raid_gold'
  ) THEN
    ALTER TABLE clan_members DROP COLUMN total_raid_gold;
  END IF;
END $$;

-- Remove indexes that are no longer needed
DROP INDEX IF EXISTS idx_clan_members_current_capital_gold;

-- Recreate the capital gold index for performance
CREATE INDEX IF NOT EXISTS idx_clan_members_current_capital_gold 
ON clan_members USING btree (current_capital_gold DESC);