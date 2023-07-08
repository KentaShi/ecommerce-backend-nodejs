const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression")
const app = express()
const testRoute = require("./controllers/test")

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init db

// init routers
app.use("/api/v1", testRoute)
// app.get("/", (req, res, next) => {
//     const strcompress = "hello world"
//     return res
//         .status(200)
//         .json({ message: "hello", metadata: strcompress.repeat(100000) })
// })
// handling errors

module.exports = app
