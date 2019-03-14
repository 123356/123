"use strict"
//布局
function Layout() {
    this.boxcenter = document.createElement("div");
    this.main = document.createElement("div");
};
Layout.prototype = {
    init: function () {
        this.creatBox();
        $("body").prepend(this.main);
        $(this.main).append(this.boxcenter);
        this.resize();
        this.adaptive();

    },
    getCookie: function (name) {
        var strcookie = document.cookie; //获取cookie字符串
        var arrcookie = strcookie.split("; "); //分割
        //遍历匹配
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    },
    //加载class 添加节点  class 给定默认样式
    creatBox: function () {
        this.boxcenter.className = "boxCenter";
        this.main.className = "main";
        this.canvas = document.createElement('canvas');
        this.canvas.className = "topo"
        this.boxcenter.appendChild(this.canvas);
    },
    // 屏幕尺寸监听
    resize: function () {
        //屏幕尺寸变化次数
        var that = this;
        $(window).resize(function () {
            //获取屏幕宽度
            that.globalwdith = parseInt($(window).width());
            that.adaptive();
        });
    },
    //按屏幕调整大小
    adaptive: function () {
        var main = this.globalwdith || parseInt($(window).width());
        var boxcenter = this.boxcenter;
        boxcenter.style.left = "0";
        boxcenter.style.width = $(window).width();
        this.canvas.width = $(window).width();
        this.canvas.height = $(window).height();
    }
};
var layout = new Layout();
layout.init();
var pid = layout.getCookie("cookiepid");
var orderNo;
//中间部分
function Topo() {
    this.PIDS = [];
    this.CIDS = [];
    this.DIDS = [];
};
Topo.prototype = {
    init: function () {
        this.createTopo();
        this.keyEvent();
        this.loadNode();
        this.loadData();
    },
    // 读取历史
    history: function (obj) {
        $("[data-type=bgcolor]").val(obj.config.bgColor);
        this.scene.translateX = obj.config.translateX;
        this.scene.translateY = obj.config.translateY;
        this.scene.zoom(obj.config.scaleX, obj.config.scaleY);
        this.scene.backgroundColor = "255,255,255";
        this.scene.background = "";
        this.copyNode(obj.data);
    },
    //复制节点
    copyNode: function (data) {
        if (!data) {
            return
        }
        this.elements = [];
        for (var key in data.node) {
            var node = data.node[key];
            this.elements[node.ID] = this.setNode(node);
        }
        for (var l = 0; l < data.line.length; l++) {
            var d = data.line[l];
            var nodeA = this.elements[d.nodeA];
            var nodeZ = this.elements[d.nodeZ];
            if (d.type == "FlexionalLink") {
                var line = this.setlink(nodeA, nodeZ);
            } else if (d.type == "FoldLink") {
                var line = this.setFoldLink(nodeA, nodeZ);
            }
            line._parentID = d._parentID;
        }
    },
    // 键盘事件
    keyEvent: function () {
        this.copyOffset = 50;
        var that = this;
        this.spacing = 0;
        $(document).keydown(function (event) {
            if (!that.isDelNode) {
                return
            }

            if (event.keyCode == 113) {
                that.ceshi();
            }
        });
    },
    // 加载数据
    loadData: function () {
        var that = this;
        $.ajax({
            type: "post",
            url: "/PDRInfo/GetExceptionStatus",
            data: {
                pid: pid,
            },
            success: function (res) {
                try {
                    res = JSON.parse(res);
                } catch (e) {
                    res = res;
                }
                for (var key in res) {
                    if (res[key] != undefined) {
                        that.controlState(that[key + "S"], res[key]);
                    }
                }
            }
        })
    },
    //控制状态
    controlState: function (arr, data) {
        for (var key in data) {
            this.changeState(arr, key, data[key].State);
        }
    },
    //改颜色
    changeState: function (arr, id, type) {
        var that = this;
        for (var a = 0; a < arr.length; a++) {
            if (parseInt(arr[a].ID) == id) {
                if (type == 0) { //红
                    if (arr[a].path.match(/_j/)) {
                        arr[a].path = arr[a].path.replace('_j.png', '_j_y.png')
                    } else {
                        arr[a].path = arr[a].path.replace('.png', '_y.png')
                    }
                } else { //不红
                    if (arr[a].path.match(/_j/)) {
                        arr[a].path = arr[a].path.replace('_j_y.png', '_j.png')
                    } else {
                        arr[a].path = arr[a].path.replace('_y.png', '.png')
                    }
                }
                arr[a].setImage("../../Content/topo/img/communication/" + arr[a].path);
                break;
            }
        }
    },
    loadNode: function () {
        var that = this;
        that.scene.clear();
        $.ajax({
            type: "post",
            url: "/PDRInfo/GetAttribute",
            data: {
                pid: pid,
                orderNo: orderNo || 1,
                type: 2
            },
            success: function (res) {
                res = res[0];

                $.ajax({
                    type: "get",
                    url: res.url + res.Path + "?date" + new Date().valueOf(),
                    success: function (data) {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            data = data;
                        }
                        that.history(data);
                    }
                })
            },
        })
    },
    //拓扑
    createTopo: function () {
        // topo.scene.translateX = "";
        // topo.scene.translateX = "";
        var that = this;
        //创建 canvas元素  定义宽高
        var stage = new JTopo.Stage(layout.canvas);
        stage.frames = 24; //只有鼠标事件时 才重新绘制
        stage.wheelZoom = 0.95;
        stage.eagleEye.visible = true;

        stage.mode = "select";
        this.stage = stage;

        stage.click(function (event) {
            if (event.button == 0) { // 右键
                $("#contextmenu").hide();
                $(".panel-default").hide();
            }
        });

        var scene = new JTopo.Scene(stage);
        scene.alpha = 1;
        scene.background = null;
        this.scene = scene;

    },

    uncompileStr: function (code) {
        if (!code) {
            return null;
        }
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    },
    //创建节点
    setNode: function (obj) {
        var that = this;
        if (obj.__type == "text") {
            var node = new JTopo.TextNode();
            node.text = obj.text || "请输入内容";
            node.setLocation(obj.x, obj.y);
            node.zIndex = obj.zIndex || 4;
            node.__type = 'text';
            node.textPosition = 'Middle_Center';
            node.font = obj.font || '16px 微软雅黑 block';

        } else if (obj.__type == "node") {
            var node = new JTopo.Node();
            node.text = obj.text || "";
            node.percent = 0.8;
            node.beginDegree = 0;
            node.zIndex = obj.zIndex || 3;
            node.setBound(obj.x, obj.y, obj.width || 100, obj.height || 50);
            node.__type = 'node';
            node._userType = obj._userType;
            node.textOffsetY = obj.textOffsetY;

            if (node._userType) {
                that[node._userType + 'S'].push(node);
            }
            node.setImage("../../Content/topo/img/communication/" + obj.path);
            node.path = obj.path
            node.fillColor = "0,0,0"; // 节点填充颜色
            node.ID = obj.ID;
            node.dragable = false;
            node.font = obj.font || '10px 微软雅黑 block';

        } else {
            return;
        }
        node.fontColor = '0,0,0';
        node.alpha = 1;
        node.rotate = obj.rotate || 0;
        node._parentID = obj._parentID;
        node.click(function () {
            that.nodeClick(node);
        })
        node._visible = 1;
        this.scene.add(node);
        return node;
    },

    //二次折线
    setlink: function (nodeA, nodeZ, text) {
        var link = new JTopo.FlexionalLink(nodeA, nodeZ, text || null);
        // link.arrowsRadius = 10;
        link.lineWidth = 3; // 线宽
        link.offsetGap = 30;
        link.bundleGap = 15; // 线条之间的间隔
        link.textOffsetY = 10; // 文本偏移量（向下15个像素）
        link.strokeColor = "0,0,0"; // 线条颜色随机
        link.type = "FlexionalLink";
        this.scene.add(link);
        this.DIDS.push(link);
        return link;
    },
    //折线
    setFoldLink: function (nodeA, nodeZ, text) {
        var link = new JTopo.FoldLink(nodeA, nodeZ, text || null);
        link.lineWidth = 3; // 线宽
        link.offsetGap = 30;
        link.bundleGap = 15; // 线条之间的间隔
        link.textOffsetY = 10; // 文本偏移量（向下15个像素）
        link.strokeColor = "0,0,0"; // 线条颜色随机
        link.type = "FoldLink";
        this.scene.add(link);
        this.CIDS.push(link);
        return link;
    },
    // 节点点击事件
    nodeClick: function (node) {
        if (this.isedit) {
            node.editAble = true;
            this.isedit = false;
        }
        node._visible = node._visible ? 0 : 1;
        this.contractionSubset(node);
        this.stage.eagleEye.update();

    },
    //收缩子集
    contractionSubset: function (node) {
        if (!node.ID) {
            return;
        }

        var arr;
        if (node._userType == "PID") {
            arr = this.DIDS;
        } else if (node._userType == "DID") {
            arr = this.CIDS;
        } else {
            return;
        }

        for (var a = 0; a < arr.length; a++) {
            if (arr[a]._parentID == node.ID) {
                if (node._visible == 1) { //打开
                    if (node.image.src.match(/_j/)) {
                        node.setImage(node.image.src.replace('_j', ''));
                    }
                } else if (node._visible == 0) { // 关闭
                    if (!node.image.src.match(/_j/) && !node.image.src.match(/_y/)) {
                        node.setImage(node.image.src.replace('.png', '_j.png'));
                    } else if (!node.image.src.match(/_j/) && node.image.src.match(/_y/)) {
                        node.setImage(node.image.src.replace('_y.png', '_j_y.png'));
                    }
                }
                arr[a]._visible = node._visible;
                arr[a].visible = arr[a]._visible;

                if (arr[a]._userType == "DID") {
                    this.contractionSubset(arr[a], node._visible);
                }
            }
        }
    },

};
var topo = new Topo();
topo.init();