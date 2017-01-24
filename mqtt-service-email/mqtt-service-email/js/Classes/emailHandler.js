/************************************************************************
 Product    : Home information and control
 Date       : 2016-07-02
 Copyright  : Copyright (C) 2016 Kjeholt Engineering. All rights reserved.
 Contact    : dev@kjeholt.se
 Url        : http://www-dev.kjeholt.se
 Licence    : ---
 ---------------------------------------------------------
 File       : TBD.js
 Version    : 0.1.0
 Author     : Bjorn Kjeholt
 *************************************************************************/

var nodeMailer = require('nodemailer');

var emailHandler = function(ci) {
    var self = this;
    this.ci = ci;
    this.transporter = null;
    
    this.sendMail = function (dstAddr, subjectText, bodyJson, attachJson) {
        var mailOptions = {
                            from: self.ci.email.addr.local, 
                            to: dstAddr,
                            subject: subjectText, 
                            priority: 'medium',
                            text: (bodyJson.text !== undefined)? bodyJson.text : undefined,
                            html: (bodyJson.html !== undefined)? bodyJson.html : undefined,
                            attachments: []                    
                        };
        var i = 0;
        
        if (attachJson !== undefined) {
            for (i=0; i < attachJson.length; i = i+1) {
                mailOptions.attachments.push({
                                    filename: attachJson[i].filename,
                                    contentType: (attachJson[i].type !== undefined)? attachJson[i].type : 'text/plain',
                                    content: attachJson[i].content
                                });
            }

        }
        
        console.log("E-mail ->", JSON.stringify(mailOptions));
        
        self.transporter.sendMail(mailOptions, function(err,info) {
            console.log("SendMail result err=" + err + "info=",info);
        });
    };
    
    (function setup (ci) {
        self.transporter = nodeMailer.createTransport({ host: self.ci.email.smtp.host,
                                                        port: self.ci.email.smtp.port,
                                                        secure: self.ci.email.smtp.secure, 
                                                        auth: {
                                                                user: self.ci.email.smtp.auth.user,
                                                                pass: self.ci.email.smtp.auth.pass
                                                            }
                                                    });
    })(self.ci);
    
    (function sendConnected() {
        self.sendMail(self.ci.email.addr.master,"The MQTT e-mail service",{
            text: "The mqtt email service is restarted"},undefined);
    })();
};

exports.create_emailHandler = function(ci){
    return new emailHandler(ci);
};
