/************************************************************************
 Product    : Home information and control
 Date       : 2016-05-25
 Copyright  : Copyright (C) 2016 Kjeholt Engineering. All rights reserved.
 Contact    : dev@kjeholt.se
 Url        : http://www-dev.kjeholt.se
 Licence    : ---
 ---------------------------------------------------------
 File       : MqttAgentRPi/agentBody.js
 Version    : 0.1.0
 Author     : Bjorn Kjeholt
 *************************************************************************/

var mqtt = require('mqtt');
var emailHandler = require('./emailHandler');

agentBody = function(ci) {
    var self = this;
    this.ci = ci;

    this.mqttConnected = false;
    this.gateWayReady = false;
    
    console.log("Configuration information :",ci);
    
    console.log("MQTT connect :");

    this.mqttSubscribe = function() {
        var i = 0;
        
        for (i=0; i < self.ci.mqtt.subscriptions.length; i=i+1) {
            console.log("MQTT subscribe: ", self.ci.mqtt.subscriptions[i]);
            self.mqttClient.subscribe(self.ci.mqtt.subscriptions[i]);
        }
    };
        
    this.mqttConnect = function(connack) {
//        console.log("MQTT connected :",connack);
        self.mqttConnected = true;
        self.ci.mqtt.connected = true;
        self.mqttSubscribe();
//        self.publishInfo();
    };
    
    this.topicStrToJson = function (str) {
        var t = str.split("/");
        var result = {dstaddr: t[2],
                      subject: t[3],
                      priority: 'normal' };
        
        if (t[4] !== undefined) { 
            result.priority = t[4];        
        }
        
        return result;
    };

    this.mqttSubscribedMessage = function(topicStr, messageStr, packet) {
        var emailHeader = self.topicStrToJson(topicStr);
        console.log("messageStr --> " + messageStr);
        
        var emailPayload = JSON.parse(messageStr);
        var currTime = Math.floor((new Date())/1000);
        var attachments;
        
        console.log("E-mail send request Topic: " + topicStr + " Message: " + messageStr);
        
        if (emailPayload.attachments !== undefined) {
            attachments = emailPayload.attachments;
        } else {
            attachments = undefined;
        }
        
        self.emailHandler.sendMail(emailHeader.dstaddr,
                                   emailHeader.subject,
                                   {
                                       text: emailPayload.body.text,
                                       html: emailPayload.body.html
                                   },
                                   attachments
                                   );
    };

    this.mqttDisconnect = function () {
        self.mqttConnected = false;
        self.ci.mqtt.connected = false;
        
    };
    
    this.mqttError = function (error) {
        self.mqttConnected = false;
        self.ci.mqtt.connected = false;
        console.log("MQTT Error = ",error);
    };
    
    this.publishInfo = function () {
        var utc = Math.floor((new Date())/1000);
        var i;
        var fileNameArray;
        
        self.mqttClient.publish("email/status",
                                JSON.stringify({  time: utc,
                                                  date: new Date(),
                                                  server: "up" }));   // ToDo: Make it dynamic
      /*
        self.mqttClient.publish("info/present/" + self.ci.service.name,
                                JSON.stringify({    time: utc,
                                                    date: new Date(),
                                                    name: self.ci.service.name,
                                                    rev:  self.ci.service.ver }));
        self.mqttClient.publish("info/present/" + self.ci.service.name + "/send",
                                JSON.stringify({    time: utc,
                                                    date: new Date(),
                                                    name: 'send',
                                                    type: 'EmailHandler' }));
        self.mqttClient.publish("info/present/" + self.ci.service.name + "/send/message",
                                JSON.stringify({    time: utc,
                                                    date: new Date(),
                                                    name: 'message',
                                                    "rev":"---",
                                                    "datatype":"text",
                                                    "devicetype":"dynamic",
                                                    "outvar": 1 })); */
    };
                                            
    (function setup (ci) {
        (function mqttSetup (ci) {
            self.mqttClient = mqtt.connect("mqtt://"+ci.mqtt.ip_addr,
                                           { connectTimeout: 5000 });
            self.mqttClient.on('close',(self.mqttDisconnect));
            self.mqttClient.on('connect',(self.mqttConnect));
            self.mqttClient.on('error',(self.mqttError));
            self.mqttClient.on('message',(self.mqttSubscribedMessage));
        }(ci));
        
        (function emailSetup (ci) {
            self.emailHandler = emailHandler.create_emailHandler(ci); 
        })(ci);    
    })(this.ci);
    
};

exports.create_AgentBody = function (ci) {
    return new agentBody(ci);
};




