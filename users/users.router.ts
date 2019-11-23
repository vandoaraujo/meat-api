import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from '../users/users.model'

class UsersRouter extends Router {
    applyRoutes(application : restify.Server){
        application.get('/users', (req, resp, next) =>{
            //Estamos emulando um metodo findall que usará uma promise pra buscar do 'banco de dados'
            User.find().then(users=> {
                resp.json(users)
                return next()
            })
            //resp.json({message: 'users router', users: User.findAll()})
        })

        application.get('/info', [
            (req, resp, next)=>{
              if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
              //resp.status(400)
              //resp.json({message: 'Please, update your browser'})
              let error: any = new Error()
              error.statusCode = 400
              error.message = 'Please, update your browser'
              return next(error)
            }
            return next()
          },(req, resp, next)=>{
            //resp.contentType = 'application/json';
            //resp.status(400)
            //resp.setHeader('Content-Type','application/json')
            //resp.send({message: 'hello'});
            resp.json({
              browser: req.userAgent(),
              method: req.method,
              url: req.href(),
              path: req.path(),
              query: req.query
            })
            return next()
          }])

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

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body);
            user.save().then(user =>{
                user.password = undefined
                resp.json(user)
                return next()
            })
        })

        application.put('/users/:id', (req, resp, next)=>{
            //faz um overwrite completo no objeto...
            const options = {overwrite: true}
            User.update({_id:req.params.id}, req.body, options)
                .exec().then(result=>{
                    if(result.n){
                        //obtem o recurso atualizado e retorna no then abaixo
                        return User.findById(req.params.id).exec()
                    }else{
                        resp.send(404)
                    }
                }).then(user=>{
                    resp.json(user)
                    return next()
                })
        })

        application.patch('/users/:id', (req, resp, next)=>{
            const options = {new : true}
            User.findByIdAndUpdate(req.params.id, req.body, options).then(user=>{
                if(user){
                    resp.json(user)
                    return next()
                }
                resp.send(404)
                return next()
            })
        })

        application.del('/users/:id', (req, resp, next)=>{
            User.remove({_id:req.params.id}).exec().then((cmdResult: any)=>{
                if(cmdResult.result.n){
                    resp.send(404)
                }  else{
                    resp.send(404)
                } 
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()