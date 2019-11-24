import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
import {hash} from 'bcryptjs'
import {environment} from '../common/environment'

//as interfaces criadas sao apenas para um controle estatico, elas nao viram objetos...
export interface User extends mongoose.Document {
    name: string,
    email:string,
    password: string
}

const userSchema = new mongoose.Schema({
    name:{
        type: String,   
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
        
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf:{
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        } 
    }
})

//usar a funcao tradicional no JS porque o 
//Mongoose nao se adapta a aerofunctions
//nao atribue um valor personalizado ao this...
userSchema.pre('save', function (next){
    const user: User = this
    if(!user.isModified('password')){
        next()
    }else{
        hash(user.password, environment.security.saltRounds)
        .then(hash=>{
            user.password = hash
            next()
        }).catch(next)
    }
})

userSchema.pre('findOneAndUpdate', function (next){
    const user: User = this
    if(!this.getUpdate().password){
        next()
    }else{
        hash(this.getUpdate().password, environment.security.saltRounds)
        .then(hash=>{
            this.getUpdate().password = hash
            next()
        }).catch(next)
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