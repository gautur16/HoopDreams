const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    yearOfCreation: { type: String, required: true},
    status: { type: String, required: true }
});
