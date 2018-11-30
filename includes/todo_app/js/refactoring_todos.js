
	//template strings:

    const textNumber = `${text} ${number}`;
    const textNumber = text + ' ' +number;
    

//todo.js
//04/02/18

const submit = document.getElementById('submit');
const update = document.getElementById('update');
var id;

window.onload = init;

function Todo(id, task) {
    this.id = id;
    this.task = task;
}
    
var todos = new Array();
var ul = document.getElementById("todoList");

//CREATE 

function init() {
    submit.onclick = getFormData;
    update.onclick= updateFormData;
    getTodoItems();
}

function getTodoItems() {
    if (localStorage) {
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.substring(0, 4) == "todo") {
//JSON.parse() takes a piece of data in JSON format and deserializes it into a JavaScript object
                todos.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        addTodosToPage();
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}

//READ
//Note: adds item to the page when the page is loaded
function addTodosToPage() {
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i< todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}

//Note:adds item to the page using the form
function addTodoToPage(todoItem){
    ul.appendChild(createNewTodo(todoItem));
}
   

//Note: creates delete icon
function setUpDeleteicon () {
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("id", todoItem.id);
    spanDelete.setAttribute("class","delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
    spanDelete.onclick = deleteItem;
}

function createNewTodo(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);

    var spanTodo = document.createElement("span");
    spanTodo.innerHTML = todoItem.task;
    setUpDeleteicon();

    //Note:create edit button
    var spanEdit = document.createElement("button");
    spanEdit.setAttribute("id",todoItem.id);
    spanEdit.setAttribute("class", "edit");
    spanEdit.innerHTML = "edit";
    spanEdit.onclick = editItem;
    li.appendChild(spanTodo);
    li.appendChild(spanDelete);
    li.appendChild(spanEdit);
    return li;
}

function getFormData(){
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;
    var todoItem = new Todo(getMaxId()+1, task);
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
    // window.addEventListener('keyup', function (e) {
    //     if (e.keyCode === 13) {
    //     return true;
    //     }
    // }, false);
    document.getElementById("task").value = "";
}

function checkInputText(value, msg){
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

//UPDATE

//EDIT button
    function editItem(e) {
    var li = e.target.parentElement;
    var span = e.target;
    id = span.parentElement.id;
    var text = li.querySelectorAll('span')[0];
    var textValue = text.innerText;
    console.log(textValue);
    document.getElementById('task').value = textValue;
    function updateInputText(value,callback) {
        if(value === textValue) {
            return true;
        }
        return false;
    }
}

function updateFormData() {
    console.log('id is ' + id);
    var key = "todo" + id;
    var task = document.getElementById("task").value;
    var todoItem = new Todo(id, task);
    var item = JSON.stringify(todoItem);
    localStorage.setItem(key, item);

    todos = [];
    var myList = document.getElementById("todoList");
    while (myList.firstChild) {
        myList.removeChild(myList.firstChild);
    }
    getTodoItems();
    document.getElementById("task").value = "";
}

function getMaxId () {
    var k = 0;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.substring(0, 4) == "todo") {
            var item = localStorage.getItem(key);
            var todoItem = JSON.parse(item);
            k = Math.max(k, todoItem.id);
        }
    }
    return k;
}

function saveTodoItem(todoItem) {
    if (localStorage) {
        var key = "todo" + todoItem.id;
        var item = JSON.stringify(todoItem);
// JSON.stringify() takes an object and serializes it into JSON format;
        localStorage.setItem(key, item);
    }
    else {
        console.log("error: you don't have localStorage");
    }
}

//DELETE

function deleteItem(e) {
    var span = e.target;
    id = span.parentElement.id;
    console.log("delete an item: " + id);

    //find and remove item in localStorage
    var key = "todo" + id;
    localStorage.removeItem(key);

    //find and remove item in the  array
    for (var i = 0; i< todos.length; i++) {
        if(todos[i].id == id) {
            todos.splice(i,1);
            break;
        }
    }

    //find and remove the item in the page
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}
    

