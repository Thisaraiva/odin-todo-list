import { Todo } from '../modules/todo';

describe('Todo', () => {
  test('should create a todo with valid properties', () => {
    const todo = Todo('Test', 'Description', '2025-05-15', 'Low', 'Notes', ['Item1']);
    expect(todo.title).toBe('Test');
    expect(todo.description).toBe('Description');
    expect(todo.dueDate).toBe('2025-05-15');
    expect(todo.priority).toBe('Low');
    expect(todo.notes).toBe('Notes');
    expect(todo.checklist).toEqual(['Item1']);
    expect(todo.isCompleted).toBe(false);
  });

  test('should throw error for missing title', () => {
    expect(() => Todo('', 'Description', '2025-05-15', 'Low')).toThrow('Title is required');
  });

  test('should throw error for invalid due date', () => {
    expect(() => Todo('Test', 'Description', 'invalid-date', 'Low')).toThrow('Valid due date is required');
  });

  test('should throw error for invalid priority', () => {
    expect(() => Todo('Test', 'Description', '2025-05-15', 'Invalid')).toThrow('Invalid priority');
  });

  test('should toggle completion status', () => {
    const todo = Todo('Test', 'Description', '2025-05-15', 'Low');
    todo.toggleComplete();
    expect(todo.isCompleted).toBe(true);
    todo.toggleComplete();
    expect(todo.isCompleted).toBe(false);
  });
});