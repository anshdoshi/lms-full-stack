import mongoose from "mongoose";

const aiTestSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true,
        enum: ['Accounting', 'Auditing', 'Taxation', 'Corporate Law', 'Financial Management', 'Cost Accounting', 'Economics', 'General']
    },
    difficulty: { 
        type: String, 
        required: true,
        enum: ['Foundation', 'Intermediate', 'Final', 'Mixed']
    },
    duration: { 
        type: Number, 
        required: true, // in minutes
        default: 30
    },
    questions: [{
        questionText: { 
            type: String, 
            required: true 
        },
        options: [{ 
            type: String, 
            required: true 
        }],
        correctAnswer: { 
            type: Number, 
            required: true // index of correct option (0-3)
        },
        explanation: { 
            type: String, 
            required: true 
        },
        marks: { 
            type: Number, 
            default: 1 
        }
    }],
    totalMarks: { 
        type: Number, 
        required: true 
    },
    passingMarks: { 
        type: Number, 
        required: true 
    },
    createdBy: { 
        type: String, 
        default: 'AI' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    attemptCount: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const AITest = mongoose.model("AITest", aiTestSchema);

export default AITest;
