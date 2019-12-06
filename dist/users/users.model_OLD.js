"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const users = [
//     {id: '1', name: 'Peter Park', email: 'peter@marvel.com'},
//     {id: '2', name: 'Bruce Wayne', email: 'bruce@dc.com'}
// ]
// export class User {
//     static findAll(): Promise<any[]>{
//         return Promise.resolve(users)
//     }
//     static findById(id: string): Promise<any> {
//         return new Promise(resolve=>{
//             const filtered = users.filter(user=> user.id === id)
//             let user = undefined
//             if(filtered.length > 0){
//                 user = filtered[0]
//             }
//             resolve(user)
//         })
//     }
// }
/**
 *
 *         application.get('/info', [
            (req, resp, next)=>{
              if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
              //resp.status(400)
              //resp.json({message: 'Please, update your browser'})
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
 *
 */ 
