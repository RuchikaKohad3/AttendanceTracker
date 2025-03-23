const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Student = require('./models/student'); // Mongoose model for students

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://RuchikaKohad:328@attendancetracker.u65wj.mongodb.net/student?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());

// Reset Password Route
app.post('/reset-password', async (req, res) => {
    const { rollNumber, currentPassword, newPassword } = req.body;

    if (!rollNumber || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.password !== currentPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Root Route (for basic server check)
app.get('/', (req, res) => {
    res.send('✅ Server is running');
});

// Start the Server
app.listen(5000, () => {
    console.log('🚀 Server is running on port 5000');
});
