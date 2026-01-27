const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // Filtra para ver si el usuario existe
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  // Verifica si usuario y contraseña coinciden
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// TASK 7: Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    // Crear token JWT
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Guardar en sesión
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// TASK 8: Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];

  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username']; // Obtenemos usuario de la sesión
      
      if(review) {
          filtered_book.reviews[reviewer] = review;
          books[isbn] = filtered_book;
      }
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  }
  return res.status(404).json({message: "Invalid ISBN"});
});

// TASK 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];
  let filtered_book = books[isbn];

  if (filtered_book) {
      if (filtered_book.reviews[reviewer]) {
          delete filtered_book.reviews[reviewer];
          return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`);
      } else {
          return res.status(404).json({message: "No review found for this user on this book"});
      }
  }
  return res.status(404).json({message: "Invalid ISBN"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
