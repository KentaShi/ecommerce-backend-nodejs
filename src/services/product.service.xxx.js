"use strict"

const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const { findAllDraftsForShop } = require("../models/repositories/product.repo")

// deinde Factory class to create products

class ProductFactory {
    static productRegistry = {} // {key : class}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
    }

    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const { query } = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

//define sub-class for different product type Clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) {
            throw new BadRequestError("Create new clothing error")
        }
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (clothing) error")
        }
    }
}

//define sub-class for different product type Electronics

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) {
            throw new BadRequestError("Create new Electronic error")
        }
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (Electronic) error")
        }
    }
}

//define sub-class for different product type Furnitures

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) {
            throw new BadRequestError("Create new Furniture error")
        }
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (Furniture) error")
        }
    }
}

// register products types
ProductFactory.registerProductType("Electronic", Electronic)
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Furniture", Furniture)

module.exports = ProductFactory
