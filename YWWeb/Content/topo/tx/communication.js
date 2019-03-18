"use strict"
//布局
function Layout() {
    this.boxleft = document.createElement("div");
    this.lineleft = document.createElement("div");
    this.boxcenter = document.createElement("div");
    this.lineright = document.createElement("div");
    this.main = document.createElement("div");
    this.boxright = document.createElement("div");
};
Layout.prototype = {
    init: function() {
        this.creatBox();
        $("body").prepend(this.main);
        $(this.main).append(this.boxleft)
            .append(this.lineleft)
            .append(this.boxcenter)
            .append(this.lineright)
            .append(this.boxright);
        this.dragline($(this.lineleft), 'left');
        this.dragline($(this.lineright), 'right');
        this.resize();
        this.adaptive();
    },
    //加载class 添加节点  class 给定默认样式
    creatBox: function() {
        this.boxleft.className = "boxLeft";
        this.lineleft.className = "lineLeft";
        this.boxcenter.className = "boxCenter";
        this.lineright.className = "lineRight";
        this.boxright.className = "boxRight";
        this.main.className = "main";
        this.canvas = document.createElement('canvas');
        this.canvas.className = "topo"
        this.boxcenter.appendChild(this.canvas);
    },
    //增加拖拉的事件绑定
    dragline: function(dv, box) {
        var that = this;
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        //鼠标按下事件
        $(dv).on('mousedown', function(e) {
            //获取x坐标和y坐标
            x = e.clientX;
            y = e.clientY;
            //获取左部和顶部的偏移量
            l = dv.offset().left;
            t = dv.offset().top;
            //开关打开
            isDown = true;
        });
        //鼠标移动
        window.addEventListener('mousemove', function(e) {
                if (isDown == false) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (x - l);
                var nt = 0;
                dv.css({
                    "left": nl + "px",
                    "top": nt + "px"
                });
                if (box == 'left' && nl < parseInt(that.lineright.style.left)) {
                    that.lineleft.style.left = nl + "px";
                    that.adaptive()
                } else if (nl > parseInt(that.lineleft.style.left)) {
                    that.lineright.style.left = nl + "px";
                    that.adaptive()
                }
            })
            //鼠标抬起事件
        $(dv).on('mouseup', function(e) {
            //开关关闭
            isDown = false;
        })
    },
    // 屏幕尺寸监听
    resize: function() {
        //屏幕尺寸变化次数
        var that = this;
        $(window).resize(function() {
 
            //获取屏幕宽度
            that.globalwdith = parseInt($(window).width());
            that.adaptive();
        });
    },
    //按屏幕调整大小
    adaptive: function() {
        var main = this.globalwdith || parseInt($(window).width());
        var lineleft = this.lineleft;
        var lineright = this.lineright;
        var boxcenter = this.boxcenter;
        var boxright = this.boxright;
        var boxleft = this.boxleft;
 
 
        lineleft.style.left = lineleft.style.left || "255px";
        boxleft.style.width = parseInt(lineleft.style.left) + 10 + 'px';
        lineright.style.left = lineright.style.left || main - 236 + "px";
        boxright.style.width = main - parseInt(lineright.style.left) - 4 + 'px';
        boxright.style.left = main - parseInt(boxright.style.width) + 4 + 'px';
        boxcenter.style.left = parseInt(lineleft.style.left) + 13 + "px"
        boxcenter.style.width = main - parseInt(boxright.style.width) - parseInt(boxleft.style.width) - 2 + "px"
 
        this.canvas.width = $(boxcenter).width();
        this.canvas.height = $(boxcenter).height();
    }
};
var layout = new Layout();
layout.init();
 
