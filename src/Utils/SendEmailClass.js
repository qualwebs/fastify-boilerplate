const nodemailer = require("nodemailer");
require('dotenv').config();
const {v4} = require("uuid");
const moment = require("moment");

class SendEmailClass{
    constructor(subject, content, users, attachments){
        this.content = content;
        this.subject = subject;
        this.users = users;
        this.attachments = attachments;
    }

    async sendEmail(){

        // create Nodemailer SES transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });


        const recipients = this.users;
        const content = this.content;
        const attachments = this.attachments;

        // PROCESS ATTACHMENT FOR SMTP
        const refinedAttachments = [];
        if(attachments != null && attachments.length){
            attachments.map((item)=>{
                refinedAttachments.push({
                    filename: item.substring(item.lastIndexOf('/') + 1),
                    path: item
                })
            })
        }

        // VALIDATE THE RECIPIENTS
        if(recipients.length){
            recipients.map(async (recipient) => {

                // send mail with defined transport object
                try{
                    await transporter.sendMail({
                        from: `"Car Washing" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address
                        to: recipient.email, // list of receivers
                        subject: this.subject, // Subject line
                        text: this.subject, // plain text body
                        html: content, // html body
                        attachments: refinedAttachments,
                        headers: {
                            to: recipient.email,
                            from: `"Report Tool" <${process.env.MAIL_FROM_ADDRESS}>`,
                            priority: 'normal',
                            'message-id': 'carws-'+v4(),
                            subject: this.subject,
                            date: moment().format('ddd, D MMM YYYY hh:mm:ss ZZ')
                        }
                    });
                }catch (e) {
                    console.log(e.toString());
                }
            })
        }
    }
}
module.exports = SendEmailClass;
