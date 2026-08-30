export class Todo {
  constructor({
    title,
    description = "",
    dueDate = null,
    priority = "normal",
    notes = "",
    checklist = [],
  }) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
  }

  addChecklistItem(text) {
    this.checklist.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false,
    });
  }

  static fromJSON(data) {
    return Object.assign(Object.create(Todo.prototype), data);
  }
}
