import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

export class ProjectList {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = createElement("aside", { classes: ["project__sidebar"] });
  }

  render(projects) {
    this.container.replaceChildren(
      this.renderList(projects),
      this.renderButton(),
    );
  }

  renderList(projects) {
    return createElement(
      "ul",
      {
        classes: ["project__list"],
        onClick: (e) => {
          if (!e.target.id) return;
          this.eventBus.publish(EVENTS.UI.PROJECT_SELECTED, e.target.id);
        },
      },
      ...projects.map((project) =>
        createElement(
          "li",
          { classes: ["project__item"], id: project.id },
          project.name,
        ),
      ),
    );
  }

  renderButton() {
    return createElement(
      "button",
      {
        classes: ["project__button"],
        onClick: () => this.eventBus.publish(EVENTS.UI.ADD_PROJECT_CLICKED),
      },
      "Add Project",
    );
  }

  get element() {
    return this.container;
  }
}
