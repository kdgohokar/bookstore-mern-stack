import express from "express";
import { PORT, DB_URL } from "./config.js";
import mongoose from "mongoose";
import bookRouter from "./routes/bookRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

/*
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
*/

app.get("/", (req, res) => {
  console.log(`Request: `, req);
  return res
    .status(200)
    .send(
      `<center><h1>Hello! Welcome to bookstore</h1> ${new Date()}</center>`
    );
});

app.use("/book", bookRouter);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Successfully connected to database`);
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error occurred: `, error);
  });
