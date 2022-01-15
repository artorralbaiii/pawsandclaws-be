const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let serviceType = new Schema({
    service: {type: Schema.Types.ObjectId, ref: 'Service'},
    serviceType: { type: String, required: true },
    duration: { type: Number },
    examinationForm: { type: Boolean }
},
{
  timestamps: true
})

module.exports = mongoose.model('ServiceType', serviceType);
