"use strict"

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const DiscountService = require("./discount.service")

class CheckoutService {
    /* payload 
        {
            "cartId",
            "userId",
            "shop_order_ids":[
                {
                    "shopId",
                    "shop_discounts":[
                        {
                            "shopId",
                            "discountId",
                            "codeId"
                        }
                    ],
                    item_products":[
                        {
                            "price",
                            "quantity",
                            "productId",
                        }
                    ]
                }
            ]

        }
    */

    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        //check cartId
        const foundCart = await findCartById(cartId)
        if (!foundCart) {
            throw new BadRequestError(`Cart not found`)
        }

        const checkout_order = {
            totalPrice: 0, //tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0, // tong thanh toan
        }
        const shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts, item_products } = shop_order_ids[i]
            // check product in server
            const checkProductServer = await checkProductByServer(item_products)
            //console.log("checkProductServer::" + checkProductServer)
            if (!checkProductServer[0]) {
                throw new BadRequestError("Order Wrong")
            }
            //tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)

            //tong tien truoc khi xu li
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // truoc khi giam gia
                priceAppliedDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            //new shop_discounts > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                //gia su chi co mot discount
                const { totalPrice = 0, discountAmount = 0 } =
                    await DiscountService.getDiscountAmount({
                        code: shop_discounts[0].code,
                        userId,
                        shopId,
                        products: checkProductServer,
                    })
                //console.log(`discount amount:: ${discountAmount}`)
                //tong cong discount giam gia
                checkout_order.totalDiscount += discountAmount
                //new tien giam gia lon hon 0
                if (discountAmount > 0) {
                    itemCheckout.priceAppliedDiscount =
                        checkoutPrice - discountAmount
                }
            }

            //tong thanh toan
            checkout_order.totalCheckout += itemCheckout.priceAppliedDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},
    }) {
        const { shop_order_ids_new, checkout_order } =
            await CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids: shop_order_ids,
            })

        // check xem co vuot ton kho hay khong
        const products = shop_order_ids_new.flatMap(
            (order) => order.item_products
        )
        console.log(`[1]::`, products)
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
        }
    }
}

module.exports = CheckoutService
