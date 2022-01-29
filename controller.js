const Config = require('./models/configuration')
const Appointment = require('./models/appointment')
const Audit = require('./models/audit')
const Pet = require('./models/pet')
const Schedule = require('./models/schedule')
const Service = require('./models/service')
const ServiceType = require('./models/servicetype')
const Specie = require('./models/specie')
const Staff = require('./models/staff')
const User = require('./models/user')
const utils = require('./utils')
const mongoose = require('mongoose')
const uuid = require('uuid')

const sgMail = require('@sendgrid/mail')
const { request } = require('express')
const { trusted } = require('mongoose')

sgMail.setApiKey(process.env.SG_API_KEY)

const LOG_ACTION = {
    APPOINTMENT_NEW: 'Appointment - New Data',
    APPOINTMENT_ATTENDED: 'Appointment - Service Attended',
    CONFIGURATION: 'Configuration',
    LOGIN: 'Login',
    LOGIN_SOCIAL: 'Login - Social Media',
    LOGOUT: 'Logout',
    NEW_CLIENT: 'New Client',
    PASSWORD_SETUP: 'Password Setup',
    PET_NEW: 'Pet - New Data',
    PET_REGISTRATION: 'Pet - Registration',
    PET_UPDATE: 'Pet - Update Data',
    SERVICES_NEW: 'Services - New Data',
    SERVICES_UPDATE: 'Services - Update Data',
    SPECIE_UPDATE: 'Specie - Update Data',
    STAFF_NEW: 'Staff - New Data',
    STAFF_UPDATE: 'Staff - Update Data',
}






let returnError = (message) => {
    return { message: message, success: false, data: null }
}

