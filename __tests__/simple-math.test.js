// Simple test that doesn't import anything from the project
describe('Simple Math Tests', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
    expect(2 + 3).toBe(5);
  });

  it('should multiply numbers correctly', () => {
    expect(2 * 3).toBe(6);
    expect(4 * 5).toBe(20);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello';
    const name = 'World';
    expect(`${greeting} ${name}`).toBe('Hello World');
  });

  it('should handle array operations', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers.length).toBe(5);
    expect(numbers.includes(3)).toBe(true);
    expect(numbers.filter(n => n > 3)).toEqual([4, 5]);
  });

  it('should handle object operations', () => {
    const user = { name: 'John', age: 30 };
    expect(user.name).toBe('John');
    expect(user.age).toBe(30);
    expect(Object.keys(user)).toEqual(['name', 'age']);
  });
});
