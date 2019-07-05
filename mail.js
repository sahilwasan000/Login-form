var express=require('express');
var nodemailer = require("nodemailer");
var app=express();
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "rahulsharmaa635@gmail.com",
        pass: "Sahil@12345"
    }
});
/*------------------SMTP Over-----------------------------*/

module.exports = {smtpTransport};
