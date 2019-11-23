"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
const users_model_1 = require("../users/users.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            //Estamos emulando um metodo findall que usará uma promise pra buscar do 'banco de dados'
            users_model_1.User.find()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.get('users/:id', (req, resp, next) => {
            users_model_1.User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.post('/users', (req, resp, next) => {
            let user = new users_model_1.User(req.body);
            user.save()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.put('/users/:id', (req, resp, next) => {
            //faz um overwrite completo no objeto...
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    //obtem o recurso atualizado e retorna no then abaixo
                    return users_model_1.User.findById(req.params.id).exec();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(resp, next))
                .catch(next);
        });
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del('/users/:id', (req, resp, next) => {
            users_model_1.User.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        });
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
