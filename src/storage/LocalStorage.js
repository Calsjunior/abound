export class LocalStorage {
  constructor(
    storageKey = "abound_projects",
    activeKey = "abound_active_project",
  ) {
    this.storageKey = storageKey;
    this.activeKey = activeKey;
  }

  getProjects() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
  }

  saveProjects(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }

  getActiveProjectId() {
    try {
      const data = localStorage.getItem(this.activeKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
  }

  saveActiveProjectId(id) {
    try {
      localStorage.setItem(this.activeKey, JSON.stringify(id));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }
}
