"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
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
});
exports.Restaurant = mongoose.model('Restaurant', restSchema);
