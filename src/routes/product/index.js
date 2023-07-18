"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const productController = require("../../controllers/product.controller")
const { authentication } = require("../../auth/authUtils")

const router = require("express").Router()

//authentication
router.use(authentication)
//logout
router.post("", asyncHandler(productController.createProduct))

module.exports = router
