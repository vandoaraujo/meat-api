"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
const logger_1 = require("../common/logger");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
const corsMiddleware = require("restify-cors-middleware");
class Server {
    initializeDb() {
        //usamos essa promise por orientação do mongoose.
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            //modo de conexaco que o mongoose usa para chegar ao mongodb, forma nova de conectar ao banco
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger_1.logger
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate),
                        options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                const corsOptions = {
                    preflightMaxAge: 10,
                    //origins: ['http://localhost:4200'],
                    origins: ['*'],
                    //permite adicionar esse header a mais
                    allowHeaders: ['authorization'],
                    //criando um header personalizado e expondo para a aplicacao cliente esse header.
                    exposeHeaders: ['x-custom-header']
                };
                const cors = corsMiddleware(corsOptions);
                // diferenca entre use e pre -> ambos registram handlers e sao chamados no request
                // porém apenas o use é invocado se a rota for válida.
                this.application.pre(cors.preflight);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                this.application.use(cors.actual);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
                // this.application.on('after', restify.plugins.auditLogger({
                //   log: logger,
                //   event: 'after',
                //   server: this.application  
                // }))
                // this.application.on('audit', data=>{
                // })
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
