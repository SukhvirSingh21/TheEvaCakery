export const CAKE_FLAVORS = [
  'Ras Malai',
  'Gulab Jamun',
  'Mixed Fruit',
  'Mango',
  'Pineapple',
  'Strawberry',
  'Blueberry',
  'Orange and Cranberries',
  'Carrot',
  'Chocolate Strawberry',
  'Chocolate Chip',
  'Vanilla',
  'Tiramisu',
] as const;

export type CakeFlavor = typeof CAKE_FLAVORS[number];

export const PAYMENT_METHODS = ['Cash', 'Bank'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const EXPENSE_CATEGORIES = [
  'Ingredients',
  'Equipment',
  'Packaging',
  'Marketing',
  'Utilities',
  'Transportation',
  'Labor',
  'Rent',
  'General',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];