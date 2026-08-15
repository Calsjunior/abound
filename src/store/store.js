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
    const index = this.projects.findIndex(
      (project) => project.id === projectId,
    );

    if (index === -1) {
      throw new Error(`No project found with id: ${projectId}`);
    }

    this.projects.splice(index, 1);
    this.eventBus.publish(EVENTS.STATE.PROJECTS_UPDATED, this.projects);
  }
}
