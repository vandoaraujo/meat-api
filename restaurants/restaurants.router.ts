import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {Restaurant} from './restaurants.model'
import {ModelRouter} from '../common/model-router'

class RestaurantsRouter extends ModelRouter<Restaurant> {

    constructor(){
        super(Restaurant)
    }


    replaceMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id)
          .then( rest => {
            if(!rest){
                throw new NotFoundError('Restaurant not found')
            }else{
                rest.menu = req.body //Array de menuItem
                return rest.save()
            }
        }).then(rest =>{
            resp.json(rest.menu)
            return next()
        }).catch(next)
    }
    findMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id, "+menu" )
          .then( rest => {
            if(!rest){
                throw new NotFoundError('Restaurant not found')
            }else{
                resp.json(rest.menu)
                return next()
            }
        }).catch(next)
    }

    applyRoutes(application : restify.Server){
        application.get('/restaurants', this.findAll)
        application.get('restaurants/:id', [this.validateId, this.findById])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [this.validateId, this.replace])
        application.patch('/restaurants/:id', [this.validateId, this.update])
        application.del('/restaurants/:id', [this.validateId, this.delete])
        application.get('/restaurants/:id', [this.validateId, this.findMenu])
    }

}

export const restaurantsRouter = new RestaurantsRouter()