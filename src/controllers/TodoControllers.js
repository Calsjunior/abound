import { EVENTS } from "../constants/events.js";

export class TodoController {
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

    this.component.render(this.store.projects.map((project) => project.todos));

    this.eventBus.subscribe(EVENTS.UI.PROJECT_SELECTED, (projectId) => {
      this.store.activeProject = projectId;
      this.component.render(this.store.activeProject.todos);
    });

    this.eventBus.subscribe(EVENTS.STATE.TODOS_UPDATED, () => {
      this.component.render(this.store.activeProject.todos);
    });

    this.eventBus.subscribe(EVENTS.UI.ADD_TODO_CLICKED, () => {
      this.dialog.open();
    });

    this.eventBus.subscribe(EVENTS.UI.TODO_FORM_SUBMITTED, (todoData) => {
      this.store.addTodoToProject({ title: todoData });
      this.dialog.close();
    });
  }
}
