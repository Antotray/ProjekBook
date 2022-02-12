const UNCOMPLETED_BOOK_LIST_ID = "incompleteBook";
const COMPLETED_BOOK_LIST_ID = "completeBook";
const BOOK_ITEMID = "bookId";

function makeBook(title, author, year, isCompleted) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerHTML = "Penulis : " + '<span class="book-author">' + author + "</span>";

    const textYear = document.createElement("p");
    textYear.innerHTML = "Tahun Terbit : " + '<span class="book-year">' + year + "</span>";

    const container = document.createElement("article");
    container.classList.add("book_item");

    const containerButton = document.createElement("div");
    containerButton.classList.add("action");

    if (isCompleted) {
        firstButton = createUncheckButton();
        secondButton = createTrashButton();
    } else {
        firstButton = createCheckButton();
        secondButton = createTrashButton();
    }
    containerButton.append(firstButton, secondButton);

    container.append(textTitle, textAuthor, textYear, containerButton);

    return container;
}

function createUncheckButton() {
    return createButton("green", "Belum selesai dibaca", function (event) {
        undoTaskFromCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus Buku", function (event) {
        removeTaskFromCompleted(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function (event) {
        addTaskToCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, text, eventListener) {
    const button = document.createElement("button");
    button.innerText = text;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBook() {
    const uncompleteBOOKlist = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    const CompletedBOOKList = document.getElementById(COMPLETED_BOOK_LIST_ID);
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(bookTitle, bookAuthor, bookYear, isCompleted);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted, false);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    if (isCompleted) {
        CompletedBOOKList.append(book);
    } else {
        uncompleteBOOKlist.append(book);
    }
    updateDataToStorage();
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_BOOK_LIST_ID);
    const bookTitle = taskElement.querySelector(".book_shelf > .book_list > .book_item > h3").innerText;
    const bookAuthor = taskElement.querySelector(".book-author").innerText;
    const bookYear = taskElement.querySelector(".book-year").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    const bookTitle = taskElement.querySelector(".book_shelf > .book_list > .book_item > h3").innerText;
    const bookAuthor = taskElement.querySelector(".book-author").innerText;
    const bookYear = taskElement.querySelector(".book-year").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const Uncompletedlist = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    let Completedlist = document.getElementById(COMPLETED_BOOK_LIST_ID);

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isCompleted){
            Completedlist.append(newBook);
        } else {
            Uncompletedlist.append(newBook);
        }
    }
}

const searchBookTitle = document.querySelector("#searchBookTitle");
searchBookTitle.addEventListener("keyup", pencarianList);

function pencarianList(e) {
    const searchBookTitle = e.target.value.toLowerCase();
    let itemList = document.querySelectorAll(".book_list");

    itemList.forEach((item) => {
        const  isiItem = item.firstChild.textContent.toLowerCase();

        if(isiItem.indexOf(searchBook) != -1){
            item.setAttribute("style", "display: block;");
        } else {
            item.setAttribute("style", "display: none !important;");
        }
    });
}