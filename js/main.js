/* Start Form */
const openForm = document.getElementById("openForm");
const closeForm = document.getElementById("closeForm");

openForm.addEventListener("click", function () {
  document.getElementById("overlayForm").style.display = "flex";
});

closeForm.addEventListener("click", function () {
  document.getElementById("overlayForm").style.display = "none";
});
/* End Form */

/*
 *
 *
 *
 *
 */

/* Start Book */
const storeData = [];
const RENDER_EVENT = "render-book";
const UNFINISHED_BOOK_ID = "incompleteBook";
const FINISHED_BOOK_ID = "completeBook";
/* End Book  */

/* Start Add Book */
function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const yearInput = document.getElementById("inputBookYear");
  const year = parseInt(yearInput.value, 10);
  const category = document.getElementById("inputBookCategory").value;
  const image = document.getElementById("inputBookImage").value;
  const isFinished = document.getElementById("inputBookIsFinish").checked;

  const generateID = generateId();
  const bookObject = makeBookObject(
    generateID,
    title,
    author,
    year,
    category,
    image,
    isFinished
  );
  storeData.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
  unfinishBookLength();
  finishBookLength();
}
/* End Add Book */

/* Start Submit */
document.addEventListener("DOMContentLoaded", function () {
  let bookSubmit = document.getElementById("inputBook");
  bookSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    removeInput();
  });

  if (storageExist()) {
    loadData();
  }
});
/* End Submit */

/* Start Remove Input */
function removeInput() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookCategory").value = "";
  document.getElementById("inputBookImage").value = "";
  document.getElementById("inputBookIsFinish").checked = false;
  document.getElementById("overlayForm").style.display = "none";
}
/* End Remove Input */

/* Start Render Book */
document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById(UNFINISHED_BOOK_ID);
  const finishedBook = document.getElementById(FINISHED_BOOK_ID);

  unfinishedBook.innerHTML = "";
  finishedBook.innerHTML = "";

  for (const book of storeData) {
    const bookElement = newBook(book);

    if (!book.isFinished) unfinishedBook.append(bookElement);
    else finishedBook.append(bookElement);
  }
});
/* End Render Book */

/* Start Book Object */
function generateId() {
  return +new Date();
}

function makeBookObject(id, title, author, year, category, image, isFinished) {
  return {
    id,
    title,
    author,
    year,
    category,
    image,
    isFinished,
  };
}
/* End Book Object */

/* Start Create Book */
function newBook(bookObject) {
  const bookImage = document.createElement("img");
  bookImage.setAttribute("src", bookObject.image);

  const bookCover = document.createElement("div");
  bookCover.classList.add("book-img");
  bookCover.append(bookImage);

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const bookCategory = document.createElement("p");
  bookCategory.innerText = bookObject.category;

  const bookContent = document.createElement("div");
  bookContent.classList.add("book-content");
  bookContent.append(bookTitle, bookAuthor, bookYear, bookCategory);

  const bookAction = document.createElement("div");
  bookAction.classList.add("book-action");

  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.append(bookContent, bookAction);

  if (bookObject.isFinished) {
    const undoButtonIcon = document.createElement("span");
    undoButtonIcon.classList.add("fa-solid");
    undoButtonIcon.classList.add("fa-rotate-left");

    const undoButton = document.createElement("button");
    undoButton.classList.add("unread-btn");
    undoButton.append(undoButtonIcon);

    undoButton.addEventListener("click", function () {
      addUnfinishBook(bookObject.id);
    });

    const removeButtonIcon = document.createElement("span");
    removeButtonIcon.classList.add("fa-solid");
    removeButtonIcon.classList.add("fa-trash");

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.append(removeButtonIcon);

    removeButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    bookAction.append(undoButton, removeButton);
  } else {
    const readButtonIcon = document.createElement("span");
    readButtonIcon.classList.add("fa-solid");
    readButtonIcon.classList.add("fa-check");

    const readButton = document.createElement("button");
    readButton.classList.add("read-btn");
    readButton.append(readButtonIcon);

    readButton.addEventListener("click", function () {
      addFinishBook(bookObject.id);
    });

    const removeButtonIcon = document.createElement("span");
    removeButtonIcon.classList.add("fa-solid");
    removeButtonIcon.classList.add("fa-trash");

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.append(removeButtonIcon);

    removeButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    bookAction.append(readButton, removeButton);
  }

  const bookList = document.createElement("article");
  bookList.classList.add("book");
  bookList.append(bookImage, bookItem);

  return bookList;
}
/* End Create Book */

// ADD READ BOOK
function addFinishBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isFinished = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unfinishBookLength();
  finishBookLength();
}

// ADD UNREAD BOOK
function addUnfinishBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isFinished = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unfinishBookLength();
  finishBookLength();
}
function findBook(bookId) {
  for (const book of storeData) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}
// REMOVE BOOK
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  storeData.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  unfinishBookLength();
  finishBookLength();
}

function findBookIndex(bookId) {
  for (const index in storeData) {
    if (storeData[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
function totalBookLength() {}
function unfinishBookLength() {
  const totalUnfinishBook = document.getElementById("totalUnfinishBook");
  let count = 0;

  for (const book of storeData) {
    if (!book.isFinished) {
      count++;
    }
  }

  totalUnfinishBook.innerText = count;

  return count;
}
function finishBookLength() {
  const totalFinishBook = document.getElementById("totalFinishBook");
  let count = 0;

  for (const book of storeData) {
    if (book.isFinished) {
      count++;
    }
  }

  totalFinishBook.innerText = count;

  return count;
}

const searchBook = document.getElementById("searchBookTitle");

searchBook.addEventListener("keyup", function (event) {
  const searchValue = event.target.value.toLowerCase();
  const books = document.querySelectorAll(".book-list article");

  books.forEach((book) => {
    const bookTitle = book
      .querySelector(".book-content h3")
      .innerText.toLowerCase();
    if (bookTitle.includes(searchValue)) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }
  });
});

const searchSubmit = document.getElementById("searchSubmit");

searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
});

const STORAGE_KEY = "READING_ROOM";
const SAVED_EVENT = "saved-book";

function storageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage.");
    return false;
  }
  return true;
}

function saveData() {
  if (storageExist()) {
    const parsed = JSON.stringify(storeData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("SAVED_EVENT"));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      storeData.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
