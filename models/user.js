const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const uuid = require('uuid')

const Schema = mongoose.Schema;

let user = new Schema({
    address: { type: String },
    email: { type: String, required: true, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    mobile: { type: String },
    password: { type: String, select: false },
    role: { type: String, default: 'CLIENT' },
    photoUrl: { type: String, default: 'assets/images/icons8-test-account-40.png' },
    activated: { type: Boolean, default: false },
    verificationCode: { type: String },
    staffId: { type: Number },
    profilePicture: { type: String }
},
    {
        timestamps: true
    })

// Encrypt Password
user.pre('save', function (next) {
    let currentUser = this;

    if (!currentUser.isModified('password')) return next();

    bcrypt.hash(currentUser.password, null, null, function (err, hash) {
        if (err) return next(err);

        currentUser.password = hash;
        currentUser.verificationCode = uuid.v1()
        next()
    });


});

user.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);
