import mongoose from "mongoose"; //"schema-less" NoSQL database,

// 1. Define the Schema Structure and Validation Rules
// mongoose.Schema is a class provided by Mongoose to bring structure and rules to your MongoDB collections at the Node.js
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      required: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"], // Only these 3 strings are allowed
        message:
          "{VALUE} is not a valid priority. Must be low, medium, or high.",
      },
      default: "medium",
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "{VALUE} is not a valid status. Must be pending or completed.",
      },
      default: "pending",
      lowercase: true,
    },
  },
  {
    // 2. Options Object: Enables automatic createdAt and updatedAt fields
    timestamps: true,
  },
);

//3. Compile the Schema into a Mongoose Model
//Schema is strictly a passive set of rules—it cannot interact with the database on its own.
//This converts that static blueprint into an active database model.
//mongoose.model() takes your schema blueprint and builds a JavaScript Model class.
//This Model provides all built-in database methods (like Todo.find(), Todo.create(),
const Todo = mongoose.model("Todo", todoSchema);
//automatically create the corresponding collection in your MongoDB database ('Todo' translates to the todos collection).

export default Todo;
//    MongoDB Database     |
// | (Passive Rules)   | -------> | (Active DB Class) | -------> | ('todos' collection)
