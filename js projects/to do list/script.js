const input = document.querySelector("#todo-input");

document.querySelector("#submit").addEventListener("click", () => {
  const inputData = input.value.trim();
  if (!inputData) return;
  input.value = "";

  addTodoToDOM(inputData);

  saveTodoToLocalStorage(inputData, false);
});

document.addEventListener("DOMContentLoaded", loadTodos);

function addTodoToDOM(inputData, isDone = false) {
  const todo_el = document.createElement("div");
  todo_el.classList.add("todo-item");

  const todo_content_el = document.createElement("div");
  todo_el.appendChild(todo_content_el);

  const todo_input_el = document.createElement("input");
  todo_input_el.classList.add("text");
  todo_input_el.type = "text";
  todo_input_el.value = inputData;
  todo_input_el.setAttribute("readonly", "readonly");

  todo_content_el.appendChild(todo_input_el);

  const todo_actions_el = document.createElement("div");
  todo_actions_el.classList.add("action-items");

  const todo_done_el = document.createElement("i");
  todo_done_el.classList.add("fa-solid", "fa-check");

  const todo_edit_el = document.createElement("i");
  todo_edit_el.classList.add("fa-solid", "fa-pen-to-square", "edit");

  const todo_delete_el = document.createElement("i");
  todo_delete_el.classList.add("fa-solid", "fa-trash");

  todo_actions_el.appendChild(todo_done_el);
  todo_actions_el.appendChild(todo_edit_el);
  todo_actions_el.appendChild(todo_delete_el);

  todo_el.appendChild(todo_actions_el);
  document.querySelector(".todo-lists").appendChild(todo_el);

  if (isDone) {
    todo_input_el.classList.add("done");
  }

  todo_done_el.addEventListener("click", () => {
    todo_input_el.classList.add("done");
    todo_el.removeChild(todo_actions_el);

    updateTodoInLocalStorage(inputData, true);
  });

  todo_edit_el.addEventListener("click", () => {
    if (todo_edit_el.classList.contains("edit")) {
      todo_edit_el.classList.remove("edit");
      todo_edit_el.classList.add("save");
      todo_input_el.removeAttribute("readonly");
      todo_input_el.focus();
    } else {
      todo_edit_el.classList.remove("save");
      todo_edit_el.classList.add("edit");
      todo_input_el.setAttribute("readonly", "readonly");

      updateTodoInLocalStorage(inputData, false, todo_input_el.value);
    }
  });

  todo_delete_el.addEventListener("click", () => {
    document.querySelector(".todo-lists").removeChild(todo_el);

    deleteTodoFromLocalStorage(inputData);
  });
}

function saveTodoToLocalStorage(todo, isDone) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push({ todo, isDone });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((todo) => {
    addTodoToDOM(todo.todo, todo.isDone);
  });

  const remainingTodos = todos.filter((todo) => !todo.isDone);
  localStorage.setItem("todos", JSON.stringify(remainingTodos));
}

function updateTodoInLocalStorage(oldTodo, isDone, newTodo = null) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoIndex = todos.findIndex((t) => t.todo === oldTodo);

  if (todoIndex > -1) {
    if (newTodo) {
      todos[todoIndex].todo = newTodo;
    }
    todos[todoIndex].isDone = isDone;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function deleteTodoFromLocalStorage(todo) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const updatedTodos = todos.filter((t) => t.todo !== todo);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}
