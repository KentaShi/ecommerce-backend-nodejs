const { apikey, checkPermission } = require("../auth/checkAuth")

const router = require("express").Router()

//check api key
router.use(apikey)
//check permission
router.use(checkPermission("0000"))

router.use("/v1/api", require("./access"))
router.use("/v1/api/product", require("./product"))

module.exports = router