//左侧节点列表
function NodeList() {
    this.selectCanvas = null;
};
NodeList.prototype = {
    init: function() {
        this.createList();
        this.clickBad();
    },
    createList: function() {
        for (var key in palette_config) {
            var content = document.createElement("div");
            content.className = 'palette-content'
                //创建头 和itme
            $('.boxLeft').append(' <div class="palette-header"><i class="caret"></i>' +
                '<span class="palette-title-text">' + palette_config[key].name + '</span></div>').append(content);
 
            // 遍历节点
            var path = '../../../Content/topo/img/communication/'
 
            var items = palette_config[key].items;
            for (var a = 0; a < items.length; a++) {
                var item = document.createElement("div");
                item.className = 'palette-item';
                var img = document.createElement("img");
                $(img).attr('data-canvas', items[a].src);
                $(img).attr('data-userType', items[a].type);
                img.className = 'palette-item-img';
                img.src = path + items[a].src;
                var title = document.createElement("div");
                title.className = "label-box";
                title.innerHTML = items[a].name;
                item.appendChild(img);
                item.appendChild(title);
                content.appendChild(item);
            }
        }
    },
    //绑定事件
    clickBad: function() {
        var that = this;
        $('.boxLeft').on('click', '.palette-header', function(e) {
            var header = $(e.target);
            //隐藏框
            var palette_content = $(header).next(".palette-content"),
                max_height = palette_content.css("max-height"),
                max_height = (max_height == "0px" ? '2000px' : "0px");
            palette_content.css("max-height", max_height);
            //三角
            var detriangle = $(header).children('i'),
                deg = detriangle.css('transform');
            deg = (deg == 'none' ? 'rotate(-90deg)' : 'none');
            detriangle.css("transform", deg)
        })
    }
};
var nodeList = new NodeList();
nodeList.init();
 
