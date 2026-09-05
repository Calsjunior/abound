import { EVENTS } from "../constants/events.js";
import { formatRelativeDate } from "../utils/dateFormatter.js";
import { createElement } from "../utils/dom.js";

import "./TodoList.css";

export class TodoList {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = createElement("main", {
      classes: ["todo__container", "stack"],
    });
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
      { classes: ["todo__header", "cluster"] },
      createElement(
        "button",
        {
          classes: ["todo__sidebar-toggle"],
          onClick: () => this.eventBus.publish(EVENTS.UI.TOGGLE_SIDEBAR),
        },
        createElement("span", {}),
        createElement("span", {}),
        createElement("span", {}),
      ),
      createElement("span", {}, "do the right thing."),
    );
  }

  renderList(todos) {
    if (todos.length === 0) return "";

    return createElement(
      "ul",
      {
        classes: ["todo__list", "stack"],
        onClick: (e) => {
          if (!e.target.id) return;

          this.eventBus.publish(EVENTS.UI.TODO_SELECTED, e.target.id);
        },
      },
      ...todos
        .filter((todo) => !todo.completed)
        .map((todo) =>
          createElement(
            "li",
            { classes: ["todo"] },
            createElement("input", {
              classes: ["todo__checkbox"],
              type: "checkbox",
              onChange: (e) => {
                const animationDuration = 700;
                e.target.parentElement.classList.add("todo--completing");
                e.target.parentElement.style.setProperty(
                  "--_todo-animation",
                  animationDuration,
                );

                setTimeout(() => {
                  this.eventBus.publish(
                    EVENTS.UI.TODO_COMPLETE_TOGGLED,
                    todo.id,
                  );
                }, animationDuration);
              },
            }),
            createElement(
              "button",
              { classes: ["todo__item", "cluster"], id: todo.id },
              todo.title,
              createElement(
                "div",
                { classes: ["todo__tags", "cluster"] },
                createElement(
                  "span",
                  { classes: ["todo__date"] },
                  formatRelativeDate(todo.dueDate) ?? "No due date",
                ),
                createElement(
                  "span",
                  {
                    classes: [
                      "todo__priority",
                      `todo__priority--${todo.priority}`,
                    ],
                  },
                  todo.priority,
                ),
              ),
            ),
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
