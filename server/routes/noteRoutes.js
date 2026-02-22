// add notes routes 

import express from "express";
import { createNote, getNotes, updateNote, deleteNote, uploadAttachment } from "../controllers/noteController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validateCreateNote, validateUpdateNote, validateNoteId } from "../middleware/validators.js";

const noteRoutes = express.Router();

noteRoutes.use(protect); // all routes protected

noteRoutes.route("/")
    .post(validateCreateNote, createNote)
    .get(getNotes);

noteRoutes.route("/:id")
    .put(validateUpdateNote, updateNote)
    .delete(validateNoteId, deleteNote);

noteRoutes.post("/:id/upload", validateNoteId, upload.single("file"), uploadAttachment);


export default noteRoutes;