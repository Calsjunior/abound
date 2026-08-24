import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

import "./ProjectForm.css";
import "./Form.css";

export class ProjectForm {
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
      placeholder: "e.g., Work",
      required: "true",
      id: "new-project",
      class: "form__input",
    });

    return createElement(
      "form",
      {
        classes: ["project__form", "stack"],
        onSubmit: (e) => {
          e.preventDefault();

          this.eventBus.publish(EVENTS.UI.PROJECT_FORM_SUBMITTED, input.value);
          input.value = "";
        },
      },
      createElement(
        "h2",
        { classes: ["form__title", "project-form__title"] },
        "New Project",
      ),
      createElement(
        "label",
        { classes: ["form__label"], for: "new-project" },
        "Project Name",
      ),
      input,
      createElement(
        "div",
        { classes: ["form__actions", "cluster"] },
        createElement(
          "button",
          {
            classes: ["form__button", "form__button--cancel"],
            type: "button",
            onClick: () =>
              this.eventBus.publish(EVENTS.UI.PROJECT_FORM_CANCELED),
          },
          "Cancel",
        ),
        createElement(
          "button",
          {
            classes: [
              "form__button",
              "form__button--submit",
              "project-form__button--submit",
            ],
            type: "submit",
          },
          "Create",
        ),
      ),
    );
  }

  get element() {
    return this.container;
  }
}
