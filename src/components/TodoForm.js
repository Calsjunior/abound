import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

export class TodoForm {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = this.render();
  }

  render() {
    const input = createElement("input", {
      type: "text",
      placeholder: "Todo Name",
      required: "true",
      id: "new-todo",
    });

    return createElement(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();

          this.eventBus.publish(EVENTS.UI.TODO_FORM_SUBMITTED, input.value);
          input.value = "";
        },
      },
      createElement("label", { for: "new-todo" }, "New Todo"),
      input,
      createElement(
        "div",
        { classes: ["form__actions"] },
        createElement(
          "button",
          {
            classes: ["form__button", "form__button--cancel"],
            type: "button",
            onClick: () => this.eventBus.publish(EVENTS.UI.TODO_FORM_CANCELED),
          },
          "Cancel",
        ),
        createElement(
          "button",
          {
            classes: [
              "form__button",
              "form__button--submit",
              "todo-form__button--submit",
            ],
            type: "submit",
          },
          "Add Todo",
        ),
      ),
    );
  }

  get element() {
    return this.container;
  }
}
