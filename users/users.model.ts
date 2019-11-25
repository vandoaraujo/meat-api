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


const hashPassword = (obj, next)=>{
    hash(obj.password, environment.security.saltRounds)
    .then(hash=>{
        obj.password = hash
        next()
    }).catch(next)
}

//usar a funcao tradicional no JS porque o 
//Mongoose nao se adapta a aerofunctions
//nao atribue um valor personalizado ao this...
const saveMiddleware = function (next){
    const user: User = this
    if(!user.isModified('password')){
        next()
    }else{
        hashPassword(user, next)
    }
}

const updateMiddleware = function (next){
    const user: User = this
    if(!this.getUpdate().password){
        next()
    }else{
       hashPassword(this.getUpdate, next)
    }
}


userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

//adapta ao documento user o schema de usuario...
export const User = mongoose.model<User>('User', userSchema)