/*
  # Remove sample data from clan_members table

  1. Changes
    - Delete all existing sample data from clan_members table
    - This ensures only real API data from ClashKing will be displayed

  2. Notes
    - The table structure remains unchanged
    - RLS policies remain in place
    - Application will start with empty state until API sync is performed
*/

-- Remove all sample data from clan_members table
DELETE FROM clan_members;