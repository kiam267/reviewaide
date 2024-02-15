const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
dotenv.config({ path: "./config.env" });

app.use(cors());

// Atlasian db
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log("DB connection successful"));

// local db
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful"));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`app running on the port ${port}`);
});

// handling ouside of express error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION 😊 shuting down");
  server.close(() => {
    process.exit(1);
  });
});
