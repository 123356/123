"use strict"

function Layout() {
    this.boxleft = document.createElement("div");
    this.lineleft = document.createElement("div");
    this.boxcenter = document.createElement("div");
    this.lineright = document.createElement("div");
    this.main = document.createElement("div");
    this.boxright = document.createElement("div")
};
Layout.prototype = {
    init: function() {
        this.creatBox();
        this.adaptive();
        $("body").prepend(this.main);
        $(this.main).append(this.boxleft).append(this.lineleft).append(this.boxcenter).append(this.lineright).append(this.boxright);
        this.dragline($(this.lineleft), 'left');
        this.dragline($(this.lineright), 'right');
        this.resize()
    },
    creatBox: function() {
        this.boxleft.className = "boxLeft";
        this.lineleft.className = "lineLeft";
        this.boxcenter.className = "boxCenter";
        this.lineright.className = "lineRight";
        this.boxright.className = "boxRight";
        this.main.className = "main"
    },
    dragline: function(dv, box) {
        var that = this;
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        $(dv).on('mousedown', function(e) {
            x = e.clientX;
            y = e.clientY;
            l = dv.offset().left;
            t = dv.offset().top;
            isDown = true
        });
        window.addEventListener('mousemove', function(e) {
            if (isDown == false) {
                return
            }
            var nx = e.clientX;
            var ny = e.clientY;
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
        });
        $(dv).on('mouseup', function(e) {
            isDown = false
        })
    },
    resize: function() {
        var that = this;
        $(window).resize(function() {
            that.globalwdith = parseInt($(window).width());
            that.adaptive()
        })
    },
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

function NodeList() {
    this.selectCanvas = null
};
NodeList.prototype = {
    init: function() {
        this.createList();
        this.clickBad()
    },
    createList: function() {
        for (var key in palette_config) {
            var content = document.createElement("div");
            content.className = 'palette-content'
            $('.boxLeft').append('<div class="palette-header"><i class="caret"></i><span class="palette-title-text">' + palette_config[key].name + '</span></div>').append(content);
            var path = '../../../Content/topo/img/symbols/'
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
                content.appendChild(item)
            }
        }
    },
    clickBad: function() {
        var that = this;
        $('.boxLeft').on('click', '.palette-header', function(e) {
            var header = $(e.target);
            var palette_content = $(header).next(".palette-content"),
                max_height = palette_content.css("max-height"),
                max_height = (max_height == "0px" ? '2000px' : "0px");
            palette_content.css("max-height", max_height);
            var detriangle = $(header).children('i'),
                deg = detriangle.css('transform');
            deg = (deg == 'none' ? 'rotate(-90deg)' : 'none');
            detriangle.css("transform", deg)
        })
    }
};
var nodeList = new NodeList();
nodeList.init();

