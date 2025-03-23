const mongoose = require('mongoose');

// Define the Student Schema
const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create and export the model (Explicitly use 'student' collection)
const Student = mongoose.model('student', studentSchema, 'student');
module.exports = Student;
