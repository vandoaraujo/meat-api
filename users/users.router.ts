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

    findByEmail = (req, resp, next )=>{
      if(req.query.email){
        User.findByEmail(req.query.email)
          .then(user => user ? [user] : [])
          .then(this.renderAll(resp, next))
          .catch(next)
      }else{
        next()
      }
    }
    
    applyRoutes(application : restify.Server){
        //Usamos o header accept-version para indicar ao restify qual versao utilizar
        //NO caso de nao passar nenhuma, ele usa a mais recente...
        //Podemos usar assim: accept-version 1.0.0 ou >1.0.0 usando qualqer versao maior q 1.0.0
        application.get({path:`${this.basePath}`, version: '2.0.0'}, [this.findByEmail, this.findAll])
        application.get({path:`${this.basePath}`, version: '1.0.0'}, this.findAll)
        //Podemos validar o Id passando um array, no primeiro parametro valido o ID.
        //passando a validação do ID, chama a funcao next e executa o metodo de busca findById
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
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