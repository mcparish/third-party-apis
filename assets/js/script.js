// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = parseInt(localStorage.getItem("nextId")) || 0;
let taskTitle = $("#task-title");
let taskDueDate =$("#task-due-date");
let taskDescription = $("#task-description");
const saveButton = $("#save_button");

// Todo: create a function to generate a unique task id



function generateTaskId() {
  let nextId = parseInt(localStorage.getItem("nextId")) || 1;
  localStorage.setItem("nextId", nextId + 1);
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card draggable")
    .css("width", "18rem")
    .attr("data-task-id", task.taskID);
  const cardBody = $("<div>").addClass("card-body");
  const taskTitle = $("<h5>").addClass("card-title").text(task.taskTitle);
  const taskDescription = $("<p>")
    .addClass("card-text")
    .text(task.taskDescription);
  const taskDueDate = $("<p>").addClass("card-text").text(task.taskDueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.taskID.toString());

  cardDeleteBtn.on("click", handleDeleteTask);

  cardBody.append(taskTitle, taskDescription, taskDueDate, cardDeleteBtn);
  taskCard.append(cardBody);
  return taskCard;
}

nextId = generateTaskId();
const newTask = {
  taskTitle: taskTitle.value,
  taskDueDate: taskDueDate.value,
  taskDescription: taskDescription.value,
  taskID: nextId,
};
//taskList.push(newTask);
//localStorage.setItem("tasks", JSON.stringify(taskList));

//window.location.reload();

renderTaskList();
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const toDo = $("#todo-cards");
  toDo.empty();
  for (let i = 0; i < taskList.length; i++) {
    let card = `<div class="card draggable" style="width: 18rem;" data-task-id="${taskList[i].taskID}">  
            <div class="card-body">
                <h5 class="card-title">${taskList[i].taskTitle}</h5>
                <p class="card-text">${taskList[i].taskDescription}</p>
                <p class="card-text">${taskList[i].taskDueDate}</p>
                <button class="btn btn-danger delete" data-task-id="${taskList[i].taskID}">Delete</button>
            </div>
        </div>`;
    toDo.append(card);
  }

  $(".draggable").draggable({
    // opacity: 0.7,
    // zIndex: 100,
    // helper: function (e) {
    //   const original = $(e.target).hasClass("ui-draggable")
    //     ? $(e.target)
    //     : $(e.target).closest(".ui-draggable");
    //   return original.clone().css({
    //     maxWidth: original.outerWidth(),
    //   });
    // },

    
  });
// $(".draggable").draggable({
//   opacity: 0.7,
//   zIndex: 100,
//   // function to clone the card being dragged so that the original card remains in place
//   helper: function (e) {
//     // check of the target of the drag event is the card itself or a child element if it is the card itself, clone it, otherwise find the parent card and clone that
//     const original = $(e.target).hasClass("ui-draggable")
//       ? $(e.target)
//       : $(e.target).closest(".ui-draggable");
//     return original.clone().css({
//       maxWidth: original.outerWidth(),
//     });
//   },
// });

  $( "#in-progress" ).droppable({
      drop: function( event, ui ) {
        $( this )
          //  .addClass( "position-absolute z-3" )
          .find( "#in-progress-cards" )
            .html( "dropped!" );
      }
    });
 
  
  $(".delete").on("click", handleDeleteTask);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $("#task-title").val();
  const taskDueDate = $("#task-due-date").val();
  const taskDescription = $("#task-description").val();

  if (taskTitle && taskDueDate && taskDescription) {
    const nextId = generateTaskId();
    const newTask = {
      taskTitle: taskTitle,
      taskDueDate: taskDueDate,
      taskDescription: taskDescription,
      taskID: nextId,
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTaskList();
  } else {
    alert("Please fill in all task details.");
  }
}

  saveButton.on("click", handleAddTask);
  //if (taskID.dueDate && taskID.status !== "done") {
    const now = dayjs();
    //let taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr("data-task-id");
  taskList = taskList.filter((task) => task.taskID !== parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const droppedTaskId = ui.draggable.attr("data-task-id");
  const newStatusLane = $(this).attr("data-status-lane");

  // Find the dropped task in the taskList
  const droppedTask = taskList.find((task) => task.taskID == droppedTaskId);

  // Update the status of the dropped task
  droppedTask.status = newStatusLane;

  // Update the taskList in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Re-render the task list
  renderTaskList();
}

// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList(); // Render the task list
  $(".delete").on("click", handleDeleteTask); // Add event listener for delete buttons
  $(".status-lane").droppable({
    // Make lanes droppable
    accept: ".draggable",
    drop: handleDrop,
  });
  $("#task-due-date").datepicker({
    // Make the due date field a date picker
    changeMonth: true,
    changeYear: true,
  });
  
});

