import { EVENTS } from "../constants/events.js";

export class ProjectController {
  constructor(eventBus, store, component, container) {
    if (typeof eventBus?.subscribe !== "function") {
      throw new Error("An eventBus with 'subscribe' method is required.");
    }

    this.eventBus = eventBus;
    this.store = store;
    this.component = component;
    this.container = container;

    this.init();
  }

  init() {
    this.container.appendChild(this.component.element);

    this.eventBus.subscribe(EVENTS.STATE.PROJECTS_UPDATED, (projects) => {
      this.component.render(projects);
    });

    this.eventBus.subscribe(EVENTS.UI.ADD_PROJECT_CLICKED, (projectName) => {
      this.store.addProject(projectName);
    });
  }
}
