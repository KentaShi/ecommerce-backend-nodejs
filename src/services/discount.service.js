"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { convertToObjectIdMongodb } = require("../utils")
const { findAllProducts } = require("../models/repositories/product.repo")
const {
    findAllDiscountCodesUnselect,
} = require("../models/repositories/discount.repo")

/*
    Discount Service

    1. Generate Discount Code [Shop | Admin]
    2. Get Discount amount [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [USer]
    5. Delete discount code [Admin | Shop]
    6. Cancel discount code [User]

 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            name,
            description,
            type,
            value,
            max_value,
            code,
            start_date,
            end_date,
            max_uses,
            count_of_used,
            list_users_used,
            max_per_user,
            min_order_value,
            shopId,
            is_active,
            applies_to,
            product_ids,
        } = payload

        if (
            new Date() < new Date(start_date) ||
            new Date() > new Date(end_date)
        ) {
            throw new BadRequestError("Discount code has expired!")
        }

        if (new Date(start_date) > new Date(end_date))
            throw new BadRequestError("Start date must be before end date!")

        //create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists!")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_count_of_used: count_of_used,
            discount_list_users_used: list_users_used,
            discount_max_per_user: max_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        })
    }

    static async updateDiscountCode() {}

    /*
        Get all products belong to discount codes
    */

    static async getAllProductsBelongToDiscountCode({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        //create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean()

        if (!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("Discount not found")

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === "all") {
            //get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            })
        }
        if (discount_product_ids === "specific") {
            //get product_ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            })
        }

        return products
    }

    /*
        Get all discount codes of shop
    */
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ["__v", "discount_shopId"],
        })

        return discounts
    }

    static async getDiscountAmount()
}
