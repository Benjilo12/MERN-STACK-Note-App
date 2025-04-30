require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose"); // ✅ Fixed the typo

const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils");

const User = require("./models/user.model");
const Note = require("./models/note.model");

mongoose.connect(config.connectionString);

// Import the CORS middleware to allow requests from other origins (like a frontend on a different domain or port)

const app = express();

app.use(express.json());

// Enable CORS for all origins (use "*" only for development/testing)

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

//login account
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Inavild Credentials",
    });
  }
});

//Get User
// Get Authenticated User Info
app.get("/get-user", authenticateToken, async (req, res) => {
  // Get the user object from the authenticated request
  const { user } = req.user;

  try {
    // Find user in the database
    const isUser = await User.findOne({ _id: user._id });

    // If user not found, send unauthorized
    if (!isUser) {
      return res.sendStatus(401);
    }

    // Return user info
    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ erroe: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ erroe: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) Note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note update successfully",
    });
  } catch (error) {
    return res.status.json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Get all Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes retrived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// DELETE Note Route - deletes a note belonging to the authenticated user
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  // Extract the note ID from the route parameters
  const noteId = req.params.noteId;

  // Get the authenticated user from the request (set by authenticateToken middleware)
  const { user } = req.user;

  // Check if the user object or user._id is missing
  if (!user || !user._id) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  try {
    // Find the note by ID and ensure it belongs to the current user
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    // If the note doesn't exist or doesn't belong to the user, return an error
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    // Delete the note from the database
    await Note.deleteOne({ _id: noteId, userId: user._id });

    // Send a success response to the client
    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    // Handle any unexpected server errors
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update isPinned Value for a Note
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    // Find the note belonging to the user
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Update the isPinned field
    note.isPinned = isPinned;

    // Save the updated note
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Search Notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});

// If you want to export it for testing or other uses:
module.exports = app;
