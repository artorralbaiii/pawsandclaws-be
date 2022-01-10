const Config = require('./models/configuration')
const Pet = require('./models/pet')
const Schedule = require('./models/schedule')
const Service = require('./models/service')
const ServiceType = require('./models/servicetype')
const Staff = require('./models/staff')
const User = require('./models/user')
const utils = require('./utils')
const mongoose = require('mongoose')

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_API_KEY)


let returnError = (message) => {
    return { message: message, success: false, data: null }
}

module.exports = () => {
    const controller = {
        ping: ping,

        // Main Features

        authenticate: authenticate,
        getPets: getPets,
        getConfig: getConfig,
        getSchedules: getSchedules,
        getServices: getServices,
        getServiceTypes: getServiceTypes,
        getSession: getSession,
        getStaffs: getStaffs,
        getUser: getUser,
        logout: logout,
        registerPet: registerPet,
        saveConfig: saveConfig,
        saveSchedule: saveSchedule,
        saveServices: saveServices,
        saveServiceType: saveServiceType,
        saveStaff: saveStaff,
        saveUser: saveUser,
        socialMediaLogin: socialMediaLogin,
        updatePet: updatePet,
        verifyAccount: verifyAccount
    }

    return controller

    function ping(req, res) {
        res.send('OK!')
    }

    // Main Features

    // START - authenticate
    function authenticate(req, res) {
        User.findOne({ email: req.body.email })
            .select('_id password firstName middleName lastName email address mobile role activated')
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
                            email: data.email,
                            activated: data.activated
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

    // START - getConfig
    function getConfig(req, res) {
        Config.findOne({}, {}, { sort: { 'created_at': -1 } }, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json({
                message: 'Configurations',
                success: true,
                data: data
            })


        })

    } // END - getConfig

    // START - getSchedules
    function getSchedules(req, res) {
        Schedule.find({}, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json({
                message: 'All Schedules',
                success: true,
                data: data
            })
        })
    } // END - getSchedules

    // START - getServices
    function getServices(req, res) {
        if (req.params.id) {
            Service.findById(req.params.id, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'Service by ID',
                    success: true,
                    data: data
                })
            })
        } else {
            Service.find({}, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'All Services',
                    success: true,
                    data: data
                })
            })
        }

    } // END - getServices

    // START - getServiceTypes
    function getServiceTypes(req, res) {
        if (req.params.id) {
            ServiceType.findById(req.params.id)
                .populate('service').exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Service by ID',
                        success: true,
                        data: data
                    })
                })
        } else {
            ServiceType.find({})
                .populate('service').exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'All Services',
                        success: true,
                        data: data
                    })
                })
        }

    } // END - getServiceTypes

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

    // START - getStaffs
    function getStaffs(req, res) {
        if (req.params.id) {
            Staff.findById(req.params.id)
                .populate('capabilities').exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Staff by ID',
                        success: true,
                        data: data
                    })
                })
        } else {
            Staff.find({})
                .populate('capabilities').exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'All Staffs',
                        success: true,
                        data: data
                    })
                })
        }

    } // END - getStaff

    // START - getUser
    function getUser(req, res) {
        let id = req.params.id

        User.findById(id, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json({
                message: 'Successful Retrieval',
                success: true,
                data: data
            })
        })// END - getUser


    }



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

        let id = null;

        if (req.params.id) {
            id = mongoose.Types.ObjectId(req.params.id);
        }

        Pet.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            req.body,
            { upsert: true, new: true },
            (err, data) => {

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


        // let pet = new Pet(req.body)

        // pet.save((err, data) => {
        //     if (err) {
        //         res.json(returnError(JSON.stringify(err)))
        //     } else {
        //         res.json({
        //             message: 'Successful Save',
        //             success: true,
        //             data: data
        //         })
        //     }
        // })

    } // END - registerPet

    // START - saveConfig
    function saveConfig(req, res) {
        Config.findOne({}, {}, { sort: { 'created_at': -1 } }, (err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            }

            if (data) {
                data.startTime = req.body.startTime
                data.endTime = req.body.endTime
                data.excludeTime = req.body.excludeTime
                data.excludeDays = req.body.excludeDays
                data.excludeDates = req.body.excludeDates
            } else {
                data = new Config(req.body)
            }

            data.save((err, savedData) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    res.json({
                        message: 'Successful Save',
                        success: true,
                        data: savedData
                    })
                }
            })

        });
    } // END - saveConfig

    // START - saveSchedule
    function saveSchedule(req, res) {

        Schedule.remove({}, (errRemove) => {

            if (errRemove) {
                res.json(returnError(JSON.stringify(errRemove)))
            } else {

                Schedule.insertMany(req.body, (err, data) => {
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

            }

        })


    } // END - saveSchedule

    // START - saveService
    function saveServices(req, res) {
        let service = new Service(req.body)

        service.save((err, data) => {
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
    }// END - saveService

    // START - saveServiceType
    function saveServiceType(req, res) {

        let id = null;

        if (req.params.id) {
            id = mongoose.Types.ObjectId(req.params.id);
        }

        ServiceType.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            req.body,
            { upsert: true, new: true },
            (err, data) => {

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

    }// END - saveServiceType


    // START - saveUser
    function saveUser(req, res) {
        let user = new User(req.body)

        user.save((err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {

                if (req.path.indexOf('login') >= 0) {

                    let url = process.env.VERIFICATION_URL + data['verificationCode']
                    const message = {
                        to: data['email'],
                        from: {
                            name: process.env.SG_FROM_NAME,
                            email: process.env.SG_FROM_EMAIL
                        },
                        subject: 'Paws and Claws: Account Registration',
                        text: `Confirm your account registration. 
                            
                            Please click this <a href="${url}">Link</a> to verify your email address and finalize your registration.
                            `,
                        html: `<h1>Confirm your account registration</h1>. 
                            
                            Please click this <a href="${url}">Link</a> to verify your email address and finalize your registration.
                            `
                    }

                    sgMail.send(message)
                        .then(response => {
                            res.json({
                                message: 'Successful Save',
                                success: true,
                                data: data
                            })
                        })
                        .catch(error => console.log(error.message))

                } else {
                    res.json({
                        message: 'Successful Save',
                        success: true,
                        data: response
                    })
                }
            }
        })

    } // END - saveUser

    // START - saveStaff
    function saveStaff(req, res) {

        let staff = new Staff(req.body)

        if (req.params.id) {

            Staff.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body, { new: true }, (err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    data.populate('capabilities')
                        .then((data) => {
                            res.json({
                                message: 'Successful Save',
                                success: true,
                                data: data
                            })
                        });

                }
            })

        } else {
            staff.save((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    data.populate('capabilities')
                        .then((data) => {
                            res.json({
                                message: 'Successful Save',
                                success: true,
                                data: data
                            })
                        });
                }
            })
        }

    } // END - saveStaff

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

    function verifyAccount(req, res) {
        let url = process.env.CLIENT_HOST + '/sign-in'
        User.findOneAndUpdate({ verificationCode: req.params.id }, { activated: true }, (err, data) => {
            if (err) {
                res.send('There is a problem encountered verifying your account. Please reach out to us to fix the problem.')
            } else {
                if (data) {
                    res.send(`<b>Thank you!</b> Your account has been successfully verified. <a href="${url}">Login</a>`)
                } else {
                    res.send(`Invalid Verification Link`)
                }
            }
        })

    }

}


