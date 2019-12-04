import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {User} from './users.model'
import {authenticate} from '../security/auth.handler'
import {authorize} from '../security/authz.handler'

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
          .then(this.renderAll(resp, next, { pageSize: this.pageSize, url: req.url}))
          .catch(next)
      }else{
        //avisamos o restify que ja estamos renderizando a resposta e nao queremos mais callback
        next(false)
      }
    }
    
    applyRoutes(application : restify.Server){
        //Usamos o header accept-version para indicar ao restify qual versao utilizar
        //NO caso de nao passar nenhuma, ele usa a mais recente...
        //Podemos usar assim: accept-version 1.0.0 ou >1.0.0 usando qualqer versao maior q 1.0.0
        // application.get({path:`${this.basePath}`, version: '2.0.0'}, [this.findByEmail, this.findAll])
        // application.get({path:`${this.basePath}`, version: '1.0.0'}, this.findAll)
        // //Podemos validar o Id passando um array, no primeiro parametro valido o ID.
        // //passando a validação do ID, chama a funcao next e executa o metodo de busca findById
        // application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        // application.post(`${this.basePath}`, this.save)
        // application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        // application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        // application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
        // application.post(`${this.basePath}/authenticate`, authenticate)

        application.get({path:`${this.basePath}`, version: '1.0.0'},[ authorize('admin'), this.findAll])

        application.get(`${this.basePath}`, [
          authorize('admin'),
          this.findByEmail,
          this.findAll
        ])
        
        application.get(`${this.basePath}/:id`, [authorize('admin') , this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, [ this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [authorize('admin') , this.validateId,this.update])
        application.del(`${this.basePath}/:id`, [authorize('admin') , this.validateId,this.delete])
    
        application.post(`${this.basePath}/authenticate`, authenticate)

    }
}

export const usersRouter = new UsersRouter()