// const mongoose = require("mongoose");
import mongoose from "mongoose"; //package.json type module

/**
 * Connects the Node.js application to the MongoDB database using Mongoose.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `[Database] MongoDB Connected successfully: ${conn.connection.host}`,
    );
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Exit process with failure code if unable to connect
    process.exit(1);
  }
};

export default connectDB; //this allows other files to import connectDB using require in CommonJS node module default
