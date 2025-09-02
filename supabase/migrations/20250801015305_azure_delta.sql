/*
  # Create sales table for cake bakery tracker

  1. New Tables
    - `sales`
      - `id` (uuid, primary key) - Unique identifier for each sale
      - `created_at` (timestamptz) - When the record was created
      - `sale_date` (date) - Date when the cake was sold
      - `cake_flavor` (text) - Flavor of the cake sold
      - `quantity` (integer) - Number of cakes sold
      - `price_per_cake` (numeric) - Price per individual cake
      - `total_amount` (numeric) - Total amount for the sale
      - `payment_method` (text) - Payment method (Cash or Bank)
      - `notes` (text, optional) - Additional notes about the sale

  2. Security
    - Enable RLS on `sales` table
    - Add policy for public access (no authentication required)

  3. Constraints
    - Ensure quantity is positive
    - Ensure price_per_cake is positive
    - Ensure total_amount is positive
    - Restrict payment_method to valid values
*/

CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  sale_date date NOT NULL,
  cake_flavor text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_per_cake numeric(10,2) NOT NULL CHECK (price_per_cake > 0),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('Cash', 'Bank')),
  notes text
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to sales"
  ON sales
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);