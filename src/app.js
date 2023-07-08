const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression")
const app = express()
require("dotenv").config()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// init db
require("./db/init.mongodb")
const { checkOverload } = require("./helpers/check.connect")

//checkOverload()

// init routers
app.use("", require("./routes"))
// handling errors

module.exports = app
