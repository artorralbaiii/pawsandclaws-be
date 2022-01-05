const controller = require('./controller')()

module.exports = (express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', controller.ping)
    
    // Main Features
    
    api.get('/session', controller.getSession)

    api.put('/pet/:id', controller.updatePet)


    api.post('/authenticate', controller.authenticate)
    api.post('/pet', controller.registerPet)
    api.post('/user', controller.saveUser)

    return api
}