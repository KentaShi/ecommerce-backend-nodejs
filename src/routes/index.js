const router = require("express").Router()

router.use("/v1/api", require("./access"))

module.exports = router
