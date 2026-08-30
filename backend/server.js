//entry point of server
// 1. Load Environment Variables (Must be loaded before other imports that use process.env)
// require("dotenv").config(); //import dotenv from "dotenv";/

//dotenv package reads your .env file and attaches those key-value pairs to process.env.

// const express = require("express"); //import connectDB from "./db/index.js";
// const cors = require("cors");
// const connectDB = require("./config/database");
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import todoRoutes from "./routes/todoRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// 1. Load Environment Variables first
dotenv.config();

// 2. Initialize Express App/It holds all server routing, configuration, and middleware setups.
const app = express(); // 1. Instantiate application container
//You canot atta configu, route handlers, or middleware to app until express() generates the instance object.

// 3. Connect to Database
connectDB();
//app.use() mounts middleware functions into the Express execution pipeline.
//Every incoming req passes sequentially through middleware registered with app.use() in exact order they are defined.
// 4. Global Middlewares
// Enable CORS so frontend (e.g. localhost:3000 or Live Server) can make requests to port 5000
app.use(cors()); // Express automatically appends these permission headers to every response

// app.use() registers middleware functions into Express's processing pipeline.
// If you do not pass a route path to app.use(), the middleware runs for every single request regardless of the path or HTTP method (GET, POST, DELETE).
// If you pass a path, like app.use('/api', router), it only executes for requests starting with /api.
// Parse incoming request payloads as JSON
app.use(express.json());
// 4. Mount API Routes (Phase 5 Integration)
app.use("/api/todos", todoRoutes);
//delegates all req starting with /api/todos to the router file (todoRoutes.js)
//Instead of writing every GET,POST,PUT handler inside server.js
// Parse incoming URL-encoded form data (if applicable)
// app.use(express.urlencoded({ extended: true })); //complex obj included

import path from "path";
import { fileURLToPath } from "url";
// path and url are built-in Node.js core modules
// path.join() normalizes slashes automatically so code runs seamlessly on any OS.

// fileURLToPath() converts standard file URLs (file:///C:/project/server/app.js) into OS-specific file path strings (C:\project\server\app.js).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//__dirname is a final module to os path problems
//xtracts the parent directory path containing that file

// Serve static frontend assets from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Fallback route serving index.html for root GET requests
//res.sendFile(): Transfers the physical file located at the specified path to the client
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html")); //..back in root direct and serve static file
});

// Centralized Error Handling Stack (Must be mounted AFTER all routes)
app.use(notFound);
app.use(errorHandler);
// placed AFTER routes:
// For valid routes (GET /api/todos): Express matches the path in todoRoutes, runs the controller, and sends a response. Execution stops there; it never reaches notFound.
// For invalid routes (GET /api/invalid-url): Express checks all routes, finds no match, and naturally "falls through" to notFound.
// For crashes/errors in routes: Express bypasses remaining normal routes and jumps directly down to errorHandler.

// 5. Root Health Check Route
// get is Express routing method,In REST APIs, GET requests are used to retrieve or fetch data from a server without modifying anythin
// placed directly in server.js as a temporary test route to confirm that Express is running
app.get("/health", (req, res) => {
  //Route Handler (req(obj),res(obj))=>{}
  //An asynchronous/synchronous callback function executed whenever a request matches both the method (GET) and path (/).
  //   http://localhost:5000/).(/)the path 5000/
  res.status(200).json({
    //Code 200 signifies OKorSuccess. Calling .status() returns the response object itself
    status: "success",
    message: "Server is healthy running cleanly",
  });
});
// 5. Catch-All Fallback for Unmatched Endpoints
// Triggered ONLY if no route in todoRoutes matched
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: Cannot ${req.method} ${req.originalUrl}`,
  });
});
// 6. Define Server Port & Listener
const PORT = process.env.PORT || 5000; //dotenv.config(path if req)

app.listen(PORT, () => {
  console.log(`[Server] Server is running on port http://localhost:${PORT}`);
});

//before routing
// Endpoints were hardcoded directly inside server.js, mixing server configuration with route logic:
//After Phase 5 (Modular Architecture)
// server.js acts strictly as an app orchestrator, delegating all route definitions to todoRoutes.js:
