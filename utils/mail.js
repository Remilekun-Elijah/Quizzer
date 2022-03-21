const path = require("path");
const config = require(path.resolve("configs", "config"));
const nodemailer = require("nodemailer");
const { info, error, success } = require('consola');


exports.sendMail = async function(message) {
    info("sending mail to", message.to+'...');
    const transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 587, // 587 465
        secure: false,
        auth: {
            user: config.gmailUser,
            pass: config.gmailSecret
        }
    })
    const packet = {
        from: `"${config.application_name}" <${config.gmailUser}>`,
        to: message.to,
        replyTo: `<${config.gmailUser}>`,
        subject: message.subject,
        html: message.body
    };

    try {
        /* send the mail */
        transporter.sendMail(packet, (err, infos) => {
            if (err) {
                error("email sending failed:", err.message);
                info("attempting to send mail again...");
                transporter.sendMail(packet, (err, info) => {
                    if (err) {
                        error("Failed to send mail");
                    } else success("Email sent to:", info.messageId, "after failed trial ");
                });
            } else success("Email sent to:", infos.messageId);
        });

    } catch (e) {
        throw new Error("Something is wrong with the mail service, please try again.");
    }
};


