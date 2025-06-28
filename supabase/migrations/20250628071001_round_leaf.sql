/*
  # Fix RLS policies for clan_members table

  1. Security Updates
    - Add policy to allow anonymous users to insert new clan members
    - Add policy to allow anonymous users to update existing clan members
    - Keep existing read policy for public access
    - Keep existing authenticated user policy for full access

  2. Changes
    - Allow INSERT operations for anon role
    - Allow UPDATE operations for anon role
    - This enables the ClashKing API sync functionality to work properly
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can read clan members" ON clan_members;
DROP POLICY IF EXISTS "Authenticated users can manage clan members" ON clan_members;

-- Allow public read access
CREATE POLICY "Anyone can read clan members"
  ON clan_members
  FOR SELECT
  TO public
  USING (true);

-- Allow anonymous users to insert new clan members (for API sync)
CREATE POLICY "Allow anon insert clan members"
  ON clan_members
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update existing clan members (for API sync)
CREATE POLICY "Allow anon update clan members"
  ON clan_members
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can manage clan members"
  ON clan_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);