const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let pet = new Schema({
    petName: { type: String, required: true },
    dob: { type: Date, required: true },
    species: { type: String, required: true },
    breeds: { type: String, required: true },
    color: { type: String, required: true },
    sex: { type: String, required: true },
    weight: { type: String },
    user: {type: Schema.Types.ObjectId, ref: 'User'}
},
{
  timestamps: true
})

module.exports = mongoose.model('Pet', pet);
