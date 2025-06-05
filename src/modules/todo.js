import { isValid, parseISO } from 'date-fns';

export const Todo = (title, description, dueDate, priority, notes = '', checklist = []) => {
  // Validação
  if (!title || title.trim() === '') throw new Error('Title is required');
  if (!description || description.trim() === '') throw new Error('Description is required');
  if (!dueDate || !isValid(parseISO(dueDate))) throw new Error('Valid due date is required');
  if (!['Low', 'Medium', 'High'].includes(priority)) throw new Error('Invalid priority');

  const todo = {
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
    isCompleted: false, // Inicializa como propriedade do objeto
  };

  todo.toggleComplete = function () {
    this.isCompleted = !this.isCompleted; // Modifica a propriedade do objeto
  };

  return todo;
};


