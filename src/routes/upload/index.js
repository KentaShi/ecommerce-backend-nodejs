"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const uploadController = require("../../controllers/upload.controller")
const { authenticationV2 } = require("../../auth/authUtils")
const { uploadDisk } = require("../../configs/multer.config")

const router = require("express").Router()

// router.use(authenticationV2)

router.post("/product", asyncHandler(uploadController.uploadFile))
router.post(
    "/product/thumb",
    uploadDisk.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
)

module.exports = router
