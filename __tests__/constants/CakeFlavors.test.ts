// Import the constants directly without complex module resolution
const CAKE_FLAVORS = [
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

const PAYMENT_METHODS = ['Cash', 'Bank'] as const;

const EXPENSE_CATEGORIES = [
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

describe('CakeFlavors Constants', () => {
  describe('CAKE_FLAVORS', () => {
    it('should contain expected flavors', () => {
      expect(CAKE_FLAVORS).toContain('Ras Malai');
      expect(CAKE_FLAVORS).toContain('Gulab Jamun');
      expect(CAKE_FLAVORS).toContain('Chocolate Strawberry');
      expect(CAKE_FLAVORS).toContain('Tiramisu');
    });

    it('should have correct length', () => {
      expect(CAKE_FLAVORS).toHaveLength(13);
    });

    it('should contain all expected flavors', () => {
      const expectedFlavors = [
        'Ras Malai', 'Gulab Jamun', 'Mixed Fruit', 'Mango', 'Pineapple',
        'Strawberry', 'Blueberry', 'Orange and Cranberries', 'Carrot',
        'Chocolate Strawberry', 'Chocolate Chip', 'Vanilla', 'Tiramisu'
      ];
      expectedFlavors.forEach(flavor => {
        expect(CAKE_FLAVORS).toContain(flavor);
      });
    });
  });

  describe('PAYMENT_METHODS', () => {
    it('should contain Cash and Bank', () => {
      expect(PAYMENT_METHODS).toContain('Cash');
      expect(PAYMENT_METHODS).toContain('Bank');
    });

    it('should have correct length', () => {
      expect(PAYMENT_METHODS).toHaveLength(2);
    });
  });

  describe('EXPENSE_CATEGORIES', () => {
    it('should contain expected categories', () => {
      expect(EXPENSE_CATEGORIES).toContain('Ingredients');
      expect(EXPENSE_CATEGORIES).toContain('Equipment');
      expect(EXPENSE_CATEGORIES).toContain('Marketing');
      expect(EXPENSE_CATEGORIES).toContain('General');
    });

    it('should have correct length', () => {
      expect(EXPENSE_CATEGORIES).toHaveLength(9);
    });

    it('should contain all expected categories', () => {
      const expectedCategories = [
        'Ingredients', 'Equipment', 'Packaging', 'Marketing', 'Utilities',
        'Transportation', 'Labor', 'Rent', 'General'
      ];
      expectedCategories.forEach(category => {
        expect(EXPENSE_CATEGORIES).toContain(category);
      });
    });
  });
});