function Topo() {
    this.selectedElements = []
};
Topo.prototype = {
    init: function() {
        this.createTopo();
        this.dragNode();
        this.menuBar();
        this.editRow();
        this.keyEvent()
    },
    history: function (obj) {
        console.log(obj)
        if (obj) {
            console.log(obj.config.translateX)
            this.scene.translateX = obj.config.translateX || 1;
            this.scene.translateY = obj.config.translateY || 1;
            this.scene.zoom(obj.config.scaleX, obj.config.scaleY);
            this.scene.backgroundColor = obj.config.bgColor; //"0,0,0";
            this.scene.background = null;
            this.copyNode(obj.nodes);
        }
    },
    copyNode: function(list) {
        if (!list) {
            return
        }
        for (var a = 0; a < list.length; a++) {
            var node = list[a];
            this.setNode(node)
        }
    },
    keyEvent: function() {
        this.copyOffset = 50;
        var that = this;
        this.spacing = 0;
        this.scene.mouseover(function() {
            that.isDelNode = true
        });
        this.scene.mouseout(function() {
            that.isDelNode = false
        });
        $(document).keydown(function(event) {
            if (!that.isDelNode) {
                return
            }
            if (that.scene.selectedElements && event.keyCode == 46) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    that.scene.remove(selectedElements[a])
                }
            }
            if (that.scene.selectedElements && event.keyCode == 13) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    var node = selectedElements[a];
                    that.setNode(node);
                    node.setLocation(node.x + that.copyOffset, node.y)
                }
            }
            if (that.scene.selectedElements && (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39)) {
                var selectedElements = that.scene.selectedElements;
                for (var a = 0; a < selectedElements.length; a++) {
                    var x = selectedElements[a].x;
                    var y = selectedElements[a].y;
                    if (event.keyCode == 38) {
                        y--
                    } else if (event.keyCode == 40) {
                        y++
                    } else if (event.keyCode == 37) {
                        x--
                    } else if (event.keyCode == 39) {
                        x++
                    }
                    selectedElements[a].setLocation(x, y)
                }
            }
        });
        $(".boxRight").on("click", "[data-type=checkMap]", function(event) {
            that.scene.clear();
            $.ajax({
                type: "post",
                url: "/PDRInfo/GetAttribute",
                data: {
                    pid: $("[data-type=pid]").val(),
                    orderNo: $("[data-type=orderNo]").val() || 1,
                    type: 1
                },
                success: function(res) {
                    res = res[0];
                    if (res.IP) {
                        that.__IP = $.base64.decode(res.IP);
                        $('[data-type=IP]').val(that.__IP);
                    }
                    if (res.Account) {
                        that.__account = $.base64.decode(res.Account);
                        $('[data-type=account]').val(that.__account);
                    }
                    if (res.Password) {
                        that.__password = $.base64.decode(res.Password);
                    }
                    $('[data-type=password]').val(that.__password);
                    if (res.Port) {
                        that.__port = $.base64.decode(res.Port);
                        $('[data-type=port]').val(that.__port);
                    }
                    if (res.Name) {
                        $('[data-type=Name]').val(res.Name);
                    }
                    $.ajax({
                        type: "get",
                        url: res.url + res.Path + "?date" + new Date().valueOf(),
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
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
        });
        $(".boxRight").on("click", "[data-type=deleteMap]", function(event) {
            topo.scene.background = null
        })
    },
    menuBar: function() {
        var menu = document.createElement('div');
        menu.className = "menuBar";
        var path = '../../../Content/topo/img/edit/'
        for (var a = 0; a < palette_MenuBar.length; a++) {
            var img = document.createElement("img");
            img.className = "menu " + palette_MenuBar[a].name;
            img.src = path + palette_MenuBar[a].url;
            img.title = palette_MenuBar[a].title;
            $(menu).append(img)
        }
        $('.boxCenter').append(menu)
    },
    createTopo: function() {
        var that = this;
        var canvas = document.createElement('canvas');
        var box = document.getElementsByClassName('boxCenter')[0];
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.className = "topo"
        box.appendChild(canvas);
        var stage = new JTopo.Stage(canvas);
        stage.frames = -24;
        stage.wheelZoom = 1.1;
        that.mode = 'normal';
        this.stage = stage;
        var scene = new JTopo.Scene(stage);
        scene.alpha = 1;
        scene.background = null;
        scene.backgroundColor = "0,0,0";
        this.scene = scene;
        scene.click(function(e) {
            if (that.isline && !that.islineNodeA && scene.selectedElements.length == 0) {
                that.islineNodeA = [parseInt(e.x), parseInt(e.y)]
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
                that.islineNodeA = null
            }
            if (scene.selectedElements.length == 0) {
                $('tbody tr').hide();
                $('.scene').show();
                $("[data-type=bgcolor]").attr('value', that.rgb2hex(scene.backgroundColor));
                $("[data-type=pid]").val(that.__pid);
                $("[data-type=orderNo]").val(that.__orderNo);
                $("[data-type=IP]").val(that.__IP);
                $("[data-type=port]").val(that.__port);
                $("[data-type=account]").val(that.__account);
                $("[data-type=password]").val(that.__password)
            }
        })
    },
    dragNode: function() {
        var that = this;
        $('body').on('mousedown', '.palette-item-img', function(e) {
            nodeList.selectCanvas = $(e.target).attr('data-canvas');
            return false
        });
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
                that.setNode(obj)
            }
            return false
        })
    },
    editRow: function() {
        var that = this;
        document.getElementsByClassName("menuBar")[0].addEventListener("click", function(e) {
            if (!e.target) {
                return
            }
            if (e.target.className.match('editSize')) {
                that.editSize()
            } else if (e.target.className.match('line')) {
                that.isline = true
            } else if (e.target.className.match('link')) {
                that.link()
            } else if (e.target.className.match('switch')) {
                that.mode = that.mode == "normal" ? "select" : "normal";
                that.stage.mode = that.mode
            } else if (e.target.className.match('monospace')) {
                that.setNodeContours("width")
            } else if (e.target.className.match('contour')) {
                that.setNodeContours("height")
            } else if (e.target.className.match('sameWidth')) {
                that.setNodeContours("widthheight")
            } else if (e.target.className.match('alignLeft')) {
                that.setNodeAlignment("left")
            } else if (e.target.className.match('alignRight')) {
                that.setNodeAlignment("right")
            } else if (e.target.className.match('alignTop')) {
                that.setNodeAlignment("top")
            } else if (e.target.className.match('alignDown')) {
                that.setNodeAlignment("bottom")
            } else if (e.target.className.match('horizontalSpacing')) {
                var distance = 10;
                that.setNodeSpacing('x', distance)
            } else if (e.target.className.match('verticalSpacing')) {
                var distance = 10;
                that.setNodeSpacing('y', distance)
            } else if (e.target.className.match('save')) {
                that.saveNodes()
            } else if (e.target.className.match('level')) {
                that.setAlign("width")
            } else if (e.target.className.match('vertical')) {
                that.setAlign("height")
            }
        })
    },
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
        var nodes = [];
        topo.scene.findElements(function(e) {
            nodes.push(e)
        });
        ojbect.nodes = nodes;
        var saveData = document.createElement("input");
        $(saveData).val(JSON.stringify(ojbect));
        $(saveData).css('display', "none");
        $("body").append(saveData);
        var IP = $.base64.encode(that.__IP);
        var port = $.base64.encode(that.__port);
        var account = $.base64.encode(that.__account);
        var password = $.base64.encode(that.__password);
        var val = `?pid=${that.__pid}&orderNo=${that.__orderNo}&type=1&IP=${IP || ""}&port=${port || ""}&account=${account || ""}&password=${password || ""}&Name=${$('input[data-type=Name]').val()}`;
        $.ajax({
            type: 'POST',
            url: "/PDRInfo/SaveAttribute" + val,
            data: {
                data: JSON.stringify(ojbect)
            },
            success: function(res) {
                if (res == '保存成功') {
                    var filename = that.__pid + '__' + that.__orderNo || 1 + '__' + new Date().toLocaleString();
                    that.saveAs(saveData, filename);
                    $(saveData).remove();
                    alert('保存成功')
                } else {
                    alert('保存失败')
                }
            },
        })
    },
    saveAs: function(obj, filename) {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/html;gb2312,' + obj.value);
        a.setAttribute('download', filename);
        a.setAttribute('target', '_blank');
        a.style.display = "none";
        obj.parentNode.appendChild(a);
        a.click()
    },

    editSize: function() {
        this.isedit = true
    },
    link: function() {},
    setAlign: function(type) {
        if (this.scene.selectedElements.length == 0) {
            return
        }
        var selectedElements = this.scene.selectedElements;
        for (var a = 0; a < selectedElements.length; a++) {
            if (type == "width") {
                selectedElements[a].setLocation(selectedElements[a].x, this.templateNode.y)
            } else {
                selectedElements[a].setLocation(this.templateNode.x, selectedElements[a].y)
            }
        }
    },
    setNodeContours: function(type) {
        if (this.scene.selectedElements.length == 0 || !this.templateNode) {
            return
        }
        var width = this.templateNode.width;
        var height = this.templateNode.height;
        var selectedElements = this.scene.selectedElements;
        for (var a = 0; a < selectedElements.length; a++) {
            if (type == "width") {
                selectedElements[a].width = width
            } else if (type == "height") {
                selectedElements[a].height = height
            } else if (type = "widthheight") {
                selectedElements[a].width = width;
                selectedElements[a].height = height
            }
        }
    },
    setNodeSpacing: function(type, distance) {
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
    setNode: function(obj) {
        var that = this;
        if (obj.__type == "text") {
            var node = new JTopo.TextNode();
            node.text = obj.text || "请输入内容";
            node.font = obj.font || '16px 微软雅黑';
            node.setLocation(obj.x, obj.y);
            node.zIndex = obj.zIndex || 4;
            node.__type = 'text';
            node.textPosition = 'Middle_Center';
            node.__statusvalue = obj.__statusvalue || 4;
            node.state4 = obj.state4 || "255,255,255";
            node.fontColor = node["state" + node.__statusvalue]
        } else if (obj.__type == "node") {
            var node = new JTopo.Node();
            node.percent = 0.8;
            node.beginDegree = 0;
            node.zIndex = obj.zIndex || 3;
            node.setBound(obj.x, obj.y, obj.width || 50, obj.height || 35);
            node.__type = 'node';
            node.__statusvalue = obj.__statusvalue || 1;
            node.state0 = obj.state0 || "#00ff00";
            node.state1 = obj.state1 || "#ff0000";
            node.state2 = obj.state2 || "#ffff00";
            node.color = node["state" + node.__statusvalue];
            node.paint = function(g) {
                eval(obj.canvas)
            };
            node.canvas = obj.canvas
        } else if (obj.__type == "line") {
            var node = new JTopo.Node();
            node.zIndex = obj.zIndex || 2;
            node.setBound(obj.x, obj.y, obj.width, obj.height);
            node.__type = 'line';
            node.__statusvalue = obj.__statusvalue || 1;
            node.state0 = obj.state0 || "193,193,193";
            node.state1 = obj.state1 || "255,0,0";
            node.fillColor = node["state" + node.__statusvalue]
        }
        if (obj.center) {
            node.setCenterLocation(obj.x, obj.y)
        }
        if (obj.dragable != undefined) {
            node.dragable = obj.dragable
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
                that.templateNode = null
            } else {
                that.templateNode = node;
                node.borderWidth = 4
            }
        });
        node.click(function() {
            that.nodeClick(node)
        });
        this.scene.add(node)
    },
    nodeClick: function(node) {
        if (this.isedit) {
            node.editAble = true;
            this.isedit = false
        }
        $('tbody tr').hide();
        if (node.__type == "text") {
            $('tr.text').show();
            $("[data-type=content]").val(node.text);
            $("[data-type=font]").val(node.font);
            $("[data-type=state4]")[0].value = this.rgb2hex(node.state4)
        } else if (node.__type == "node") {
            $('tr.node').show();
            $("[data-type=width]").val(node.getBound().width);
            $("[data-type=height]").val(node.getBound().height);
            $("[data-type=status0]").val(node.state0);
            $("[data-type=status1]").val(node.state1);
            $("[data-type=status2]").val(node.state2)
        } else if (node.__type == "line") {
            $('tr.line').show();
            $("[data-type=linecolor]").val(this.rgb2hex(node.fillColor));
            $("[data-type=linewidth]").val(node.width < node.height ? node.width : node.height);
            $("[data-type=linelength]").val(node.width > node.height ? node.width : node.height);
            $("[data-type=linkx]").val(node.x);
            $("[data-type=linky]").val(node.y);
            $("[data-type=state0]")[0].value = this.rgb2hex(node.state0);
            $("[data-type=state1]")[0].value = this.rgb2hex(node.state1)
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
        $("[data-type=CIDValue]").val(node._cid);
        if (node.image) {
            var path = node.image.currentSrc
        }
    },
    rgb2hex: function(rgb) {
        if (!rgb) {
            return
        }
        var reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
        var arr = reg.exec(rgb);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2)
        }
        var _hex = "#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
        return _hex.toUpperCase()
    },
};
var topo = new Topo();
topo.init();
var AttributesTab = function() {}
AttributesTab.prototype = {
    init: function() {
        this.createTable();
        this.setNodeStyle()
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
                var input = document.createElement("input")
            } else {
                var input = document.createElement("select")
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
            for (var a = 0; a < selectedElements.length; a++) {
                switch (key) {
                    case "content":
                        selectedElements[a].text = value;
                        break;
                    case "font":
                        selectedElements[a].font = value;
                        break;
                    case "linewidth":
                        if (selectedElements[a].height > selectedElements[a].width) {
                            selectedElements[a].width = parseInt(value) || 0
                        } else {
                            selectedElements[a].height = parseInt(value) || 0
                        }
                        break;
                    case "linelength":
                        if (selectedElements[a].height < selectedElements[a].width) {
                            selectedElements[a].width = parseInt(value) || 0
                        } else {
                            selectedElements[a].height = parseInt(value) || 0
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
                            node.fontColor = node["state" + value]
                        } else if (node.__type == "node") {
                            node.color = node["state" + value]
                        } else if (node.__type == "line") {
                            node.fillColor = node["state" + value]
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
                        topo.copyOffset = parseInt(value);
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
                        break
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
                        reader.onloadend = function(e) {
                            topo.scene.background = e.target.result
                        }
                    }
                    break;
                case "pid":
                    topo.__pid = value;
                    $.ajax({
                        type: "post",
                        url: "/PDRInfo/GetDeviceByPID",
                        data: {
                            pid: value,
                        },
                        success: function(res) {
                            var qwe = [];
                            for (var a = 0; a < res.length; a++) {
                                qwe.push('<option value="' + res[a].ID + '">' + res[a].Name + '</option>')
                            }
                            $("[data-type=DID]").html(qwe.join(''))
                        }
                    });
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
                    break
            }
        });
        $("select").on('change', function() {
            var key = $(this).attr("data-type");
            var value = $(this).val();
            var selectedElements = topo.scene.selectedElements;
            switch (key) {
                case "DID":
                    $.ajax({
                        type: "post",
                        url: "/PDRInfo/GetCirByDID",
                        data: {
                            pid: topo.__pid,
                            did: value,
                        },
                        success: function(res) {
                            var qwe = ['<option value="0 ">请选择</option>'];
                            for (var a = 0; a < res.length; a++) {
                                qwe.push('<option value="' + res[a].ID + '">' + res[a].Name + '</option>')
                            }
                            $("[data-type=CID]").html(qwe.join(''))
                        }
                    });
                    break;
                case "CID":
                    for (var a = 0; a < selectedElements.length; a++) {
                        selectedElements[a]._cid = value;
                        $("[data-type=CIDValue]").val(value)
                    }
                    break
            }
        })
    },
    textColor: function(node, type, value) {
        if (node.__statusvalue == type) {
            if (node.__type == 'text') {
                node.fontColor = value
            } else if (node.__type == 'node') {
                node.color = value
            } else if (node.__type == 'line') {
                node.fillColor = value
            }
        }
    },
    hexToRgba: function(hex, opacity) {
        return parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7))
    },
}
var attributesTab = new AttributesTab();
attributesTab.init();