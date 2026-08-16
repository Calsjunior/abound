import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

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
      placeholder: "Project Name",
      required: "true",
      id: "new-project",
    });

    return createElement(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();

          this.eventBus.publish(EVENTS.UI.PROJECT_FORM_SUBMITTED, input.value);
          input.value = "";
        },
      },
      createElement("label", { for: "new-project" }, "New Project"),
      input,
      createElement("button", { type: "submit" }, "Create"),
    );
  }

  get element() {
    return this.container;
  }
}
