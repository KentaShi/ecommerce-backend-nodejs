const app = require("./src/app")

const PORT = 5000

const server = app.listen(PORT, () => {
    console.log(`Web service eCommerce is listening on port ${PORT}`)
})

process.on("SIGINT", () => {
    server.close(() => console.log("Exit server express"))
})
