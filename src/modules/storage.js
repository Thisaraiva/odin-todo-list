import { Project, ProjectManager } from './project';
import { Todo } from './todo';

export const Storage = () => {
  const saveProjects = (projects) => {
    // Filtra duplicatas mantendo o primeiro "Default" e projetos únicos
    const uniqueProjects = projects.filter((proj, index, self) =>
      index === self.findIndex(p => p.name.toLowerCase() === proj.name.toLowerCase())
    );
    localStorage.setItem('projects', JSON.stringify(uniqueProjects));
  };

  const loadProjects = () => {
    const data = localStorage.getItem('projects');
    const projectManager = ProjectManager();

    if (!data) {
      return projectManager;
    }

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse projects from localStorage:', error);
      return projectManager;
    }

    if (!Array.isArray(parsed)) {
      console.warn('Stored projects data is not an array, initializing with default project');
      return projectManager;
    }

    parsed.forEach((proj) => {
      if (!proj || !proj.name) {
        console.warn('Invalid project data, skipping:', proj);
        return;
      }
      try {
        const project = Project(proj.name);
        if (proj.todos && Array.isArray(proj.todos)) {
          proj.todos.forEach((todo) => {
            if (!todo || !todo.title || !todo.description || !todo.dueDate || !todo.priority) {
              console.warn('Invalid todo data, skipping:', todo);
              return;
            }
            const newTodo = Todo(
              todo.title,
              todo.description,
              todo.dueDate,
              todo.priority,
              todo.notes || '',
              todo.checklist || []
            );
            newTodo.isCompleted = todo.isCompleted || false;
            project.addTodo(newTodo);
          });
        }
        projectManager.addProject(project);
      } catch (error) {
        console.warn('Failed to add project, skipping:', error.message);
      }
    });

    return projectManager;
  };

  return { saveProjects, loadProjects };
};