import express from "express";
import { Book } from "../model/book-model.js";

const bookRouter = express.Router();

bookRouter.post("/", async (req, res) => {
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

bookRouter.get("/", async (req, res) => {
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

bookRouter.get("/:id", async (req, res) => {
  try {
    console.log(`Request to get book by id: ${req.params.id}`);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .send({ success: false, message: `Book not found` });
    }
    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(`Exception occurred while get all books: `, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

bookRouter.put("/:id", async (req, res) => {
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

bookRouter.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    console.log(`Request to delete book: `, id);
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return response
        .status(404)
        .send({ success: false, message: `Book not found` });
    }
    return response
      .status(200)
      .send({ success: true, message: `Book deleted successfully` });
  } catch (error) {
    console.log(`Exception iccurred while deleting book`, error);
    return response
      .status(500)
      .send({ success: false, message: error.message });
  }
});

export default bookRouter;
