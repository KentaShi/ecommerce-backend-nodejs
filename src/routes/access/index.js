const asyncHandler = require("../../helpers/asyncHandler")
const accessController = require("../../controllers/access.controller")
const { authentication } = require("../../auth/authUtils")

const router = require("express").Router()

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp))

//login
router.post("/shop/login", asyncHandler(accessController.login))

//authentication
router.use(authentication)
//logout
router.post("/shop/logout", asyncHandler(accessController.logout))
//refreshToken
router.post(
    "/shop/handlerRefreshToken",
    asyncHandler(accessController.handlerRefreshToken)
)

module.exports = router
