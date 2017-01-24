/************************************************************************
 Product    : Home information and control
 Date       : 2016-05-25
 Copyright  : Copyright (C) 2016 Kjeholt Engineering. All rights reserved.
 Contact    : dev@kjeholt.se
 Url        : http://www-dev.kjeholt.se
 Licence    : ---
 ---------------------------------------------------------
 File       : MqttAgentRPi/nodeRPi.js
 Version    : 0.1.0
 Author     : Bjorn Kjeholt
 *************************************************************************/

// var owfsClient = require('owfs').Client;
var fs = require('fs');
var spawn = require("child_process").spawn;
var cpuLoad = require('cpu-load');
var network = require('network');


var nodeRPi = function (ci) {
    var self = this;
    
    this.ci = ci;

    this.numberOfDevices = 0;
    
    /**
     * { name: "NodeName",
     *   type: "NodeType I.e. DS1820 ..."
     *   devices: [
     *              { name: "DeviceName",
     *                dat: "bool, int, float, text",
     *                det: "dynamic, semstatic, static",
     *                wa: "WrapAround limit",
     *                wao: "Wraparound offset"
     *                dac: "Data coeficient",
     *                dao: "Data offset"
     *              }
     *            ]
     *  }
     */
    this.nodeInfoList = [{ name: "Characteristics",
                           type: "TempSensors",
                           devices: [{ name: "CPU temperature",
                                       dat: "float",
                                       det: "dynamic",
                                       dac: 1.0,
                                       dao: 0,
                                       value: null,
                                       func: function(callback) {
                                                    if (process.env.SIMULATED_MODE === undefined) {
                                                        fs.readFile('/sys/class/thermal/thermal_zone0/temp',function (err,data) {
                                                                var cpuTemp = (Math.round(data/100))/10.0;
                                                                callback(null,cpuTemp);
                                                        });
                                                    } else {
                                                        var cpuTemp= -3.14;
                                                        callback(null, cpuTemp);
                                                    }
                                                } }] },
                         { name: "System",
                           type: "Info",
                           devices: [{ name: "Boot-time",
                                       dat: "text",
                                       det: "semistatic",
                                       value: null,
                                       func: function(callback) {
                                                    callback(null,"testing 123");
                                                } },
                                     { name: "Average CPU load (%)",
                                       dat: "float",
                                       det: "dynamic",
                                       dac: 1.0,
                                       dao: 0,
                                       value: null,
                                       func: function(callback) {
                                                    cpuLoad(1000,function(load) {
                                                        callback(null,load*100);
                                                    });
                                       }},
                                     { name: "Memory usage",
                                       dat: "int",
                                       det: "semistatic",
                                       dac: 1.0,
                                       dao: 0,
                                       value: null,
                                       variables: [{
                                               name: "mem-total",
                                               data: "int",
                                               det: "semistatic",
                                               value: null
                                       },{
                                               name: "mem-used",
                                               data: "int",
                                               det: "dynamic",
                                               value: null
                                       },{
                                               name: "mem-free",
                                               data: "int",
                                               det: "dynamic",
                                               value: null
                                       },{
                                               name: "swap-total",
                                               data: "int",
                                               det: "semistatic",
                                               value: null
                                       },{
                                               name: "swap-used",
                                               data: "int",
                                               det: "dynamic",
                                               value: null
                                       },{
                                               name: "swap-free",
                                               data: "int",
                                               det: "dynamic",
                                               value: null
                                       }],
                                       func: function(callback) {
                                                    
                                           
                                                    callback(null,12.3);
                                       }}] },
                         { name: "Network",
                           type: "Network-info",
                           devices: [{ name: "Public-IP-addr",
                                      dat: "text",
                                      det: "semistatic",
                                      outdata: true,
                                      value: null,
                                      func: function(callback) {
                                                    network.get_public_ip(function(err, ip) {
                                                        callback(err,ip);
                                                    });
                                      }
                                   
                           }] }
                       ];

    //-------------------------------------------------------------------
    this.getDataMemUsage = function(callback) {
        var freeCmd = spawn('free',['-o']);
        var result = [];
        
        freeCmd.stdout.on('data',function(data) {
            var dateArr = data.split('\s+');
            
            
        });
        
        freeCmd.on('data',function() {
            
        });
        
    };
    //-------------------------------------------------------------------
 
    this.getNumberOfDevice = function() {
        var number = 0;
        var nodeIndex, deviceIndex;
        
        for (nodeIndex=0; nodeIndex < self.nodeInfoList.length; nodeIndex = nodeIndex + 1) {
            number += self.nodeInfoList[nodeIndex].devices.length;
        }
        
        return number;
    };
    
    this.updateNodeList = function(callback) {
        callback(null);
    };
    
    /**
     * @function updateNodeInfoList
     * @param {function} callback
     * @returns {undefined}
     */
    this.updateNodeInfoList = function(callback) {
        callback(null);
    };
    
    var readDataSubNode = function (ni, devId, subNodeDataList, sampleTime, callback) {
        var list = subNodeDataList;
        var getDataFunc;
        
        if (devId > 0) {
            devId = devId - 1;
        
//            console.log("deviceInfo = ",self.nodeInfoList[ni].devices[devId]);
            getDataFunc = self.nodeInfoList[ni].devices[devId].func;
            
            (getDataFunc)( function(err,result) {
//                    console.log("readDataSubNode nodeInfo -> ",self.nodeInfoList[ni].devices[devId]);
                    if (!err) {
                        if ((self.nodeInfoList[ni].devices[devId].det === "dynamic") || 
                            (self.nodeInfoList[ni].devices[devId].value === null) ||
                            (self.nodeInfoList[ni].devices[devId].value !== result)) {
                            list.push({ name: self.nodeInfoList[ni].devices[devId].name,
                                        time: sampleTime,
                                        data: result });                                        
                        }
                                                
                        self.nodeInfoList[ni].devices[devId].value = result;
                                                
                        readDataSubNode(ni,devId, list, sampleTime, callback);
                    } else {
                        console.log("readDataSubNode err=",err);
                        callback(err,list);
                    }
                });
        } else {
            callback(null,list);
        }        
    };
    
    var readDataNode = function (ni, nodeDataList, sampleTime, callback) {
        var list = nodeDataList;
        if (ni > 0) {
            ni = ni-1;
            
            readDataSubNode(ni, self.nodeInfoList[ni].devices.length, [], sampleTime, 
                    function(err,subNodeDataListResult){
                        
                        list.push({ name: self.nodeInfoList[ni].name,
                                    devices: subNodeDataListResult
                                  });
//                        console.log("ReadDataNode Loop("+ni+") list=",list);
                        readDataNode(ni, list, sampleTime, callback);
                    });
        } else {
            callback(null, list);
        }
    };
    
    this.get_NodeDataList = function(callback) {
        var nodeDataList = [];

        readDataNode(self.nodeInfoList.length,nodeDataList, Math.floor(new Date()/1000), 
                    function(err,result) {
//                        console.log("Get nodeDataList result_",result);
                        
                        callback(null,result);
                    });
    };
    
    (function setup() {
//        self.owfsConnect = new owfsClient( self.ci.onewire.ip_addr, self.ci.onewire.port_no);
        
     })();
};

exports.create_node = function(ci){
    return new nodeRPi(ci);
};

