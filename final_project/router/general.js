const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (userName) => {
    let sameNameUsers = users.filter((user) => {
      return user.username === userName;
    });
    if (sameNameUsers.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  
public_users.post("/register", (req, res) => {
 
    const userName = req.body.username;
    const password = req.body.password;
  
    if (userName && password) {
      if (!doesExist(userName)) {
        users.push({ username: userName, password: password });
        return res
          .status(200)
          .json({ message: "User is successfully registred. You can login now!" });
      } else {
        return res.status(404).json({ message: "Can't Login , User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register the user" });
  });
  


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBNumber = req.params.isbn;
  res.send(books[ISBNumber]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
if (authorBooks.length === 0) {
return res.status(300).json({ message: "Unable to find the Author" });
}

res.send(authorBooks);
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
 const getBook= Object.values(books).filter(book=> book.title===req.params.title);
 if(getBook.length===0){
    return res.status(300).json({ message: "Unable to find the Book by Title" });
 }
 res.send(getBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBNumber = req.params.isbn;
  res.send(books[ISBNumber].reviews);
});
function getBookList() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }
  
  public_users.get("/", function (req, res) {
    getBookList().then(
      (bk) => res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("rejected")
    );
  });
  
  function getFromISBN(isbn) {
    let curent_book = books[isbn];
    return new Promise((resolve, reject) => {
      if (curent_book) {
        resolve(curent_book);
      } else {
        reject("Unable to find book with given ISBN number");
      }
    });
  }
  
  public_users.get("/isbn/:isbn", function (req, res) {
    const isbn_number = req.params.isbn;
    getFromISBN(isbn_number).then(
      (bk) => res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    );
  });
  
  
  function getFromAuthor(author) {
    let answer = [];
    return new Promise((resolve, reject) => {
      for (var isbn_number in books) {
        let current_book = books[isbn_number];
        if (current_book.author === author) {
          answer.push(current_book);
        }
      }
      resolve(answer);
    });
  }
  
  public_users.get("/author/:author", function (req, res) {
    const author_name = req.params.author;
    getFromAuthor(author_name).then((result) =>
      res.send(JSON.stringify(result, null, 4))
    );
  });
  
  
  function getFromTitle(title) {
    let answer = [];
    return new Promise((resolve, reject) => {
      for (var isbn_number in books) {
        let current_book = books[isbn_number];
        if (current_book.title === title) {
          answer.push(current_book);
        }
      }
      resolve(answer);
    });
  }
  
  public_users.get("/title/:title", function (req, res) {
    const book_title = req.params.title;
    getFromTitle(book_title).then((result) =>
      res.send(JSON.stringify(result, null, 4))
    );
  });

module.exports.general = public_users;
