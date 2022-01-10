const controller = require('./controller')()

module.exports = (express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', controller.ping)
    
    // Main Features
    
    api.get('/config', controller.getConfig)
    api.get('/pet/:id', controller.getPets)
    api.get('/pet/user/:userid', controller.getPets)
    api.get('/schedule', controller.getSchedules)
    api.get('/service-type', controller.getServiceTypes)
    api.get('/service-type/:id', controller.getServiceTypes)
    api.get('/service', controller.getServices)
    api.get('/service/:id', controller.getServices)
    api.get('/session', controller.getSession)
    api.get('/staff', controller.getStaffs)
    api.get('/staff/:id', controller.getStaffs)

    api.put('/pet/:id', controller.updatePet)

    api.post('/authenticate', controller.authenticate)
    api.post('/config', controller.saveConfig)
    api.post('/logout', controller.logout)
    api.post('/pet', controller.registerPet)
    api.post('/pet/:id', controller.registerPet)
    api.post('/schedule', controller.saveSchedule)
    api.post('/service-type', controller.saveServiceType)
    api.post('/service-type/:id', controller.saveServiceType)
    api.post('/service', controller.saveServices)
    api.post('/staff/:id', controller.saveStaff)
    api.post('/staff', controller.saveStaff)
    api.post('/social-media-login', controller.socialMediaLogin)
    api.post('/user/login', controller.saveUser)
    api.post('/user', controller.saveUser)

    return api
}