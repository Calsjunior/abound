import { INBOX } from "../constants/default.js";
import { EVENTS } from "../constants/events.js";
import { Project } from "../models/Project.js";
import { Todo } from "../models/Todo.js";

export class ProjectStore {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.projects = [];
    this.activeProjectId = null;
    this.init();
  }

  init() {
    const inbox = new Project(INBOX.name);
    inbox.id = INBOX.id;
    this.projects.push(inbox);
    this.activeProjectId = INBOX.id;
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
    if (this.activeProjectId === INBOX.id)
      return this.projects.flatMap((project) => project.todos);

    return this.activeProject.todos;
  }
}
