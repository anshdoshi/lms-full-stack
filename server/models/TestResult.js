import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    testId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AITest',
        required: true 
    },
    answers: [{
        questionIndex: { 
            type: Number, 
            required: true 
        },
        selectedAnswer: { 
            type: Number, 
            required: true 
        },
        isCorrect: { 
            type: Boolean, 
            required: true 
        },
        marksObtained: { 
            type: Number, 
            required: true 
        }
    }],
    score: { 
        type: Number, 
        required: true 
    },
    totalMarks: { 
        type: Number, 
        required: true 
    },
    percentage: { 
        type: Number, 
        required: true 
    },
    passed: { 
        type: Boolean, 
        required: true 
    },
    timeTaken: { 
        type: Number, 
        required: true // in seconds
    },
    analysis: {
        strengths: [{ type: String }],
        weaknesses: [{ type: String }],
        recommendations: [{ type: String }],
        topicWisePerformance: [{
            topic: String,
            correct: Number,
            total: Number,
            percentage: Number
        }],
        overallFeedback: { type: String }
    },
    rank: { 
        type: Number 
    },
    completedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index for faster queries
testResultSchema.index({ userId: 1, testId: 1 });
testResultSchema.index({ userId: 1, createdAt: -1 });

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;
