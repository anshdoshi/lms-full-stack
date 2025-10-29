import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    sessionId: { 
        type: String, 
        required: true 
    },
    messages: [{
        role: { 
            type: String, 
            enum: ['user', 'assistant', 'system'],
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },
        timestamp: { 
            type: Date, 
            default: Date.now 
        }
    }],
    topic: { 
        type: String,
        default: 'General CA Query'
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastMessageAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index for faster queries
chatHistorySchema.index({ userId: 1, sessionId: 1 });
chatHistorySchema.index({ userId: 1, lastMessageAt: -1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
