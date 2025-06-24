document.addEventListener("DOMContentLoaded", () => {
  const taskNameInput    = document.getElementById("task-name")
  const taskCategoryInput= document.getElementById("task-category")
  const taskDeadlineInput= document.getElementById("task-deadline")
  const taskStatusSelect = document.getElementById("task-status")
  const addTaskBtn       = document.getElementById("add-task-btn")
  const taskList         = document.getElementById("task-list")
  const filterButtons    = document.querySelectorAll("#filters button")

  
  let tasks = []

 


  
  function updateTaskIfOverdue(task) {
    const today    = new Date().setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline).setHours(0, 0, 0, 0);
    if (deadline < today && task.status !== "Completed") {
      task.status = "Overdue";
    }
    return task
  }

  
  function renderTask(task) {
    const li = document.createElement("li")
    li.className = "task-item"
    li.setAttribute("data-id", task.id)

    
    const detailsDiv = document.createElement("div")
    detailsDiv.className = "task-details";
    detailsDiv.innerHTML = `<strong>${task.name}</strong>
      <br>Category: ${task.category}
      <br>Deadline: ${task.deadline}
      <br>Status: <span class="status-text">${task.status}</span>`

    
    const actionsDiv = document.createElement("div")
    actionsDiv.className = "task-actions"

    
    const statusSelect = document.createElement("select")
    const statusOptions = ["In Progress", "Completed"]
    statusOptions.forEach(optionValue => {
      const option = document.createElement("option")
      option.value = optionValue
      option.textContent = optionValue
      if (optionValue === task.status) {
        option.selected = true
      }
      statusSelect.appendChild(option)
    })
    statusSelect.addEventListener("change", (e) => {
      task.status = e.target.value;
      
      if (task.status !== "Completed") {
        task = updateTaskIfOverdue(task)
      }
      li.querySelector(".status-text").textContent = task.status
      saveTasks()
    })
    actionsDiv.appendChild(statusSelect)

    
    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id)
      li.remove()
      saveTasks()
    })
    actionsDiv.appendChild(deleteBtn)

    li.appendChild(detailsDiv)
    li.appendChild(actionsDiv)
    taskList.appendChild(li)
  }

  
  function addTask() {
    const name     = taskNameInput.value.trim()
    const category = taskCategoryInput.value.trim()
    const deadline = taskDeadlineInput.value
    let status     = taskStatusSelect.value

    if (name === "" || deadline === "") {
      alert("Please enter a task name and deadline.")
      return
    }

    
    const task = {
      id: Date.now(),
      name,
      category,
      deadline,
      status
    }

    updateTaskIfOverdue(task)
    tasks.push(task)
    renderTask(task)
    saveTasks()

    
    taskNameInput.value     = ""
    taskCategoryInput.value = ""
    taskDeadlineInput.value = ""
    taskStatusSelect.value  = "In Progress"
  }

  addTaskBtn.addEventListener("click", addTask)

  
  function filterTasks(filterStatus) {
    const items = document.querySelectorAll(".task-item")
    items.forEach(item => {
      const status = item.querySelector(".status-text").textContent
      if (filterStatus === "All" || status === filterStatus) {
        item.style.display = "flex"
      } else {
        item.style.display = "none"
      }
    })
  }

  
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterTasks(button.getAttribute("data-filter"))
    })
  })

  
  })