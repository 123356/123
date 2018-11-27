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
            url: "/PDRInfo/GetOneView",
            data: {
                pid: that.pid,
                orderNo: that.orderNo,
            },
            success: function(res) {
                console.log(res)
                $.ajax({
                    type: "get",
                    url: res + "?date" + new Date().valueOf(),
                    success: function(res) {
                        that.history(res);
                    },error: function(){
                        console.log("有错")
                    }

                })
            },

        })
    },
    // 读取历史
    history: function(obj) {
        $('[data-type=pid]').val(obj.config.pid);
        $('[data-type=orderNo]').val(obj.config.orderNo);
        $("[data-type=bgcolor]").val(obj.config.bgColor);
        this.scene.backgroundColor = obj.config.bgColor;
        this.copyNode(obj.nodes)
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
    setNode(obj) {
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
                $('#electricMeterBounced').css({ "top": e.clientY + node.height / 3 + 'px', "left": e.clientX - 150 + 'px' });
                that.matchElectricMeter(node._cid);
            })
            node.mouseout(function() {
                $('#electricMeterBounced').hide();
                // $("#topo").css("cursor", "default");
            })
        }

        node.selected = false;
        node.dragable = false;
        node.editAble = false;
        node.showSelected = false;

        this.scene.add(node)
    },
    //获取绑定节点的数据
    getBindData: function() {
        var attributeNode = []; //带有属性的节点
        var electricMeter = []; //带有cid的电表
        topo.scene.findElements(function(e) {
            if (e._parentID || e._failureState || e.id) {
                attributeNode.push(e);
            }
            if (e._cid) {
                electricMeter.push(e);
            }
        })
        this.specialNode = attributeNode;
        this.electricMeter = electricMeter;
    },
    //轮询请求节点状态
    getNodeState: function() {
        var that = this;




        var timer1 = setInterval(function() {
            if (that.specialNode) {
                clearInterval(timer1)
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
                            if (nodes[a].__type == "text") {
                                that.nodeText(nodes[a], data);
                            } else if (nodes[a].__type == "node") {
                                that.nodeShape(nodes[a], data);
                            } else if (nodes[a].__type == "line") {
                                that.nodeLine(nodes[a], data);
                            }
                        }
                    },
                })
            }
        }, 150)




        //初始化表数据
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
        })


        //长连接
        function mqtt() {
            var wsbroker = "59.110.153.200";
            location.hostname; //mqtt websocket enabled broker ip
            var wsport = 15675; // 端口号
            //连接选项
            var client;
            var options = {
                timeout: 30,
                userName: "webguest",
                password: "!@#23&Qbn",
                keepAliveInterval: 10,
                onSuccess: function(e) {
                    console.log(("连接成功"))
                    client.subscribe('/ny/12', {
                        qos: 2
                    });
                },
                onFailure: function(message) {
                    console.log("连接失败 " + message.errorMessage);
                    setTimeout(() => {
                        mqtt();
                    }, 10000);
                }
            };
            if (location.protocol == "https:") {
                options.useSSL = true;
            }
            client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + guid());
            //创建连接
            client.connect(options);
            client.onConnectionLost = function(responseObject) {
                if (responseObject.errorCode !== 0) {
                    console.error("异常掉线，掉线信息为:" + responseObject.errorMessage);
                }
                setTimeout(() => {
                    mqtt();
                }, 10000);
            };
            client.onMessageArrived = function(res) {
                var payload = JSON.parse(res.payloadString);
                console.log(payload)
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
                    }
                    return
                }
                var content = payload.content;
                var nodes = that.specialNode;
                if (!nodes) {
                    return
                }
                for (var a = 0; a < nodes.length; a++) {
                    if (nodes[a].__type == "text") {
                        that.nodeText(nodes[a], content);
                    } else if (nodes[a].__type == "node") {
                        that.nodeShape(nodes[a], content);
                    } else if (nodes[a].__type == "line") {
                        that.nodeLine(nodes[a], content);
                    }
                }


            };
        }

        function guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        mqtt();









    },
    // 文字类型改变
    nodeText: function(node, data) {
        var pv = data[node.id].PV;
        node.text = parseFloat(pv);
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
                num += data[arr[a]].PV;
            }
            if (arr.length >= 3 && num >= 2) {
                pv2 = 1;
            } else if (arr.length <= 2 && num >= 1) {
                pv2 = 1;
            } else {
                pv2 = 0;
            }
        }




        if (node.id) {
            pv3 = data[node.id].PV;
        }
        if (pv1 == 1) {
            node.color = node.state2;
        } else if (pv2 == 0) {
            node.color = node.state1;
        } else if (pv2 == 1 && pv3 == undefined) {
            node.color = node.state0;
        } else if ((pv3 == 1 && pv2 == 1) || (pv3 == 1 && pv2 == undefined)) {
            node.color = node.state0;
        } else {
            node.color = node.state1;
        }
    },
    // 线类型改变
    nodeLine: function(node, data) {
        var arr = node._parentID.split(",");
        var num = 0;
        for (var a = 0; a < arr.length; a++) {

            num += data[arr[a]].PV;
        }
        if (arr.length >= 3 && num >= 2) {
            node.fillColor = node.state0;
        } else if (arr.length <= 2 && num >= 1) {
            node.fillColor = node.state0;
        } else {
            node.fillColor = node.state1;
        }
    },
    // 匹配表
    matchElectricMeter: function(cid) {
        var component = [];
        var datatypeid = -1;
        for (var a = 0; a < this.meterData.length; a++) {
            var meter = this.meterData[a];
            if (meter.CID == cid) {

                if (component.length == 0) {
                    component.push(`
                    </tr><tr><th colspan="4">${meter.CName}</th><tr>
                    <tr><td width="140px"></td><td>A</td><td>B</td><td>C</td>
                `)
                }
                if (meter.DataTypeID != datatypeid) {
                    datatypeid = meter.DataTypeID;
                    component.push(`
                        </td><tr><td>${meter.CtypeName}${meter.Units}</td>
                    `)
                }
                if (meter.DataTypeID == 2 || meter.DataTypeID == 3) {
                    component.push(`
                    <td>${ meter.DValue}</td>
                `)
                } else {
                    component.push(`
                    <td colspan="3">${ meter.DValue}</td>
                `)
                }

            }
        }
        $("#electricMeterBounced").html(component.join(""));
    }
};
var topo = new Topo();
topo.init();