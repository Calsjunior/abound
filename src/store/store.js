import { EVENTS } from "../constants/events.js";
import { Project } from "../models/Project.js";
import { Todo } from "../models/Todo.js";

export class ProjectStore {
  constructor(eventBus, defaultProjects = []) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.defaultProjects = defaultProjects;
    this.projects = [];
    this.activeProjectId = null;
    this.init();
  }

  init() {
    this.projects = [...this.defaultProjects];
    this.activeProjectId =
      this.defaultProjects.length > 0 ? this.defaultProjects[0].id : null;
  }

  addProject(projectName) {
    const project = new Project(projectName);
    this.projects.push(project);
    this.eventBus.publish(EVENTS.STATE.PROJECTS_UPDATED, this.projects);
  }

  removeProject(projectId) {
    const project = this.findProject(projectId);
    const index = this.projects.indexOf(project);
    this.projects.splice(index, 1);
    this.eventBus.publish(EVENTS.STATE.PROJECTS_UPDATED, this.projects);
  }

  addTodoToProject(todoData) {
    const todo = new Todo(todoData);
    this.activeProject.addTodo(todo);
    this.eventBus.publish(EVENTS.STATE.TODOS_UPDATED, this.projects);
  }

  findProject(projectId) {
    const project = this.projects.find((project) => project.id === projectId);
    if (!project) {
      throw new Error(`No project found with id: ${projectId}`);
    }

    return project;
  }

  set activeProject(projectId) {
    this.activeProjectId = projectId;
  }

  get activeProject() {
    return this.findProject(this.activeProjectId);
  }

  get activeTodo() {
    return this.activeProject.getTodos(this.projects);
  }
}
