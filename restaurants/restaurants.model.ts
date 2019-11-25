import * as mongoose from 'mongoose'

export interface MenuItem extends mongoose.Document {
    name: string,
    price: number
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        // se trouxer o restaurante por default nao traz o menu...
        select: false,
        //valor default para o menu.
        default: []
    }
})

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema)