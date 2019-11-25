import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {User} from '../users/users.model'

class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }
    
    applyRoutes(application : restify.Server){

        application.get('/users', this.findAll)
        //Podemos validar o Id passando um array, no primeiro parametro valido o ID.
        //passando a validação do ID, chama a funcao next e executa o metodo de busca findById
        application.get('users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.replace])
        application.patch('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete])
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
    }
}

export const usersRouter = new UsersRouter()