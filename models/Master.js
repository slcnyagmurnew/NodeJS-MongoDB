const mongoose = require("mongoose");

const MasterSchema = mongoose.Schema({
    barcode: {
        type: String,
    },
    sku: {
        type: String,
    },
    urun_adi: {
        type: String,
    },
});

module.exports = mongoose.model("Master", MasterSchema);
