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
    dateAttended: { type: Date },
    followUp: { type: Date },
    isNotified: { type: Boolean, defult: false }
},
    {
        timestamps: true
    })

appointment.pre('save', function (next) {
    let currentAppointment = this;
    currentAppointment.date.setHours(0,0,0,0);
    currentAppointment.date = moment.tz(currentAppointment.date, 'Asia/Manila');

    console.log('FOLLOWUP - START');

    if (currentAppointment.followUp) {
        currentAppointment.followUp.setHours(0,0,0,0);
        currentAppointment.followUp = moment.tz(currentAppointment.followUp, 'Asia/Manila');

        console.log(currentAppointment.followUp);
    }
    console.log('FOLLOWUP - END');

    next()
}); 

module.exports = mongoose.model('Appointment', appointment);
