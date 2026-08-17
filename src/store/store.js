import { EVENTS } from "../constants/events.js";
import { Project } from "../models/Project.js";

export class ProjectStore {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.projects = [];
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

  findProject(projectId) {
    const project = this.projects.find((project) => project.id === projectId);
    if (!project) {
      throw new Error(`No project found with id: ${projectId}`);
    }

    return project;
  }
}
