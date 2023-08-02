"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const productController = require("../../controllers/product.controller")
const { authenticationV2 } = require("../../auth/authUtils")

const router = require("express").Router()

//authentication
router.use(authenticationV2)
//create product
router.post("/", asyncHandler(productController.createProduct))

module.exports = router
