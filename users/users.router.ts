import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from '../users/users.model'

class UsersRouter extends Router {
    applyRoutes(application : restify.Server){
        application.get('/users', (req, resp, next) =>{
            //Estamos emulando um metodo findall que usará uma promise pra buscar do 'banco de dados'
            User.findAll().then(users => {
                resp.json(users)
                return next()
            })
            //resp.json({message: 'users router', users: User.findAll()})
        })
    }
}

export const usersRouter = new UsersRouter()