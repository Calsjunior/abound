import { Dialog } from "./components/Dialog.js";
import { ProjectForm } from "./components/ProjectForm.js";
import { ProjectList } from "./components/ProjectList.js";
import { TodoList } from "./components/TodoList.js";
import { ProjectController } from "./controllers/ProjectController.js";
import { TodoController } from "./controllers/TodoControllers.js";
import { ProjectStore } from "./store/store.js";
import { EventEmitter } from "./utils/EventEmitter.js";

import "./styles/reset.css";

const container = document.querySelector("#content");
const eventBus = new EventEmitter();
const store = new ProjectStore(eventBus);
const projectList = new ProjectList(eventBus);
const todoList = new TodoList(eventBus);

const projectForm = new ProjectForm(eventBus);
const dialog = new Dialog(projectForm.element);

new ProjectController(eventBus, store, projectList, container, dialog);
new TodoController(eventBus, store, todoList, container);

store.addProject("Inbox");
store.projects[0].addTodo({ title: "hi" });
