const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let schedule = new Schema({
  title: { type: String },
  start: { type: Date },
  end: { type: Date },
  color: {
    primary: { type: String },
    secondary: { type: String }
  },
  meta: { type: Schema.Types.ObjectId, ref: 'Staff' }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Schedule', schedule);
