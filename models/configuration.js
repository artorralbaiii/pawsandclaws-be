const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let config = new Schema({
    startTime: { type: Number },
    endTime: { type: Number },
    excludeTime: [{ type: Number }],
    excludeDays: [{ type: Number }],
    excludeDates: [{ type: Date }]
})

module.exports = mongoose.model('Config', config);
