const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Función auxiliar para verificar si el usuario ya existe
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

// TASK 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// TASK 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Usamos JSON.stringify para formatear la salida (hint del lab)
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
});
  
// TASK 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({message: "No books found for this author"});
});

// TASK 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];

  bookKeys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }
  return res.status(404).json({message: "No books found with this title"});
});

// TASK 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
