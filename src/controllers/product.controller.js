"use strict"

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const { CREATED, SuccessResponse } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        // v1
        // new SuccessResponse({
        //     message: "Product created successfully!",
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId,
        //         }
        //     ),
        // }).send(res)

        //v2
        new SuccessResponse({
            message: "Product created successfully!",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res)
    }

    /**
     * @desc Get all draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */

    // query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft for shop successfully!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
    // end query
}

module.exports = new ProductController()
