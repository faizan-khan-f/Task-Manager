// Base API Endpoint targeting the Express backend
const API_URL = "http://localhost:5000/api/todos"; //todos in last refer resource it give resource json data from data base
// In Express,this aligns with modular routing (app.use('/api/todos', todoRouter)), separating static middleware from data controllers.

// Application State
let todos = [];
let activeFilter = "all"; //for pending comple
let searchQuery = ""; //for searching task

// DOM Element References
const form = document.getElementById("todo-form");
const todoIdInput = document.getElementById("todo-id");
const titleInput = document.getElementById("todo-title");
const descInput = document.getElementById("todo-description");
const priorityInput = document.getElementById("todo-priority");
const dueDateInput = document.getElementById("todo-duedate");
const formHeading = document.getElementById("form-heading");
const submitBtn = document.getElementById("btn-submit");
const cancelBtn = document.getElementById("btn-cancel");

const todoListContainer = document.getElementById("todo-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const errorBanner = document.getElementById("error-banner");

const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statCompleted = document.getElementById("stat-completed");

// =========================================================================
// 1. API CALLS (Native fetch API)
// =========================================================================

async function fetchTodos() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message); //if no resp
    todos = result.data; //todos is stred as data while modeling
    hideError();
    render();
  } catch (err) {
    showError(err.message || "Failed to load tasks from backend.");
  }
}

async function createTodo(payload) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    todos.unshift(result.data);
    resetForm();
    hideError();
    render();
  } catch (err) {
    showError(err.message);
  }
}

async function updateTodo(id, payload) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    todos = todos.map((t) => (t._id === id ? result.data : t));
    resetForm();
    hideError();
    render();
  } catch (err) {
    showError(err.message);
  }
}

async function toggleStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    todos = todos.map((t) => (t._id === id ? result.data : t));
    hideError();
    render();
  } catch (err) {
    showError(err.message);
  }
}

async function deleteTodo(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    todos = todos.filter((t) => t._id !== id);
    hideError();
    render();
  } catch (err) {
    showError(err.message);
  }
}

// =========================================================================
// 2. RENDERING & STATS UPDATES
// =========================================================================

function render() {
  updateStats();

  // Filter and search computation
  const filtered = todos.filter((todo) => {
    const matchesFilter =
      activeFilter === "all" || todo.status === activeFilter;
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    todoListContainer.innerHTML = `
      <div class="text-center py-12 bg-slate-800/20 border border-dashed border-slate-700 rounded-2xl">
        <p class="text-slate-400 font-medium">No tasks found</p>
      </div>
    `;
    return;
  }

  const priorityStyles = {
    low: "bg-slate-700/50 text-slate-300 border-slate-600",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    high: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  todoListContainer.innerHTML = filtered
    .map((todo) => {
      const isCompleted = todo.status === "completed";
      const formattedDate = todo.dueDate
        ? new Date(todo.dueDate).toLocaleDateString()
        : "";

      return `
        <div class="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 transition duration-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isCompleted ? "opacity-60" : ""
        }">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <button
              onclick="toggleStatus('${todo._id}', '${isCompleted ? "pending" : "completed"}')"
              class="mt-1 sm:mt-0 w-6 h-6 rounded-full border flex items-center justify-center transition ${
                isCompleted
                  ? "bg-emerald-500 border-emerald-500 text-slate-950"
                  : "border-slate-500 hover:border-indigo-400"
              }"
            >
              ${isCompleted ? "✓" : ""}
            </button>

            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-medium text-slate-100 ${isCompleted ? "line-through text-slate-400" : ""}">
                  ${escapeHTML(todo.title)}
                </h3>
                <span class="text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${
                  priorityStyles[todo.priority] || priorityStyles.medium
                }">
                  ${todo.priority}
                </span>
              </div>

              ${todo.description ? `<p class="text-sm text-slate-400">${escapeHTML(todo.description)}</p>` : ""}

              ${formattedDate ? `<div class="text-xs text-slate-400 pt-1">📅 ${formattedDate}</div>` : ""}
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            <button
              onclick="startEdit('${todo._id}')"
              class="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
            >
              Edit
            </button>
            <button
              onclick="deleteTodo('${todo._id}')"
              class="px-3 py-1.5 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const pending = total - completed;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
}

// =========================================================================
// 3. EVENT LISTENERS & FORM HANDLING
// =========================================================================

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = todoIdInput.value;
  const payload = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    priority: priorityInput.value,
    dueDate: dueDateInput.value || undefined,
  };

  if (id) {
    updateTodo(id, payload);
  } else {
    createTodo(payload);
  }
});

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.className =
        "filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-400 hover:text-slate-200";
    });
    btn.className =
      "filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-indigo-600 text-white";
    activeFilter = btn.getAttribute("data-filter");
    render();
  });
});

window.startEdit = function (id) {
  const todo = todos.find((t) => t._id === id);
  if (!todo) return;

  todoIdInput.value = todo._id;
  titleInput.value = todo.title;
  descInput.value = todo.description || "";
  priorityInput.value = todo.priority;
  dueDateInput.value = todo.dueDate ? todo.dueDate.split("T")[0] : "";

  formHeading.textContent = "Edit Task";
  submitBtn.textContent = "Save Changes";
  cancelBtn.classList.remove("hidden");
};

function resetForm() {
  todoIdInput.value = "";
  form.reset();
  formHeading.textContent = "Create New Task";
  submitBtn.textContent = "Add Task";
  cancelBtn.classList.add("hidden");
}

function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}

// Initial Load
fetchTodos();
