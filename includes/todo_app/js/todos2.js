//todo.js
//01/02/18
// ;
// (function ( window, document, undefined) {

    //"use strict";


const update = document.getElementById('update');
const cancel = document.getElementById('cancel');


    window.onload = init;

    function Todo(id, task) {
        this.id = id;
        this.task = task;
    }
    

    var todos = new Array();

//CREATE 

    function init() {
        var submitButton = document.getElementById("submit");
        submitButton.onclick = getFormData;
        update.onclick = updateFormData;
        getTodoItems();

    }


    function getTodoItems() {
        if (localStorage) {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.substring(0, 4) == "todo") {
                    var item = localStorage.getItem(key);
                    var todoItem = JSON.parse(item);
//JSON.parse() takes a piece of data in JSON format and deserializes it into a JavaScript object
                    todos.push(todoItem);
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
        var ul = document.getElementById("todoList");
        var listFragment = document.createDocumentFragment();
        for (var i = 0; i< todos.length; i++) {
            var todoItem = todos[i];
            var li = createNewTodo(todoItem);
            listFragment.appendChild(li);
        }
        ul.appendChild(listFragment);
    }

//UPDATE

//Note:adds item to the page using the form
    function addTodoToPage(todoItem){
        var ul = document.getElementById("todoList");
        var li = createNewTodo(todoItem);
        ul.appendChild(li);
        document.forms[0].reset();
    }

    function createNewTodo(todoItem) {
        var li = document.createElement("li");
        li.setAttribute("id", todoItem.id);

        var spanTodo = document.createElement("span");
        spanTodo.innerHTML = todoItem.task;

    //Note: creates delete icon
        var spanDelete = document.createElement("span");
        spanDelete.setAttribute("id", todoItem.id);
        spanDelete.setAttribute("class","delete");
        spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

        spanDelete.onclick = deleteItem;
        
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
        
        var id = todos.length;
        var todoItem = new Todo(id, task);
        todos.push(todoItem);
        addTodoToPage(todoItem);
        saveTodoItem(todoItem);
            
            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                return true;
                }
            }, false);
    }

    function checkInputText(value, msg){
        if (value == null || value == "") {
            alert(msg);
            return true;
        }
        return false;
    }


    function updateFormData() {
       var id = localStorage.getItem(key);
       console.log('id is '+ key);

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
        var id = span.parentElement.id;
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
    


//Edit button

function editItem(e) {
    var li = e.target.parentElement;

    var span = e.target;
    var id = span.parentElement.id;

    var text = li.querySelectorAll('span')[0];
    var textValue = text.innerText;
    console.log(textValue);

    document.getElementById('task').value = textValue;

    }