//中间部分
function Topo() {
    //选中节点
    this.PIDS = [];
    this.CIDS = [];
    this.DIDS = [];
    this.selectedElements = [];
};
Topo.prototype = {
    init: function() {
        this.createTopo();
        this.menuBar();
        this.editRow();
        this.keyEvent();
        this.listEvent();
    },
    // 读取历史
    history: function(obj) {
        $("[data-type=bgcolor]").val(obj.config.bgColor);
        this.scene.backgroundColor = "255,255,255"; //obj.config.bgColor;
        this.scene.background = "";
        // obj.config.bgImg == "" ? "" : "../../img/communication/" + obj.config.bgImg;
        this.copyNode(obj.data);
    },
    //复制节点
    copyNode: function(data) {
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
    keyEvent: function() {
        this.copyOffset = 50;
        var that = this;
        this.spacing = 0;
        this.scene.mouseover(function() {
            that.isDelNode = true;
        })
        this.scene.mouseout(function() {
            that.isDelNode = false;
        })
        $(document).keydown(function(event) {
            if (!that.isDelNode) {
                return
            }
            //回退 delete  删除
            if (that.scene.selectedElements && event.keyCode == 46) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    that.scene.remove(selectedElements[a]);
                }
            }
            //回车复制
            if (that.scene.selectedElements && event.keyCode == 13) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    var node = selectedElements[a];
                    that.setNode(node);
                    node.setLocation(node.x + that.copyOffset, node.y);
                }
            }
 
            if (event.keyCode == 32) {
                that.ceshi();
            }
 
 
            //上下左右
            if (that.scene.selectedElements && (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39)) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    var x = selectedElements[a].x;
                    var y = selectedElements[a].y;
                    if (event.keyCode == 38) {
                        y--;
                    } else if (event.keyCode == 40) {
                        y++;
                    } else if (event.keyCode == 37) {
                        x--;
                    } else if (event.keyCode == 39) {
                        x++;
                    }
                    selectedElements[a].setLocation(x, y);
                }
            }
        });
        //查看历史
        $(".boxRight").on("click", "[data-type=checkMap]", function(event) {
                that.scene.clear();
                $.ajax({
                    type: "post",
                    url: "/PDRInfo/GetAttribute",
                    data: {
                        pid: parseInt($("[data-type=pid]").val()),
                        orderNo: parseInt($("[data-type=orderNo]").val()),
                        type: 2
                    },
                    success: function(res) {
                        res = res[0];
                        $('[data-type=IP]').val(that.uncompileStr(res.IP));
                        $('[data-type=account]').val(that.uncompileStr(res.Account));
                        $('[data-type=password]').val(that.uncompileStr(res.Password));
                        $('[data-type=port]').val(that.uncompileStr(res.Port));
                        $.ajax({
                            type: "get",
                            url: res.url + res.Path + "?date" + new Date().valueOf(),
                            success: function(data) {
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
            })
            //删除地图
        $(".boxRight").on("click", "[data-type=deleteMap]", function(event) {
            topo.scene.background = null;
        })
    },
    // 菜单栏
    menuBar: function() {
        var menu = document.createElement('div');
        menu.className = "menuBar";
        var path = '../../../Content/topo/img/edit/'
        for (let a = 0; a < palette_MenuBar.length; a++) {
            let img = document.createElement("img");
            img.className = "menu " + palette_MenuBar[a].name;
            img.src = path + palette_MenuBar[a].url;
            img.title = palette_MenuBar[a].title;
            $(menu).append(img);
        }
        $('.boxCenter').append(menu);
    },
    //拓扑
    createTopo: function() {
        // topo.scene.translateX = "";
        // topo.scene.translateX = "";
        var that = this;
        //创建 canvas元素  定义宽高
        var stage = new JTopo.Stage(layout.canvas);
        stage.frames = 24; //只有鼠标事件时 才重新绘制
        stage.wheelZoom = 0.95;
        stage.eagleEye.visible = true;
 
        that.mode = 'normal';
        // stage.zoom(0.5, 0.5);
        this.stage = stage;
 
        stage.click(function(event) {
            if (event.button == 0) { // 右键
                $("#contextmenu").hide();
                $(".panel-default").hide();
            }
        });
 
        var scene = new JTopo.Scene(stage);
        scene.alpha = 1;
        scene.background = null;
        scene.click(function(e) {
            if (scene.selectedElements.length == 0) {
                $('tbody tr').hide();
                $('.scene').show();
                $("[data-type=bgcolor]").attr('value', that.rgb2hex(scene.backgroundColor));
                $("[data-type=pid]").val(that.__pid);
                $("[data-type=orderNo]").val(that.__orderNo);
                $("[data-type=IP]").val(that.__IP);
                $("[data-type=port]").val(that.__port);
                $("[data-type=account]").val(that.__account);
                $("[data-type=password]").val(that.__password);
            }
        })
        this.scene = scene;
 
    },
    // 编辑
    editRow: function() {
        var that = this;
        document.getElementsByClassName("menuBar")[0].addEventListener("click", function(e) {
            if (e.target.className.match('switch')) {
                if (that.mode == "normal") {
                    that.mode = "select";
                    $('[title = 切换编辑模式]').attr('src', "../../../Content/topo/img/edit/switch-hover.png")
                } else {
                    that.mode = "normal";
                    $('[title = 切换编辑模式]').attr('src', "../../../Content/topo/img/edit/switch.png")
                }
                that.stage.mode = that.mode;
            } else if (e.target.className.match('save')) {
                that.saveNodes();
            }
        })
    },
    //保存 提交数据属性
    saveNodes: function() {
        var that = this;
        if (!that.__pid || !that.__orderNo) {
            alert('配电室ID和编号不能为空');
            return
        }
        var ojbect = {
            config: {
                bgColor: attributesTab.hexToRgba($('[data-type=bgcolor]').val()),
                scaleX: this.scene.scaleX,
                scaleY: this.scene.scaleY,
                bgImg: this.scene.background,
                translateX: topo.scene.translateX,
                translateY: topo.scene.translateY,
            }
        }
        var nodes = {};
        var line = [];
        topo.scene.findElements(function(e) {
            if (e.elementType == "link") {
                var l = {};
                l.elementType = e.elementType;
                l.fillColor = e.fillColor;
                l.font = e.font;
                l.fontColor = e.fontColor;
                l.alpha = e.alpha;
                l.borderColor = e.borderColor;
                l.lineWidth = e.lineWidth;
                l.nodeA = e.nodeA.ID;
                l._parentID = e._parentID;
                l.nodeZ = e.nodeZ.ID;
                l.type = e.type;
                line.push(l);
            }
 
            if (e.elementType == "node") {
                delete e.inLinks;
                delete e.outLinks;
                nodes[e.ID] = e;
            }
 
        })
        ojbect.data = { node: nodes, line: line };
        var saveData = document.createElement("input");
        $(saveData).val(JSON.stringify(ojbect));
        $(saveData).css('display', "none")
        $("body").append(saveData);
 
        var val = `?pid=${that.__pid}&orderNo=${that.__orderNo}&type=2&IP=${that.compileStr(that.__IP)}&port=${that.compileStr(that.__port)}&account=${ that.compileStr(that.__account)}&password=${ that.compileStr(that.__password)}`;
 
        $.ajax({
            type: 'POST',
            url: "/PDRInfo/SaveAttribute" + val,
            data: {
                data: JSON.stringify(ojbect)
            },
            success: function(res) {
                var filename = `${that.__pid}__${that.__orderNo||1}__${new Date().toLocaleString()}`
                that.saveAs(saveData, filename)
                $(saveData).remove();
                if (res == '保存成功') {
                    alert('保存成功');
                }
            },
        })
    },
 
    //保存文件
    saveAs: function(obj, filename) {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/html;gb2312,' + obj.value);
        a.setAttribute('download', filename);
        a.setAttribute('target', '_blank');
        a.style.display = "none";
        obj.parentNode.appendChild(a);
        a.click();
    },
    compileStr: function(code) {
        if (!code) {
            return null;
        }
        var c = String.fromCharCode(code.charCodeAt(0) + code.length); 
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1)); 
        }
        return escape(c);
    },
    uncompileStr: function(code) {
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
    setNode: function(obj) {
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
            node.textPosition = 'Bottom_Center';
            node.textOffsetY = obj.textOffsetY;
            if (node._userType) {
                that[node._userType + 'S'].push(node);
            }
            node.setImage("../../Content/topo/img/communication/" + obj.path);
            node.path = obj.path
            node.fillColor = "0,0,0"; // 节点填充颜色
            node.ID = obj.ID;
            node.font = obj.font || '10px 微软雅黑 block';
            node.addEventListener('mouseup', function handler(event) {
                if (event.button == 2) { // 右键
                    // 当前位置弹出菜单（div）
                    $("#contextmenu").css({
                        top: event.pageY,
                        left: event.pageX
                    }).show();
                }
            });
            if (node._userType == "PID") {
                node.ID = "0" + that.__pid;
            }
        } else {
            return;
        }
        if (obj.dragable != undefined) {
            node.dragable = obj.dragable;
        }
        node.fontColor = '0,0,0';
        node.alpha = 1;
        node.rotate = obj.rotate || 0;
        node._parentID = obj._parentID;
        node.click(function() {
            that.nodeClick(node);
        })
        node._visible = 1;
        this.scene.add(node);
        return node;
    },
    listEvent: function() {
        var that = this;
        $("#contextmenu a").click(function() {
            if (!that.__pid) {
                alert('PID不能为空')
                return
            }
            var text = $(this).text();
            if (text == '添加子节点') {
                var url, data;
                if (that.scene.selectedElements[0]._userType == "PID") {
                    url = "/PDRInfo/GetDeviceByPID";
                    data = { pid: that.__pid };
                } else if (that.scene.selectedElements[0]._userType == "DID") {
                    url = "/PDRInfo/GetCirByDID";
                    data = { pid: that.__pid, did: that.scene.selectedElements[0].ID };
                } else {
                    $("#contextmenu").hide();
                    return
                }
                $.ajax({
                    type: "post",
                    url: url,
                    data: data,
                    success: function(res) {
                        $('.panel-default').show();
                        for (var a = 0, arr = []; a < res.length; a++) {
                            arr.push(`<li><label><input type="checkBox" value="${res[a].ID}"><span>${res[a].Name}</span></label></li>`);
                        }
                        $('.childs').html(arr.join(''));
                    }
                })
            }
 
            $("#contextmenu").hide();
        });
        $('.addChild').on('click', function() {
            that.addDIDorCID(that.scene.selectedElements[0]);
            //获取选中复选框
            $('.panel-default').hide();
            $('.allCheck')[0].checked = false;
        })
 
 
        //全选按钮
        $('.allCheck').on('change', function() {
            var userids = this.checked;
            $(".childs input").each(function() {
                this.checked = userids;
            });
        })
    },
 
    ceshi: function() {
        this.scene.clear();
        var that = this;
        var zhan = that.setNode({
            __type: "node",
            path: "server.png",
            x: 600,
            y: 100,
            text: "服务器",
            width: 100,
            height: 100,
            ID: 0,
            textOffsetY: -10
        });
        var root = that.setNode({
            _parentID: 0,
            __type: "node",
            path: "switches.png",
            _userType: "PID",
            text: "交换机",
            x: 600,
            y: 250,
            width: 100,
            height: 80,
            ID: that.__pid,
            textOffsetY: -10
        });
        this.setlink(root, zhan);
        $.ajax({
            type: "post",
            url: "/PDRInfo/GetDeviceByPID",
            data: { pid: root.ID },
            success: function(res) {
                var PID = root;
                //DID
                var postiionX = PID.x - res.length / 2 * 100 + PID.width * .5;
                for (var a = 0; a < res.length; a++) {
                    var DID = that.setNode({
                        __type: "node",
                        path: "meter-box.png",
                        _userType: "DID",
                        text: res[a].Name,
                        width: 100,
                        height: 100,
                        ID: res[a].ID,
                        _parentID: PID.ID,
                        x: res.length == 1 ? PID.x : postiionX + 100 * a,
                        y: PID.y + 60 + PID.height,
                        textOffsetY: -10
                    });
                    var PID_DID = that.setlink(DID, PID);
                    PID_DID._parentID = PID.ID;
 
                    $.ajax({
                        type: "post",
                        url: "/PDRInfo/GetCirByDID",
                        data: { pid: PID.ID, did: DID.ID },
                        async: false,
                        success: function(resCID) {
                            //CID
                            for (var b = 0; b < resCID.length; b++) {
                                var CID = that.setNode({
                                    __type: "node",
                                    path: "electric-meter.png",
                                    _userType: "CID",
                                    text: resCID[b].Name,
                                    width: 60,
                                    height: 60,
                                    ID: resCID[b].ID,
                                    _parentID: DID.ID,
                                    x: DID.x + DID.width / 3 * 2,
                                    y: DID.y + DID.height + 30 + (50 + 8) * b,
                                    textOffsetY: -15
 
                                });
                                var DID_CID = that.setFoldLink(CID, DID);
                                DID_CID._parentID = DID.ID;
                            }
                        }
 
                    })
                }
            }
        })
        setTimeout(() => {
            that.stage.eagleEye.update();
        }, 500);
 
    },
    // 添加DID节点 或者CID节点
    addDIDorCID: function(node) {
        var that = this;
        var num = 0;
        var node1 = node;
        if (!node1) {
            return
        }
        var nodeWidth = parseInt($('.nodewidth').val());
        var nodeHeight = parseInt($('.nodeheight').val());
        var maxleng = parseInt($('.nodewidth').val());
        var postiionX = node1.x - ($('input:checkbox:checked').length / 2) * maxleng + node1.width * .5;
        var _userType = node1._userType == "PID" ? "DID" : "CID";
 
 
        $.each($('.childs  input:checkbox:checked'), function() {
            if (_userType == "DID") {
                var x = $('input:checkbox:checked').length == 1 ? node1.x : postiionX + maxleng * num;
                var y = node1.y + 60 + node1.height;
            } else {
                var x = node1.x + node1.width / 3 * 2;
                var y = node1.y + node1.height + 30 + (nodeHeight + 20) * num;
            }
            var url = _userType == "DID" ? "switches.png" : "electric-meter.png";
            var node2 = that.setNode({
                __type: "node",
                path: url,
                _userType: _userType,
                text: $(this).next('span').html(),
                width: nodeWidth,
                height: nodeHeight,
                ID: $(this).val(),
                _parentID: node1.ID,
                x: x,
                y: y
            });
            if (_userType == "DID") {
                var line = that.setlink(node1, node2);
            } else {
                var line = that.setFoldLink(node1, node2);
                node2.linkElementID = node1.ID;
 
            }
            node2.linkElementID = node1.ID;
            line._parentID = node1.ID;
            num++;
        });
    },
 
    //二次折线
    setlink: function(nodeA, nodeZ, text) {
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
    setFoldLink: function(nodeA, nodeZ, text) {
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
    nodeClick: function(node) {
        if (this.isedit) {
            node.editAble = true;
            this.isedit = false;
        }
        $('tbody tr').hide();
        if (node.__type == "text") {
            $('tr.text').show();
            $("[data-type=content]").val(node.text);
            $("[data-type=font]").val(node.font);
        } else if (node.__type == "node") {
            $('tr.node').show();
            $("[data-type=width]").val(node.getBound().width);
            $("[data-type=height]").val(node.getBound().height);
            $("[data-type=path]").val(node.path);
        }
        $("[data-type=zIndex]").val(node.zIndex || null);
        $("[data-type=parentID]").val(node._parentID || null);
        $("[data-type=x]").val(node.x);
        $("[data-type=y]").val(node.y);
        $("[data-type=fixe]").prop('checked', !node.dragable);
        $("[data-type=angle]").val(parseInt(node.rotate) * 180 / Math.PI || 0);
        $("[data-type=copyOffset]").val(this.copyOffset);
        $("[data-type=_userType]").val(node._userType);
        $("[data-type=ID]").val(node.ID);
 
 
 
 
 
        node._visible = node._visible ? 0 : 1;
        this.contractionSubset(node);
        this.stage.eagleEye.update();
 
    },
    //收缩子集
    contractionSubset: function(node) {
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
                        node.setImage(node.image.src.replace('_j.png', '.png'))
                    }
 
                } else if (node._visible == 0) { // 关闭
                    if (!node.image.src.match(/_j/)) {
                        node.setImage(node.image.src.replace('.png', '_j.png'))
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
    rgb2hex: function(rgb) {
        if (!rgb) {
            return
        }
        var reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
        var arr = reg.exec(rgb);
 
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        var _hex = "#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
        return _hex.toUpperCase();
    },
};
var topo = new Topo();
topo.init();
 
//右侧属性表格
var AttributesTab = function() {}
AttributesTab.prototype = {
    init: function() {
        this.createTable();
        this.setNodeStyle();
    },
    createTable: function() {
        $(".boxRight").html("<table class='table'><thead><tr><th>属性</th><th>值</th></tr></thead><tbody></tbody></table>");
        for (var a = 0, str = ""; a < palette_Attributes.length; a++) {
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML = palette_Attributes[a].name;
            tr.appendChild(td1);
            var td2 = document.createElement("td");
            tr.appendChild(td2);
            var input = document.createElement("input");
            $(input).attr('type', palette_Attributes[a].type);
            $(input).attr('data-type', palette_Attributes[a].title);
            $(tr).attr('class', palette_Attributes[a].sort);
            if (palette_Attributes[a].value) {
                $(input).val(palette_Attributes[a].value);
                $(input).attr('id', "submit")
            }
            td2.appendChild(input);
            $('tbody').append(tr)
        }
    },
    setNodeStyle: function() {
        var that = this;
        $("input").on('input', function() {
            var key = $(this).attr("data-type");
            var value = $(this).val();
            var selectedElements = topo.scene.selectedElements;
            for (let a = 0; a < selectedElements.length; a++) {
                switch (key) {
                    case "content":
                        selectedElements[a].text = value;
                        break;
                    case "font":
                        selectedElements[a].font = value;
                        break;
                    case "x":
                        selectedElements[a].setLocation(parseInt(value), selectedElements[a].y);
                        break;
                    case "y":
                        selectedElements[a].setLocation(selectedElements[a].x, parseInt(value));
                        break;
                    case "fixe":
                        selectedElements[a].dragable = !$(this).is(':checked');
                        break;
                    case "width":
                        selectedElements[a].setSize(parseInt(value), selectedElements[a].height);
                        break;
                    case "height":
                        selectedElements[a].setSize(selectedElements[a].width, parseInt(value));
                        break;
                    case "spacing":
                        topo.spacing = parseInt(value);
                        break;
                    case "angle":
                        selectedElements[a].rotate = parseInt(value) / 180 * Math.PI;
                        break;
                    case "switchQuantity":
                        selectedElements[a]._switchQuantity = value;
                        break;
                    case "alarmStatus":
                        selectedElements[a]._alarmStatus = value;
                        break;
                    case "parentID":
                        selectedElements[a]._parentID = value;
                        break;
                    case "ID":
                        selectedElements[a].ID = value;
                        break;
                    case "copyOffset":
                        topo.copyOffset = parseInt(value)
                        break;
                    case "zIndex":
                        selectedElements[a].zIndex = value;
                        break;
                    case "path":
                        selectedElements[a].setImage("../../Content/topo/img/communication/" + value);
                        break;
                }
            }
            switch (key) {
                case "bgcolor":
                    topo.scene.backgroundColor = that.hexToRgba(value);
                    break;
                case "map":
                    var file = this.files[0];
                    if (window.FileReader) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        //监听文件读取结束后事件    
                        reader.onloadend = function(e) {
                            topo.scene.background = e.target.result;
                        };
                    }
                    break;
                case "pid":
                    topo.__pid = value;
                    topo.scene.findElements(function(e) {
                        if (e._userType == "PID") {
                            e.ID = value;
                        }
                    })
                    break;
                case "orderNo":
                    topo.__orderNo = value;
                    break;
                case "IP":
                    topo.__IP = value;
                    break;
                case "port":
                    topo.__port = value;
                    break;
                case "account":
                    topo.__account = value;
                    break;
                case "password":
                    topo.__password = value;
                    break;
 
            }
        })
    },
 
    //颜色转换
    hexToRgba: function(hex, opacity) {
        return parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7));
    },
}
var attributesTab = new AttributesTab();
attributesTab.init();
