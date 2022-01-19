const controller = require('./controller')()

module.exports = (express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', controller.ping)
    
    // Main Features
    
    api.get('/appointment/user/:userid', controller.getAppointments)
    api.get('/appointment/date/:y/:m/:d', controller.getAppointmentTime)
    api.get('/appointment/status/:status/:from/:to', controller.getAppointments)
    api.get('/appointment/status/:status', controller.getAppointments)
    api.get('/appointment/:id', controller.getAppointments)
    api.get('/appointment/:from/:to', controller.getAppointments)
    api.get('/appointment', controller.getAppointments)
    api.get('/client', controller.getClients)
    api.get('/config', controller.getConfig)
    api.get('/pet/:id', controller.getPets)
    api.get('/pet/user/:userid', controller.getPets)
    api.get('/pet-count/:id', controller.petCount)
    api.get('/schedule', controller.getSchedules)
    api.get('/service-type', controller.getServiceTypes)
    api.get('/service-type/:id', controller.getServiceTypes)
    api.get('/service', controller.getServices)
    api.get('/service/:id', controller.getServices)
    api.get('/session', controller.getSession)
    api.get('/staff', controller.getStaffs)
    api.get('/staff/:id', controller.getStaffs)
    api.get('/staff/count/:serviceType/:weekDay', controller.getAvailableStaff)
    api.get('/user/:id', controller.getUser)
    api.get('/user/verification/:id', controller.verifyAccount)
    api.get('/user/verification/resend/:id', controller.resendEmailVerification)

    api.put('/pet/:id', controller.updatePet)

    api.post('/appointment', controller.saveAppointment)
    api.post('/appointment/:id', controller.saveAppointment)
    api.post('/authenticate', controller.authenticate)
    api.post('/config', controller.saveConfig)
    api.post('/logout', controller.logout)
    api.post('/pet', controller.registerPet)
    api.post('/pet/:id', controller.registerPet)
    api.post('/schedule', controller.saveSchedule)
    api.post('/service-type', controller.saveServiceType)
    api.post('/service-type/:id', controller.saveServiceType)
    api.post('/service', controller.saveServices)
    api.post('/setup-password/:id', controller.setupPassword)
    api.post('/staff/:id', controller.saveStaff)
    api.post('/staff', controller.saveStaff)
    api.post('/social-media-login', controller.socialMediaLogin)
    api.post('/user/login', controller.saveUser)
    api.post('/user', controller.saveUser)

    return api
}