

const User = require('./models/user')
const Pet = require('./models/pet')
const mongoose = require('mongoose')

let returnError = (message) => {
    return { message: message, success: false, data: null }
}

module.exports = () => {
    const controller = {
        ping: ping,

        // Main Features

        authenticate: authenticate,
        getPets: getPets,
        getSession: getSession,
        logout: logout,
        registerPet: registerPet,
        saveUser: saveUser,
        socialMediaLogin: socialMediaLogin,
        updatePet: updatePet,
    }

    return controller

    function ping(req, res) {
        res.send('OK!')
    }

    // Main Features

    // START - authenticate
    function authenticate(req, res) {
        User.findOne({ email: req.body.email })
            .select('_id password firstName middleName lastName email address mobile role')
            .exec(function (err, data) {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                if (!data) {
                    return res.json(returnError('Email is not registered.'))
                }


                if (data.comparePassword(req.body.password)) {

                    req.session.regenerate(() => {

                        req.session.user = {
                            id: data._id,
                            firstName: data.firstName,
                            middleName: data.middelName,
                            lastName: data.lastName,
                            mobile: data.mobile,
                            address: data.address,
                            role: data.role,
                            email: data.email
                        }

                        res.json({
                            message: 'Authenticated',
                            success: true,
                            data: req.session.user
                        });
                    });

                } else {
                    res.json(returnError('Invalid password.'))
                }

            })
    } // END - authenticate

    // START - getPets
    function getPets(req, res) {

        if (req.params.id) {
            Pet.findById(req.params.id, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'Pet by ID',
                    success: true,
                    data: data
                })
            })
        } else {
            var id = mongoose.Types.ObjectId(req.params.userid)
            Pet.find({ user: id }, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'Pet by User',
                    success: true,
                    data: data
                })
            })
        }


    } // END - getPets

    // START - getSession
    function getSession(req, res) {
        if (req.session.user) {
            res.json({
                message: 'Authenticated',
                success: true,
                data: req.session.user
            });
        } else {
            res.json(returnError('No Session Found!'))
        }

    } // END - getSession

    function logout(req, res) {
        req.session.destroy(function (err) {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json({
                message: 'Successful Logout',
                success: true,
                data: null
            })

        })
    }


    // START - registerPet
    function registerPet(req, res) {
        let pet = new Pet(req.body)

        pet.save((err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {
                res.json({
                    message: 'Successful Save',
                    success: true,
                    data: data
                })
            }
        })
    } // END - registerPet


    // START - saveUser
    function saveUser(req, res) {
        let user = new User(req.body)

        user.save((err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {

                if (req.path.indexOf('login') >= 0) {
                    req.session.regenerate(() => {
                        req.session.user = data;

                        res.json({
                            message: 'Authenticated',
                            success: true,
                            data: req.session.user
                        });
                    });
                } else {
                    res.json({
                        message: 'Successful Save',
                        success: true,
                        data: data
                    })
                }

            }
        })

    } // END - saveUser

    // START - socialMediaLogin
    function socialMediaLogin(req, res) {
        User.findOneAndUpdate(
            { email: req.body.email },
            req.body, { upsert: true, new: true },
            (err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    req.session.regenerate(() => {
                        req.session.user = data;

                        res.json({
                            message: 'Authenticated',
                            success: true,
                            data: req.session.user
                        })
                    })
                }
            })
    } // END - socialMediaLogin

    // START - updatePet
    function updatePet(req, res) {
        Pet.findByIdAndUpdate(req.params.id, req.body, { upsert: false }, (err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {
                res.json({
                    message: 'Successfully updated',
                    success: true,
                    data: data
                })
            }
        })
    } // END - updatePet

}


