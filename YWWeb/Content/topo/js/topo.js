"use strict"

function Topo() {};
Topo.prototype = {
    init: function() {
        this.pid = $("#pid").html();
        this.orderNo = $("#orderNo").html() || 1;
        this.newCanvas();
    },
    //创建画布
    newCanvas: function() {
        var canvas = document.createElement('canvas');
        var box = $('#topo')[0];
        canvas.width = parseInt($('#topo').css('width'))
        canvas.height = parseInt($('#topo').css('height'));
        canvas.className = "topo"
        box.appendChild(canvas);
        this.stage = new JTopo.Stage(canvas);
        this.stage.wheelZoom = 1.1;
        this.stage.frames = -24;
        this.scene = new JTopo.Scene(this.stage);
        this.scene.alpha = 1;
        this.scene.background = null;
        this.scene.backgroundColor = "0,0,0";
        this.view()
    },
    //视图
    view: function() {
        var that = this;
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
                if (!that.isShowOrderTheTopo) {
                    that.orderNoList(res);
                    that.isShowOrderTheTopo = true;
                }
                that.__IP = $.base64.decode(res.IP);
                that.__account = $.base64.decode(res.Account);
                that.__password = $.base64.decode(res.Password);
                that.__port = $.base64.decode(res.Port);
                that.LoadView(res.url, res.Path);
                that.LoadData();
                that.LoadMeter();
            },
        })
    },
    //加载视图
    LoadView: function(url, path) {
        var that = this;
        $.ajax({
            type: "get",
            url: url + path,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(data) {
                console.log(data.config)
                that.scene.clear();
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = data;
                }
                that.history(data);
                that.stage.paint();
            }
        })
    },
    //加载编号列表
    orderNoList: function(res) {
        var that = this;
        var ul = document.createElement('ul');
        ul.className = "titleUl"
        for (var a = 0, arr = []; a < res.OrderNoList.length; a++) {
            arr.push(`<li class='titleli' data-path='${res.OrderNoList[a].Path}'>${res.OrderNoList[a].Name}</li>`);
        }
        ul.innerHTML = arr.join('');
        $('#topo').append(ul);
        $(ul).on('click', 'li', function() {
            $('table').remove();
            that.LoadView(res.url, $(this).attr('data-path'));
            that.LoadData();
            that.LoadMeter();
        })
    },
    // 读取历史
    history: function(obj) {
        this.scene.translateX = obj.config.translateX;
        this.scene.translateY = obj.config.translateY;
        this.scene.zoom(obj.config.scaleX, obj.config.scaleY);
        this.scene.backgroundColor = obj.config.bgColor;
        this.copyNode(obj.nodes);
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
    //设置节点
    setNode: function(obj) {
        var that = this;
        this.textNode = []; //带有属性的节点
        this.meterNode = []; //带有cid的电表
        this.lineNode = []; //带有cid的电表

        if (obj.__type == "text") {
            var node = new JTopo.TextNode();
            node.text = obj.text || "请输入内容";
            node.font = obj.font || '16px 微软雅黑';
            node.setLocation(obj.x, obj.y);
            node.zIndex = obj.zIndex || 4;
            node.__type = 'text';
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
        if (obj.id && obj.__type == "text") {
            that.matchText(node);
        }

        node.selected = false;
        node.dragable = false;
        node.editAble = false;
        node.showSelected = false;
        this.scene.add(node);
        if (node._parentID || node._failureState || node.id) {
            this.lineNode.push(node);
        }
        if (node._cid) {
            this.meterNode.push(node);
        }
        if (node.__type == "text") {
            this.textNode.push(node);
        }

        if (node._cid) {
            var className = 'meter' + node._cid;
            var str = `  
             <table id="electricMeterBounced" class="${className}">
                <thead>
                    <tr>
                        <th colspan="4" class='title'></th>
                    </tr>
                </thead>
                <tr class="td3 tdb ">
                    <th class="b3"></th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                </tr>
                <tr class="td3 b1">
                    <td class="b3">电压(kV)</td>
                    <td class="UA1">--</td>
                    <td class="UA2">--</td>
                    <td class="UA3">--</td>
                </tr>
                <tr class="td3 b1">
                    <td class="b3">电流(A)</td>
                    <td class="I1">--</td>
                    <td class="I2">--</td>
                    <td class="I3">--</td>
                </tr>
                <tr class="b1">
                    <td class="">功率因数</td>
                    <td colspan="3" class="F">--</td>
                </tr>
                <tr>
                    <td>总有功功率(kW)</td>
                    <td colspan="3" class="P">--</td>
                </tr>
                <tr>
                    <td>总无功功率(kVar)</td>
                    <td colspan="3" class="Q">--</td>
                </tr>
                <tr class="border b1">
                    <td>总有功电度(kWh)</td>
                    <td colspan="3" class="K">--</td>
                </tr>
            </table>`

            $('body').append(str);

            node.mouseover(function(e) {
                $('.' + className).show();
                $('.' + className).css({
                    "top": e.clientY + node.height / 3 + 'px',
                    "left": e.clientX - 150 + 'px'
                });
            });
            node.mouseout(function() {
                $('.' + className).hide();
            });
        }
    },
    LoadData: function() {
        var that = this;
        $.ajax({
            type: 'POST',
            url: "/PDRInfo/GetOneGraph_kg",
            data: {
                "pid": that.pid,
            },
            success: function(res) {
                var data = JSON.parse(res);
                console.log(data)
                    // var nodes = that.specialNode;
                    // if (!nodes) {
                    //     return
                    // }
                    // for (var a = 0; a < nodes.length; a++) {
                    //     if (nodes[a].__type == "node") {
                    //         that.nodeShape(nodes[a], data);
                    //     } else if (nodes[a].__type == "line") {
                    //         that.nodeLine(nodes[a], data)
                    //     }
                    // }
                    // that.stage.paint();
            },
        })
    },
    LoadMeter: function() {
        $.ajax({
            type: 'POST',
            url: "/PDRInfo/GetOneGraph_kg",
            data: {
                "pid": that.pid,
            },
            success: function(res) {
                var data = JSON.parse(res);
                console.log(data)
                    // var nodes = that.specialNode;
                    // if (!nodes) {
                    //     return
                    // }
                    // for (var a = 0; a < nodes.length; a++) {
                    //     if (nodes[a].__type == "node") {
                    //         that.nodeShape(nodes[a], data);
                    //     } else if (nodes[a].__type == "line") {
                    //         that.nodeLine(nodes[a], data)
                    //     }
                    // }
                    // that.stage.paint();
            },
        })
    }
};
var topo = new Topo();
topo.init();