import { EVENTS } from "../constants/events.js";

export class TodoController {
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

    this.eventBus.subscribe(EVENTS.UI.PROJECT_SELECTED, (projectId) => {
      const project = this.store.findProject(projectId);
      this.component.render(project.todos);
    });
  }
}
