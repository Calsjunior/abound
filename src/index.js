import { Dialog } from "./components/Dialog.js";
import { ProjectForm } from "./components/ProjectForm.js";
import { ProjectList } from "./components/ProjectList.js";
import { TodoForm } from "./components/TodoForm.js";
import { TodoList } from "./components/TodoList.js";
import { ProjectController } from "./controllers/ProjectController.js";
import { TodoController } from "./controllers/TodoControllers.js";
import { InboxProject, TodayProject } from "./models/Project.js";
import { LocalStorage } from "./storage/LocalStorage.js";
import { ProjectStore } from "./store/store.js";
import { EventEmitter } from "./utils/EventEmitter.js";

import "@fontsource-variable/space-grotesk";
import "@fontsource/shrikhand";

import "./styles/reset.css";
import "./styles/global.css";

const defaultProjects = [new InboxProject(), new TodayProject()];

const container = document.querySelector("#content");
const eventBus = new EventEmitter();
const localDb = new LocalStorage();
const store = new ProjectStore(eventBus, localDb, defaultProjects);
const projectList = new ProjectList(eventBus);
const todoList = new TodoList(eventBus);

const projectForm = new ProjectForm(eventBus);
const projectDialog = new Dialog(projectForm.element);
const todoForm = new TodoForm(eventBus);
const todoDialog = new Dialog(todoForm.element);

new ProjectController(eventBus, store, projectList, container, projectDialog);
new TodoController(eventBus, store, todoList, container, todoForm, todoDialog);
