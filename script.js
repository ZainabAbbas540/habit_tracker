// Study Planner — script.js
// Simple SPA-style app, stores tasks in localStorage

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const tasksListEl = document.getElementById("tasksList");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalClose = document.getElementById("modalClose");
  const taskForm = document.getElementById("taskForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescInput = document.getElementById("taskDesc");
  const taskDueInput = document.getElementById("taskDue");
  const taskPriority = document.getElementById("taskPriority");
  const taskTagsInput = document.getElementById("taskTags");
  const filterInputs = document.querySelectorAll('input[name="filter"]');
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const exportBtn = document.getElementById("exportBtn");
  const importFile = document.getElementById("importFile");

  // State
  let tasks = []; 
  let editingId = null;

  // Local storage keys
  const STORAGE_KEY = "study_planner_tasks_v1";

  // --- Initialization
  loadFromStorage();
  render();

  // --- Event listeners
  addTaskBtn.addEventListener("click", () => openModal());
  modalClose.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) return;

    const desc = taskDescInput.value.trim();
    const due = taskDueInput.value || null;
    const priority = taskPriority.value;
    const tags = parseTags(taskTagsInput.value);

    if (editingId) {
      updateTask(editingId, { title, desc, due, priority, tags });
    } else {
      addTask({ title, desc, due, priority, tags });
    }
    closeModal();
    taskForm.reset();
  });

  filterInputs.forEach(inp => inp.addEventListener("change", render));
  sortSelect.addEventListener("change", render);
  searchInput.addEventListener("input", render);

  exportBtn.addEventListener("click", exportTasks);
  importFile.addEventListener("change", handleImportFile);

  // --- CRUD functions
  function addTask({ title, desc, due, priority, tags }) {
    const t = {
      id: 't_' + Date.now() + '_' + Math.floor(Math.random() * 999),
      title,
      desc,
      due,
      priority,
      tags,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(t);
    saveToStorage();
    render();
  }

  function updateTask(id, patch) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx] = { ...tasks[idx], ...patch };
    saveToStorage();
    render();
    editingId = null;
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage();
    render();
  }

  function toggleComplete(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    saveToStorage();
    render();
  }

  // --- Render UI
  function render() {
    tasksListEl.innerHTML = "";
    const filtered = applyFilters(tasks.slice());
    const sorted = applySort(filtered);
    const searched = applySearch(sorted);

    if (searched.length === 0) {
      tasksListEl.innerHTML = `<div class="card" style="text-align:center; color:#666">No tasks found. Add a task to get started ✨</div>`;
    } else {
      for (const task of searched) {
        tasksListEl.appendChild(createTaskCard(task));
      }
    }
    updateProgress();
  }

  function createTaskCard(task) {
    const el = document.createElement("div");
    el.className = "task card";
    const left = document.createElement("div");
    left.className = "task-left";

    // Checkbox
    const checkbox = document.createElement("div");
    checkbox.className = "checkbox" + (task.completed ? " checked" : "");
    checkbox.innerHTML = task.completed ? "✓" : "";
    checkbox.title = task.completed ? "Mark as incomplete" : "Mark as complete";
    checkbox.addEventListener("click", () => toggleComplete(task.id));

    // Meta
    const meta = document.createElement("div");
    meta.className = "task-meta";

    const titleEl = document.createElement("div");
    titleEl.className = "task-title";
    titleEl.textContent = task.title;

    const descEl = document.createElement("div");
    descEl.className = "task-desc";
    descEl.textContent = task.desc || "";

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "task-tags";
    (task.tags || []).slice(0, 6).forEach(tg => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tg;
      tagsWrap.appendChild(tag);
    });

    meta.appendChild(titleEl);
    if (task.desc) meta.appendChild(descEl);
    if ((task.tags || []).length) meta.appendChild(tagsWrap);

    left.appendChild(checkbox);
    left.appendChild(meta);

    // Right side
    const right = document.createElement("div");
    right.className = "task-right";

    // due date
    const dueEl = document.createElement("div");
    dueEl.className = "task-due";
    if (task.due) {
      const dueText = formatDateShort(task.due);
      dueEl.textContent = `Due: ${dueText}`;
      if (isOverdue(task) && !task.completed) {
        dueEl.style.color = "#b71c1c";
        dueEl.textContent += " • overdue";
      }
    } else {
      dueEl.textContent = formatRelative(task.createdAt);
    }

    // priority
    const badge = document.createElement("div");
    badge.className = "badge " + (task.priority || "medium");
    badge.textContent = capitalize(task.priority || "medium");

    // actions
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn outline";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openModal(task.id));

    const delBtn = document.createElement("button");
    delBtn.className = "btn outline";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      if (confirm("Delete this task?")) deleteTask(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    right.appendChild(dueEl);
    right.appendChild(badge);
    right.appendChild(actions);

    el.appendChild(left);
    el.appendChild(right);

    // Visual for completed
    if (task.completed) {
      titleEl.style.textDecoration = "line-through";
      titleEl.style.opacity = 0.7;
    }

    return el;
  }

  // --- Filters / Sort / Search
  function applyFilters(list) {
    const filter = document.querySelector('input[name="filter"]:checked')?.value || "all";
    if (filter === "active") return list.filter(t => !t.completed);
    if (filter === "completed") return list.filter(t => t.completed);
    if (filter === "overdue") return list.filter(t => !t.completed && isOverdue(t));
    return list;
  }

  function applySort(list) {
    const s = sortSelect.value;
    if (s === "created_desc") return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (s === "due_asc") return list.sort((a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    });
    if (s === "priority_desc") {
      const rank = { high: 3, medium: 2, low: 1 };
      return list.sort((a, b) => (rank[b.priority] || 2) - (rank[a.priority] || 2));
    }
    return list;
  }

  function applySearch(list) {
    const q = (searchInput.value || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter(t => {
      if (t.title.toLowerCase().includes(q)) return true;
      if ((t.desc || "").toLowerCase().includes(q)) return true;
      if ((t.tags || []).some(tag => tag.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  // --- Progress
  function updateProgress() {
    const total = tasks.length || 1;
    const done = tasks.filter(t => t.completed).length;
    const pct = Math.round((done / total) * 100);
    progressFill.style.width = pct + "%";
    progressPercent.textContent = pct + "%";
  }

  // --- Modal handling
  function openModal(editId) {
    editingId = null;
    modalTitle.textContent = editId ? "Edit Task" : "Add Task";
    if (editId) {
      const t = tasks.find(x => x.id === editId);
      if (!t) return;
      taskTitleInput.value = t.title;
      taskDescInput.value = t.desc || "";
      taskDueInput.value = t.due || "";
      taskPriority.value = t.priority || "medium";
      taskTagsInput.value = (t.tags || []).join(", ");
      editingId = editId;
    } else {
      taskForm.reset();
    }
    modal.classList.remove("hidden");
    taskTitleInput.focus();
  }

  function closeModal() {
    editingId = null;
    modal.classList.add("hidden");
    taskForm.reset();
  }

  // --- Helpers
  function parseTags(text) {
    if (!text) return [];
    return text.split(",").map(s => s.trim()).filter(Boolean);
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function formatRelative(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function isOverdue(task) {
    if (!task.due) return false;
    const today = new Date();
    const due = new Date(task.due + "T23:59:59");
    return due < today;
  }

  function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

  // --- Storage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        tasks = defaultSeed();
        saveToStorage();
      } else {
        tasks = JSON.parse(raw) || [];
      }
    } catch (e) {
      console.error("load error:", e);
      tasks = [];
    }
  }

  // default seed tasks to show a nice demo
  function defaultSeed() {
    return [
      {
        id: "seed_1",
        title: "Prepare GKS documents",
        desc: "Collect transcripts, certificates, and recommendation letters.",
        due: "",
        priority: "high",
        tags: ["GKS", "Documents"],
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "seed_2",
        title: "Study Data Structures",
        desc: "Practice arrays, linked lists and trees — 2 hours daily.",
        due: addDaysISO(7),
        priority: "medium",
        tags: ["CS", "DS"],
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "seed_3",
        title: "Portfolio polish",
        desc: "Update project descriptions and add screenshots.",
        due: addDaysISO(3),
        priority: "low",
        tags: ["Portfolio"],
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  function addDaysISO(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  // --- Export / Import
  function exportTasks() {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study_planner_tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error("Expected array of tasks");
        // simple merge: append and save
        tasks = imported.concat(tasks);
        saveToStorage();
        render();
        alert("Imported successfully.");
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  }

});







