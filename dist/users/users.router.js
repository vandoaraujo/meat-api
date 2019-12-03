"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => user ? [user] : [])
                    .then(this.renderAll(resp, next, { pageSize: this.pageSize, url: req.url }))
                    .catch(next);
            }
            else {
                //avisamos o restify que ja estamos renderizando a resposta e nao queremos mais callback
                next(false);
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
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
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authz_handler_1.authorize('admin'), this.findAll]);
        application.get(`${this.basePath}`, [
            authz_handler_1.authorize('admin'),
            this.findByEmail,
            this.findAll
        ]);
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
