# talkative_chat
Talkative – Real-Time Chat Application

Talkative is a real-time chat application similar to WhatsApp that allows users to communicate through one-to-one chats and group chats. It supports user authentication, profile management, file sharing, and real-time messaging using Socket.IO.


Features

🔐 User Authentication

Sign up & login

Secure user sessions

👤 User Profile

Upload and update profile picture

View user details

💬 Real-Time Chat

One-to-one personal chat

Group chat creation and management

Real-time message delivery using Socket.IO

📎 File Sharing

Send documents and files

Share media in chats

👥 Group Chats

Create groups

Add/remove users

Group messaging in real time



Tech Stack
Frontend

React (or your frontend framework)

HTML, CSS,chakra ui, JavaScript

Socket.IO Client

Backend

Node.js

Express.js

Socket.IO

Database

MongoDB (or your database)

Other Tools

Git & GitHub

REST APIs

JWT Authentication (if used)

Multer / Cloud storage (for file uploads)




How It Works (Flow)

User signs up or logs in

User connects to the server via Socket.IO

User can:

Start one-to-one chat

Create or join group chats

Messages are sent and received in real time

Messages and files are stored in the database

Profile updates (like profile picture) are saved and reflected instantly







Installation & Setup

1. backend setup
cd backend
npm install
npm start

2. Frontend setup
cd frontend
npm install
npm start



Environment Variables

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
