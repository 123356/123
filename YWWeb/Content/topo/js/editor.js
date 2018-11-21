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
        this.adaptive();
        $("body").prepend(this.main);
        $(this.main).append(this.boxleft)
            .append(this.lineleft)
            .append(this.boxcenter)
            .append(this.lineright)
            .append(this.boxright);
        this.dragline($(this.lineleft), 'left');
        this.dragline($(this.lineright), 'right');
        this.resize()
    },
    //加载class 添加节点  class 给定默认样式
    creatBox: function() {
        this.boxleft.className = "boxLeft";
        this.lineleft.className = "lineLeft";
        this.boxcenter.className = "boxCenter";
        this.lineright.className = "lineRight";
        this.boxright.className = "boxRight";
        this.main.className = "main";
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
            return false;
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
                return false;
            })
            //鼠标抬起事件
        $(dv).on('mouseup', function(e) {
            //开关关闭
            isDown = false;
            return false;
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
            $('.boxLeft').append(`<div class="palette-header"><i class="caret"></i>
                <span class="palette-title-text">${palette_config[key].name}</span></div>`)
                .append(content);
            // 遍历节点
                var path = "../../Content/topo/img/symbols/";
            var items = palette_config[key].items;
            for (var a = 0; a < items.length; a++) {
                var item = document.createElement("div");
                item.className = 'palette-item';
                var img = document.createElement("img");
                $(img).attr('data-canvas', items[a].canvas);
                img.className = 'palette-item-img';
                img.src = path + items[a].type;
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
        $('.boxLeft').on('mousedown', '.palette-item-img', function(e) {
            that.selectCanvas = $(e.target).attr('data-canvas');
            return false;
        })
    }
};
var nodeList = new NodeList();
nodeList.init();

//中间部分
function Topo() {
    //选中节点
    this.selectedElements = [];
};
Topo.prototype = {
    init: function() {
        this.menuBar();
        this.createTopo();
        this.dragNode();
        this.editRow();
        this.keyEvent();
    },
    // 读取历史
    history: function(obj) {
        $('[data-type=pid]').val(obj.config.pid);
        $('[data-type=orderNo]').val(obj.config.orderNo);
        $("[data-type=bgcolor]").val(obj.config.bgColor);
        this.scene.backgroundColor = obj.config.bgColor
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
                    url: "https://yw.ife360.com/PDRInfo/GetOneView",
                    // dataType: "json",
                    // headers: { 'Content-Type': 'application/json;charset=utf8' },
                    data: {
                        pid: $("[data-type=pid]").val(),
                        orderNo: $("[data-type=orderNo]").val()
                    },
                    success: function(res) {
                        $.ajax({
                            type: "get",
                            url: res + "?date" + new Date().valueOf(),
                            success: function(res) {
                                that.history(JSON.parse(res))
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
        // menu
        var path = "../../Content/topo/img/edit/"
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
        var that = this;
        //创建 canvas元素  定义宽高
        var canvas = document.createElement('canvas');
        var box = document.getElementsByClassName('boxCenter')[0];
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.className = "topo"
        box.appendChild(canvas);
        var stage = new JTopo.Stage(canvas);
        stage.frames = 24; //只有鼠标事件时 才重新绘制
        stage.wheelZoom = 1.1;
        that.mode = 'normal';
        this.stage = stage;
        var scene = new JTopo.Scene(stage);
        scene.alpha = 1;
        scene.background = null;
        scene.backgroundColor = "0,0,0";


        // var container = new JTopo.Container();
        // container.setBound(0, 0, 1686, 883);
        // scene.add(container)


        this.scene = scene;
        //点击连线时 点击空白画布 创建宽度为1的节点（可拖拽）
        scene.click(function(e) {
            if (that.isline && !that.islineNodeA && scene.selectedElements.length == 0) {
                that.islineNodeA = [parseInt(e.x), parseInt(e.y)];
            } else if (that.isline && that.islineNodeA && scene.selectedElements.length == 0) {
                var obj = Math.abs(that.islineNodeA[0] - parseInt(e.x)) > Math.abs(that.islineNodeA[1] - parseInt(e.y)) ? {
                    width: Math.abs(that.islineNodeA[0] - parseInt(e.x)),
                    height: 2
                } : {
                    height: Math.abs(that.islineNodeA[1] - parseInt(e.y)),
                    width: 2
                };
                obj.__type = "line";
                obj.x = that.islineNodeA[0];
                obj.y = that.islineNodeA[1];
                that.setNode(obj);
                that.isline = false;
                that.islineNodeA = null;
            }
            if (scene.selectedElements.length == 0) {
                $('tbody tr').hide();
                $('.scene').show();
                $("[data-type=bgcolor]").attr('value', that.rgb2hex(scene.backgroundColor));
                $("[data-type=pid]").val(that.__pid);
                $("[data-type=orderNo]").val(that.__orderNo);
            }
        })
    },
    // 拖拽节点
    dragNode: function() {
        var that = this;
        this.scene.mouseup(function(event) {
            if (nodeList.selectCanvas) {
                var canvas = nodeList.selectCanvas;
                nodeList.selectCanvas = null;



                var x = event.x;
                var y = event.y;
                var obj = canvas == 'text' ? {
                    __type: "text",
                    canvas: null
                } : {
                    __type: "node",
                    canvas: canvas,
                }
                obj.x = parseInt(x);
                obj.y = parseInt(y);
                obj.center = true;
                that.setNode(obj);
            }
            return false;
        })
    },
    // 顶部编辑行
    editRow: function() {
        var that = this;
        document.getElementsByClassName("menuBar")[0].addEventListener("click", function(e) {
            if (!e.target) {
                return
            }
            if (e.target.className.match('editSize')) {
                that.editSize();
            } else if (e.target.className.match('line')) {
                that.isline = true;
            } else if (e.target.className.match('link')) {
                that.link();
            } else if (e.target.className.match('switch')) {
                that.mode = that.mode == "normal" ? "select" : "normal";
                that.stage.mode = that.mode;
            } else if (e.target.className.match('monospace')) {
                that.setNodeContours("width");
            } else if (e.target.className.match('contour')) {
                that.setNodeContours("height")
            } else if (e.target.className.match('sameWidth')) {
                that.setNodeContours("widthheight")
            } else if (e.target.className.match('alignLeft')) {
                that.setNodeAlignment("left");
            } else if (e.target.className.match('alignRight')) {
                that.setNodeAlignment("right");
            } else if (e.target.className.match('alignTop')) {
                that.setNodeAlignment("top");
            } else if (e.target.className.match('alignDown')) {
                that.setNodeAlignment("bottom");
            } else if (e.target.className.match('horizontalSpacing')) {
                var distance = 10;
                that.setNodeSpacing('x', distance);
            } else if (e.target.className.match('verticalSpacing')) {
                var distance = 10;
                that.setNodeSpacing('y', distance);
            } else if (e.target.className.match('save')) {
                that.saveNodes();
            } else if (e.target.className.match('level')) {
                that.setAlign("width");
            } else if (e.target.className.match('vertical')) {
                that.setAlign("height");
            }
        });
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
                pid: that.__pid,
                orderNo: that.__orderNo,
                bgColor: attributesTab.hexToRgba($('[data-type=bgcolor]').val())
            }
        }
        var nodes = [];
        topo.scene.findElements(function(e) {
            nodes.push(e)
        })
        ojbect.nodes = nodes;
        $.ajax({
            type: 'POST',
            url: "https://yw.ife360.com/PDRInfo/SaveOneView?pid=" + that.__pid + "&orderNo=" + that.__orderNo,
            data: {
                data: JSON.stringify(ojbect)
            },
            success: function(res) {

                const element = document.createElement('a');
                const file = new Blob([JSON.stringify(ojbect)]);
                element.href = URL.createObjectURL(file);
                element.download = new Date().toLocaleString() + '.json';
                element.click();
                alert('保存成功');
            },
        })
    },
    //编辑大小
    editSize: function() {
        this.isedit = true;
    },
    // 多边形连线
    link: function() {},
    //对其方式
    setAlign: function(type) {
        if (this.scene.selectedElements.length == 0) {
            return
        }
        var selectedElements = this.scene.selectedElements;
        for (var a = 0; a < selectedElements.length; a++) {
            if (type == "width") {
                selectedElements[a].setLocation(selectedElements[a].x, this.templateNode.y);
            } else {
                selectedElements[a].setLocation(this.templateNode.x, selectedElements[a].y);
            }
        }
    },
    //设置所有节点等高
    setNodeContours(type) {
        if (this.scene.selectedElements.length == 0 || !this.templateNode) {
            return
        }
        var width = this.templateNode.width;
        var height = this.templateNode.height;
        var selectedElements = this.scene.selectedElements;
        for (var a = 0; a < selectedElements.length; a++) {
            if (type == "width") {
                selectedElements[a].width = width;
            } else if (type == "height") {
                selectedElements[a].height = height;
            } else if (type = "widthheight") {
                selectedElements[a].width = width;
                selectedElements[a].height = height;
            }
        }
    },
    //设置节点间距
    setNodeSpacing(type, distance) {
        if (!this.templateNode) {
            return
        }
        var selectedElements = this.scene.selectedElements;
        var position = this.templateNode[type];
        for (var a = 0, len = selectedElements.length; a < len; a++) {
            var node = selectedElements[a];
            if (type == "x") {
                var num = a == 0 ? this.templateNode.width : selectedElements[a].width;
                position += num + this.spacing;
                node.setLocation(parseInt(position), node.y)
            } else {
                var num = a == 0 ? this.templateNode.height : selectedElements[a - 1].height;
                position += this.spacing + num;
                node.setLocation(node.x, parseInt(position))
            }
        }
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
            node.textPosition = 'Middle_Center';
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
            node.zIndex = obj.zIndex || 2;
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
        if (obj.dragable != undefined) {
            node.dragable = obj.dragable;
        }
        node.alpha = 1;
        node.textPosition = 'Bottom_Center';
        node.rotate = obj.rotate || 0;
        node.id = obj.id;
        node._cid = obj._cid;
        node._parentID = obj._parentID;
        node._failureState = obj._failureState;
        node.dbclick(function() {
            if (that.templateNode) {
                that.templateNode.borderWidth = 0;
                that.templateNode = null;
            } else {
                that.templateNode = node;
                node.borderWidth = 4;
            }
        })
        node.click(function() {
            that.nodeClick(node);
        })
        this.scene.add(node);
        // JTopo.Animate.stepByStep(node, {
        //     fontColor: "255,255,255"
        // }, 3000, false).start();

    },

    // 节点点击事件

    nodeClick(node) {

        if (this.isedit) {

            node.editAble = true;
            this.isedit = false;
        }
        $('tbody tr').hide();
        if (node.__type == "text") {
            $('tr.text').show();
            $("[data-type=content]").val(node.text);
            $("[data-type=font]").val(node.font);
            $("[data-type=state4]")[0].value = this.rgb2hex(node.state4);
        } else if (node.__type == "node") {
            $('tr.node').show();
            $("[data-type=width]").val(node.getBound().width);
            $("[data-type=height]").val(node.getBound().height);

            $("[data-type=status0]").val(node.state0);
            $("[data-type=status1]").val(node.state1);
            $("[data-type=status2]").val(node.state2);
        } else if (node.__type == "line") {
            $('tr.line').show();
            $("[data-type=linecolor]").val(this.rgb2hex(node.fillColor));
            $("[data-type=linewidth]").val(node.width < node.height ? node.width : node.height);
            $("[data-type=linelength]").val(node.width > node.height ? node.width : node.height);
            $("[data-type=linkx]").val(node.x);
            $("[data-type=linky]").val(node.y);
            $("[data-type=state0]")[0].value = this.rgb2hex(node.state0);
            $("[data-type=state1]")[0].value = this.rgb2hex(node.state1);
        }
        $("[data-type=ID]").val(node.id || null);
        $("[data-type=zIndex]").val(node.zIndex || null);
        $("[data-type=parentID]").val(node._parentID || null);
        $("[data-type=x]").val(node.x);
        $("[data-type=y]").val(node.y);
        $("[data-type=fixe]").prop('checked', !node.dragable);
        $("[data-type=spacing]").val(this.spacing);
        $("[data-type=angle]").val(parseInt(node.rotate) * 180 / Math.PI || 0);
        $("[data-type=copyOffset]").val(this.copyOffset);
        $("[data-type=failureState]").val(node._failureState || null);
        $("[data-type=statusvalue]").val(node.__statusvalue);
        $("[data-type=CID]").html(`<option>${node._cid || "无"}</option>`);

        if (node.image) {
            var path = node.image.currentSrc;
        }

    },
    rgb2hex(rgb) {
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
            if (palette_Attributes[a].type != "select") {
                var input = document.createElement("input");
            } else {
                var input = document.createElement("select");
            }
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
                    case "linewidth":
                        if (selectedElements[a].height > selectedElements[a].width) {
                            selectedElements[a].width = parseInt(value) || 0;
                        } else {
                            selectedElements[a].height = parseInt(value) || 0;
                        }
                        break;
                    case "linelength":
                        if (selectedElements[a].height < selectedElements[a].width) {
                            selectedElements[a].width = parseInt(value) || 0;
                        } else {
                            selectedElements[a].height = parseInt(value) || 0;
                        }
                        break;
                    case "linecolor":
                        selectedElements[a].fillColor = that.hexToRgba(value);
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
                    case "failureState":
                        selectedElements[a]._failureState = value;
                        break;
                    case "alarmStatus":
                        selectedElements[a]._alarmStatus = value;
                        break;
                    case "parentID":
                        selectedElements[a]._parentID = value;
                        break;
                    case "ID":
                        selectedElements[a].id = value;
                        break;
                    case "statusvalue":
                        var node = selectedElements[a];
                        value = value || 0;
                        node.__statusvalue = value;
                        if (node.__type == "text") {
                            node.fontColor = node["state" + value];
                        } else if (node.__type == "node") {
                            node.color = node["state" + value];
                        } else if (node.__type == "line") {
                            node.fillColor = node["state" + value];
                        }
                        break;
                    case "status0":
                        selectedElements[a].state0 = value;
                        that.textColor(selectedElements[a], 0, value);
                        break;
                    case "status1":
                        selectedElements[a].state1 = value;
                        that.textColor(selectedElements[a], 0, value);
                        break;
                    case "status2":
                        selectedElements[a].state2 = value;
                        that.textColor(selectedElements[a], 0, value);
                        break;
                    case "copyOffset":
                        topo.copyOffset = parseInt(value)
                        break;
                    case "state0":
                        var color = that.hexToRgba(value);
                        selectedElements[a].state0 = color;
                        that.textColor(selectedElements[a], 0, color);
                        break;
                    case "state1":
                        var color = that.hexToRgba(value);
                        selectedElements[a].state1 = color;
                        that.textColor(selectedElements[a], 1, color);

                        break;
                    case "state2":
                        var color = that.hexToRgba(value);
                        selectedElements[a].state2 = color;
                        that.textColor(selectedElements[a], 2, color);
                        break;
                    case "state4":
                        var color = that.hexToRgba(value);
                        selectedElements[a].state4 = color;
                        that.textColor(selectedElements[a], 4, color);
                        break;
                    case "zIndex":
                        selectedElements[a].zIndex = value;
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
                    $.ajax({
                        type: "post",
                        url: "https://yw.ife360.com/PDRInfo/GetDeviceByPID",
                        data: {
                            pid: value,
                        },
                        success: function(res) {
                            var qwe = [];
                            for (var a = 0; a < res.length; a++) {
                                qwe.push(`<option value="${res[a].ID}">${res[a].Name}</option>`)
                            }
                            $("[data-type=DID]").html(qwe.join(''));
                        }
                    })
                    break;
                case "orderNo":
                    topo.__orderNo = value;
                    break;
            }
        })

        $("select").on('change', function() {
            var key = $(this).attr("data-type");
            var value = $(this).val();
            var selectedElements = topo.scene.selectedElements;
            switch (key) {
                case "DID":
                    $.ajax({
                        type: "post",
                        url: "https://yw.ife360.com/PDRInfo/GetCirByDID",
                        data: {
                            pid: topo.__pid,
                            did: value,
                        },
                        success: function(res) {
                            var qwe = [`<option value="0">请选择</option>`];
                            for (var a = 0; a < res.length; a++) {
                                qwe.push(`<option value="${res[a].ID}">${res[a].Name}</option>`)
                            }
                            $("[data-type=CID]").html(qwe.join(''));
                        }
                    })
                    break;
                case "CID":
                    for (let a = 0; a < selectedElements.length; a++) {
                        selectedElements[a]._cid = value
                    }
                    break;
            }

        })
    },
    // 判断状态修改字体颜色
    textColor(node, type, value) {
        if (node.__statusvalue == type) {
            if (node.__type == 'text') {
                node.fontColor = value;
            } else if (node.__type == 'node') {
                node.color = value
            } else if (node.__type == 'line') {
                node.fillColor = value;
            }
        }
    },
    //颜色转换
    hexToRgba(hex, opacity) {
        return parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7));
    },
}
var attributesTab = new AttributesTab();
attributesTab.init();