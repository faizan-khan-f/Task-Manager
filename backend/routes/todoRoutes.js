//Defines WHERE req go.Maps HTTP verbs(GET,POST) and URL paths (/, /:id) to logic.
import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
} from "../controllers/todoController.js";
// Imports getTodos and attaches it as a handler                     │
// │    router.get('/', getTodos)
//mapping HTTP request paths to their corresponding controller functions.
const router = express.Router();

// Base Endpoint: /api/todos
router
  .route("/") //is route pr hi krna h
  .get(getTodos) // GET    /api/todos      -> Retrieve all todos
  .post(createTodo); // POST   /api/todos      -> Create a new todo
// Prefix Routing bcz of this express automaticall prepends
// '/' inside todoRoutes.js maps to /api/todos in server.js
// '/:id' inside todoRoutes.js maps to /api/todos/:id in serverjs

// separated because GET (get all) and POST (create) act on the entire collection without needing an ID,
//while GET by ID,PUT,and DELETE act on a single specific item

// Parameterized Endpoint: /api/todos/:id
router
  .route("/:id")
  .get(getTodoById) // GET    /api/todos/:id  -> Get todo by MongoDB _id
  .put(updateTodo) // PUT    /api/todos/:id  -> Full update of todo
  .delete(deleteTodo); // DELETE /api/todos/:id  -> Delete todo

// Specialized Endpoint: /api/todos/:id/status
router.patch("/:id/status", updateTodoStatus); // PATCH /api/todos/:id/status -> Update status only
//adding status go to status model and reduce load from whole data to completed etc
//reduce validation condns
export default router;
// SERVER (server.js)                                                  │
// │    Mounts router to base path:                                         │
// │    app.use('/api/todos', router)
