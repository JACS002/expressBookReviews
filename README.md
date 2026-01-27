# Node.js & Express Book Reviews Project

This repository contains the complete solution for the final project of the **IBM Developing Back-End Apps with Node.js and Express** course.

## Implemented Routes

### Public Routes (General Users)
- `GET /` - Get the book list available in the shop.
- `GET /isbn/:isbn` - Get book details based on ISBN.
- `GET /author/:author` - Get book details based on the author.
- `GET /title/:title` - Get book details based on the title.
- `GET /review/:isbn` - Get book reviews based on ISBN.
- `POST /register` - Register a new user.

### Authenticated Routes (Registered Users)
- `POST /customer/login` - Login as a registered user.
- `PUT /customer/auth/review/:isbn` - Add or modify a book review.
- `DELETE /customer/auth/review/:isbn` - Delete a book review posted by the logged-in user.
