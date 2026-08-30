#TASK MASTER - Full-Stack(a task management system);

#RESTful Todo Application
A production-ready, full-stack Task Management application built with Vanilla JavaScript (ES6+), Node.js, Express.js, and MongoDB. This application features dynamic client-side state synchronization, robust backend input validation, centralized error handling, and unified static asset serving via Express.

#Key Features:

#Full CRUD Functionality: Create, read, update, toggle completion status, and delete tasks asynchronously without full page reloads.

#Client-Side Memory Sync: Operates on an in-memory array (todos) synchronized with backend responses for instant updates and minimal server overhead.

#RESTful API Design: Modular endpoint architecture following HTTP verb standards (GET, POST, PUT, PATCH, DELETE).

#Input Validation Guardrails: Custom middleware intercepts invalid payloads (missing titles, invalid priority levels, incorrect statuses) before touching the database.

#ES Modules (ESM) Architecture: Modern Node.js setup using import/export syntax alongside custom \_\_dirname resolution via Node's url module.

#Cross-OS Path Normalization: Reliable static file serving using path.join() across Linux, macOS, and Windows environments.

#Error Handling Boundary: Centralized Express error-handling middleware catches uncaught exceptions and database connection failures cleanly.

#Tech Stack:
Frontend
Vanilla JavaScript (ES6+): async/await, Fetch API, Array methods (map, filter, unshift)

#HTML5 & CSS3: Responsive UI layout, interactive forms, and real-time alert banners

#Backend & Database:

Runtime: Node.js (v18+)

Framework: Express.js (v4)

Database: MongoDB with Mongoose ODM

Utilities: cors, dotenv, path, url

#Project Architecture & Directory

StructurePlaintexttodo-app/
├── controllers/
│ └── todoController.js # Mongoose queries and business logic
├── middleware/
│ └── validate.js # Payload validation middleware
├── models/
│ └── Todo.js # Mongoose database schema & rules
├── routes/
│ └── todoRoutes.js # Modular Express endpoint routing
├── public/
│ ├── index.html # Main User Interface
│ ├── styles.css # Application layout styling
│ └── app.js # Fetch client & state management
├── .gitignore # Dependency & environment exclusion
├── package.json # Scripts and package manifests
└── server.js # Application entry point & DB connection

#Database Schema Model

The MongoDB collection is powered by the following Mongoose schema (models/Todo.js):JavaScript{
title: { type: String, required: true, trim: true, maxlength: 120 },
description: { type: String, trim: true, default: "" },
status: { type: String, enum: ["pending", "completed"], default: "pending" },
priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
dueDate: { type: Date, default: null },
timestamps: true // Automatically manages createdAt and updatedAt
}

#REST API ReferenceBase URL:
/api/todosHTTP MethodRouteDescriptionRequired Request BodyGET/api/todosFetch all tasks (sorted by newest)NonePOST/api/todosCreate a new task{ "title": "Task title", "priority": "high" }PUT/api/todos/:idFull update of existing task{ "title": "Updated title", "priority": "low" }PATCH/api/todos/:id/statusToggle completion status{ "status": "completed" }DELETE/api/todos/:idRemove task permanentlyNone
