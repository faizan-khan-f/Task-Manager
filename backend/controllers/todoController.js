// controllers are funcns that contain the core business logic of your backend.
//They act as the middleman between your API routes (which listen for incoming web requests) and your database models(todos)

//imports are required in the controller file because they provide the tools needed to interact with the database and validate incoming requests.
// import mongoose from "mongoose";
// import Todo from "../models/todo.model.js";

// /**
//  * Utility helper to validate MongoDB ObjectId format
//  */
// //Creates a shortcut func or tool in memory named isValidObjectId.
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id); //return true/false
// //arrow funcn that takes one param id (the ID string sent from the client request URL(24digi hexstring)).
// //Sends a clear 400 Bad Request informing the client that their input was malformed

// // ==========================================
// // 1. GET ALL TODOS
// // Route: GET /api/todos
// // ==========================================
// // Population of lists & dashboards todos array as data whole;
// export const getTodos = async (req, res) => {
//   try {
//     // Fetch all todos from MongoDB sorted by newest first
//     const todos = await Todo.find().sort({ createdAt: -1 });
//     //Queries MongoDB via Mongoose to retrieve all documents from the collection,
//     //sorts them in descending order (-1) by createdAt (newest first), and pauses execution (await) until MongoDB completes the query.
//     //status is a mrthod of res obj .json just extend it
//     //API uses a standardized JSON response structure
//     res.status(200).json({
//       success: true,
//       count: todos.length,
//       data: todos, //embeds the array of todo items inside that field for client consuming
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to fetch todos",
//       error: error.message, //avaScript's built-in Error object and attaches it to the error property of your JSON response.
//     });
//   }
// };

// // ==========================================
// // 2. GET SINGLE TODO BY ID
// // Route: GET /api/todos/:id
// // ==========================================
// // Task details, modals, edit screens object(todo)
// export const getTodoById = async (req, res) => {
//   try {
//     //xpress captures the URL parameter and stores it inside req.params as an object:
//     //const id =req.params.id; same
//     const { id } = req.params;
//     //If a user visits /api/todos/66ce1a2b3c4d5e6f7a8b9c0d, id becomes "66ce1a2b3c4d5e6f7a8b9c0d"

//     // Validate MongoDB ObjectId format
//     //performing when to check the ID during an incoming HTTP request.
//     if (!isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Todo ID format",
//       });
//     }

//     //Queries MongoDB using Mongoose's findById method.Execpauses(await) until
//     //MongoDB searches the collection and returns either the matching document object or null.
//     const todo = await Todo.findById(id);

//     //statement to check if the database returned null
//     if (!todo) {
//       return res.status(404).json({
//         success: false,
//         message: `Todo not found with ID: ${id}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: todo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to fetch todo",
//       error: error.message,
//     });
//   }
// };

// // ==========================================
// // 3. CREATE A NEW TODO
// // Route: POST /api/todos
// // ==========================================
// export const createTodo = async (req, res) => {
//   try {
//     const { title, description, dueDate, priority } = req.body;
//     //req is obj created by express inside objs body(content) .param(id) req.headers(metadata)
//     // Field Validation: Title is required
//     if (!title || title.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Title is required",
//       });
//     }

//     // Field Validation: Priority value
//     if (
//       priority &&
//       !["low", "medium", "high"].includes(priority.toLowerCase())
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Priority must be low, medium, or high",
//       });
//     }

//     // Field Validation: Due Date format
//     if (dueDate && isNaN(Date.parse(dueDate))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid due date format",
//       });
//     }

//     // Create and save document in MongoDB
//     const newTodo = await Todo.create({
//       title,
//       description,
//       dueDate,
//       priority,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Todo created successfully",
//       data: newTodo,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(", "),
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to create todo",
//       error: error.message,
//     });
//   }
// };

// // ==========================================
// // 4. UPDATE TODO (FULL EDIT)
// // Route: PUT /api/todos/:id
// // ==========================================
// export const updateTodo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, dueDate, priority, status } = req.body;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Todo ID format",
//       });
//     }

//     if (title !== undefined && title.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Title cannot be empty",
//       });
//     }

//     if (
//       priority &&
//       !["low", "medium", "high"].includes(priority.toLowerCase())
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Priority must be low, medium, or high",
//       });
//     }

//     if (status && !["pending", "completed"].includes(status.toLowerCase())) {
//       return res.status(400).json({
//         success: false,
//         message: "Status must be pending or completed",
//       });
//     }

//     if (dueDate && isNaN(Date.parse(dueDate))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid due date format",
//       });
//     }

//     // Update document and return the modified object
//     const updatedTodo = await Todo.findByIdAndUpdate(
//       id,
//       { title, description, dueDate, priority, status },
//       { new: true, runValidators: true },
//     );

