const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// MongoDB Connection
mongoose.connect('mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Teacher Schema
const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    password: { type: String, required: true }
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

// Register Teacher Route
app.post('/register-teacher', async (req, res) => {
    const { name, subject, password } = req.body;
    console.log("📥 Received:", req.body);

    if (!name || !subject || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const existingTeacher = await Teacher.findOne({ name, subject });
        console.log("🔍 Checking for existing teacher:", existingTeacher);

        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already registered' });
        }

        // Hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("🔑 Hashed Password:", hashedPassword);

        const newTeacher = new Teacher({ 
            name, 
            subject, 
            password: hashedPassword 
        });

        const savedTeacher = await newTeacher.save();
        console.log("✅ Saved to DB:", savedTeacher);
        
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        console.error("🔥 Error saving to DB:", error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Server Listening
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
