const bookList = document.getElementById('bookList');
const borrowedBooks = document.getElementById('borrowed-books-list');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');
const addBookButton = document.getElementById('add-book');

function fetchBooks() {
  fetch('http://localhost:3012/books')
    .then((res) => res.json())
    .then((books) => {
      renderBooks(books);
      printBorrowedBooks(books);
    });
}

function printBorrowedBooks(books) {
  let unavalibaleBooks = books.filter((book) => book.isAvalibale === false);
  borrowedBooks.innerHTML = '';
  for (let i = 0; i < unavalibaleBooks.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = unavalibaleBooks[i].title;

    borrowedBooks.appendChild(li);
  }
}

addBookButton.addEventListener('click', () => {
  if (
    titleInput.value == '' ||
    authorInput.value == '' ||
    pagesInput.value == ''
  ) {
    console.log('du måste fylla i fälten');
  } else {
    let newBook = {
      title: titleInput.value,
      author: authorInput.value,
      pages: pagesInput.value,
      isAvalibale: true,
    };
    postNewBook(newBook);
  }
});

function postNewBook(newBook) {
  fetch('http://localhost:3012/books/newbook/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook),
  }).then((res) => res.json());
  fetchBooks();
}

function renderBooks(books) {
  bookList.innerHTML = '';
  for (let i = 0; i < books.length; i++) {
    let li = document.createElement('li');
    let bookInfoButton = document.createElement('button');
    li.innerHTML = `${books[i].title}`;
    bookInfoButton.innerHTML = 'info om bok';
    bookList.append(li, bookInfoButton);

    bookInfoButton.addEventListener('click', () => {
      let bookId = books[i].id;
      fetchBookInfo(bookId);
    });
  }
}

function fetchBookInfo(bookId) {
  fetch('http://localhost:3012/books/' + bookId)
    .then((res) => res.json())
    .then((bookInfo) => {
      printBookInfo(bookInfo);
    });
}

function printBookInfo(bookInfo) {
  let bookInfoContainer = document.getElementById('book-info-container');
  let borrowBookButton = document.createElement('button');

  bookInfoContainer.innerHTML = `Titel: ${bookInfo.title} <br />Författare: ${bookInfo.author}<br />Antal sidor: ${bookInfo.pages} <br />`;
  bookInfoContainer.appendChild(borrowBookButton);

  if (bookInfo.isAvalibale === true) {
    borrowBookButton.innerHTML = 'Låna bok';
  } else {
    borrowBookButton.innerHTML = 'Lämna tillbaka bok';
  }

  borrowBookButton.addEventListener('click', () => {
    bookInfoContainer.innerHTML = '';
    toggle(bookInfo.id);
  });
}

function toggle(bookId) {
  fetch('http://localhost:3012/books/toggle/' + bookId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toggle),
  }).then((res) => res.json());
  fetchBooks();
}

fetchBooks();
