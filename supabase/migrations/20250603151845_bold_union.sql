/*
  # Initial Schema Setup

  1. New Tables
    - `schemas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `schema_content` (text)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    
    - `summaries`
      - `id` (uuid, primary key)
      - `schema_id` (uuid, references schemas)
      - `summary_content` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create schemas table
CREATE TABLE IF NOT EXISTS schemas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  schema_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_id uuid REFERENCES schemas(id) ON DELETE CASCADE NOT NULL,
  summary_content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for schemas
CREATE POLICY "Users can create their own schemas"
  ON schemas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own schemas"
  ON schemas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own schemas"
  ON schemas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schemas"
  ON schemas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for summaries
CREATE POLICY "Users can view summaries of their schemas"
  ON summaries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM schemas
      WHERE schemas.id = summaries.schema_id
      AND schemas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create summaries for their schemas"
  ON summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM schemas
      WHERE schemas.id = schema_id
      AND schemas.user_id = auth.uid()
    )
  );

-- Create updated_at trigger for schemas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schemas_updated_at
  BEFORE UPDATE ON schemas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();