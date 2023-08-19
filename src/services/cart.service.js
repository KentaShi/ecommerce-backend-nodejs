"use strict"

const { cart } = require("../models/cart.model")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const {
    createUserCart,
    updateUserCartQuantity,
} = require("../models/repositories/cart.repo")

/*
    CartService
    - add product to cart [user]
    - reduce product quantity [user]
    - increase product quantity [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]

 */

class CartService {
    static async addToCart({ userId, product = {} }) {
        // check if cart already exists
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create new cart
            return await createUserCart({ userId, product })
        }

        // if cart already exists but it doesnt have product yet
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // if cart already exists and it has product
        return await updateUserCartQuantity({ userId, product })
    }
}

module.exports = CartService
