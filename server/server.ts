import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose';

export class Server {

  application: restify.Server

  initializeDb(): mongoose.MongooseThenable {
    //usamos essa promise por orientação do mongoose.
    (<any>mongoose).Promise = global.Promise
     return mongoose.connect(environment.db.url, {
       //modo de conexaco que o mongoose usa para chegar ao mongodb, forma nova de conectar ao banco
        useMongoClient: true
     })
  }

  initRoutes(routers : Router []): Promise<any>{
    return new Promise((resolve, reject)=>{
      try{

        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.get('/info', [
          (req, resp, next)=>{
            if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
            //resp.status(400)
          //  resp.json({message: 'Please, update your browser'})
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

        this.application.listen(environment.server.port, ()=>{
           resolve(this.application)
        })

      }catch(error){
        reject(error)
      }
    })
  }

  bootstrap(routers : Router [] = []): Promise<Server>{
      return this.initializeDb().then(() =>
             this.initRoutes(routers).then(()=> this))
  }

}
