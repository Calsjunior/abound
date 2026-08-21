import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

export class TodoList {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = createElement("main", { classes: ["todo__container"] });
  }

  render(todos) {
    this.container.replaceChildren(
      this.renderTitle(),
      this.renderButton(),
      this.renderList(todos),
    );
  }

  renderTitle() {
    return createElement(
      "header",
      { classes: ["todo__header"] },
      "do the right thing.",
    );
  }

  renderList(todos) {
    if (todos.length === 0) return "";

    return createElement(
      "ul",
      {
        classes: ["todo__list"],
      },
      ...todos.map((todo) =>
        createElement(
          "li",
          { classes: ["todo__item"], id: todo.id },
          todo.title,
        ),
      ),
    );
  }

  renderButton() {
    return createElement(
      "button",
      {
        classes: ["todo__button"],
        onClick: () => this.eventBus.publish(EVENTS.UI.ADD_TODO_CLICKED),
      },
      "Add Todo",
    );
  }

  get element() {
    return this.container;
  }
}
