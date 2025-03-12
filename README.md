# Feedback Management API

This is a backend API built with **Node.js** and **Express**. The core functionality of the API revolves around user authentication, post management, and voting systems. Users can register, login, and manage their posts (create, read, update, delete). Additionally, users can vote on posts, with the restriction that they can only vote once. If they vote again, it unvotes their previous vote. There’s also a feature for recovering forgotten passwords via email.

## Key Features:
- **User Authentication**: Sign up, log in, and password recovery via email.
- **Post Management**: Create, edit, delete, and view posts with a title, message, and image.
- **Voting System**: Users can vote on posts, but only once per post. Voting again will remove their previous vote.
- **Email Recovery**: Users can reset their password through email.

## Technologies Used:
- **Node.js** + **Express** for building the API.
- **MongoDB** for the database.
- **JWT** for user authentication.

[API Documentation Link](https://documenter.getpostman.com/view/42604255/2sAYdkG8Zo)
