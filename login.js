// Importing Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize App
const app = express(); 
const PORT = 5000; // Define Port

// MongoDB URI (Replace with your own credentials if needed)
const MONGO_URI = "mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority";

// Log to verify connection string
console.log("✅ Mongo URI:", MONGO_URI);

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("🚫 MongoDB Connection Error:", err);
    process.exit(1);
  });

// Schema & Model
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Student = mongoose.model("student", studentSchema, "student"); // Force "student" collection

// Test Route (To check if the server is running)
app.get("/", (req, res) => {
    console.log("Root route accessed");
  res.status(200).send("✅ Server is up and running");
});

// Login Route
app.post("/login", async (req, res) => {
  console.log("📩 Login Request Body:", req.body);

  try {
    const { rollNumber, password } = req.body;

    // Check for missing fields
    if (!rollNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find student in DB
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check password
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login Successful:", student.rollNumber);
    res.status(200).json({ message: "Login successful", rollNumber: student.rollNumber });
  } catch (error) {
    console.error("🚫 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post('/dashboard', (req, res) => {
    const { rollNumber } = req.body;
    res.json({
        message: 'Welcome to the dashboard',
        rollNumber
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
