import { ProjectList } from "./components/ProjectList.js";
import { EVENTS } from "./constants/events.js";
import { ProjectController } from "./controllers/ProjectController.js";
import { Project } from "./models/Project.js";
import { ProjectStore } from "./store/store.js";
import { EventEmitter } from "./utils/EventEmitter.js";

import "./styles/reset.css";

const container = document.querySelector("#content");
const eventBus = new EventEmitter();
const store = new ProjectStore(eventBus);
const projectList = new ProjectList(eventBus);

new ProjectController(eventBus, store, projectList, container);

store.addProject("Inbox");
