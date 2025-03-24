const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000; // Hardcoded Port

// MongoDB URI
const MONGO_URI = "mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority";

// Log to verify connection string
console.log("✅ Mongo URI:", MONGO_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  section: { type: String, required: true, enum: ["A", "B"] },
  password: { type: String, required: true },
});

const Student = mongoose.model("student", studentSchema, "student");

// API Route
app.post("/register", async (req, res) => {
  console.log("📩 Request Body:", req.body);

  try {
    const { name, rollNumber, section, password } = req.body;

    // Validate input
    if (!name || !rollNumber || !section || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing student
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Roll number already exists" });
    }

    // Create and save student
    const newStudent = new Student({ name, rollNumber, section, password });
    await newStudent.save();

    console.log("✅ Student Saved:", newStudent);
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("🚫 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
