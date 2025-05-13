import { compareAsc, compareDesc, parseISO } from 'date-fns';

export const Project = (name) => {
  if (!name || name.trim() === '') {
    throw new Error('Project name is required');
  }
  let todos = [];

  const addTodo = (todo) => {
    todos.push(todo);
  };

  const removeTodo = (index) => {
    todos.splice(index, 1);
  };

  const getTodos = (filterPriority = 'all', sortOrder = 'asc') => {
    let filteredTodos = todos;
    
    if (filterPriority !== 'all') {
      filteredTodos = todos.filter(
        (todo) => todo.priority.toLowerCase() === filterPriority.toLowerCase()
      );
    }

    return filteredTodos.sort((a, b) => {
      const dateA = parseISO(a.dueDate);
      const dateB = parseISO(b.dueDate);
      return sortOrder === 'asc' ? compareAsc(dateA, dateB) : compareDesc(dateA, dateB);
    });
  };

  return {
    name,
    addTodo,
    removeTodo,
    getTodos,
  };
};

export const ProjectManager = () => {
  let projects = [Project('Default')];

  const addProject = (project) => {
    if (!project || !project.name) {
      throw new Error('Invalid project data');
    }
    const existingProject = projects.find(p => p.name.toLowerCase() === project.name.toLowerCase());
    if (existingProject) {
      throw new Error('A project with this name already exists');
    }
    projects.push(project);
  };

  const removeProject = (index) => {
    if (projects[index].name !== 'Default') {
      projects.splice(index, 1);
    }
  };

  const getProjects = () => projects;

  return {
    addProject,
    removeProject,
    getProjects,
  };
};