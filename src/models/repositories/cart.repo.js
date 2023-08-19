"use strict"

const { cart } = require("../cart.model")

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: "active" }
    const updateOrInsert = {
        $addToSet: {
            cart_products: product,
        },
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        "cart_product.productId": productId,
        cart_state: "active",
    }
    const updateSet = {
        $in: {
            "cart_products.$.quantity": quantity,
        },
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
}

module.exports = { createUserCart, updateUserCartQuantity }
