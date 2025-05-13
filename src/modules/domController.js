import { format, parseISO, compareAsc, compareDesc } from 'date-fns';
import { Todo } from './todo';
import { Project } from './project';

export const DomController = (projectManager, storage) => {
  let currentProjectIndex = 0;
  let filterPriority = 'all';
  let sortOrder = 'asc';
  let showAllTasks = false;

  const modal = document.getElementById('modal');

  const showModal = (title, formContent, onSubmit) => {
    modal.innerHTML = `
      <div class="modal-content">
        <h2 id="modal-title">${title}</h2>
        <div id="error-message" class="error-message"></div>
        <form id="modal-form">
          ${formContent}
          <div class="buttons">
            <button type="submit">Save</button>
            <button type="button" id="cancel-modal">Cancel</button>
          </div>
        </form>
      </div>
    `;
    modal.classList.add('show');
    const form = modal.querySelector('#modal-form');
    const errorMessage = modal.querySelector('#error-message');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = validateForm(form);
      if (errors.length > 0) {
        errorMessage.textContent = errors.join('\n');
        return;
      }
      errorMessage.textContent = '';
      try {
        onSubmit();
        modal.classList.remove('show');
      } catch (error) {
        errorMessage.textContent = error.message;
      }
    });
    modal.querySelector('#cancel-modal').addEventListener('click', () => {
      modal.classList.remove('show');
    });
    const createProjectBtn = modal.querySelector('#create-project');
    if (createProjectBtn) {
      createProjectBtn.addEventListener('click', () => {
        showModal(
          'Add Project',
          `
            <div class="form-group">
              <label for="name">Project Name:</label>
              <input type="text" id="name" name="name" required>
            </div>
          `,
          () => {
            const form = modal.querySelector('#modal-form');
            const projectName = form.name.value.trim();
            try {
              const project = Project(projectName);
              projectManager.addProject(project);
              storage.saveProjects(projectManager.getProjects());
              renderProjects();
              currentProjectIndex = projectManager.getProjects().length - 1;
              renderTodos();
              document.getElementById('current-project').textContent = projectName;
              updateProjectSelect();
            } catch (error) {
              errorMessage.textContent = error.message;
            }
          }
        );
      });
    }
  };

  const validateForm = (form) => {
    const errors = [];
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        errors.push(`${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`);
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });
    return errors;
  };

  const updateProjectSelect = () => {
    const select = modal.querySelector('#project-select');
    if (select) {
      select.innerHTML = '';
      projectManager.getProjects().forEach((project, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = project.name;
        select.appendChild(option);
      });
      select.value = currentProjectIndex;
    }
  };

  const renderProjects = () => {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    const projects = projectManager.getProjects();
    if (projects.length === 0 || (projects.length === 1 && projects[0].name !== 'Default')) {
      projectManager.addProject(Project('Default'));
    }
    projects.forEach((project, index) => {
      if (project.name === 'Default' && index > 0) return;
      const li = document.createElement('li');
      li.textContent = project.name;
      li.classList.add('project-item');
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `Select project ${project.name}`);
      li.addEventListener('click', () => {
        currentProjectIndex = index;
        showAllTasks = false;
        renderTodos();
        document.getElementById('current-project').textContent = project.name;
        projectList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
        li.classList.add('active');
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          li.click();
        }
      });
      if (project.name !== 'Default') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-project');
        deleteBtn.setAttribute('aria-label', `Delete project ${project.name}`);
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          projectManager.removeProject(index);
          storage.saveProjects(projectManager.getProjects());
          renderProjects();
          if (currentProjectIndex >= projectManager.getProjects().length) {
            currentProjectIndex = 0;
          }
          renderTodos();
        });
        li.appendChild(deleteBtn);
      }
      projectList.appendChild(li);
      if (index === currentProjectIndex) {
        li.classList.add('active');
      }
    });
  };

  const renderTodos = () => {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    let todos;
    if (showAllTasks) {
      todos = projectManager.getProjects()
        .flatMap(project => project.getTodos(filterPriority, sortOrder))
        .sort((a, b) => {
          const dateA = parseISO(a.dueDate);
          const dateB = parseISO(b.dueDate);
          return sortOrder === 'asc' ? compareAsc(dateA, dateB) : compareDesc(dateA, dateB);
        });
    } else {
      const currentProject = projectManager.getProjects()[currentProjectIndex];
      if (!currentProject) {
        console.error('Current project is undefined');
        return;
      }
      todos = currentProject.getTodos(filterPriority, sortOrder);
    }
    todos.forEach((todo) => {
      const li = document.createElement('li');
      const classes = ['todo-item', todo.priority.toLowerCase()];
      if (todo.isCompleted) classes.push('completed');
      li.classList.add(...classes.filter(cls => cls && cls.trim()));
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'listitem');
      li.innerHTML = `
        <div class="todo-header">
          <span>${todo.title} - ${format(parseISO(todo.dueDate), 'MMM dd, yyyy')}</span>
          <div class="todo-actions">
            <button class="expand" aria-label="Toggle details for ${todo.title}">Details</button>
            <button class="edit" aria-label="Edit ${todo.title}">Edit</button>
            <button class="delete" aria-label="Delete ${todo.title}">Delete</button>
          </div>
        </div>
        <div class="todo-details">
          <p><strong>Description:</strong> ${todo.description}</p>
          <p><strong>Notes:</strong> ${todo.notes || 'N/A'}</p>
          <p><strong>Checklist:</strong> ${todo.checklist.length > 0 ? todo.checklist.join(', ') : 'None'}</p>
          <label><input type="checkbox" ${todo.isCompleted ? 'checked' : ''} aria-label="Mark ${todo.title} as completed"> Completed</label>
        </div>
      `;
      li.querySelector('.expand').addEventListener('click', () => {
        const details = li.querySelector('.todo-details');
        details.classList.toggle('show');
        li.querySelector('.expand').setAttribute(
          'aria-expanded',
          details.classList.contains('show')
        );
      });
      li.querySelector('.edit').addEventListener('click', () => {
        showModal(
          'Edit Todo',
          `
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" name="title" value="${todo.title}" required>
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description" required>${todo.description}</textarea>
            </div>
            <div class="form-group">
              <label for="dueDate">Due Date:</label>
              <input type="date" id="dueDate" name="dueDate" value="${todo.dueDate}" required>
            </div>
            <div class="form-group">
              <label for="priority">Priority:</label>
              <select id="priority" name="priority" required>
                <option value="Low" ${todo.priority === 'Low' ? 'selected' : ''}>Low</option>
                <option value="Medium" ${todo.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="High" ${todo.priority === 'High' ? 'selected' : ''}>High</option>
              </select>
            </div>
            <div class="form-group">
              <label for="notes">Notes:</label>
              <textarea id="notes" name="notes">${todo.notes}</textarea>
            </div>
          `,
          () => {
            const form = modal.querySelector('#modal-form');
            const newTodo = Todo(
              form.title.value,
              form.description.value,
              form.dueDate.value,
              form.priority.value,
              form.notes.value
            );
            newTodo.isCompleted = todo.isCompleted;
            const project = showAllTasks ? projectManager.getProjects().find(p => p.getTodos().includes(todo)) : projectManager.getProjects()[currentProjectIndex];
            project.removeTodo(project.getTodos().indexOf(todo));
            project.addTodo(newTodo);
            storage.saveProjects(projectManager.getProjects());
            renderTodos();
          }
        );
      });
      li.querySelector('.delete').addEventListener('click', () => {
        const project = showAllTasks ? projectManager.getProjects().find(p => p.getTodos().includes(todo)) : projectManager.getProjects()[currentProjectIndex];
        project.removeTodo(project.getTodos().indexOf(todo));
        storage.saveProjects(projectManager.getProjects());
        renderTodos();
      });
      li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        todo.toggleComplete();
        storage.saveProjects(projectManager.getProjects());
        li.classList.toggle('completed', todo.isCompleted);
      });
      todoList.appendChild(li);
    });
  };

  const init = () => {
    document.getElementById('add-project').addEventListener('click', () => {
      showModal(
        'Add Project',
        `
          <div class="form-group">
            <label for="name">Project Name:</label>
            <input type="text" id="name" name="name" required>
          </div>
        `,
        () => {
          const form = modal.querySelector('#modal-form');
          const projectName = form.name.value.trim();
          try {
            const project = Project(projectName);
            projectManager.addProject(project);
            storage.saveProjects(projectManager.getProjects());
            renderProjects();
            currentProjectIndex = projectManager.getProjects().length - 1;
            renderTodos();
            document.getElementById('current-project').textContent = projectName;
            updateProjectSelect();
          } catch (error) {
            modal.querySelector('#error-message').textContent = error.message;
          }
        }
      );
    });

    document.getElementById('add-todo').addEventListener('click', () => {
      showModal(
        'Add Todo',
        `
          <div class="form-group">
            <label for="project-select">Select Project:</label>
            <select id="project-select" name="project" required>
              ${projectManager.getProjects().map((proj, index) => `<option value="${index}">${proj.name}</option>`).join('')}
            </select>
            <button type="button" id="create-project" style="margin-top: 0.5rem;">Create New Project</button>
          </div>
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="dueDate" required>
          </div>
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select id="priority" name="priority" required>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div class="form-group">
            <label for="notes">Notes:</label>
            <textarea id="notes" name="notes"></textarea>
          </div>
        `,
        () => {
          const form = modal.querySelector('#modal-form');
          const selectedProjectIndex = form.project.value;
          const todo = Todo(
            form.title.value,
            form.description.value,
            form.dueDate.value,
            form.priority.value,
            form.notes.value
          );
          projectManager.getProjects()[selectedProjectIndex].addTodo(todo);
          storage.saveProjects(projectManager.getProjects());
          renderTodos();
        }
      );
      updateProjectSelect();
    });

    document.getElementById('filter-priority').addEventListener('change', (e) => {
      filterPriority = e.target.value;
      renderTodos();
    });

    document.getElementById('sort-date').addEventListener('change', (e) => {
      sortOrder = e.target.value;
      renderTodos();
    });

    const showAllButton = document.createElement('button');
    showAllButton.textContent = 'Show All Tasks';
    showAllButton.addEventListener('click', () => {
      showAllTasks = !showAllTasks;
      showAllButton.textContent = showAllTasks ? 'Show Current Project' : 'Show All Tasks';
      document.getElementById('current-project').textContent = showAllTasks ? 'All Tasks' : projectManager.getProjects()[currentProjectIndex].name;
      renderTodos();
    });
    document.querySelector('.controls').appendChild(showAllButton);

    renderProjects();
    renderTodos();
  };

  return { init };
};