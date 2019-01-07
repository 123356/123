"use strict"

function Topo() {};
Topo.prototype = {
    init: function() {
        this.pid = $("#pid").html();
        this.orderNo = $("#orderNo").html() || 1;
        this.createTopo();
        this.viewTopo();
        this.getNodeState();
    },
    viewTopo: function() {
        var that = this;
        this.scene.clear();
        $.ajax({
            type: "post",
            url: "/PDRInfo/GetAttribute",
            data: {
                pid: $('#pid').html(),
                orderNo: $("[data-type=orderNo]").val() || 1,
                type: 1
            },
            success: function(res) {
                res = res[0];

                var ul = document.createElement('ul');
                ul.className = "titleUl"

                for (var a = 0, arr = []; a < res.OrderNoList.length; a++) {
                    arr.push(`<li class='titleli' data-path='${res.OrderNoList[a].Path}'>${res.OrderNoList[a].Name}</li>`);
                }
                ul.innerHTML = arr.join('');
                $('#topo').append(ul);

                $(ul).on('click', 'li', function () {
                    that.scene.clear();
                    that.lodingData(res.url, $(this).attr('data-path'));
                    that.getNodeState();
                })

                that.__IP = $.base64.decode(res.IP);
                $('[data-type=IP]').val(that.__IP);

                that.__account = $.base64.decode(res.Account);
                $('[data-type=account]').val(that.__account);

                that.__password = $.base64.decode(res.Password);
                $('[data-type=password]').val(that.__password);

                that.__port = $.base64.decode(res.Port);
                $('[data-type=port]').val(that.__port);
                that.lodingData(res.url,res.Path);
             },
        })
    },
    lodingData: function (url,path) {
        var that = this;
        $.ajax({
            type: "get",
            url: url + path + "?date" + new Date().valueOf(),
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (data) {
                console.log(data)
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = data;
                }
                that.history(data);
            }
        })

    },
    // 读取历史
    history: function(obj) {
        this.scene.translateX = obj.config.translateX;
        this.scene.translateY = obj.config.translateY;
        this.scene.zoom(obj.config.scaleX, obj.config.scaleY);
        this.scene.backgroundColor = obj.config.bgColor; //"0,0,0";
        this.scene.background = null;
        this.copyNode(obj.nodes);
        this.getBindData();

    },
    //复制节点
    copyNode: function(list) {
        if (!list) {
            return
        }
        for (var a = 0; a < list.length; a++) {
            var node = list[a];
            this.setNode(node);
        }
    },
    //拓扑
    createTopo: function() {
        var that = this;
        //创建 canvas元素  定义宽高
        var canvas = document.createElement('canvas');
        var box = $('#topo')[0];
        canvas.width = parseInt($('#topo').css('width'));
        canvas.height = parseInt($('#topo').css('height'));
        canvas.className = "topo"
        box.appendChild(canvas);
        var stage = new JTopo.Stage(canvas);
        stage.frames = 24; //只有鼠标事件时 才重新绘制
        stage.wheelZoom = 1.1;
        this.stage = stage;
        var scene = new JTopo.Scene(stage);
        scene.alpha = 1;
        scene.background = null;
        // scene.mode = "drag"
        this.scene = scene;
    },
    //创建节点
    setNode: function(obj) {
        var that = this;
        if (obj.__type == "text") {
            var node = new JTopo.TextNode();
            node.text = obj.text || "请输入内容";
            node.font = obj.font || '16px 微软雅黑';
            node.setLocation(obj.x, obj.y);
            node.zIndex = obj.zIndex || 4;
            node.__type = 'text';
            //状态赋值
            node.__statusvalue = obj.__statusvalue || 4;
            node.state4 = obj.state4 || "255,255,255";
            node.fontColor = node["state" + node.__statusvalue];
        } else if (obj.__type == "node") {
            var node = new JTopo.Node();
            node.percent = 0.8;
            node.beginDegree = 0;
            node.zIndex = obj.zIndex || 3;
            node.setBound(obj.x, obj.y, obj.width || 50, obj.height || 35);
            node.__type = 'node';
            node.__statusvalue = obj.__statusvalue || 0;
            node.state0 = obj.state0 || "#ff0000";
            node.state1 = obj.state1 || "#00ff00";
            node.state2 = obj.state2 || "#ffff00";
            node.color = node["state" + node.__statusvalue];
            node.paint = function(g) {
                eval(obj.canvas);
            };
            node.canvas = obj.canvas;
        } else if (obj.__type == "line") {
            var node = new JTopo.Node();
            node.zIndex = obj.zIndex || 3;
            node.setBound(obj.x, obj.y, obj.width, obj.height);
            node.__type = 'line';
            //状态赋值
            node.__statusvalue = obj.__statusvalue || 0;
            node.state0 = obj.state0 || "255,0,0";
            node.state1 = obj.state1 || "193,193,193";
            node.fillColor = node["state" + node.__statusvalue];
        }
        if (obj.center) {
            node.setCenterLocation(obj.x, obj.y);
        }
        node.alpha = 1;
        node.textPosition = 'Bottom_Center';
        node.rotate = obj.rotate || 0;
        node._parentID = obj._parentID;
        node.id = obj.id;
        node._failureState = obj._failureState;
        node._cid = obj._cid;
        if (node._cid) {
            node.mouseover(function(e) {
                if (!that.meterData) {
                    $(this).attr("cursor", "wait");
                    return;
                }
                $('#electricMeterBounced').show();
                $('#electricMeterBounced').css({
                    "top": e.clientY + node.height / 3 + 'px',
                    "left": e.clientX - 150 + 'px'
                });
                that.matchElectricMeter(node._cid);
                that.timer = setInterval(function() {
                    that.matchElectricMeter(node._cid);
                }, 1000)
            });
            node.mouseout(function() {
                clearInterval(that.timer);
                $('#electricMeterBounced').hide();
            });
        }
        if (obj.id && obj.__type == "text") {
            that.matchText(node);
        }
        node.selected = false;
        node.dragable = false;
        node.editAble = false;
        node.showSelected = false;
        this.scene.add(node);
    },
    //获取绑定节点的数据
    getBindData: function() {
        var attributeNode = []; //带有属性的节点
        var electricMeter = []; //带有cid的电表
        var textDataNode = [];
        topo.scene.findElements(function(e) {
            if (e._parentID || e._failureState || e.id) {
                attributeNode.push(e);
            }
            if (e._cid) {
                electricMeter.push(e);
            }
            if (e.__type == "text") {
                textDataNode.push(e);
            }
        });
        this.specialNode = attributeNode;
        this.electricMeter = electricMeter;
        this.textDataNode = textDataNode;
    },
    getNodeState: function() {
        var that = this;
        //等节点加载成功
        var timer1 = setInterval(function() {
            if (that.specialNode != undefined && that.specialNode.length != 0) {
                clearInterval(timer1);
                $.ajax({
                    type: 'POST',
                    url: "/PDRInfo/GetOneGraph_kg",
                    data: {
                        "pid": that.pid,
                    },
                    success: function(res) {
                        var data = JSON.parse(res);
                        var nodes = that.specialNode;
                        if (!nodes) {
                            return
                        }
                        for (var a = 0; a < nodes.length; a++) {
                            if (nodes[a].__type == "node") {
                                that.nodeShape(nodes[a], data);
                            } else if (nodes[a].__type == "line") {
                                that.nodeLine(nodes[a], data)
                            }
                            ///!!!!
                        }
                    },
                })
            }
        }, 150);
        //第一次获取所有数据
        $.ajax({
            type: 'POST',
            url: "/PDRInfo/GetOneGraph_value",
            data: {
                "pid": that.pid,
            },
            async: false,
            success: function(res) {
                that.meterData = res;
            },
        });
        //连接mqtt获取变化量
        setTimeout(function() {
            that.mqtt();
        }, 1000);
    },
    guid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    mqtt: function() {
        var that = this;
        var wsbroker = that.__IP;
        location.hostname;
        var wsport = parseInt(that.__port);
        //连接选项
        var client;

        var options = {
            timeout: 30,
            userName: that.__account,
            password: that.__password,
            keepAliveInterval: 10,
            onSuccess: function(e) {
                console.log(("连接成功"));
                client.subscribe('/ny/' + that.pid, {
                    qos: 2
                });
            },
            onFailure: function(message) {
                console.log("连接失败 " + message.errorMessage);
                setTimeout(function() {
                    that.mqtt();
                }, 10000);
            }
        };
        if (location.protocol == "https:") {
            console.log("https")
            options.useSSL = true;
        } else {
            console.log("http")
        }
        client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + that.guid());
        //创建连接
        client.connect(options);
        client.onConnectionLost = function(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.error("异常掉线，掉线信息为:" + responseObject.errorMessage);
            }
            setTimeout(function() {
                that.mqtt();
            }, 10000);
        };
        client.onMessageArrived = function(res) {
            var payload = JSON.parse(res.payloadString);
            if (!payload.type) {
                return;
            }
            if (payload.type == 6) {
                var changeData = payload.content;
                for (var key in changeData) {
                    for (var a = 0; a < that.meterData.length; a++) {
                        if (key == that.meterData[a].TagID) {
                            that.meterData[a].DValue = changeData[key].PV;
                            break;
                        }
                    }


                    for (var b = 0; b < that.textDataNode.length; b++) {
                        if (that.textDataNode[b].id == key) {
                            that.textDataNode[b].text = changeData[key].PV;
                        }
                    }
                }
                return
            }
            var content = payload.content;
            var nodes = that.specialNode;
            if (!nodes) {
                return
            }
            for (var a = 0; a < nodes.length; a++) {
                if (nodes[a].__type == "node") {
                    that.nodeShape(nodes[a], content);
                } else if (nodes[a].__type == "line") {
                    that.nodeLine(nodes[a], content);
                }
            }
        };
    },
    // 节点类型改变
    nodeShape: function(node, data) {
        var pv1, //故障
            pv2, //parent
            pv3; //自己ID
        if (node._failureState && data[node._failureState]) {
            pv1 = data[node._failureState].PV;
        }
        if (node._parentID) {
            var arr = node._parentID.split(",");
            var num = 0;
            for (var a = 0; a < arr.length; a++) {
                if (data[arr[a]]) {
                    num += data[arr[a]].PV;
                }
            }
            if (arr.length >= 3 && num >= 2) {
                pv2 = 1;
            } else if (arr.length <= 2 && num >= 1) {
                pv2 = 1;
            } else {
                pv2 = 0;
            }
        }
        if (node.id && data[node.id]) {
            pv3 = data[node.id].PV;
        }
        if (pv1 == 1) {
            node.color = node.state2;
        } else if (pv2 == 0) {
            node.color = node.state0;
        } else if (pv2 == 1 && pv3 == undefined) {
            node.color = node.state1;
        } else if ((pv3 == 1 && pv2 == 1) || (pv3 == 1 && pv2 == undefined)) {
            node.color = node.state1;
        } else {
            node.color = node.state0;
        }
    },
    // 线类型改变
    nodeLine: function(node, data) {
        var arr = node._parentID.split(",");
        var num = 0;
        for (var a = 0; a < arr.length; a++) {
            if (data[arr[a]]) {
                num += data[arr[a]].PV;
            }
        }
        if (arr.length >= 3 && num >= 2) {
            node.fillColor = node.state1;
        } else if (arr.length <= 2 && num >= 1) {
            node.fillColor = node.state1;
        } else {
            node.fillColor = node.state0;
        }
    },
    // 匹配表
    matchElectricMeter: function(cid) {
        var component = [];
        var datatypeid = -1;
        for (var a = 0, b = 0; a < this.meterData.length; a++) {
            var meter = this.meterData[a];
            if (meter.CID == cid) {
                if (b == 0) {
                    $('.title').html(meter.CName);
                    b++;
                }

                if (meter.DataTypeID == '2') { //电流
                    $('.I' + meter.ABCID).html(meter.DValue);
                    $('.IA .unit').html(meter.Units);
                } else if (meter.DataTypeID == '3' || meter.DataTypeID == "56") { //电压
                    $('.UA' + meter.ABCID).html(meter.DValue);
                    $('.UAB .unit').html(meter.Units);
                } else if (meter.DataTypeID == '6' || meter.DataTypeID == '51') { //功率因数
                    $('.F').html(meter.DValue);
                    $('.PF .unit').html(meter.Units);
                } else if (meter.DataTypeID == '46' || meter.DataTypeID == '7') { //总有功
                    $('.P').html(meter.DValue);
                    $('._P .unit').html(meter.Units);
                } else if (meter.DataTypeID == '48' || meter.DataTypeID == '8') { //总无功功率
                    $('.Q').html(meter.DValue);
                    $('._Q .unit').html(meter.Units);
                } else if (meter.DataTypeID == '52') { //总有功电度
                    $('.K').html(meter.DValue);
                }

            }
        }
    },
    //匹配文字
    matchText: function(node) {
        var that = this;
        window.timer3 = setInterval(function() {
            if (that.meterData != undefined && that.meterData.length != 0) {
                for (var a = 0; a < that.meterData.length; a++) {
                    if (node.id == that.meterData[a].TagID) {
                        node.text = that.meterData[a].DValue;
                        return
                    }
                }
                clearInterval(window.timer3);
            }
        }, 500);
    }
};
var topo = new Topo();
topo.init();