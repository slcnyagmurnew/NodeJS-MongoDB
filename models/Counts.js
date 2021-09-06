const mongoose = require("mongoose");

const CountSchema = mongoose.Schema({
    id: {
        type: Number,
    },
    locationCode: {
        type: String,
    },
    completedCounts: [
        {
            totalAmount: {
                type: Number,
            },
            contents: [],
        },
    ],
});

module.exports = mongoose.model("Count", CountSchema);
