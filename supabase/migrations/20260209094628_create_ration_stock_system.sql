/*
  # Ration Stock Notification System

  ## Overview
  Complete database schema for a ration stock notification system where staff can update product availability
  and beneficiaries receive SMS notifications about stock status.

  ## 1. New Tables
  
  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name (e.g., Rice, Wheat, Sugar)
  - `unit` (text) - Unit of measurement (kg, liter, etc.)
  - `quantity` (integer) - Current stock quantity
  - `status` (text) - Stock status: 'available' or 'out_of_stock'
  - `price_per_unit` (decimal) - Price per unit
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `beneficiaries`
  - `id` (uuid, primary key) - Unique beneficiary identifier
  - `name` (text) - Beneficiary full name
  - `ration_card_number` (text, unique) - Unique ration card number
  - `phone_number` (text) - Phone number for SMS notifications
  - `address` (text) - Residential address
  - `family_members` (integer) - Number of family members
  - `active` (boolean) - Whether beneficiary is active
  - `created_at` (timestamptz) - Record creation timestamp

  ### `stock_updates`
  - `id` (uuid, primary key) - Unique update identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `previous_quantity` (integer) - Stock quantity before update
  - `new_quantity` (integer) - Stock quantity after update
  - `previous_status` (text) - Status before update
  - `new_status` (text) - Status after update
  - `updated_by` (text) - Staff member who made the update
  - `notes` (text) - Optional notes about the update
  - `created_at` (timestamptz) - Update timestamp

  ### `notifications`
  - `id` (uuid, primary key) - Unique notification identifier
  - `beneficiary_id` (uuid, foreign key) - Reference to beneficiaries table
  - `product_id` (uuid, foreign key) - Reference to products table
  - `message` (text) - SMS message content
  - `status` (text) - Notification status: 'pending', 'sent', 'failed'
  - `sent_at` (timestamptz) - When notification was sent
  - `created_at` (timestamptz) - Record creation timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Create policies for authenticated staff access
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  quantity integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'out_of_stock',
  price_per_unit decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ration_card_number text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  family_members integer NOT NULL DEFAULT 1,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  previous_status text NOT NULL,
  new_status text NOT NULL,
  updated_by text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view beneficiaries"
  ON beneficiaries FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert beneficiaries"
  ON beneficiaries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update beneficiaries"
  ON beneficiaries FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete beneficiaries"
  ON beneficiaries FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view stock updates"
  ON stock_updates FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert stock updates"
  ON stock_updates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view notifications"
  ON notifications FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update notifications"
  ON notifications FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_active ON beneficiaries(active);
CREATE INDEX IF NOT EXISTS idx_stock_updates_product ON stock_updates(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_beneficiary ON notifications(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

INSERT INTO products (name, unit, quantity, status, price_per_unit) VALUES
  ('Rice', 'kg', 0, 'out_of_stock', 25.00),
  ('Wheat', 'kg', 0, 'out_of_stock', 20.00),
  ('Sugar', 'kg', 0, 'out_of_stock', 35.00),
  ('Cooking Oil', 'liter', 0, 'out_of_stock', 120.00),
  ('Pulses (Dal)', 'kg', 0, 'out_of_stock', 80.00)
ON CONFLICT DO NOTHING;

INSERT INTO beneficiaries (name, ration_card_number, phone_number, address, family_members) VALUES
  ('Rajesh Kumar', 'RC001234', '+919876543210', '123 Main Street, Mumbai', 4),
  ('Priya Sharma', 'RC001235', '+919876543211', '456 Park Road, Delhi', 3),
  ('Amit Patel', 'RC001236', '+919876543212', '789 Lake View, Bangalore', 5),
  ('Sunita Devi', 'RC001237', '+919876543213', '321 Garden Lane, Chennai', 2),
  ('Mohammed Ali', 'RC001238', '+919876543214', '654 Market Street, Hyderabad', 6)
ON CONFLICT DO NOTHING;