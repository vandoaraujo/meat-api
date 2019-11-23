"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
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
    cpf: {
        type: String
    }
});
//adapta ao documento user o schema de usuario...
exports.User = mongoose.model('User', userSchema);
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
