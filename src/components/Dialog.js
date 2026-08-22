import { createElement } from "../utils/dom.js";

import "./Dialog.css";

export class Dialog {
  constructor(formElement) {
    this.container = createElement(
      "dialog",
      { classes: ["dialog"] },
      formElement,
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
