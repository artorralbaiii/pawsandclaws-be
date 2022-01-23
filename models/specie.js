const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let specie = new Schema({
    specie: { type: String, required: true },
    breed: { type: String, required: true },
},
{
  timestamps: true
})

module.exports = mongoose.model('Specie', specie);
