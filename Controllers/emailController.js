const express = require("express")
const bodyparser = require('body-parser');

const hashtable = require("simple-hashtable")
const paramhash = new hashtable()

const router = express.Router()
router.use(bodyparser.json())

const nodemailer = require("nodemailer");
require('dotenv').config()

const cors = require("cors")

const sqloperation = require('../sqloperation')

var CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "POST"
}
router.use(cors(CorsOptions))
module.exports = router

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    service: "gmail",
    auth: {
        user: process.env.SENDER_ID,
        pass: process.env.SENDER_PASSWORD
    }
})


router.post("/send", cors(), function (req, res) {

    paramhash.put('user_id', req.body.user_id ? req.body.user_id : null)
        .put('group_name', req.body.group_name)

    var q = "email_list"

    sqloperation.executeStoredProcedureWithParameters(q, paramhash).then(result => {
        email_list = result.recordset.map(value => value.email_address);

        if (result.rowsAffected) {

            const mailOptions = {
                from: "YOUR GMAIL ID",
                to: email_list,
                subject: req.body.subject_name,
                text: req.body.message
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    res.status(200).send({ message: "Try again" })
                }
                else {
                    console.log("email Send :" + info.response)
                    res.status(200).send({ message: "email Send." })
                }
            })
        }
        else {
            res.status(200).send({ message: "Try again" })
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err)
    });
})