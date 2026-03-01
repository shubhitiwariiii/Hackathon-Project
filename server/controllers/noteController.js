import Note from "../models/note.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";



// Create Note
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category, topic, difficulty, tags, isFavorite, color } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const note = await Note.create({
    title,
    content,
    user: req.user._id,
    category,
    topic,
    difficulty,
    tags,
    isFavorite: isFavorite || false,
    color: color || "default",
  });

  res.status(201).json(note);
});

// Read ~ Find Notes ( of users those who have access )

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id
  }).sort("-createdAt");

  res.status(200).json(notes);
});

// Update Note

const updateNote = asyncHandler(async (req, res) => {
  const { title, content, category, topic, difficulty, tags, isFavorite, color } = req.body;

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // check ownership before giving access to update

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  note.title = title || note.title;
  note.content = content || note.content;
  if (category !== undefined) note.category = category;
  if (topic !== undefined) note.topic = topic;
  if (difficulty !== undefined) note.difficulty = difficulty;
  if (tags !== undefined) note.tags = tags;
  if (isFavorite !== undefined) note.isFavorite = isFavorite;
  if (color !== undefined) note.color = color;

  const updatedNote = await note.save();

  res.status(200).json(updatedNote);
});

// Delete Note

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // check ownership
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await note.deleteOne();

  res.status(200).json({ message: "Note deleted" });
});

const uploadAttachment = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Determine file type from mimetype
  const isPDF = req.file.mimetype === "application/pdf";
  const fileType = isPDF ? "pdf" : "image";

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "notiqAI-notes",
        resource_type: "auto",
        // Force PDF resource type if detected
        format: isPDF ? "pdf" : undefined
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  note.attachments.push({
    url: result.secure_url,
    public_id: result.public_id,
    type: fileType,
  });

  await note.save();

  res.json(note);
});



export { createNote, getNotes, updateNote, deleteNote, uploadAttachment };