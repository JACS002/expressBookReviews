const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

// TASK 1: Get the book list available in the shop (USANDO PROMESAS)
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        // Simulamos una operación asíncrona
        if (books) {
            resolve(books);
        } else {
            reject({message: "Books not found"});
        }
    })
    .then((data) => {
        return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch((err) => {
        return res.status(500).json(err);
    });
});

// TASK 2: Get book details based on ISBN (USANDO PROMESAS)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({message: "Book not found"});
        }
    })
    .then((book) => {
        return res.status(200).json(book);
    })
    .catch((err) => {
        return res.status(404).json(err);
    });
});
  
// TASK 3: Get book details based on author (USANDO ASYNC/AWAIT)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    // Envolvemos la búsqueda en una promesa
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const booksByAuthor = [];

        bookKeys.forEach(key => {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        });

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject({message: "No books found for this author"});
        }
    });

    try {
        const result = await getBooksByAuthor;
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json(error);
    }
});

// TASK 4: Get all books based on title (USANDO ASYNC/AWAIT)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const booksByTitle = [];

        bookKeys.forEach(key => {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        });

        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject({message: "No books found with this title"});
        }
    });

    try {
        const result = await getBooksByTitle;
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json(error);
    }
});

// TASK 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
