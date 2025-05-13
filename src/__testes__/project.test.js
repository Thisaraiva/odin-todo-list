import { Project, ProjectManager } from '../modules/project';
import { Todo } from '../modules/todo';

describe('Project', () => {
  let project;

  beforeEach(() => {
    project = Project('Test Project');
  });

  test('should add and retrieve todos', () => {
    const todo = Todo('Test', 'Description', '2025-05-15', 'Low');
    project.addTodo(todo);
    expect(project.getTodos()).toContain(todo);
  });

  test('should remove todo by index', () => {
    const todo = Todo('Test', 'Description', '2025-05-15', 'Low');
    project.addTodo(todo);
    project.removeTodo(0);
    expect(project.getTodos()).toEqual([]);
  });

  test('should filter todos by priority', () => {
    const todo1 = Todo('Test1', 'Desc1', '2025-05-15', 'Low');
    const todo2 = Todo('Test2', 'Desc2', '2025-05-16', 'High');
    project.addTodo(todo1);
    project.addTodo(todo2);
    expect(project.getTodos('low')).toEqual([todo1]);
    expect(project.getTodos('high')).toEqual([todo2]);
  });

  test('should sort todos by date', () => {
    const todo1 = Todo('Test1', 'Desc1', '2025-05-15', 'Low');
    const todo2 = Todo('Test2', 'Desc2', '2025-05-10', 'High');
    project.addTodo(todo1);
    project.addTodo(todo2);
    expect(project.getTodos('all', 'asc')[0]).toBe(todo2);
    expect(project.getTodos('all', 'desc')[0]).toBe(todo1);
  });
});

describe('ProjectManager', () => {
  test('should add and retrieve projects', () => {
    const manager = ProjectManager();
    const project = Project('New Project');
    manager.addProject(project);
    expect(manager.getProjects()).toContain(project);
  });

  test('should not remove default project', () => {
    const manager = ProjectManager();
    manager.removeProject(0);
    expect(manager.getProjects()[0].name).toBe('Default');
  });

  test('should throw error for empty project name', () => {
    const manager = ProjectManager();
    expect(() => manager.addProject(Project(''))).toThrow('Project name is required');
  });
});