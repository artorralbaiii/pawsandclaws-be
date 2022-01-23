const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let audit = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
    description: { type: String }
},
{
  timestamps: true
})

module.exports = mongoose.model('Audit', audit);
