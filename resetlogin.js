// Importing Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize App
const app = express(); 
const PORT = 5000; 

// MongoDB URI
const MONGO_URI = "mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority";

// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true })); // CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("🚫 MongoDB Connection Error:", err));

// Schema & Model
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Student = mongoose.model("student", studentSchema, "student");

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("✅ Server is up and running");
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    if (!rollNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", rollNumber: student.rollNumber });
  } catch (error) {
    console.error("🚫 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Reset Password Route
app.post("/reset-password", async (req, res) => {
  try {
    const { rollNumber, currentPassword, newPassword } = req.body;
    if (!rollNumber || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    student.password = newPassword;
    await student.save();
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("🚫 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
