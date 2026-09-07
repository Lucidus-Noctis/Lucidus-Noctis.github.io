const inputTextBtn = document.getElementById("input-task");
const addBtn = document.getElementById('add-btn');
let counter = 0;
const taskList = new Map();

addBtn.addEventListener('click', function() {
    const tasksSection = document.getElementById("tasks");
    tasksSection.append(createTaskElement(inputTextBtn.value));
    inputTextBtn.value = "";
})

function createTaskElement(text) {
    const checkboxElement = document.createElement("input");
    checkboxElement.className = "form-check-input mt-0 my-checkbox";
    checkboxElement.type = 'checkbox';
    checkboxElement.id = counter;

    const labelElement = document.createElement("label");
    labelElement.className = "form-check-label my-checkbox-label";
    labelElement.htmlFor = checkboxElement.id;
    labelElement.textContent = text;

    const divFlexContainer = document.createElement('div');
    divFlexContainer.className = "d-flex justify-content-start align-items-center gap-3 flex-grow-1";
    divFlexContainer.append(checkboxElement, labelElement);

    const trashBtnImg = document.createElement("img");
    trashBtnImg.src = "./img/trash.png";
    trashBtnImg.className = "trash-btn";
    trashBtnImg.alt = "delete button";

    const trashBtnElement = document.createElement("button");
    trashBtnElement.className = "btn p-2";
    trashBtnElement.append(trashBtnImg);

    const taskElement = document.createElement("article");
    taskElement.className = "d-flex align-items-center p-3 bg-white rounded-4 gap-3 mt-3";
    taskElement.append(divFlexContainer, trashBtnElement);

    trashBtnElement.addEventListener('click', () => taskElement.remove());
    checkboxElement.addEventListener("change", function() {
        taskData = taskList.get(+checkboxElement.id);
        
        if (checkboxElement.checked) {
            taskData.status = "done";
            taskData.endDate = getDate();
            taskElement.classList.add("opacity-50");
            labelElement.classList.add("text-decoration-line-through")
        } else {
            taskData.status = "todo";
            taskData.endDate = null;
            taskElement.classList.remove("opacity-50");
            labelElement.classList.remove("text-decoration-line-through")
        }
    });

    addTaskToList(counter++, text);
    return taskElement;
}

function addTaskToList(id, text) {
    const toDoItem = {
        title: text,
        status: "todo", // Можливі значення: "todo" або "done"
        startDate: getDate(),
        endDate: null // Заповнюється при виконанні завдання
    };

    taskList.set(id, toDoItem);
}

function getDate() {
    return new Date().toLocaleString('sv-SE').slice(0, 16);
}