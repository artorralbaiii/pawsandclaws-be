const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let appointment = new Schema({
    pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
    serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    attendedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    status: { type: String },
    additionalDetails: { type: String },
    time: { type: Number },
    y: { type: Number },
    m: { type: Number },
    d: { type: Number },
    history: { type: String },
    peFindings: { type: String },
    medications: { type: String },
    notes: { type: String },
    dateAttended: { type: Date }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Appointment', appointment);
