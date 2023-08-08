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
}

module.exports = new ProductController()
