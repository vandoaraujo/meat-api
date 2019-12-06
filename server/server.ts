import * as fs from 'fs'

import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import {logger} from '../common/logger'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'
import {tokenParser} from '../security/token.parser'
import * as corsMiddleware from 'restify-cors-middleware'

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

        const options: restify.ServerOptions = {
          name: 'meat-api',
          version: '1.0.0',
          log: logger
        }

        if(environment.security.enableHTTPS){
          options.certificate = fs.readFileSync(environment.security.certificate),
          options.key = fs.readFileSync(environment.security.key)
        }

        this.application = restify.createServer(options)

        const corsOptions: corsMiddleware.Options = {
          preflightMaxAge: 10,
          //origins: ['http://localhost:4200'],
          origins: ['*'],
          //permite adicionar esse header a mais
          allowHeaders: ['authorization'],
          //criando um header personalizado e expondo para a aplicacao cliente esse header.
          exposeHeaders: ['x-custom-header']
        }

        const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

        // diferenca entre use e pre -> ambos registram handlers e sao chamados no request
        // porém apenas o use é invocado se a rota for válida.
        this.application.pre(cors.preflight)

        this.application.pre(restify.plugins.requestLogger({
          log: logger
        }))

        this.application.use(cors.actual)
        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, ()=>{
           resolve(this.application)
        })

        this.application.on('restifyError', handleError)
        // this.application.on('after', restify.plugins.auditLogger({
        //   log: logger,
        //   event: 'after',
        //   server: this.application  
        // }))

        // this.application.on('audit', data=>{

        // })

      }catch(error){
        reject(error)
      }
    })
  }

  bootstrap(routers : Router [] = []): Promise<Server>{
      return this.initializeDb().then(() =>
             this.initRoutes(routers).then(()=> this))
  }

  shutdown(){
    return mongoose.disconnect().then(()=>this.application.close())
  }

}
