import { Temporal } from "@js-temporal/polyfill";
import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

import "./TodoForm.css";
import "./Form.css";

export class TodoForm {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = this.render();
  }

  // Hell hole
  render() {
    this.titleInput = createElement("input", {
      id: "todo-title",
      type: "text",
      name: "title",
      placeholder: "e.g., Eat the spreadsheet",
      required: "true",
      classes: ["form__input"],
    });

    this.descriptionInput = createElement("textarea", {
      id: "todo-description",
      name: "description",
      placeholder: "Optional Details...",
      classes: ["form__input", "form__textarea"],
    });

    this.dueDateInput = createElement("input", {
      id: "todo-due",
      type: "date",
      name: "dueDate",
      value: Temporal.Now.plainDateISO().toString(),
      classes: ["form__input"],
    });

    this.highPriorityInput = createElement("input", {
      id: "priority-high",
      type: "radio",
      name: "priority",
      value: "high",
      classes: ["todo-form__radio", "todo-form__radio--high"],
    });

    this.normalPriorityInput = createElement("input", {
      id: "priority-normal",
      type: "radio",
      name: "priority",
      value: "normal",
      checked: true,
      classes: ["todo-form__radio", "todo-form__radio--normal"],
    });

    this.lowPriorityInput = createElement("input", {
      id: "priority-low",
      type: "radio",
      name: "priority",
      value: "low",
      classes: ["todo-form__radio", "todo-form__radio--low"],
    });

    this.notesInput = createElement("textarea", {
      id: "todo-notes",
      name: "notes",
      placeholder: "Additional thoughts, or links...",
      classes: ["form__input", "form__textarea"],
    });

    this.formTitle = createElement(
      "h2",
      { classes: ["form__title", "todo-form__title"] },
      "Add Todo",
    );

    this.submitButton = createElement(
      "button",
      {
        classes: [
          "form__button",
          "form__button--submit",
          "todo-form__button--submit",
        ],
        type: "submit",
      },
      "Save Todo",
    );

    const formFields = createElement(
      "FRAG",
      {},
      createElement(
        "div",
        { classes: ["form__group", "stack"] },
        createElement(
          "label",
          {
            classes: ["form__label", "form__label--required"],
            for: "todo-title",
          },
          "Title",
        ),
        this.titleInput,
      ),
      createElement(
        "div",
        { classes: ["form__group", "stack"] },
        createElement(
          "label",
          { classes: ["form__label"], for: "todo-description" },
          "Description",
        ),
        this.descriptionInput,
      ),
      createElement(
        "div",
        { classes: ["form__section"] },
        createElement(
          "div",
          { classes: ["form__group", "stack"] },
          createElement(
            "label",
            { classes: ["form__label"], for: "todo-due" },
            "Due Date",
          ),
          this.dueDateInput,
        ),
        createElement(
          "fieldset",
          { classes: ["form__group"] },
          createElement("legend", { classes: ["form__label"] }, "Priority"),
          createElement(
            "div",
            { classes: ["cluster"] },
            createElement(
              "label",
              {
                for: "priority-high",
                classes: ["form__label", "cluster"],
              },
              this.highPriorityInput,
              createElement("span", {}, "High"),
            ),
            createElement(
              "label",
              {
                for: "priority-normal",
                classes: ["form__label", "cluster"],
              },
              this.normalPriorityInput,
              createElement("span", {}, "Normal"),
            ),
            createElement(
              "label",
              {
                for: "priority-low",
                classes: ["form__label", "cluster"],
              },
              this.lowPriorityInput,
              createElement("span", {}, "Low"),
            ),
          ),
        ),
      ),
      createElement(
        "div",
        { classes: ["form__group", "stack"] },
        createElement(
          "label",
          { classes: ["form__label"], for: "todo-notes" },
          "Notes",
        ),
        this.notesInput,
        // TODO: implement checklist
      ),
    );

    return createElement(
      "form",
      {
        classes: ["todo-form", "stack"],
        onSubmit: (e) => {
          e.preventDefault();

          const formData = Object.fromEntries(new FormData(e.target));

          this.eventBus.publish(EVENTS.UI.TODO_FORM_SUBMITTED, formData);
          e.target.reset();
        },
      },
      this.formTitle,
      formFields,
      createElement(
        "div",
        { classes: ["form__actions", "cluster"] },
        createElement(
          "button",
          {
            classes: ["form__button", "form__button--cancel"],
            type: "button",
            onClick: () => this.eventBus.publish(EVENTS.UI.TODO_FORM_CANCELED),
          },
          "Cancel",
        ),
        this.submitButton,
      ),
    );
  }

  populate({ title, description, dueDate, priority, notes }) {
    this.titleInput.value = title;
    this.descriptionInput.value = description;
    this.dueDateInput.value = dueDate;
    this.lowPriorityInput = priority === "high";
    this.normalPriorityInput = priority === "normal";
    this.lowPriorityInput = priority === "low";
    this.notesInput = notes;
  }

  clear() {
    this.container.reset();
  }

  get element() {
    return this.container;
  }
}
