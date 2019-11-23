import * as mongoose from 'mongoose'

//as interfaces criadas sao apenas para um controle estatico, elas nao viram objetos...
export interface User extends mongoose.Document {
    name: string,
    email:string,
    password: string
}

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
})

//adapta ao documento user o schema de usuario...
export const User = mongoose.model<User>('User', userSchema)


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