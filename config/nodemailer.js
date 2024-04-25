const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

//create reusable transporter on object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'zadafiyajay4@gmail.com',
        pass: 'zlcvjpkytrvldnfj',

    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, "../views/mailers", relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log('Error in rendering template');
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}