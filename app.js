var express = require("express")
const expObj = express()

const config = require('config')
const environmentport = config.get('port');

var bodyparser = require("body-parser")

expObj.use(bodyparser.json())

const routes = require("./router")

expObj.use("/",routes)

const port = environmentport || 3333

expObj.listen(port,()=>{
    console.log(`express listing on port ${port}`)
})