const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// MongoDB Connection
const MONGO_URI = "mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("🚫 MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// HOD Schema
const hodSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Hod = mongoose.model("Hod", hodSchema);

// HOD Registration Route
app.post("/register-hod", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingHod = await Hod.findOne({ email });
    if (existingHod) {
      return res.status(400).json({ message: "HOD already registered" });
    }

    const newHod = new Hod({ email, password });
    await newHod.save();

    res.status(201).json({ message: "HOD registered successfully" });
  } catch (error) {
    console.error("🚫 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
