import {Server} from './server/server'

const server = new Server()
server.bootstrap().then(server=>{
    console.log('Server is listening on: ', server.application.address())
}).catch(error=>{
    console.log('Server failed to Start')
    console.log(error)
    process.exit(1)
})