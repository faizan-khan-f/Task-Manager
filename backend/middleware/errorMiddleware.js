// phase 6 errormiddeleware and conteoller trysnc express 5 and
// Handles requests to routes that do not exist
//error 404(build by error handler) mongoose validation error

//notFound's only job is detection:"This route does not exist."(params  def both sep)
//errorHandler's only job is formatting&delivery:"Take any error object, format it into JSON, and send it back to the client."

//client req GET /api/unknown non exist,error message becomes "Not Found - /api/unknown".
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`); //Creates a standard JavaScript Error instance.
  res.status(404); //next is callback funcn used to pass control tonext middleware in stack.
  next(error); //next k andr error arg dekh kr
};
//after creation preparing for dev
// Express routes error directly to app.use(errorHandler)
//    ➜ Reads res.statusCode (404)
//    ➜ Reads err.message ("Not Found - /api/xyz")

// Centralized Global Error Handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  //if its 400 or 404 get in status code
  //if its unhandled 200 it conv into 500 server error
  let message = err.message || "Internal Server Error";
  // Extracts the message attached to the error instance (e.g., new Error("Title is required")

  // Handle Invalid MongoDB ObjectId Format (CastError)
  // when fails to convert "invalid-id-123" into an ObjectId and generates an error object structured like this:
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400; //statusCode from 500 to 400 (Bad Request) and sets a user-friendly error message.
    message = "Invalid Todo ID format";
  }

  // Handle Mongoose Schema Validation Failures
  if (err.name === "ValidationError") {
    statusCode = 400; //hanges statusCode to 400.
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle Duplicate Field Error (Mongo Code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value: ${Object.keys(err.keyValue).join(", ")} already exists`;
  }

  res.status(statusCode).json({
    success: false, //yhi hota h
    message, //eariler msg
    stack: process.env.NODE_ENV === "production" ? null : err.stack, //in prod(null) or dev(err.stack)
    //Contains full stack trace(file path and line numbers where the error originated).
  });
};
