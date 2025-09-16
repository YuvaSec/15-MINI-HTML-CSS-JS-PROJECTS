// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todosList = document.getElementById("todosList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const emptyState = document.querySelector(".emptyState");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");


let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) :[];
let currentFilter = "all";


addTaskBtn.addEventListener("click", (e) => {
    const iconChange = e.currentTarget.querySelector("i");
    showCopySuccess(iconChange);
    addTodo(taskInput.value);
})
taskInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addTodo(taskInput.value);
})

clearCompletedBtn.addEventListener("click", clearCompleted);

//ToDo: THIS WILL ADD TASK OBJECT TO THE TODOS ARRAY. //SAVE //RENDER TODOS ARRAY
function addTodo(text) {
    if (text.trim() === "") return;

    const todo = {
        id: Date.now(),
        text,
        completed: false,
        date: new Date().toLocaleDateString()
    };
    todos.push(todo);
    saveTodos();
    renderTodos();
    taskInput.value = "";
}


// // ToDo: This will save the todos in local storage. //UPDATE ITEM-COUNT //CHECK EMPTY STATE
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateItemsCount();
    checkEmptyState();
}

// // // ToDo: Update Total item count by using filter function.
function updateItemsCount(){
    const unComp = todos.filter((todo)=>!todo.completed).length;
    itemsLeft.textContent = `${unComp} item${unComp !==1 ?'s' :''} left`;
}

// // // ToDo: Check for Empty state and Unhide.
function checkEmptyState(){
    const filteredTodos = filterTodos(currentFilter);
    if(filteredTodos?.length === 0){
        emptyState.classList.remove("hidden");
    }
    else{
        emptyState.classList.add("hidden");
    }
}

// // // // todo: THIS WILL USE SWITCH AND CHECK WHICH FILTER IS ACTIVE AND RETURN UNCOMPLETED LENGTH
function filterTodos(currentFilter){
    switch(currentFilter){
        case "active":
            return todos.filter((todo)=>!todo.completed);
        case "completed":
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}

// // ToDo: Render ToDos from the todos array to the Todolist.
function renderTodos(){
todosList.innerHTML = "";
const filteredTodos = filterTodos(currentFilter);

filteredTodos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todoItem")
        if(todo.completed) todoItem.classList.add("completed");

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkboxContainer");

        const checkbox = document.createElement("input");
        checkbox.classList.add("todoCheckbox");
        checkbox.type="checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        //todo

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        const todoText = document.createElement("span");
        todoText.classList.add("todoItemText");
        todoText.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        todoItem.appendChild(checkboxContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        todosList.appendChild(todoItem);
    });
}
// // ToDo:
function deleteTodo(id) {
        todos = todos.filter((todo) => todo.id !== id);
        saveTodos();
        renderTodos();
}
// // ToDo:
function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }

        return todo;
    });
    saveTodos();
    renderTodos();
}

// ToDo:THIS WILL CHANGE THE ADD TASK BUTTON ANIMATION
function showCopySuccess(element) {
    element.classList.remove("far", "fa-plus");
    element.classList.add("fas", "fa-check");
    element.style.color = "#48bb78";
    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-plus");
        element.style.color = "";
    }, 2000);
}

//
function clearCompleted(){
    todos = todos.filter((todo)=>!todo.completed);
    saveTodos();
    renderTodos();
}

function loadTodos() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) todos = JSON.parse(storedTodos);
    renderTodos();
}

filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        setActiveFilter(filter.getAttribute("data-filter"));
    });
});

function setActiveFilter(filter) {
    currentFilter = filter;

    filters.forEach((item) => {
        if (item.getAttribute("data-filter") === filter) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    renderTodos();
}

function setDate() {
    const options = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", options);
}

window.addEventListener("DOMContentLoaded", () => {
    updateItemsCount()
    console.log(todos);
    renderTodos()
    checkEmptyState();
})