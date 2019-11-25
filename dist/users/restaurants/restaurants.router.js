"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_model_1 = require("./restaurants.model");
const model_router_1 = require("./common/model-router");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
    }
}
