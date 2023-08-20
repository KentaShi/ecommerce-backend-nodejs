"use strict"

const { cart } = require("../cart.model")
const { getProductById } = require("./product.repo")

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: "active" }
    const { productId } = product
    const foundProduct = await getProductById({ productId })
    const { product_name, product_price } = foundProduct
    const newProduct = { ...product, product_name, product_price }
    const updateOrInsert = {
        $addToSet: {
            cart_products: newProduct,
        },
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
    }
    const updateSet = {
        $inc: {
            "cart_products.$.quantity": quantity,
        },
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
}

const getList = async ({ userId }) => {
    return await cart.findOne({ cart_userId: +userId }).lean()
}

const deleteCartItem = async (query, updateSet) => {
    return cart.updateOne(query, updateSet)
}

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteCartItem,
    getList,
}
