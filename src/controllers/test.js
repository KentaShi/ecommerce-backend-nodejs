const router = require("express").Router()

router.get("/test", (req, res, next) => {
    const strcompress = "hello world"
    return res
        .status(200)
        .json({ message: "hello", metadata: strcompress.repeat(10000) })
})

module.exports = router
