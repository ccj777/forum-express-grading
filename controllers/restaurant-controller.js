const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category // 拿出關聯的 Category mode
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("The restaurant doesn't exist!")
        return restaurant.update({ viewCounts: restaurant.dataValues.viewCounts + 1 }) //
      })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("The restaurant doesn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
