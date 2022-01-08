const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let service = new Schema({
    serviceName: { type: String, required: true }
},
{
  timestamps: true
})

module.exports = mongoose.model('Service', service);
