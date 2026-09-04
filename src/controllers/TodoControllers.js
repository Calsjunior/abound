import { EVENTS } from "../constants/events.js";

export class TodoController {
  constructor(eventBus, store, component, container, form, dialog) {
    if (typeof eventBus?.subscribe !== "function") {
      throw new Error("An eventBus with 'subscribe' method is required.");
    }

    this.eventBus = eventBus;
    this.store = store;
    this.component = component;
    this.container = container;
    this.form = form;
    this.dialog = dialog;

    this.editingTodoId = null;
    this.init();
  }

  init() {
    this.container.appendChild(this.component.element);
    document.body.appendChild(this.dialog.element);

    this.component.render(this.store.activeTodo);

    this.eventBus.subscribe(EVENTS.UI.PROJECT_SELECTED, (projectId) => {
      this.store.activeProject = projectId;
      this.component.render(this.store.activeTodo);
    });

    this.eventBus.subscribe(EVENTS.UI.TODO_COMPLETE_TOGGLED, (todoId) => {
      this.store.toggleTodoComplete(todoId);
    });

    this.eventBus.subscribe(EVENTS.UI.TODO_SELECTED, (todoId) => {
      this.editingTodoId = todoId;
      const todo = this.store.findTodoById(todoId);
      this.form.setMode("edit");
      this.form.populate(todo);
      this.dialog.open();
    });

    this.eventBus.subscribe(EVENTS.STATE.TODOS_UPDATED, () => {
      this.component.render(this.store.activeTodo);
    });

    this.eventBus.subscribe(EVENTS.UI.ADD_TODO_CLICKED, () => {
      this.editingTodoId = null;
      this.form.setMode();
      this.form.clear();
      this.dialog.open();
    });

    this.eventBus.subscribe(EVENTS.UI.TODO_FORM_SUBMITTED, (todoData) => {
      if (this.editingTodoId) {
        this.store.updateTodo(this.editingTodoId, todoData);
      } else {
        this.store.addTodoToProject(todoData);
      }
      this.editingTodoId = null;
      this.dialog.close();
    });

    this.eventBus.subscribe(EVENTS.UI.TODO_FORM_CANCELED, () => {
      this.dialog.close();
    });
  }
}
