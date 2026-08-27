import { Temporal } from "@js-temporal/polyfill";
import { INBOX, TODAY } from "../constants/default.js";
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

    const today = new Project(TODAY.name);
    today.id = TODAY.id;
    this.projects.push(today);
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

  // FIXME: Will need a refactor in the case of more manual generated projects
  get activeTodo() {
    if (this.activeProjectId === INBOX.id)
      return this.projects.flatMap((project) => project.todos);

    if (this.activeProjectId === TODAY.id) {
      const today = Temporal.Now.plainDateISO().toString();
      return this.projects
        .flatMap((project) => project.todos)
        .filter((todo) => todo.dueDate === today);
    }

    return this.activeProject.todos;
  }
}
