import { EVENTS } from "../constants/events.js";
import { createElement } from "../utils/dom.js";

import "./ProjectList.css";

export class ProjectList {
  constructor(eventBus) {
    if (typeof eventBus?.publish !== "function") {
      throw new Error("An eventBus with 'publish' method is required.");
    }

    this.eventBus = eventBus;
    this.container = createElement("aside", {
      classes: ["project__sidebar", "stack"],
    });
  }

  render(projects, activeId) {
    this.container.replaceChildren(
      this.renderList(projects, activeId),
      this.renderButton(),
    );
  }

  renderList(projects, activeId) {
    return createElement(
      "ul",
      {
        classes: ["project__list", "stack"],
        onClick: (e) => {
          if (!e.target.id) return;
          if (e.target.id === activeId) return;

          this.eventBus.publish(EVENTS.UI.PROJECT_SELECTED, e.target.id);
        },
      },
      ...projects.map((project) =>
        createElement(
          "li",
          {},
          createElement(
            "button",
            {
              classes:
                project.id === activeId
                  ? ["project__item", "project__item--active"]
                  : ["project__item"],
              id: project.id,
            },
            project.name,
          ),
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
      "New Project",
    );
  }

  toggleSidebar() {
    this.container.classList.toggle("project__sidebar--open");
  }

  closeSidebar() {
    this.container.classList.remove("project__sidebar--open");
  }

  get element() {
    return this.container;
  }
}
