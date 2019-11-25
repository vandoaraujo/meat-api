"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("../users/users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get('/users', this.findAll);
        //Podemos validar o Id passando um array, no primeiro parametro valido o ID.
        //passando a validação do ID, chama a funcao next e executa o metodo de busca findById
        application.get('users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
        application.get('/info', [
            (req, resp, next) => {
                if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
                    //resp.status(400)
                    //resp.json({message: 'Please, update your browser'})
                    let error = new Error();
                    error.statusCode = 400;
                    error.message = 'Please, update your browser';
                    return next(error);
                }
                return next();
            }, (req, resp, next) => {
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
                });
                return next();
            }
        ]);
    }
}
exports.usersRouter = new UsersRouter();
