import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from '../users/users.model'

class UsersRouter extends Router {
    applyRoutes(application : restify.Server){
        application.get('/users', (req, resp, next) =>{
            //Estamos emulando um metodo findall que usará uma promise pra buscar do 'banco de dados'
            User.findAll().then(users=> {
                resp.json(users)
                return next()
            })
            //resp.json({message: 'users router', users: User.findAll()})
        })

        application.get('users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user=>{
                if(user){
                    resp.json(user)
                    return next()
                }
                resp.send(404)
                return next()
                // resp.json({message: 'nao encontrado'})
            })
        })
    }
}

export const usersRouter = new UsersRouter()