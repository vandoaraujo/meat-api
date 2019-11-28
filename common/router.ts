import * as restify from 'restify'
import { EventEmitter } from 'events'
import {NotFoundError} from 'restify-errors'

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)
    
    envelope(document: any): any {
        return document
    }

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
    render(response: restify.Response, next: restify.Next){
        return (document)=>{
            if(document){
                this.emit('beforeRender', document)
                response.json(this.envelope(document))                
            }else{
                throw new NotFoundError('Documento não encontrado') 
            }
            return next()   
        }
    }

    renderAll(response: restify.Response, next: restify.Next){
        return (documents : any [])=>{
            if(documents){
                documents.forEach((document, index, array) =>{
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document)
                })
                response.json(documents) 
            }else{
                response.json([])
            }
            return next()
        }
    }
}