//     if (!updatedTodo) {
//       return res.status(404).json({
//         success: false,
//         message: `Todo not found with ID: ${id}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Todo updated successfully",
//       data: updatedTodo,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(", "),
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to update todo",
//       error: error.message,
//     });
//   }
// };

// // ==========================================
// // 5. UPDATE TODO STATUS ONLY (PARTIAL EDIT)
// // Route: PATCH /api/todos/:id/status
// // ==========================================
// export const updateTodoStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Todo ID format",
//       });
//     }

//     if (!status || !["pending", "completed"].includes(status.toLowerCase())) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required and must be pending or completed",
//       });
//     }

//     const updatedTodo = await Todo.findByIdAndUpdate(
//       id,
//       { status: status.toLowerCase() },
//       { new: true, runValidators: true },
//     );

//     if (!updatedTodo) {
//       return res.status(404).json({
//         success: false,
//         message: `Todo not found with ID: ${id}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Todo status updated successfully",
//       data: updatedTodo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to update status",
//       error: error.message,
//     });
//   }
// };

// // ==========================================
// // 6. DELETE TODO
// // Route: DELETE /api/todos/:id
// // ==========================================
// export const deleteTodo = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Todo ID format",
//       });
//     }

//     const deletedTodo = await Todo.findByIdAndDelete(id);

//     if (!deletedTodo) {
//       return res.status(404).json({
//         success: false,
//         message: `Todo not found with ID: ${id}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Todo deleted successfully",
//       data: deletedTodo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error: Unable to delete todo",
//       error: error.message,
//     });
//   }
// };
//express 5 automatically handles try catch and helps in throwing error
import mongoose from "mongoose";
import Todo from "../models/todo.model.js";

/**
 * Utility helper to validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==========================================
// 1. GET ALL TODOS
// Route: GET /api/todos
// ==========================================
export const getTodos = async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
};

// ==========================================
// 2. GET SINGLE TODO BY ID
// Route: GET /api/todos/:id
// ==========================================
export const getTodoById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID format"); //errorHandler builds and sends the JSON
    // Express 5 automatically intercepts this thrown error and forwards err, req, res, and next directly to your global errorHandler middleware.
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    res.status(404);
    throw new Error(`Todo not found with ID: ${id}`);
  }

  res.status(200).json({
    success: true,
    data: todo,
  });
};

// ==========================================
// 3. CREATE A NEW TODO
// Route: POST /api/todos
// ==========================================
export const createTodo = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || title.trim() === "") {
    res.status(400);
    throw new Error("Title is required");
  }

  if (priority && !["low", "medium", "high"].includes(priority.toLowerCase())) {
    res.status(400);
    throw new Error("Priority must be low, medium, or high");
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400);
    throw new Error("Invalid due date format");
  }

  const newTodo = await Todo.create({
    title: title.trim(),
    description: description ? description.trim() : "",
    dueDate,
    priority: priority ? priority.toLowerCase() : "medium",
  });
  // ❌ THIS CODE NEVER RUNS if Mongoose throws an error validation error etc
  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: newTodo,
  });
};

// ==========================================
// 4. UPDATE TODO (FULL EDIT)
// Route: PUT /api/todos/:id
// ==========================================
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID format");
  }

  if (title !== undefined && title.trim() === "") {
    res.status(400);
    throw new Error("Title cannot be empty");
  }

  if (priority && !["low", "medium", "high"].includes(priority.toLowerCase())) {
    res.status(400);
    throw new Error("Priority must be low, medium, or high");
  }

  if (status && !["pending", "completed"].includes(status.toLowerCase())) {
    res.status(400);
    throw new Error("Status must be pending or completed");
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400);
    throw new Error("Invalid due date format");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description, dueDate, priority, status },
    { new: true, runValidators: true },
  );

  if (!updatedTodo) {
    res.status(404);
    throw new Error(`Todo not found with ID: ${id}`);
  }

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
};

// ==========================================
// 5. UPDATE TODO STATUS ONLY (PARTIAL EDIT)
// Route: PATCH /api/todos/:id/status
// ==========================================
export const updateTodoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID format");
  }

  if (!status || !["pending", "completed"].includes(status.toLowerCase())) {
    res.status(400);
    throw new Error("Status is required and must be pending or completed");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { status: status.toLowerCase() },
    { new: true, runValidators: true },
  );

  if (!updatedTodo) {
    res.status(404);
    throw new Error(`Todo not found with ID: ${id}`);
  }

  res.status(200).json({
    success: true,
    message: "Todo status updated successfully",
    data: updatedTodo,
  });
};

// ==========================================
// 6. DELETE TODO
// Route: DELETE /api/todos/:id
// ==========================================
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID format");
  }

  const deletedTodo = await Todo.findByIdAndDelete(id);

  if (!deletedTodo) {
    res.status(404);
    throw new Error(`Todo not found with ID: ${id}`);
  }

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: deletedTodo,
  });
};
