# LiveChatX

 A simple real-time chat application built with a React frontend and a Node.js backend.

 ## Project Structure

```
LiveChatX/
├── chat-frontend/    # React 
├── chat-backend/     # Node.js backend
└── README.md
```

 ## Tech Stack

 ### Frontend

 - React
- TypeScript
- Vite
- Socket.IO Client

 ### Backend

 - Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB

 ## Features

 - User authentication
- Real-time messaging
- Send messages
- Delete messages
- Clear chat
- JWT authentication
- Socket.IO real-time communication

 ## Getting Started

 ### 1\. Clone the repository

```
git clone <your-repository-url>
cd LiveChatX
```

 ### 2\. Start the Backend

```
cd chat-backend
npm install
npm run dev
```

 The backend runs on:

```
http://localhost:3000
```

 ### 3\. Start the Frontend

 Open another terminal:

```
cd chat-frontend
npm install
npm run dev
```

 The frontend will be available at the URL shown by Vite, usually:

```
http://localhost:5173
```

 ## Environment Variables

 Create a `.env` file inside `chat-backend` and add the required configuration.

 Example:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

 Do not commit your `.env` file to Git.

 ## API

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/message
POST   /api/message
DELETE /api/message/:id
DELETE /api/message
```

 ## Development

 Run the frontend and backend in separate terminals:

```
# Terminal 1
cd chat-backend
npm run dev
```

```
# Terminal 2
cd chat-frontend
npm run dev
```

 ## License

 This project is for learning and development purposes.