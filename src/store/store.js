import { EVENTS } from "../constants/events.js";
import { Project } from "../models/Project.js";
import { Todo } from "../models/Todo.js";

export class ProjectStore {
  constructor(eventBus, db, defaultProjects = []) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    if (
      typeof db?.getProjects !== "function" &&
      typeof db?.saveProjects !== "function"
    ) {
      throw new Error(
        "A database with 'getProjects' and 'saveProjects' methods are required.",
      );
    }

    this.eventBus = eventBus;
    this.db = db;
    this.defaultProjects = defaultProjects;
    this.projects = [];
    this.activeProjectId = null;
    this.init();
  }

  init() {
    this.hydrateProjects();
    this.hydrateActiveProjectId();
  }

  hydrateProjects() {
    const rawProjects = this.db.getProjects();
    if (!rawProjects?.length) {
      this.projects = [...this.defaultProjects];
      this.activeProjectId = this.defaultProjects[0]?.id ?? null;
      return;
    }

    this.projects = rawProjects.map((rawProject) => {
      // If the saved project is a default project, i.e., inbox, and today,
      // reuse their existing instances to preserve their own getTodos methods.
      // Otherwise, recreate as normal Project instance.
      const project =
        this.defaultProjects.find(
          (defaultProject) => defaultProject.id === rawProject.id,
        ) ?? Project.fromJSON(rawProject);

      project.todos = rawProject.todos.map((todo) => Todo.fromJSON(todo));

      return project;
    });
  }

  hydrateActiveProjectId() {
    const rawActiveProjectId = this.db.getActiveProjectId();
    const isValidId = this.projects.some(
      (project) => project.id === rawActiveProjectId,
    );

    this.activeProjectId = isValidId ? rawActiveProjectId : this.projects[0].id;
  }

  addProject(projectName) {
    const project = new Project(projectName);
    this.projects.push(project);
    this.eventBus.publish(EVENTS.STATE.PROJECTS_UPDATED, this.projects);
    this.db.saveProjects(this.projects);
  }

  removeProject(projectId) {
    const project = this.findProject(projectId);
    const index = this.projects.indexOf(project);
    this.projects.splice(index, 1);
    this.eventBus.publish(EVENTS.STATE.PROJECTS_UPDATED, this.projects);
    this.db.saveProjects(this.projects);
  }

  addTodoToProject(todoData) {
    const todo = new Todo(todoData);
    this.activeProject.addTodo(todo);
    this.eventBus.publish(EVENTS.STATE.TODOS_UPDATED, this.projects);
    this.db.saveProjects(this.projects);
  }

  toggleTodoComplete(todoId) {
    const todo = this.findTodoById(todoId);
    todo.toggleComplete();
    this.eventBus.publish(EVENTS.STATE.TODOS_UPDATED, this.projects);
    this.db.saveProjects(this.projects);
  }

  updateTodo(todoId, todoData) {
    const todo = this.findTodoById(todoId);
    todo.update(todoData);
    this.eventBus.publish(EVENTS.STATE.TODOS_UPDATED);
    this.db.saveProjects(this.projects);
  }

  findProject(projectId) {
    const project = this.projects.find((project) => project.id === projectId);
    if (!project) {
      throw new Error(`No project found with id: ${projectId}`);
    }

    return project;
  }

  findTodoById(todoId) {
    for (const project of this.projects) {
      const todo = project.todos.find((todo) => todo.id === todoId);

      if (todo) return todo;
    }

    throw new Error(`No todo found with id: ${todoId}`);
  }

  set activeProject(projectId) {
    this.activeProjectId = projectId;
    this.db.saveActiveProjectId(projectId);
  }

  get activeProject() {
    return this.findProject(this.activeProjectId);
  }

  get activeTodo() {
    return this.activeProject.getTodos(this.projects);
  }
}
