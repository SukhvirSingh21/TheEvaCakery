/*
  # Add user authentication and multi-item sales system

  1. New Tables
    - `sales` - Main sales record with user association
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `sale_date` (date)
      - `total_amount` (numeric)
      - `payment_method` (text: 'Cash' or 'Bank')
      - `notes` (text, optional)
    
    - `sale_items` - Individual items in each sale
      - `id` (uuid, primary key)
      - `sale_id` (uuid, references sales)
      - `item_type` (text: 'Cake' or 'Cupcake')
      - `flavor` (text)
      - `quantity` (integer)
      - `price_per_item` (numeric)
      - `subtotal` (numeric)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own sales and sale items
    - Authenticated users only

  3. Constraints
    - Ensure positive quantities and prices
    - Valid item types and payment methods
*/

-- Drop existing sales table if it exists
DROP TABLE IF EXISTS sales CASCADE;

-- Create main sales table with user association
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  sale_date date NOT NULL,
  total_amount numeric(10,2) NOT NULL CHECK (total_amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('Cash', 'Bank')),
  notes text
);

-- Create sale items table for multiple items per sale
CREATE TABLE sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('Cake', 'Cupcake')),
  flavor text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_per_item numeric(10,2) NOT NULL CHECK (price_per_item > 0),
  subtotal numeric(10,2) NOT NULL CHECK (subtotal > 0)
);

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Sales policies - users can only access their own sales
CREATE POLICY "Users can view own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
  ON sales
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
  ON sales
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sale items policies - users can only access items from their own sales
CREATE POLICY "Users can view own sale items"
  ON sale_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND sales.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sale items"
  ON sale_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND sales.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sale items"
  ON sale_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND sales.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sale items"
  ON sale_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND sales.user_id = auth.uid()
    )
  );