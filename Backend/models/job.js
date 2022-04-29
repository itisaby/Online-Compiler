const mongoose = require('mongoose');
const JobSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "py", "js"]
    },
    filepath: {
        type: String,
        required: true,
    },
    SubmittedAt: {
        type: Date,
        Default: Date.now()
    },
    StartedAt: {
        type: Date,
    },
    CompletedAt: {
        type: Date,
    },
    Output: {
        type: String,
    },
    Score: {
        type: Number,
    },
    Status: {
        type: String,
        Default: "Pending",
        enum: ["Pending", "success", "error"]
    }
});

const Job = mongoose.model('job', JobSchema);

module.exports = Job;