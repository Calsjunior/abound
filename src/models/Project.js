import { Temporal } from "@js-temporal/polyfill";
import { INBOX, TODAY } from "../constants/default.js";

export class Project {
  constructor(name, id = crypto.randomUUID()) {
    this.id = id;
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
  }

  getTodos() {
    return this.todos;
  }
}

export class InboxProject extends Project {
  constructor() {
    super(INBOX.name, INBOX.id);
  }

  getTodos(allProjects) {
    return allProjects.flatMap((project) => project.todos);
  }
}

export class TodayProject extends Project {
  constructor() {
    super(TODAY.name, TODAY.id);
  }

  getTodos(allProjects) {
    const today = Temporal.Now.plainDateISO().toString();
    return allProjects
      .flatMap((project) => project.todos)
      .filter((todo) => todo.dueDate === today);
  }
}
