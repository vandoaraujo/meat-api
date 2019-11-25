import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
import {hash} from 'bcryptjs'
import {environment} from '../common/environment'

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