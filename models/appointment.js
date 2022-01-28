const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

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

appointment.pre('save', function (next) {
    let currentAppointment = this;
    currentAppointment.date.setHours(0,0,0,0);
    currentAppointment.date = moment.tz(currentAppointment.date, 'Asia/Manila');

    next()
}); 

module.exports = mongoose.model('Appointment', appointment);
