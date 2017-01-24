/************************************************************************
 Product    : Home information and control
 Date       : 2016-05-25
 Copyright  : Copyright (C) 2016 Kjeholt Engineering. All rights reserved.
 Contact    : dev@kjeholt.se
 Url        : http://www-dev.kjeholt.se
 Licence    : ---
 -------------------------------------------------------------------------
 File       : MqttAgentRPi/main.js
 Version    : 0.1.1
 Author     : Bjorn Kjeholt
 *************************************************************************/

var service = require('./Classes/serviceBody');

var serviceObj = service.create_AgentBody({ 
                                    service: {
                                            name: process.env.npm_package_name,
                                            ver:  process.env.npm_package_version },
                                    mqtt: {
                                            ip_addr: (process.env.MQTT_IP_ADDR !== undefined)? process.env.MQTT_IP_ADDR : process.env.MQTT_PORT_1883_TCP_ADDR,   // "192.168.1.10"
                                            port_no: (process.env.MQTT_PORT_NO !== undefined)? process.env.MQTT_PORT_NO : process.env.MQTT_PORT_1883_TCP_PORT,   // "1883"
                                            user:    (process.env.MQTT_USER !== undefined)? process.env.MQTT_USER : process.env.MQTT_ENV_MQTT_USER,      //"hic_nw",
                                            passw:   (process.env.MQTT_PASSWORD !== undefined)? process.env.MQTT_PASSWORD : process.env.MQTT_ENV_MQTT_PASSWORD,  //"RtG75df-4Ge",
                                            connected: false,
                                            link: { 
                                                    status: 'down',
                                                    latest_status_time: (Math.floor((new Date())/1000)),
                                                    timeout: 120 }, // seconds
                                            subscriptions: [
                                                    "email/send/#"
                                                ]
                                          },
                                    email: {
                                            smtp: {
                                                    host: process.env.SMTP_URL,   //'smtp.gmail.com',
                                                    port: process.env.SMTP_PORT_NO,   //465,
                                                    secure: (process.env.SMTP_SECURE !== undefined)? process.env.SMTP_SECURE : true, // use SSL 
                                                    auth: {
                                                            user: process.env.SMTP_USER,   //'user@gmail.com',
                                                            pass: process.env.SMTP_PWD   //'pass' 
                                                          } 
                                                   },
                                            addr: {
                                                    local: (process.env.EMAIL_LOCAL_ADDR !== undefined)? 
                                                                            process.env.EMAIL_LOCAL_ADDR : 
                                                                            process.env.SMTP_USER,               // Source e-mail address
                                                    master: (process.env.EMAIL_MASTER_ADDR!== undefined)? 
                                                                            process.env.EMAIL_MASTER_ADDR :
                                                                            process.env.EMAIL_LOCAL_ADDR
                                                   }
                                           },
                                    node: {
                                            scan_node_data: 30000,
                                            scan_new_nodes: 300000 }
                                  });
var cnt= 0;

setInterval(function() {
    console.log("Status @ " + cnt + "sec. Mqtt link connected:" + serviceObj.ci.mqtt.connected);
    cnt = cnt + 10;
},10000);
//abhObj.setup();

