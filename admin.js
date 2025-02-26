const express = require("express");
const router = express.Router();
const conn = require("../db");
const multer = require("multer");
const path = require("path");

const fs = require('fs');

// fetch all users
router.get("/users", (request, response) => {
  const statement = `SELECT * FROM users`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no users found");
    else response.json({ status: "success", data: rows });
  });
});

// fetch user by id
router.get("/user/:id", (request, response) => {
  const { id } = request.params;
  const statement = `SELECT * FROM users WHERE id =?`;

  conn.execute(statement, [id], (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no user found");
    else response.json({ status: "success", data: rows[0] });
  });
});

// fetch all mobiles
router.get("/mobiles", (request, response) => {
  const statement = `SELECT * FROM mobiles`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no mobiles found");
    else response.json({ status: "success", data: rows });
  });
});

// get mobile by id
router.get("/mobile/:id", (request, response) => {
  const { id } = request.params;
  const statement = `SELECT * FROM mobiles WHERE id =?`;

  conn.execute(statement, [id], (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no mobile found");
    else response.json({ status: "success", data: rows[0] });
  });
});


/////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the upload folder where documents will be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename by appending a timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension based on file type
  }
});

const upload = multer({ storage: storage });

// Document upload route
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    // File and other information from the request
    const file = req.file ? req.file.path : null;
    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Respond back with the file path where the document is stored
    res.status(200).json({
      status: 'success',
      message: 'Document uploaded successfully',
      file: file, // Return file path
    });
  } catch (error) {
    console.error('Error uploading document:', error.message);
    res.status(500).json({ status: 'error', message: 'Something went wrong', errorMessage: error.message });
  }
});
// Endpoint to get all uploaded files




module.exports = router;
