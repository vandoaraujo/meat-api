"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    /*

    Olá Fernando,

A função render retorna uma outra função cujo argumento é o document que queremos, então quem vai chamar essa 2ª função e passar o valor (o document) é a função then da Promise (quando esta for resolvida).

Se a gente olhar a assinatura de uma função passada ao then, teremos algo assim:

User.find().then(user => {
   resp.json(user)
})
Ou seja, uma função com um argumento.

Mas como queríamos criar uma função para reaproveitar a renderização de um documento qualquer, precisamos também do objeto Response e da função Next do restify.

Então, o que fizemos foi criar essa função, chamamos de render e dentro dela retornamos a função com a assinatura correspondente ao then.

Isso é chamado de closure.

Um closure é uma função que captura algumas informações e cria um ambiente fechado (um escopo) para uma outra função. No caso, a função render captura o objeto Response e Next para ser usado quando a função retornada for de fato chamada.

Para mais detalhes sobre closure, segue o link.

Abraços.

    */
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(document);
            }
            else {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            }
            return next();
        };
    }
}
exports.Router = Router;
