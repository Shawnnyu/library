class Book {
  constructor(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = Boolean(haveRead);
    this.id = new Number();
  }
  info() {
    return [this.author, this.pages];
  }
}

class Library {
  constructor() {
    this.library = [];
    this.idGenerator = 0;
  }

  addBookToLibrary(book) {
    book.id = this.idGenerator;
    this.library.push(book);
    this.idGenerator++;
  }

  deleteBookFromLibrary(id) {
    console.log(`in delete ${id}`);
    this.library.splice(
      this.library.findIndex((book) => book.id == id),
      1
    );
  }

  getLibrary() {
    return this.library;
  }

  sortAZ() {
    const sorted = [...this.library].sort(function (a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });

    return sorted;
  }

  sortZA() {
    const sorted = [...this.library].sort(function (a, b) {
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    });

    return sorted;
  }

  sortNewest() {
    const sorted = [...this.library].sort(function (a, b) {
      if (a.id > b.id) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    });

    return sorted;
  }

  sortOldest() {
    const sorted = [...this.library].sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });

    return sorted;
  }

  filterRead() {
    const read = [...this.library].filter((book) => book.haveRead === true);
    return read;
  }

  filterUnread() {
    const unread = [...this.library].filter((book) => book.haveRead === false);
    return unread;
  }
}

/* load elements */

const libContainer = document.getElementById("library-container");
const booksContainer = document.getElementById("books-container");
const newBookBtn = document.querySelector("#newBookBtn");
const newBookSticky = document.querySelector(".newBookSticky");
const bookDialog = document.getElementById("bookDialog");
const submitBtn = document.querySelector("#submitBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const newBookForm = document.querySelector("#newBookForm");

const newBookTitle = document.querySelector("#new-title");
const newBookAuthor = document.querySelector("#new-author");
const newBookPages = document.querySelector("#new-pages");
const newBookCompleted = document.querySelector("#completed");

const header = document.querySelector("header");
const selectEl = header.querySelector("select");
const bookCount = document.querySelector("#books-count");

let bookCountValue = new Number();
this.library = new Library();

/*** library ***/
function loadLibrary(library) {
  for (const book of library) {
    bookCard = createCard(book);
    bookCard.bookObject = book;
    booksContainer.insertBefore(bookCard, booksContainer.lastElementChild);
  }
  bookCount.innerHTML = `Count: ${library.length}`;
  bookCountValue = library.length;
}

function createCard(book) {
  const bookCard = document.createElement("div");
  bookCard.className = "book";

  const title = document.createElement("div");
  title.className = "title";
  title.appendChild(generateContent(`"${book.title}"`));
  bookCard.appendChild(title);

  const info = document.createElement("div");
  info.className = "info";
  info.appendChild(generateContent(`By: ${book.author}`));
  info.appendChild(generateContent(`Pages: ${book.pages}`));
  const finished = generateContent("Finished?");
  info.appendChild(finished);
  const complete = document.createElement("input");
  complete.type = "checkbox";
  complete.name = "finished";
  complete.checked = book.haveRead ? true : false;

  //change shadow color if book has been read
  if (complete.checked) bookCard.classList.add("have-read");

  //check the finished box
  complete.addEventListener("change", (e) => {
    const index = library.library.findIndex((x) => x.id == e.target.offsetParent.offsetParent.bookObject.id);
    if (complete.checked) {
      library.library[index].haveRead = true;
      bookCard.classList.add("have-read");
    } else {
      library.library[index].haveRead = false;
      bookCard.classList.remove("have-read");
    }
  });
  finished.insertAdjacentElement("beforeend", complete);
  bookCard.appendChild(info);

  //adding delete function
  const deleteBookBtn = document.createElement("button");
  deleteBookBtn.className = "deleteBtn";
  deleteBookBtn.textContent = "X";
  bookCard.appendChild(deleteBookBtn);
  deleteBookBtn.onclick = () => deleteBook(book.id, bookCard);

  return bookCard;
}

function generateContent(text) {
  const para = document.createElement("p");
  const content = document.createTextNode(text);
  para.appendChild(content);

  return para;
}

/***  Book  ***/

newBookBtn.addEventListener("click", () => {
  bookDialog.showModal();
});

newBookSticky.addEventListener("click", () => {
  bookDialog.showModal();
});

function createBook() {
  completed = newBookCompleted.checked ? true : false;
  const book = new Book(newBookTitle.value, newBookAuthor.value, newBookPages.value, completed);
  library.addBookToLibrary(book);
}

cancelBtn.addEventListener("click", () => {
  bookDialog.close(cancelBtn.value);
});

function bookFormSubmit() {
  createBook();
  filterBooks();
}

bookDialog.addEventListener("close", () => {
  [newBookTitle.value, newBookAuthor.value, newBookPages.value, newBookCompleted.checked] = [null, null, null, false];
  console.log(bookDialog.returnValue);
});

//submitBtn.onclick = bookFormSubmit;
newBookForm.onsubmit = bookFormSubmit;

function deleteBook(bookId, card) {
  library.deleteBookFromLibrary(bookId);
  booksContainer.removeChild(card);
  bookCount.innerHTML = `Count: ${--bookCountValue}`;
  console.log(`Deleting id: ${bookId}`);
  console.log(library.getLibrary());
}

selectEl.addEventListener("change", filterBooks);

function filterBooks() {
  filteredLibrary = [];
  switch (selectEl.value) {
    case "default":
      filteredLibrary = library.getLibrary();
      break;
    case "A-Z":
      filteredLibrary = library.sortAZ();
      break;
    case "Z-A":
      filteredLibrary = library.sortZA();
      break;
    case "Read books":
      filteredLibrary = library.filterRead();
      break;
    case "Unread books":
      filteredLibrary = library.filterUnread();
      break;
    case "Newest":
      filteredLibrary = library.sortNewest();
      break;
    case "Oldest":
      filteredLibrary = library.sortOldest();
      break;
  }
  while (booksContainer.childNodes.length > 2) {
    booksContainer.removeChild(booksContainer.firstChild);
  }
  console.log(filteredLibrary);
  loadLibrary(filteredLibrary);
}

//Load some sample books
window.onload = function () {
  let book1 = new Book("Sample Title 1", "Sample Author 1", 328, true);
  let book2 = new Book("Sample Title 2", "Sample Author 2", 416, false);

  library.addBookToLibrary(book1);
  library.addBookToLibrary(book2);

  loadLibrary(this.library.library);
};
