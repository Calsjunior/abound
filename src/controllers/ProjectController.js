import { EVENTS } from "../constants/events.js";

export class ProjectController {
  constructor(eventBus, store, component, container, dialog) {
    if (typeof eventBus?.subscribe !== "function") {
      throw new Error("An eventBus with 'subscribe' method is required.");
    }

    this.eventBus = eventBus;
    this.store = store;
    this.component = component;
    this.container = container;
    this.dialog = dialog;

    this.init();
  }

  init() {
    this.container.appendChild(this.component.element);
    document.body.appendChild(this.dialog.element);

    this.component.render(this.store.projects, this.store.activeProjectId);

    this.eventBus.subscribe(EVENTS.STATE.PROJECTS_UPDATED, () => {
      this.component.render(this.store.projects, this.store.activeProjectId);
    });

    this.eventBus.subscribe(EVENTS.UI.PROJECT_SELECTED, (projectId) => {
      this.component.render(this.store.projects, projectId);
      this.component.closeSidebar();
    });

    this.eventBus.subscribe(EVENTS.UI.ADD_PROJECT_CLICKED, () => {
      this.dialog.open();
    });

    this.eventBus.subscribe(EVENTS.UI.PROJECT_FORM_SUBMITTED, (projectName) => {
      this.store.addProject(projectName);
      this.dialog.close();
    });

    this.eventBus.subscribe(EVENTS.UI.PROJECT_FORM_CANCELED, () => {
      this.dialog.close();
    });

    this.eventBus.subscribe(EVENTS.UI.TOGGLE_SIDEBAR, () => {
      this.component.toggleSidebar();
    });
  }
}