module.exports = () => {
    const controller = {
        ping: ping,

        // Main Features

        authenticate: authenticate,
        getAppointments: getAppointments,
        getAppointmentTime: getAppointmentTime,
        getAuditLogs: getAuditLogs,
        getAvailableStaff: getAvailableStaff,
        getClients: getClients,
        getConfig: getConfig,
        getLogActions: getLogActions,
        getSchedules: getSchedules,
        getPets: getPets,
        getServices: getServices,
        getServiceTypes: getServiceTypes,
        getSession: getSession,
        getSpecies: getSpecies,
        getStaffs: getStaffs,
        getUser: getUser,
        logout: logout,
        petCount: petCount,
        registerPet: registerPet,
        resendEmailVerification: resendEmailVerification,
        saveAppointment: saveAppointment,
        saveConfig: saveConfig,
        saveSchedule: saveSchedule,
        saveServices: saveServices,
        saveServiceType: saveServiceType,
        saveSpecie: saveSpecie,
        saveStaff: saveStaff,
        saveUser: saveUser,
        setupPassword: setupPassword,
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
            .select('_id password firstName middleName lastName email address mobile role activated photoUrl mobile staffId')
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
                            _id: data._id,
                            firstName: data.firstName,
                            middleName: data.middelName,
                            lastName: data.lastName,
                            mobile: data.mobile,
                            address: data.address,
                            role: data.role,
                            email: data.email,
                            activated: data.activated,
                            photoUrl: data.photoUrl,
                            staffId: data.staffId
                        }

                        auditTrail(
                            data._id,
                            LOG_ACTION.LOGIN,
                            'Login to the application'
                        )

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

    // START - getAppointments
    function getAppointments(req, res) {

        if (req.params.userid) {
            Appointment.find({ user: mongoose.Types.ObjectId(req.params.userid) })
                .populate('user serviceType pet attendedBy')
                .sort({ date: -1 })
                .exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Apointment by User',
                        success: true,
                        data: data
                    })
                })
        } else if (req.params.id) {
            var id = mongoose.Types.ObjectId(req.params.id)
            Appointment.findOne({ _id: id })
                .populate('user serviceType pet attendedBy')
                .sort({ date: -1 })
                .exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Appointment by Id',
                        success: true,
                        data: data
                    })
                })
        } else if (req.params.status) {

            let options = {
                status: req.params.status
            }

            if (req.params.from && req.params.to) {
                options = {
                    status: req.params.status,
                    date: {
                        $gte: req.params.from,
                        $lte: req.params.to
                    }
                }
            }

            Appointment.find(options)
                .populate('user serviceType pet attendedBy')
                .sort({ date: -1 })
                .exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Apointment by User',
                        success: true,
                        data: data
                    })
                })
        } else if (req.params.petId) {
            Appointment.find({ pet: mongoose.Types.ObjectId(req.params.petId), status: 'Completed' })
                .populate('user serviceType pet attendedBy')
                .sort({ date: -1 })
                .exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Apointment by Pet',
                        success: true,
                        data: data
                    })
                })
        } else {

            let options = {}

            if (req.params.from && req.params.to) {
                options = {
                    date: {
                        $gte: req.params.from,
                        $lte: req.params.to
                    }
                }
            }

            Appointment.find(options)
                .populate('user serviceType pet attendedBy')
                .sort({ date: -1 })
                .exec((err, data) => {
                    if (err) {
                        return res.json(returnError(JSON.stringify(err)))
                    }

                    res.json({
                        message: 'Appointments',
                        success: true,
                        data: data
                    })
                })
        }


    } // END - getAppointments

    function getAppointmentTime(req, res) {
        let y = req.params.y
        let m = req.params.m
        let d = req.params.d

        Appointment.find({ y: y, m: m, d: d, status: { $ne: 'Cancelled' } }, '-_id time', (err, data) => {
            if (err) {
                res.json([])
            } else {
                res.json(data.map(val => val.time))
            }
        })
    }

    function getAuditLogs(req, res) {
        let user = req.params.user
        let action = req.params.action
        let from = req.params.from
        let to = req.params.to
        let option = {}
        let populateOption = {}


        populateOption['path'] = 'user'

        if (user) {
            populateOption['match'] = {
                email: user
            }
        }

        if (action) {
            option['action'] = action
        }

        if ((from) && (to)) {
            option['createdAt'] = {
                $gte: req.params.from + ' 00:00 AM',
                $lte: req.params.to + ' 11:59 PM'
            }
        }

        Audit.find(option)
            .sort({ date: -1 })
            .populate(populateOption)
            .exec((err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                let filteredData = data.filter(obj=> obj.user != null)

                res.json({
                    message: 'All Audit Logs',
                    success: true,
                    data: filteredData
                })
            })
    }

    // START - getAvailableStaff
    function getAvailableStaff(req, res) {
        let serviceType = mongoose.Types.ObjectId(req.params.serviceType)
        let weekDay = req.params.weekDay

        Staff.count({ capabilities: serviceType, availability: weekDay }, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json(data)
        })
    } // EN - getAvailableStaff

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

    function getClients(req, res) {
        if (req.params.id) {
            User.findById(req.params.id, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'User by ID',
                    success: true,
                    data: data
                })
            })
        } else {
            User.find({ role: 'CLIENT' }, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'All Clients',
                    success: true,
                    data: data
                })
            })
        }
    }

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

    function getLogActions(req, res) {
        let logActions = []
        for (const key in LOG_ACTION) {
            logActions.push(LOG_ACTION[key])
        }

        res.json({
            message: 'All Log Actions',
            success: true,
            data: logActions
        })
    }

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

    // START - getSpecies
    function getSpecies(req, res) {
        Specie.find({}, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            res.json({
                message: 'All Species',
                success: true,
                data: data
            })
        })
    } // END - getSpecies

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
        } else if (req.params.staffid) {
            Staff.findOne({staffId: req.params.staffid})
            .populate('capabilities').exec((err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'Staff by Staff Id',
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

        if (id) {
            User.findById(id, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'Users by ID',
                    success: true,
                    data: data
                })
            })
        } else {
            User.find({}, (err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                }

                res.json({
                    message: 'All users',
                    success: true,
                    data: data
                })
            })
        }


    } // END - getUser



    function logout(req, res) {
        console.log('req.session.user')
        console.log(req.session.user)
        let id = req.session.user._id
        req.session.destroy(function (err) {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            auditTrail(
                id,
                LOG_ACTION.LOGOUT,
                'Logout to the application.'
            )

            res.json({
                message: 'Successful Logout',
                success: true,
                data: null
            })

        })
    }

    function petCount(req, res) {
        let id = req.params.id

        Pet.count({ user: mongoose.Types.ObjectId(req.params.id) }, function (err, count) {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {
                res.json({
                    message: 'Successful Save',
                    success: true,
                    data: count
                })

            }
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

                    if (id) {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.PET_UPDATE,
                            'Update pet data for Pet ID: ' + id
                        )
                    } else {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.PET_NEW,
                            'New pet data is added. Pet ID:' + data._id
                        )
                    }

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

    // START - saveAppointment
    function saveAppointment(req, res) {

        let id = null;

        if (req.params.id) {
            id = mongoose.Types.ObjectId(req.params.id);
        }

        Appointment.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            req.body,
            { upsert: true, new: true },
            (err, data) => {

                if (id) {
                    if (data.status.toUpperCase() === 'COMPLETED') {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.APPOINTMENT_ATTENDED,
                            'A service appointment has been attended. Appointment ID: ' + id
                        )
                    }
                } else {
                    auditTrail(
                        req.session.user._id,
                        LOG_ACTION.APPOINTMENT_NEW,
                        'New appointment has been created. Appointment id: ' + id
                    )
                }

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

        // appointment.save((err, data) => {
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


    } // END - saveAppointment


    // START - resendEmailVerification
    function resendEmailVerification(req, res) {
        User.findById(req.params.id, (err, data) => {
            if (err) {
                return res.json(returnError(JSON.stringify(err)))
            }

            let url = process.env.VERIFICATION_URL + data['verificationCode']
            const message = {
                to: data['email'],
                from: {
                    name: process.env.SG_FROM_NAME,
                    email: process.env.SG_FROM_EMAIL
                },
                subject: 'Paws and Claws: Account Registration',
                text: `Welcome to Paws and Claws. 
                    
                    You are almost there! Activate your account by clicking on the link below.
                    
                    ${url}
                    `,
                html: `<h1>Welcome to Paws and Claws</h1>.

                <p><b>You are almost there!</b> Activate your account by clicking on the link below.</p>
                <br>
                <p><a href="${url}"><b>Verify Email</b></a>.</p>
                    `
            }

            sgMail.send(message)
                .then(response => {
                    res.json({
                        message: 'Successful Send',
                        success: true,
                        data: data
                    })
                })
                .catch(error => console.log(error.message))
        })
    }
    // END - resendEmailVerification

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
                data.colors = req.body.colors
                data.cancelWindow = req.body.cancelWindow
            } else {
                data = new Config(req.body)
            }

            data.save((err, savedData) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    auditTrail(
                        req.session.user._id,
                        LOG_ACTION.CONFIGURATION,
                        'Application configuration has been updated.'
                    )

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

                    if (id) {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.SERVICES_UPDATE,
                            'Update services data for Service ID: ' + id
                        )
                    } else {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.SERVICES_NEW,
                            'New service data is added. Service ID:' + id
                        )
                    }


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

                    auditTrail(
                        data._id,
                        LOG_ACTION.NEW_CLIENT,
                        'New client ha been registered. User ID: ' + data._id
                    )

                    let url = process.env.VERIFICATION_URL + data['verificationCode']
                    const message = {
                        to: data['email'],
                        from: {
                            name: process.env.SG_FROM_NAME,
                            email: process.env.SG_FROM_EMAIL
                        },
                        subject: 'Paws and Claws: Account Registration',
                        text: `Welcome to Paws and Claws. 
                            
                            You are almost there! Activate your account by clicking on the link below.
                            
                            ${url}
                            `,
                        html: `<h1>Welcome to Paws and Claws</h1>.

                        <p><b>You are almost there!</b> Activate your account by clicking on the link below.</p>
                        <br>
                        <p><a href="${url}"><b>Verify Email</b></a>.</p>
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

    // START - saveSpecie
    function saveSpecie(req, res) {
        let id = null;

        if (req.params.id) {
            id = mongoose.Types.ObjectId(req.params.id);
        }

        Specie.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            req.body,
            { upsert: true, new: true },
            (err, data) => {

                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    if (id) {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.SPECIE_UPDATE,
                            'Update specie data for Specie ID: ' + id
                        )
                    } else {
                        auditTrail(
                            req.session.user._id,
                            LOG_ACTION.STAFF_NEW,
                            'New specie data is added. Specie ID:' + id
                        )
                    }

                    res.json({
                        message: 'Successful Save',
                        success: true,
                        data: data
                    })

                }
            })
    } // END - saveSpecie

    // START - saveStaff
    function saveStaff(req, res) {

        let staff = new Staff(req.body)

        if (req.params.id) {

            Staff.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body, { new: true }, (err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    auditTrail(
                        req.session.user._id,
                        LOG_ACTION.STAFF_UPDATE,
                        'Update staff data for Staff ID: ' + data._id
                    )

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
                    return res.json(returnError(JSON.stringify(err)))
                } else {

                    let user = new User({
                        email: data.email,
                        firstName: data.staffName,
                        lastName: data.staffLastName,
                        password: data.email,
                        role: 'STAFF',
                        activated: false,
                        verificationCode: uuid.v1(),
                        photoUrl: '',
                        staffId: data.staffId,
                        mobile: data.mobile    
                    })

                    user.save((err, dataUser) => {

                        if (err) {
                            res.json(returnError(JSON.stringify(err)))
                        } else {

                            auditTrail(
                                dataUser._id,
                                LOG_ACTION.STAFF_NEW,
                                'New staff data is added. Staff ID: ' + data._id
                            )

                            let url = process.env.CLIENT_HOST + '/setup-password/' + dataUser._id

                            const message = {
                                to: dataUser['email'],
                                from: {
                                    name: process.env.SG_FROM_NAME,
                                    email: process.env.SG_FROM_EMAIL
                                },
                                subject: 'Paws and Claws: Account Creation',
                                text: `Welcome to Paws and Claws. 
                                    
                                    Please setup your password in the link below.
                                    
                                    ${url}
                                    `,
                                html: `<h1>Welcome to Paws and Claws</h1>.
        
                                <p><b>Please setup your password in the link below</p>
                                <br>
                                <p><a href="${url}"><b>Set Password</b></a>.</p>
                                    `
                            }

                            sgMail.send(message)
                                .then(response => {
                                    data.populate('capabilities')
                                        .then((dataStaff) => {
                                            res.json({
                                                message: 'Successful Save',
                                                success: true,
                                                data: dataStaff
                                            })
                                        });
                                })
                                .catch(error => console.log(error.message))
                        }

                    })
                }
            })
        }

    } // END - saveStaff

    // START - setupPassword
    function setupPassword(req, res) {

        User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
            .select('_id password firstName middleName lastName email address mobile role activated')
            .exec((err, data) => {
                if (err) {
                    return res.json(returnError(JSON.stringify(err)))
                } else {

                    data.password = req.body.password
                    data.activated = true

                    data.save((err1, userData) => {
                        if (err1) {
                            return res.json(returnError(JSON.stringify(err1)))
                        } else {

                            auditTrail(
                                req.params.id,
                                LOG_ACTION.PASSWORD_SETUP,
                                'Initial password setup'
                            )

                            return res.json({
                                message: 'Successful Save',
                                success: true,
                                data: userData
                            })
                        }
                    })


                }
            })
    } // END - setupPassword

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

                        auditTrail(
                            data._id,
                            LOG_ACTION.LOGIN_SOCIAL,
                            'Login to the application using Social Media'
                        )

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

        let id = req.params.id

        Pet.findByIdAndUpdate(req.params.id, req.body, { upsert: false }, (err, data) => {
            if (err) {
                res.json(returnError(JSON.stringify(err)))
            } else {

                if (id) {
                    auditTrail(
                        req.session.user._id,
                        LOG_ACTION.PET_UPDATE,
                        'Update pet data for Pet ID: ' + id
                    )
                } else {
                    auditTrail(
                        dreq.session.user._id,
                        LOG_ACTION.PET_REGISTRATION,
                        'Added new pet. Pet ID: ' + data._id
                    )
                }

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

function auditTrail(user, action, description) {
    if (user) {
        new Audit({
            user: mongoose.Types.ObjectId(user),
            action: action,
            description: description
        }).save();
    }
}


