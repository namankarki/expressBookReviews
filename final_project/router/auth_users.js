const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let all_users = [{ username: "naman", password: "s-t-f-11" }];

const isValid = (username) => {
  const same_users = all_users.filter((user) => user.username === username);
  return same_users.length > 0;
};

const authenticatedUser = (username, password) => {
  const matched_users = all_users.filter(
    (user) => user.username === username && user.password === password
  );
  return matched_users.length > 0;
};

regd_users.post("/login", (req, res) => {
  console.log("login: ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Login is successful by the User");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login , Please check the Username and Password again!!" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn_number = req.params.isbn;
  const book_review = req.body.review;
  const username = req.session.authorization.username;
  console.log("add review: ", req.params, req.body, req.session);
  if (books[isbn_number]) {
    let book = books[isbn_number];
    book.reviews[username] = book_review;
    return res.status(200).send("Review is successfully registered with the Book");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn_number} not found, please check ISBN again!` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn_number = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn_number]) {
    let book = books[isbn_number];
    delete book.reviews[username];
    return res.status(200).send("Successfully Deleted the Review");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn_number} not found , please check ISBN again!` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = all_users;