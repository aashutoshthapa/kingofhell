/*
  # Fix column types for direct ticket values

  1. Column Changes
    - Change `perfect_month` from boolean to integer
    - Change `cwl_performance` from text to integer
    - This allows storing direct ticket values from Google Sheets GHIJ columns

  2. Data Migration
    - Convert existing boolean values: true -> 5, false -> 0
    - Convert existing string values: 'excellent' -> 5, 'good' -> 3, 'average' -> 1, others -> 0
*/

-- Change perfect_month from boolean to integer
ALTER TABLE clan_members 
ALTER COLUMN perfect_month TYPE integer USING 
  CASE 
    WHEN perfect_month = true THEN 5
    WHEN perfect_month = false THEN 0
    ELSE 0
  END;

-- Change cwl_performance from text to integer
ALTER TABLE clan_members 
ALTER COLUMN cwl_performance TYPE integer USING 
  CASE 
    WHEN cwl_performance = 'excellent' THEN 5
    WHEN cwl_performance = 'good' THEN 3
    WHEN cwl_performance = 'average' THEN 1
    ELSE 0
  END;

-- Set default values for new columns
ALTER TABLE clan_members 
ALTER COLUMN perfect_month SET DEFAULT 0,
ALTER COLUMN cwl_performance SET DEFAULT 0; 