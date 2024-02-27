import express from "express";
import { PORT, DB_URL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./model/book-model.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log(`Request: `, req);
  return res
    .status(200)
    .send(
      `<center><h1>Hello! Welcome to bookstore</h1> ${new Date()}</center>`
    );
});

app.post("/book", async (req, res) => {
  try {
    console.log(`Request: `, req.body);
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        success: false,
        message: `Mandatory field [title, author, publishYear] is missing`,
      });
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.create(newBook);
    console.log(`New book created : ${book}`);
    return res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.log(`Exception occurred while saving book: `, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/book", async (req, res) => {
  try {
    console.log(`Request to get all books`);
    const books = await Book.find();
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(`Exception occurred while get all books: `, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    console.log(`Request to get book by id: ${req.params.id}`);
    const book = await Book.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(`Exception occurred while get all books: `, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/book/:id", async (req, res) => {
  try {
    console.log(`Request to update book by id: ${req.params.id}`);
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        success: false,
        message: "Mandatory field [title, author, publishYear] is missing",
      });
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.findByIdAndUpdate(req.params.id, newBook);
    if (!book) {
      return res.status(404).send({
        success: false,
        message: "Book not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
    });
  } catch (error) {
    console.log(`Exception occurred while get all books: `, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

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
