const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    logo: String,
    name: String,
    category: Array,
    description: String,
    homepage: String,
    min_price: Number,
    max_price: Number
});

module.exports = mongoose.model('Content', contentSchema);
