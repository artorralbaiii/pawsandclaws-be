const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let specie = new Schema({
    specie: { type: String, required: true },
    breed: { type: String, required: true },
    images: [{ type: String }]
},
{
  timestamps: true
})

module.exports = mongoose.model('Specie', specie);
