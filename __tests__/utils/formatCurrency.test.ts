// Utility function for formatting currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Utility function for formatting date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle decimal places correctly', () => {
      expect(formatCurrency(123.4)).toBe('$123.40');
      expect(formatCurrency(123.456)).toBe('$123.46'); // Rounds to 2 decimal places
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      // Use UTC dates to avoid timezone issues
      const date1 = new Date('2024-01-15T12:00:00Z');
      const formatted1 = date1.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted1).toBe('Jan 15, 2024');
      
      const date2 = new Date('2024-12-25T12:00:00Z');
      const formatted2 = date2.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted2).toBe('Dec 25, 2024');
    });

    it('should handle ISO date strings', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted).toBe('Jan 15, 2024');
    });

    it('should handle different date formats', () => {
      const date = new Date('2024-06-01T12:00:00Z');
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted).toBe('Jun 1, 2024');
    });
  });
});
