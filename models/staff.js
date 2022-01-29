const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

let staff = new Schema({
  staffName: { type: String, required: true },
  staffLastName: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  capabilities: [{ type: Schema.Types.ObjectId, ref: 'ServiceType' }],
  staffId: Number,
  availability: [{ type: Number }],
  mobile: { type: String, required: true }
},
  {
    timestamps: true
  })

staff.plugin(autoIncrement, { inc_field: 'staffId' });

module.exports = mongoose.model('Staff', staff);

