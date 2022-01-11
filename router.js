module.exports = require("express").Router()

.use("/user",require("./Controllers/userController"))
.use("/email",require("./Controllers/emailController"))