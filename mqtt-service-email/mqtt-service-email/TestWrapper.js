/************************************************************************
 Product    : Home information and control
 Date       : 2016-06-01
 Copyright  : Copyright (C) 2016 Kjeholt Engineering. All rights reserved.
 Contact    : dev@kjeholt.se
 Url        : http://www-dev.kjeholt.se
 Licence    : ---
 -------------------------------------------------------------------------
 File       : TestWrapper.js
 Version    : 0.1.0
 Author     : Bjorn Kjeholt
 *************************************************************************/

    process.env.npm_package_name = "hic-service-email";
    process.env.npm_package_version = "0.1.2";
    
    process.env.AGENT_NAME       = "hic-agent-email";
    process.env.AGENT_REV        = "0.1.0";
    process.env.MQTT_IP_ADDR     = "192.168.1.78";
    process.env.MQTT_PORT_NO     = "1883";
    process.env.MQTT_USER        = "NA";
    process.env.MQTT_PASSWORD    = "NA";
    process.env.SIMULATED_MODE   = "0";
    process.env.SMTP_URL         = "xxxxx";
    process.env.SMTP_PORT_NO     = "465";
    process.env.SMTP_USER        = "hic@kjeholt.se";
    process.env.SMTP_PWD         = "xxxxxx";
    process.env.EMAIL_LOCAL_ADDR = "Home Information Center <hic@kjeholt.se>";

require("./main.js");
