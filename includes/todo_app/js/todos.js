//todo.js
//04/02/18

const update = document.getElementById('update');
// const PlaceHolderTitle = document.getElementById("ListTitle").placeholder;
// PlaceHolderTitle.style.visibility="hidden";
update.style.visibility="hidden";

const submit = document.getElementById('submit');
const ListTitle = document.getElementById("ListTitle");
const ul = document.getElementById("todoList");
var id;


//FADE_in

var body  = document.querySelector('body');
TweenLite.from(body, 1, {opacity:0});
// document.body.className += 'fade-out';

// document.addEventListener('DOMContentLoaded', function() {
//     document.body.className -= 'fade-out';
// })

window.onload = init;

function Todo(id, task) {
    this.id = id;
    this.task = task;
}
    
var todos = new Array();


/** CREATE
 * 
 */

function init() {
    var li = document.getElementsByTagName("li");
    ListTitle.onkeypress = submitListTitle;
    submit.onclick = getFormData;
    update.onclick= updateFormData;
    getTodoItems();
    getListTitle();

/**ANIMATIONS-1
 *  * TweenMax
 * TweenLite.to( [target object],
 *  [duration in seconds],
 *  [destination values] )
 */

    TweenLite.from([submit, task, update, ListTitle, ul], 1, {opacity:0});
    TweenMax.staggerFrom(["li:nth-child(odd)", "li:nth-child(even)", submit, update], 0.6, {scale:0.2}, 0.15);
    TweenLite.from(task, .5, {left:200});
    TweenLite.from("li:nth-child(odd)", 0.5, {left:200});
    TweenLite.from("li:nth-child(even)", 0.5, {right:200});
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

///ListTitle

function submitListTitle () {
    var text1 = document.getElementById("ListTitle").value;
    localStorage.setItem("ListTitle", text1);
    console.log("ListTitle submitted");
    }
    
function getListTitle() {
    document.getElementById("ListTitle").value = localStorage.getItem("ListTitle");
    }


/** READ
 * 
 */

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
        var li = createNewTodo(todoItem);
        ul.appendChild(li);
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
        spanDelete.innerHTML = '';
        spanDelete.onmouseover = lineThrough;
        spanDelete.onmouseleave = nolineThrough;
        spanDelete.onclick = deleteItem;
        
        
        //Note:create edit button
        var spanEdit = document.createElement("span");
        spanEdit.setAttribute("id",todoItem.id);
        spanEdit.setAttribute("class", "edit");
        spanEdit.innerHTML = '';
        spanEdit.onclick = editItem;

        li.appendChild(spanTodo);
        li.appendChild(spanDelete);
        li.appendChild(spanEdit);

        return li;
    }


    function getFormData(event){
        var task = document.getElementById("task").value;
        if (checkInputText(task, "Please enter a task")) return;

        var submitted = document.getElementsByClassName("submitted");
        TweenLite.to(submitted, 1, {visibility: 'visible'});
        TweenLite.from(submitted, 0.8, {scale:0.2});

        setTimeout(function() { 
            TweenLite.to(submitted, 1, {visibility: 'hidden'});

            
            
            id = getMaxId()+1;
            var todoItem = new Todo(id, task);
            todos.push(todoItem);
            addTodoToPage(todoItem);
            saveTodoItem(todoItem);            
            document.getElementById("task").value = ""; 

        }, 1000);
    
    }
    

    function checkInputText(value, msg){
        if (value == null || value == "") {
            alert(msg);
            return true;
        }
        return false;
    }


/** UPDATE
 *  EDIT BUTTON
 */
    function editItem(e) {
        update.style.visibility="visible";
        update.style.float = "left";
        submit.style.visibility = "hidden";

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
        var MyForm = document.getElementById("MyForm");
        MyForm.setAttribute("onsubmit", "updateFormData();return false");
    }


    function updateFormData() {
        update.style.visibility = "hidden";
        update.style.float = "right";
        submit.style.visibility = "visible";

        var edited = document.getElementsByClassName("edited");
        TweenLite.to(edited, 1, {visibility: 'visible'});
        TweenLite.from(edited, 0.8, {scale:0.2});

        setTimeout(function() { 
            TweenLite.to(edited, 1, {visibility: 'hidden'});
            console.log('id is ' + id);
            var key = "todo" + id;
            var task = document.getElementById("task").value;
            var todoItem = new Todo(id, task);
            var item = JSON.stringify(todoItem);
            localStorage.setItem(key, item);

            todos = [];
            // var myList = document.getElementById("todoList");
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
            getTodoItems();
            document.getElementById("task").value = "";
         }, 1200);
        var MyForm = document.getElementById("MyForm");
        MyForm.setAttribute("onsubmit", "getFormData();return false");
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


/**DELETE
 * 
 */

    function deleteItem(e) {
        update.style.float = "right";
        submit.style.visibility = "visible";

        var span = e.target;
        id = span.parentElement.id;
        var check = document.getElementsByClassName("check");
        TweenLite.to(check, 1, {visibility: 'visible'});
        TweenLite.from(check, 0.8, {scale:0.2});

        setTimeout(function() { 
            TweenLite.to(check, 1, {visibility: 'hidden'});
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
            ul.removeChild(li);

        }, 1200);
}
    

/**ANIMATIONS-2
 */

function lineThrough(e) {
    var li = e.target.parentElement;
    var span = e.target;
    var text = li.querySelectorAll('span')[0];
    text.style.textDecoration = "line-through";

    }

function nolineThrough(e) {
        var li = e.target.parentElement;
        var span = e.target;
        var text = li.querySelectorAll('span')[0];
        text.style.textDecoration = "none";
 
        }

