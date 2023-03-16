const bookList = document.getElementById('bookList');
const borrowedBooks = document.getElementById('borrowed-books-list');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');
const addBookButton = document.getElementById('add-book');

function fetchBooks() {
  fetch('https://seal-app-6t52v.ondigitalocean.app/books')
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
    titleInput.value = '';
    authorInput.value = '';
    pagesInput.value = '';
    postNewBook(newBook);
  }
});

function postNewBook(newBook) {
  fetch('https://seal-app-6t52v.ondigitalocean.app/books/newbook/', {
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
  fetch('https://seal-app-6t52v.ondigitalocean.app/books/' + bookId)
    .then((res) => res.json())
    .then((bookInfo) => {
      printBookInfo(bookInfo);
    });
}

function printBookInfo(bookInfo) {
  let bookInfoContainer = document.getElementById('book-info-container');
  let borrowBookButton = document.createElement('button');
  let closeInfoButton = document.createElement('button');

  bookInfoContainer.innerHTML = `<h3>Titel</h3> ${bookInfo.title} <h3>Författare</h3> ${bookInfo.author}<h3>Antal sidor</h3> ${bookInfo.pages} <br />`;
  bookInfoContainer.append(borrowBookButton, closeInfoButton);
  closeInfoButton.innerHTML = 'stäng';

  if (bookInfo.isAvalibale === true) {
    borrowBookButton.innerHTML = 'Låna bok';
  } else {
    borrowBookButton.innerHTML = 'Lämna tillbaka bok';
  }

  closeInfoButton.addEventListener('click', () => {
    bookInfoContainer.innerHTML = '';
  });

  borrowBookButton.addEventListener('click', () => {
    bookInfoContainer.innerHTML = '';
    toggle(bookInfo.id);
  });
}

function toggle(bookId) {
  fetch('https://seal-app-6t52v.ondigitalocean.app/books/toggle/' + bookId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toggle),
  }).then((res) => res.json());
  fetchBooks();
}

fetchBooks();
