const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
app.use(cors());
const path = require('path');
app.use(express.json());

mongoose.connect('mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const teacherSchema = new mongoose.Schema({
    name: String,
    subject: String,
    password: String
});

const Teacher = mongoose.model('teachers', teacherSchema);

const attendanceSchema = new mongoose.Schema({
    studentId: String,
    date: Date,
    status: String
});

const Attendance = mongoose.model('attendances', attendanceSchema);

// Teacher Login Route
app.post('/teacher/login', async (req, res) => {
    const { name, subject, password } = req.body;

    if (!name || !subject || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const teacher = await Teacher.findOne({ name, subject });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', redirectTo: '/dashboard' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard Route (Serves HTML)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
// Dashboard Routes
app.get('/dashboard', (req, res) => {
    res.send('Welcome to the Teacher Dashboard');
});

app.get('/dashboard/markAttendance', (req, res) => {
    res.send('Mark Attendance Page');
});

app.get('/dashboard/viewRecords', (req, res) => {
    res.send('View Attendance Records Page');
});

app.get('/dashboard/approveLeave', (req, res) => {
    res.send('Approve Medical Leave Page');
});

app.get('/dashboard/updateAttendance', (req, res) => {
    res.send('Update Attendance Page');
});

app.get('/dashboard/searchStudent', (req, res) => {
    res.send('Search Student by Percentage Page');
});

app.get('/dashboard/resetPassword', (req, res) => {
    res.send('Reset Password Page');
});

app.listen(3000, () => console.log('Server running on port 3000'));