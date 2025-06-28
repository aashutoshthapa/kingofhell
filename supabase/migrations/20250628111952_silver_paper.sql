/*
  # Clear all existing clan member data

  1. Changes
    - Delete all existing data from clan_members table
    - This prepares the database for fresh ClashKing API data

  2. Notes
    - Table structure remains unchanged
    - RLS policies remain in place
    - Application will start with empty state until new sync is performed
*/

-- Clear all existing data from clan_members table
DELETE FROM clan_members;