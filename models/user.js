const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let user = new Schema({
    address: { type: String },
    email: { type: String, required: true, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    mobile: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: 'CLIENT' },
})

// Encrypt Password
user.pre('save', function (next) {
    let currentUser = this;

    if (!currentUser.isModified('password')) return next();

    bcrypt.hash(currentUser.password, null, null, function (err, hash) {
        if (err) return next(err);

        currentUser.password = hash;
        next();
    });
});

user.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);