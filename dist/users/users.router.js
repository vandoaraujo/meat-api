"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("../users/users.model");
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            //Estamos emulando um metodo findall que usará uma promise pra buscar do 'banco de dados'
            users_model_1.User.find().then(users => {
                resp.json(users);
                return next();
            });
            //resp.json({message: 'users router', users: User.findAll()})
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
        application.get('users/:id', (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
                // resp.json({message: 'nao encontrado'})
            });
        });
        application.post('/users', (req, resp, next) => {
            let user = new users_model_1.User(req.body);
            user.save().then(user => {
                user.password = undefined;
                resp.json(user);
                return next();
            });
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
                    resp.send(404);
                }
            }).then(user => {
                resp.json(user);
                return next();
            });
        });
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
        application.del('/users/:id', (req, resp, next) => {
            users_model_1.User.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(404);
                }
                else {
                    resp.send(404);
                }
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();
