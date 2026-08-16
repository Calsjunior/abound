import { createElement } from "../utils/dom.js";

export class Dialog {
  constructor(formElement) {
    this.container = createElement(
      "dialog",
      { classes: ["dialog"] },
      formElement,
      createElement("button", { onClick: () => this.close() }, "Cancel"),
    );
  }

  open() {
    this.container.showModal();
  }

  close() {
    this.container.close();
  }

  get element() {
    return this.container;
  }
}
