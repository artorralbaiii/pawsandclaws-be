const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let appointment = new Schema({
    pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
    serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date },
    status: { type: String },
    additionalDetails: { type: String }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Appointment', appointment);
