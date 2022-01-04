const controller = require('./controller')()

module.exports = (express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', controller.ping)
    
    // Main Features
    
    api.get('/session', controller.getSession)

    api.post('/authenticate', controller.authenticate)
    api.post('/user', controller.saveUser)

    return api
}