const controller = require('./controller')()

module.exports = (express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', controller.ping)
    
    // Main Features
    
    api.get('/session', controller.getSession)
    api.get('/pet/:id', controller.getPets)
    api.get('/pet/user/:userid', controller.getPets)

    api.put('/pet/:id', controller.updatePet)


    api.post('/authenticate', controller.authenticate)
    api.post('/logout', controller.logout)
    api.post('/pet', controller.registerPet)
    api.post('/social-media-login', controller.socialMediaLogin)
    api.post('/user/login', controller.saveUser)
    api.post('/user', controller.saveUser)

    return api
}