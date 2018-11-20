! function(window) {
    function Element() {
        this.initialize = function() {
            this.elementType = "element", this.serializedProperties = ["elementType"], this.propertiesStack = [], this._id = "" + (new Date).getTime()
        }, this.distroy = function() {}, this.removeHandler = function() {}, this.attr = function(t, e) {
            if (null != t && null != e) this[t] = e;
            else if (null != t) return this[t];
            return this
        }, this.save = function() {
            var t = this,
                e = {};
            this.serializedProperties.forEach(function(i) {
                e[i] = t[i]
            }), this.propertiesStack.push(e)
        }, this.restore = function() {
            if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
                var t = this,
                    e = this.propertiesStack.pop();
                this.serializedProperties.forEach(function(i) {
                    t[i] = e[i]
                })
            }
        }, this.toJson = function() {
            var t = this,
                e = "{",
                i = this.serializedProperties.length;
            return this.serializedProperties.forEach(function(s, n) {
                var h = t[s];
                "string" == typeof h && (h = '"' + h + '"'), e += '"' + s + '":' + h, i > n + 1 && (e += ",")
            }), e += "}"
        }
    }
    CanvasRenderingContext2D.prototype.JTopoRoundRect = function(t, e, i, s, n) {
        "undefined" == typeof n && (n = 5), this.beginPath(), this.moveTo(t + n, e), this.lineTo(t + i - n, e), this.quadraticCurveTo(t + i, e, t + i, e + n), this.lineTo(t + i, e + s - n), this.quadraticCurveTo(t + i, e + s, t + i - n, e + s), this.lineTo(t + n, e + s), this.quadraticCurveTo(t, e + s, t, e + s - n), this.lineTo(t, e + n), this.quadraticCurveTo(t, e, t + n, e), this.closePath()
    }, CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function(t, e, i, s, n) {
        "undefined" == typeof n && (n = 5);
        var h = i - t,
            o = s - e,
            a = Math.floor(Math.sqrt(h * h + o * o)),
            r = 0 >= n ? a : a / n,
            l = o / a * n,
            c = h / a * n;
        this.beginPath();
        for (var u = 0; r > u; u++) u % 2 ? this.lineTo(t + u * c, e + u * l) : this.moveTo(t + u * c, e + u * l);
        this.stroke()
    }, JTopo = {
        version: "0.4.8_01",
        zIndex_Container: 1,
        zIndex_Link: 2,
        zIndex_Node: 3,
        SceneMode: {
            normal: "normal",
            drag: "drag",
            edit: "edit",
            select: "select"
        },
        MouseCursor: {
            normal: "default",
            pointer: "pointer",
            top_left: "nw-resize",
            top_center: "n-resize",
            top_right: "ne-resize",
            middle_left: "e-resize",
            middle_right: "e-resize",
            bottom_left: "ne-resize",
            bottom_center: "n-resize",
            bottom_right: "nw-resize",
            move: "move",
            open_hand: "url(./img/cur/openhand.cur) 8 8, default",
            closed_hand: "url(./img/cur/closedhand.cur) 8 8, default"
        },
        createStageFromJson: function(jsonStr, canvas) {
            eval("var jsonObj = " + jsonStr);
            var stage = new JTopo.Stage(canvas);
            for (var k in jsonObj) "childs" != k && (stage[k] = jsonObj[k]);
            var scenes = jsonObj.childs;
            return scenes.forEach(function(t) {
                var e = new JTopo.Scene(stage);
                for (var i in t) "childs" != i && (e[i] = t[i]), "background" == i && (e.background = t[i]);
                var s = t.childs;
                s.forEach(function(t) {
                    var i = null,
                        s = t.elementType;
                    "node" == s ? i = new JTopo.Node : "CircleNode" == s && (i = new JTopo.CircleNode);
                    for (var n in t) i[n] = t[n];
                    e.add(i)
                })
            }), stage
        }
    }, JTopo.Element = Element, window.JTopo = JTopo
}(window),
function(JTopo) {
    function MessageBus(t) {
        var e = this;
        this.name = t, this.messageMap = {}, this.messageCount = 0, this.subscribe = function(t, i) {
            var s = e.messageMap[t];
            null == s && (e.messageMap[t] = []), e.messageMap[t].push(i), e.messageCount++
        }, this.unsubscribe = function(t) {
            var i = e.messageMap[t];
            null != i && (e.messageMap[t] = null, delete e.messageMap[t], e.messageCount--)
        }, this.publish = function(t, i, s) {
            var n = e.messageMap[t];
            if (null != n)
                for (var h = 0; h < n.length; h++) s ? ! function(t, e) {
                    setTimeout(function() {
                        t(e)
                    }, 10)
                }(n[h], i) : n[h](i)
        }
    }

    function getDistance(t, e, i, s) {
        var n, h;
        return null == i && null == s ? (n = e.x - t.x, h = e.y - t.y) : (n = i - t, h = s - e), Math.sqrt(n * n + h * h)
    }

    function getElementsBound(t) {
        for (var e = {
                left: Number.MAX_VALUE,
                right: Number.MIN_VALUE,
                top: Number.MAX_VALUE,
                bottom: Number.MIN_VALUE
            }, i = 0; i < t.length; i++) {
            var s = t[i];
            s instanceof JTopo.Link || (e.left > s.x && (e.left = s.x, e.leftNode = s), e.right < s.x + s.width && (e.right = s.x + s.width, e.rightNode = s), e.top > s.y && (e.top = s.y, e.topNode = s), e.bottom < s.y + s.height && (e.bottom = s.y + s.height, e.bottomNode = s))
        }
        return e.width = e.right - e.left, e.height = e.bottom - e.top, e
    }

    function mouseCoords(t) {
        return t = cloneEvent(t), t.pageX || (t.pageX = t.clientX + document.body.scrollLeft - document.body.clientLeft, t.pageY = t.clientY + document.body.scrollTop - document.body.clientTop), t
    }

    function getEventPosition(t) {
        return t = mouseCoords(t)
    }

    function rotatePoint(t, e, i, s, n) {
        var h = i - t,
            o = s - e,
            a = Math.sqrt(h * h + o * o),
            r = Math.atan2(o, h) + n;
        return {
            x: t + Math.cos(r) * a,
            y: e + Math.sin(r) * a
        }
    }

    function rotatePoints(t, e, i) {
        for (var s = [], n = 0; n < e.length; n++) {
            var h = rotatePoint(t.x, t.y, e[n].x, e[n].y, i);
            s.push(h)
        }
        return s
    }

    function $foreach(t, e, i) {
        function s(n) {
            n != t.length && (e(t[n]), setTimeout(function() {
                s(++n)
            }, i))
        }
        if (0 != t.length) {
            var n = 0;
            s(n)
        }
    }

    function $for(t, e, i, s) {
        function n(t) {
            t != e && (i(e), setTimeout(function() {
                n(++t)
            }, s))
        }
        if (!(t > e)) {
            var h = 0;
            n(h)
        }
    }

    function cloneEvent(t) {
        var e = {};
        for (var i in t) "returnValue" != i && "keyLocation" != i && (e[i] = t[i]);
        return e
    }

    function clone(t) {
        var e = {};
        for (var i in t) e[i] = t[i];
        return e
    }

    function isPointInRect(t, e) {
        var i = e.x,
            s = e.y,
            n = e.width,
            h = e.height;
        return t.x > i && t.x < i + n && t.y > s && t.y < s + h
    }

    function isPointInLine(t, e, i) {
        var s = JTopo.util.getDistance(e, i),
            n = JTopo.util.getDistance(e, t),
            h = JTopo.util.getDistance(i, t),
            o = Math.abs(n + h - s) <= .5;
        return o
    }

    function removeFromArray(t, e) {
        for (var i = 0; i < t.length; i++) {
            var s = t[i];
            if (s === e) {
                t = t.del(i);
                break
            }
        }
        return t
    }

    function randomColor() {
        return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())
    }

    function isIntsect() {}

    function getProperties(t, e) {
        for (var i = "", s = 0; s < e.length; s++) {
            s > 0 && (i += ",");
            var n = t[e[s]];
            "string" == typeof n ? n = '"' + n + '"' : void 0 == n && (n = null), i += e[s] + ":" + n
        }
        return i
    }

    function loadStageFromJson(json, canvas) {
        var obj = eval(json),
            stage = new JTopo.Stage(canvas);
        for (var k in stageObj)
            if ("scenes" != k) stage[k] = obj[k];
            else
                for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
                    var sceneObj = scenes[i],
                        scene = new JTopo.Scene(stage);
                    for (var p in sceneObj)
                        if ("elements" != p) scene[p] = sceneObj[p];
                        else
                            for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
                                var elementObj = elements[m],
                                    type = elementObj.elementType,
                                    element;
                                "Node" == type && (element = new JTopo.Node);
                                for (var mk in elementObj) element[mk] = elementObj[mk];
                                nodeMap[element.text] = element, scene.add(element)
                            }
                }
        return console.log(stage), stage
    }

    function toJson(t) {
        var e = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(","),
            i = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(","),
            s = "{";
        s += "frames:" + t.frames, s += ", scenes:[";
        for (var n = 0; n < t.childs.length; n++) {
            var h = t.childs[n];
            s += "{", s += getProperties(h, e), s += ", elements:[";
            for (var o = 0; o < h.childs.length; o++) {
                var a = h.childs[o];
                o > 0 && (s += ","), s += "{", s += getProperties(a, i), s += "}"
            }
            s += "]}"
        }
        return s += "]", s += "}"
    }

    function changeColor(t, e, i) {
        var s = i.split(","),
            n = parseInt(s[0]),
            h = parseInt(s[1]),
            o = parseInt(s[2]),
            a = canvas.width = e.width,
            r = canvas.height = e.height;
        t.clearRect(0, 0, canvas.width, canvas.height), t.drawImage(e, 0, 0);
        for (var l = t.getImageData(0, 0, e.width, e.height), c = l.data, u = 0; a > u; u++)
            for (var d = 0; r > d; d++) {
                var f = 4 * (u + d * a);
                0 != c[f + 3] && (null != n && (c[f + 0] += n), null != h && (c[f + 1] += h), null != o && (c[f + 2] += o))
            }
        t.putImageData(l, 0, 0, 0, 0, e.width, e.height);
        var g = canvas.toDataURL();
        return g
    }

    function genImageAlarm(t, e) {
        var i = t.src + e;
        if (alarmImageCache[i]) return alarmImageCache[i];
        var s = new Image;
        return s.src = changeColor(graphics, t, e), alarmImageCache[i] = s, s
    }

    function getOffsetPosition(t) {
        if (!t) return {
            left: 0,
            top: 0
        };
        var e = 0,
            i = 0;
        if ("getBoundingClientRect" in document.documentElement) var s = t.getBoundingClientRect(),
            n = t.ownerDocument,
            h = n.body,
            o = n.documentElement,
            a = o.clientTop || h.clientTop || 0,
            r = o.clientLeft || h.clientLeft || 0,
            e = s.top + (self.pageYOffset || o && o.scrollTop || h.scrollTop) - a,
            i = s.left + (self.pageXOffset || o && o.scrollLeft || h.scrollLeft) - r;
        else
            do e += t.offsetTop || 0, i += t.offsetLeft || 0, t = t.offsetParent; while (t);
        return {
            left: i,
            top: e
        }
    }

    function lineF(t, e, i, s) {
        function n(t) {
            return t * h + o
        }
        var h = (s - e) / (i - t),
            o = e - t * h;
        return n.k = h, n.b = o, n.x1 = t, n.x2 = i, n.y1 = e, n.y2 = s, n
    }

    function inRange(t, e, i) {
        var s = Math.abs(e - i),
            n = Math.abs(e - t),
            h = Math.abs(i - t),
            o = Math.abs(s - (n + h));
        return 1e-6 > o
    }

    function isPointInLineSeg(t, e, i) {
        return inRange(t, i.x1, i.x2) && inRange(e, i.y1, i.y2)
    }

    function intersection(t, e) {
        var i, s;
        return t.k == e.k ? null : (1 / 0 == t.k || t.k == -1 / 0 ? (i = t.x1, s = e(t.x1)) : 1 / 0 == e.k || e.k == -1 / 0 ? (i = e.x1, s = t(e.x1)) : (i = (e.b - t.b) / (t.k - e.k), s = t(i)), 0 == isPointInLineSeg(i, s, t) ? null : 0 == isPointInLineSeg(i, s, e) ? null : {
            x: i,
            y: s
        })
    }

    function intersectionLineBound(t, e) {
        var i = JTopo.util.lineF(e.left, e.top, e.left, e.bottom),
            s = JTopo.util.intersection(t, i);
        return null == s && (i = JTopo.util.lineF(e.left, e.top, e.right, e.top), s = JTopo.util.intersection(t, i), null == s && (i = JTopo.util.lineF(e.right, e.top, e.right, e.bottom), s = JTopo.util.intersection(t, i), null == s && (i = JTopo.util.lineF(e.left, e.bottom, e.right, e.bottom), s = JTopo.util.intersection(t, i)))), s
    }
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(t) {
        setTimeout(t, 1e3 / 24)
    }, Array.prototype.del = function(t) {
        if ("number" != typeof t) {
            for (var e = 0; e < this.length; e++)
                if (this[e] === t) return this.slice(0, e).concat(this.slice(e + 1, this.length));
            return this
        }
        return 0 > t ? this : this.slice(0, t).concat(this.slice(t + 1, this.length))
    }, [].indexOf || (Array.prototype.indexOf = function(t) {
        for (var e = 0; e < this.length; e++)
            if (this[e] === t) return e;
        return -1
    }), window.console || (window.console = {
        log: function() {},
        info: function() {},
        debug: function() {},
        warn: function() {},
        error: function() {}
    });
    var canvas = document.createElement("canvas"),
        graphics = canvas.getContext("2d"),
        alarmImageCache = {};
    JTopo.util = {
        rotatePoint: rotatePoint,
        rotatePoints: rotatePoints,
        getDistance: getDistance,
        getEventPosition: getEventPosition,
        mouseCoords: mouseCoords,
        MessageBus: MessageBus,
        isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
        isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
        isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
        clone: clone,
        isPointInRect: isPointInRect,
        isPointInLine: isPointInLine,
        removeFromArray: removeFromArray,
        cloneEvent: cloneEvent,
        randomColor: randomColor,
        isIntsect: isIntsect,
        toJson: toJson,
        loadStageFromJson: loadStageFromJson,
        getElementsBound: getElementsBound,
        genImageAlarm: genImageAlarm,
        getOffsetPosition: getOffsetPosition,
        lineF: lineF,
        intersection: intersection,
        intersectionLineBound: intersectionLineBound
    }, window.$for = $for, window.$foreach = $foreach
}(JTopo),
function(t) {
    function e(t) {
        return {
            hgap: 16,
            visible: !1,
            exportCanvas: document.createElement("canvas"),
            getImage: function(e, i) {
                var s = t.getBound(),
                    n = 1,
                    h = 1;
                this.exportCanvas.width = t.canvas.width, this.exportCanvas.height = t.canvas.height, null != e && null != i ? (this.exportCanvas.width = e, this.exportCanvas.height = i, n = e / s.width, h = i / s.height) : (s.width > t.canvas.width && (this.exportCanvas.width = s.width), s.height > t.canvas.height && (this.exportCanvas.height = s.height));
                var o = this.exportCanvas.getContext("2d");
                return t.childs.length > 0 && (o.save(), o.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), t.childs.forEach(function(t) {
                    1 == t.visible && (t.save(), t.translateX = 0, t.translateY = 0, t.scaleX = 1, t.scaleY = 1, o.scale(n, h), s.left < 0 && (t.translateX = Math.abs(s.left)), s.top < 0 && (t.translateY = Math.abs(s.top)), t.paintAll = !0, t.repaint(o), t.paintAll = !1, t.restore())
                }), o.restore()), this.exportCanvas.toDataURL("image/png")
            },
            canvas: document.createElement("canvas"),
            update: function() {
                this.eagleImageDatas = this.getData(t)
            },
            setSize: function(t, e) {
                this.width = this.canvas.width = t, this.height = this.canvas.height = e
            },
            getData: function(e, i) {
                function s(t) {
                    var e = t.stage.canvas.width,
                        i = t.stage.canvas.height,
                        s = e / t.scaleX / 2,
                        n = i / t.scaleY / 2;
                    return {
                        translateX: t.translateX + s - s * t.scaleX,
                        translateY: t.translateY + n - n * t.scaleY
                    }
                }
                null != l && null != c ? this.setSize(e, i) : this.setSize(200, 160);
                var n = this.canvas.getContext("2d");
                if (t.childs.length > 0) {
                    n.save(), n.clearRect(0, 0, this.canvas.width, this.canvas.height), t.childs.forEach(function(t) {
                        1 == t.visible && (t.save(), t.centerAndZoom(null, null, n), t.repaint(n), t.restore())
                    });
                    var h = s(t.childs[0]),
                        o = h.translateX * (this.canvas.width / t.canvas.width) * t.childs[0].scaleX,
                        a = h.translateY * (this.canvas.height / t.canvas.height) * t.childs[0].scaleY,
                        r = t.getBound(),
                        l = t.canvas.width / t.childs[0].scaleX / r.width,
                        c = t.canvas.height / t.childs[0].scaleY / r.height;
                    l > 1 && (l = 1), c > 1 && (l = 1), o *= l, a *= c, r.left < 0 && (o -= Math.abs(r.left) * (this.width / r.width)), r.top < 0 && (a -= Math.abs(r.top) * (this.height / r.height)), n.save(), n.lineWidth = 1, n.strokeStyle = "rgba(255,0,0,1)", n.strokeRect(-o, -a, n.canvas.width * l, n.canvas.height * c), n.restore();
                    var u = null;
                    try {
                        u = n.getImageData(0, 0, n.canvas.width, n.canvas.height)
                    } catch (t) {}
                    return u
                }
                return null
            },
            paint: function() {
                if (null != this.eagleImageDatas) {
                    var e = t.graphics;
                    e.save(), e.fillStyle = "rgba(211,211,211,0.3)", e.fillRect(t.canvas.width - this.canvas.width - 2 * this.hgap, t.canvas.height - this.canvas.height - 1, t.canvas.width - this.canvas.width, this.canvas.height + 1), e.fill(), e.save(), e.lineWidth = 1, e.strokeStyle = "rgba(0,0,0,1)", e.rect(t.canvas.width - this.canvas.width - 2 * this.hgap, t.canvas.height - this.canvas.height - 1, t.canvas.width - this.canvas.width, this.canvas.height + 1), e.stroke(), e.restore(), e.putImageData(this.eagleImageDatas, t.canvas.width - this.canvas.width - this.hgap, t.canvas.height - this.canvas.height), e.restore()
                } else this.eagleImageDatas = this.getData(t)
            },
            eventHandler: function(t, e, i) {
                var s = e.x,
                    n = e.y;
                if (s > i.canvas.width - this.canvas.width && n > i.canvas.height - this.canvas.height && (s = e.x - this.canvas.width, n = e.y - this.canvas.height, "mousedown" == t && (this.lastTranslateX = i.childs[0].translateX, this.lastTranslateY = i.childs[0].translateY), "mousedrag" == t && i.childs.length > 0)) {
                    var h = e.dx,
                        o = e.dy,
                        a = i.getBound(),
                        r = this.canvas.width / i.childs[0].scaleX / a.width,
                        l = this.canvas.height / i.childs[0].scaleY / a.height;
                    i.childs[0].translateX = this.lastTranslateX - h / r, i.childs[0].translateY = this.lastTranslateY - o / l
                }
            }
        }
    }

    function i(i) {
        function s(e) {
            var i = t.util.getEventPosition(e),
                s = t.util.getOffsetPosition(f.canvas);
            return i.offsetLeft = i.pageX - s.left, i.offsetTop = i.pageY - s.top, i.x = i.offsetLeft, i.y = i.offsetTop, i.target = null, i
        }

        function n(t) {
            document.onselectstart = function() {
                return !1
            }, this.mouseOver = !0;
            var e = s(t);
            f.dispatchEventToScenes("mouseover", e), f.dispatchEvent("mouseover", e)
        }

        function h(t) {
            v = setTimeout(function() {
                g = !0
            }, 500), document.onselectstart = function() {
                return !0
            };
            var e = s(t);
            f.dispatchEventToScenes("mouseout", e), f.dispatchEvent("mouseout", e), f.needRepaint = 0 != f.animate
        }

        function o(t) {
            var e = s(t);
            f.mouseDown = !0, f.mouseDownX = e.x, f.mouseDownY = e.y, f.dispatchEventToScenes("mousedown", e), f.dispatchEvent("mousedown", e)
        }

        function a(t) {
            var e = s(t);
            f.dispatchEventToScenes("mouseup", e), f.dispatchEvent("mouseup", e), f.mouseDown = !1, f.needRepaint = 0 != f.animate
        }

        function r(t) {
            v && (window.clearTimeout(v), v = null), g = !1;
            var e = s(t);
            f.mouseDown ? 0 == t.button && (e.dx = e.x - f.mouseDownX, e.dy = e.y - f.mouseDownY, f.dispatchEventToScenes("mousedrag", e), f.dispatchEvent("mousedrag", e), 1 == f.eagleEye.visible && f.eagleEye.update()) : (f.dispatchEventToScenes("mousemove", e), f.dispatchEvent("mousemove", e))
        }

        function l(t) {
            var e = s(t);
            f.dispatchEventToScenes("click", e), f.dispatchEvent("click", e)
        }

        function c(t) {
            var e = s(t);
            f.dispatchEventToScenes("dbclick", e), f.dispatchEvent("dbclick", e)
        }

        function u(t) {
            var e = s(t);
            f.dispatchEventToScenes("mousewheel", e), f.dispatchEvent("mousewheel", e), null != f.wheelZoom && (t.preventDefault ? t.preventDefault() : (t = t || window.event, t.returnValue = !1), 1 == f.eagleEye.visible && f.eagleEye.update())
        }

        function d(e) {
            t.util.isIE || !window.addEventListener ? (e.onmouseout = h, e.onmouseover = n, e.onmousedown = o, e.onmouseup = a, e.onmousemove = r, e.onclick = l, e.ondblclick = c, e.onmousewheel = u, e.touchstart = o, e.touchmove = r, e.touchend = a) : (e.addEventListener("mouseout", h), e.addEventListener("mouseover", n), e.addEventListener("mousedown", o), e.addEventListener("mouseup", a), e.addEventListener("mousemove", r), e.addEventListener("click", l), e.addEventListener("dblclick", c), t.util.isFirefox ? e.addEventListener("DOMMouseScroll", u) : e.addEventListener("mousewheel", u)), window.addEventListener && (window.addEventListener("keydown", function(e) {
                f.dispatchEventToScenes("keydown", t.util.cloneEvent(e));
                var i = e.keyCode;
                (37 == i || 38 == i || 39 == i || 40 == i) && (e.preventDefault ? e.preventDefault() : (e = e || window.event, e.returnValue = !1))
            }, !0), window.addEventListener("keyup", function(e) {
                f.dispatchEventToScenes("keyup", t.util.cloneEvent(e));
                var i = e.keyCode;
                (37 == i || 38 == i || 39 == i || 40 == i) && (e.preventDefault ? e.preventDefault() : (e = e || window.event, e.returnValue = !1))
            }, !0))
        }
        t.stage = this;
        var f = this;
        this.initialize = function(i) {
            d(i), this.canvas = i, this.graphics = i.getContext("2d"), this.childs = [], this.frames = 24, this.messageBus = new t.util.MessageBus, this.eagleEye = e(this), this.wheelZoom = null, this.mouseDownX = 0, this.mouseDownY = 0, this.mouseDown = !1, this.mouseOver = !1, this.needRepaint = !0, this.serializedProperties = ["frames", "wheelZoom"]
        }, null != i && this.initialize(i);
        var g = !0,
            v = null;
        document.oncontextmenu = function() {
            return g
        }, this.dispatchEventToScenes = function(t, e) {
            if (0 != this.frames && (this.needRepaint = !0), 1 == this.eagleEye.visible && -1 != t.indexOf("mouse")) {
                var i = e.x,
                    s = e.y;
                if (i > this.width - this.eagleEye.width && s > this.height - this.eagleEye.height) return void this.eagleEye.eventHandler(t, e, this)
            }
            this.childs.forEach(function(i) {
                if (1 == i.visible) {
                    var s = i[t + "Handler"];
                    if (null == s) throw new Error("Function not found:" + t + "Handler");
                    s.call(i, e)
                }
            })
        }, this.add = function(t) {
            for (var e = 0; e < this.childs.length; e++)
                if (this.childs[e] === t) return;
            t.addTo(this), this.childs.push(t)
        }, this.remove = function(t) {
            if (null == t) throw new Error("Stage.remove鍑洪敊: 鍙傛暟涓簄ull!");
            for (var e = 0; e < this.childs.length; e++)
                if (this.childs[e] === t) return t.stage = null, this.childs = this.childs.del(e), this;
            return this
        }, this.clear = function() {
            this.childs = []
        }, this.addEventListener = function(t, e) {
            var i = this,
                s = function(t) {
                    e.call(i, t)
                };
            return this.messageBus.subscribe(t, s), this
        }, this.removeEventListener = function(t) {
            this.messageBus.unsubscribe(t)
        }, this.removeAllEventListener = function() {
            this.messageBus = new t.util.MessageBus
        }, this.dispatchEvent = function(t, e) {
            return this.messageBus.publish(t, e), this
        };
        var p = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
            m = this;
        p.forEach(function(t) {
                m[t] = function(e) {
                    null != e ? this.addEventListener(t, e) : this.dispatchEvent(t)
                }
            }), this.saveImageInfo = function(t, e) {
                var i = this.eagleEye.getImage(t, e),
                    s = window.open("about:blank");
                return s.document.write("<img src='" + i + "' alt='from canvas'/>"), this
            }, this.saveAsLocalImage = function(t, e) {
                var i = this.eagleEye.getImage(t, e);
                return i.replace("image/png", "image/octet-stream"), window.location.href = i, this
            }, this.paint = function() {
                null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function(t) {
                    1 == t.visible && t.repaint(f.graphics)
                }), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore())
            }, this.repaint = function() {
                0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)))
            }, this.zoom = function(t) {
                this.childs.forEach(function(e) {
                    0 != e.visible && e.zoom(t)
                })
            }, this.zoomOut = function(t) {
                this.childs.forEach(function(e) {
                    0 != e.visible && e.zoomOut(t)
                })
            }, this.zoomIn = function(t) {
                this.childs.forEach(function(e) {
                    0 != e.visible && e.zoomIn(t)
                })
            }, this.centerAndZoom = function() {
                this.childs.forEach(function(t) {
                    0 != t.visible && t.centerAndZoom()
                })
            }, this.setCenter = function(t, e) {
                var i = this;
                this.childs.forEach(function(s) {
                    var n = t - i.canvas.width / 2,
                        h = e - i.canvas.height / 2;
                    s.translateX = -n, s.translateY = -h
                })
            }, this.getBound = function() {
                var t = {
                    left: Number.MAX_VALUE,
                    right: Number.MIN_VALUE,
                    top: Number.MAX_VALUE,
                    bottom: Number.MIN_VALUE
                };
                return this.childs.forEach(function(e) {
                    var i = e.getElementsBound();
                    i.left < t.left && (t.left = i.left, t.leftNode = i.leftNode), i.top < t.top && (t.top = i.top, t.topNode = i.topNode), i.right > t.right && (t.right = i.right, t.rightNode = i.rightNode), i.bottom > t.bottom && (t.bottom = i.bottom, t.bottomNode = i.bottomNode)
                }), t.width = t.right - t.left, t.height = t.bottom - t.top, t
            }, this.toJson = function() {
                var e = this,
                    i = '{"version":"' + t.version + '",';
                return this.serializedProperties.length, this.serializedProperties.forEach(function(t) {
                    var s = e[t];
                    "string" == typeof s && (s = '"' + s + '"'), i += '"' + t + '":' + s + ","
                }), i += '"childs":[', this.childs.forEach(function(t) {
                    i += t.toJson()
                }), i += "]", i += "}"
            },
            function() {
                0 == f.frames ? setTimeout(arguments.callee, 100) : f.frames < 0 ? (f.repaint(), setTimeout(arguments.callee, 1e3 / -f.frames)) : (f.repaint(), setTimeout(arguments.callee, 1e3 / f.frames))
            }(), setTimeout(function() {
                f.mousewheel(function(t) {
                    var e = null == t.wheelDelta ? t.detail : t.wheelDelta;
                    null != this.wheelZoom && (e > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom))
                }), f.paint()
                console.log(112)
            }, 300), setTimeout(function() {
                f.paint()
            }, 1e3), setTimeout(function() {
                f.paint()
            }, 3e3)
    }
    i.prototype = {
        get width() {
            return this.canvas.width
        },
        get height() {
            return this.canvas.height
        },
        set cursor(t) {
            this.canvas.style.cursor = t
        },
        get cursor() {
            return this.canvas.style.cursor
        },
        set mode(t) {
            this.childs.forEach(function(e) {
                e.mode = t
            })
        }
    }, t.Stage = i
}(JTopo),
function(t) {
    function e(i) {
        function s(t, e, i, s) {
            return function(n) {
                n.beginPath(), n.strokeStyle = "rgba(0,0,236,0.5)", n.fillStyle = "rgba(0,0,236,0.1)", n.rect(t, e, i, s), n.fill(), n.stroke(), n.closePath()
            }
        }
        var n = this;
        this.initialize = function() {
            e.prototype.initialize.apply(this, arguments), this.messageBus = new t.util.MessageBus, this.elementType = "scene", this.childs = [], this.zIndexMap = {}, this.zIndexArray = [], this.backgroundColor = "255,255,255", this.visible = !0, this.alpha = 0, this.scaleX = 1, this.scaleY = 1, this.mode = t.SceneMode.normal, this.translate = !0, this.translateX = 0, this.translateY = 0, this.lastTranslateX = 0, this.lastTranslateY = 0, this.mouseDown = !1, this.mouseDownX = null, this.mouseDownY = null, this.mouseDownEvent = null, this.areaSelect = !0, this.operations = [], this.selectedElements = [], this.paintAll = !1;
            var i = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
            this.serializedProperties = this.serializedProperties.concat(i)
        }, this.initialize(), this.setBackground = function(t) {
            this.background = t
        }, this.addTo = function(t) {
            this.stage !== t && null != t && (this.stage = t)
        }, null != i && (i.add(this), this.addTo(i)), this.show = function() {
            this.visible = !0
        }, this.hide = function() {
            this.visible = !1
        }, this.paint = function(t) {
            if (0 != this.visible && null != this.stage) {
                if (t.save(), this.paintBackgroud(t), t.restore(), t.save(), t.scale(this.scaleX, this.scaleY), 1 == this.translate) {
                    var e = this.getOffsetTranslate(t);
                    t.translate(e.translateX, e.translateY)
                }
                this.paintChilds(t), t.restore(), t.save(), this.paintOperations(t, this.operations), t.restore()
            }
        }, this.repaint = function(t) {
            0 != this.visible && this.paint(t)
        }, this.paintBackgroud = function(t) {
            null != this.background ? t.drawImage(this.background, 0, 0, t.canvas.width, t.canvas.height) : (t.beginPath(), t.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")", t.fillRect(0, 0, t.canvas.width, t.canvas.height), t.closePath())
        }, this.getDisplayedElements = function() {
            for (var t = [], e = 0; e < this.zIndexArray.length; e++)
                for (var i = this.zIndexArray[e], s = this.zIndexMap[i], n = 0; n < s.length; n++) {
                    var h = s[n];
                    this.isVisiable(h) && t.push(h)
                }
            return t
        }, this.getDisplayedNodes = function() {
            for (var e = [], i = 0; i < this.childs.length; i++) {
                var s = this.childs[i];
                s instanceof t.Node && this.isVisiable(s) && e.push(s)
            }
            return e
        }, this.paintChilds = function(e) {
            for (var i = 0; i < this.zIndexArray.length; i++)
                for (var s = this.zIndexArray[i], n = this.zIndexMap[s], h = 0; h < n.length; h++) {
                    var o = n[h];
                    if (1 == this.paintAll || this.isVisiable(o)) {
                        if (e.save(), 1 == o.transformAble) {
                            var a = o.getCenterLocation();
                            e.translate(a.x, a.y), o.rotate && e.rotate(o.rotate), o.scaleX && o.scaleY ? e.scale(o.scaleX, o.scaleY) : o.scaleX ? e.scale(o.scaleX, 1) : o.scaleY && e.scale(1, o.scaleY)
                        }
                        1 == o.shadow && (e.shadowBlur = o.shadowBlur, e.shadowColor = o.shadowColor, e.shadowOffsetX = o.shadowOffsetX, e.shadowOffsetY = o.shadowOffsetY), o instanceof t.InteractiveElement && (o.selected && 1 == o.showSelected && o.paintSelected(e), 1 == o.isMouseOver && o.paintMouseover(e)), o.paint(e), e.restore()
                    }
                }
        }, this.getOffsetTranslate = function(t) {
            var e = this.stage.canvas.width,
                i = this.stage.canvas.height;
            null != t && "move" != t && (e = t.canvas.width, i = t.canvas.height);
            var s = e / this.scaleX / 2,
                n = i / this.scaleY / 2,
                h = {
                    translateX: this.translateX + (s - s * this.scaleX),
                    translateY: this.translateY + (n - n * this.scaleY)
                };
            return h
        }, this.isVisiable = function(e) {
            if (1 != e.visible) return !1;
            if (e instanceof t.Link) return !0;
            var i = this.getOffsetTranslate(),
                s = e.x + i.translateX,
                n = e.y + i.translateY;
            s *= this.scaleX, n *= this.scaleY;
            var h = s + e.width * this.scaleX,
                o = n + e.height * this.scaleY;
            return !(s > this.stage.canvas.width || n > this.stage.canvas.height || 0 > h || 0 > o)
        }, this.paintOperations = function(t, e) {
            for (var i = 0; i < e.length; i++) e[i](t)
        }, this.findElements = function(t) {
            for (var e = [], i = 0; i < this.childs.length; i++) 1 == t(this.childs[i]) && e.push(this.childs[i]);
            return e
        }, this.getElementsByClass = function(t) {
            return this.findElements(function(e) {
                return e instanceof t
            })
        }, this.addOperation = function(t) {
            return this.operations.push(t), this
        }, this.clearOperations = function() {
            return this.operations = [], this
        }, this.getElementByXY = function(e, i) {
            for (var s = null, n = this.zIndexArray.length - 1; n >= 0; n--)
                for (var h = this.zIndexArray[n], o = this.zIndexMap[h], a = o.length - 1; a >= 0; a--) {
                    var r = o[a];
                    if (r instanceof t.InteractiveElement && this.isVisiable(r) && r.isInBound(e, i)) return s = r
                }
            return s
        }, this.add = function(t) {
            this.childs.push(t), null == this.zIndexMap[t.zIndex] && (this.zIndexMap[t.zIndex] = [], this.zIndexArray.push(t.zIndex), this.zIndexArray.sort(function(t, e) {
                return t - e
            })), this.zIndexMap["" + t.zIndex].push(t)
        }, this.remove = function(e) {
            this.childs = t.util.removeFromArray(this.childs, e);
            var i = this.zIndexMap[e.zIndex];
            i && (this.zIndexMap[e.zIndex] = t.util.removeFromArray(i, e)), e.removeHandler(this)
        }, this.clear = function() {
            var t = this;
            this.childs.forEach(function(e) {
                e.removeHandler(t)
            }), this.childs = [], this.operations = [], this.zIndexArray = [], this.zIndexMap = {}
        }, this.addToSelected = function(t) {
            this.selectedElements.push(t)
        }, this.cancleAllSelected = function(t) {
            for (var e = 0; e < this.selectedElements.length; e++) this.selectedElements[e].unselectedHandler(t);
            this.selectedElements = []
        }, this.notInSelectedNodes = function(t) {
            for (var e = 0; e < this.selectedElements.length; e++)
                if (t === this.selectedElements[e]) return !1;
            return !0
        }, this.removeFromSelected = function(t) {
            for (var e = 0; e < this.selectedElements.length; e++) {
                var i = this.selectedElements[e];
                t === i && (this.selectedElements = this.selectedElements.del(e))
            }
        }, this.toSceneEvent = function(e) {
            var i = t.util.clone(e);
            if (i.x /= this.scaleX, i.y /= this.scaleY, 1 == this.translate) {
                var s = this.getOffsetTranslate();
                i.x -= s.translateX, i.y -= s.translateY
            }
            return null != i.dx && (i.dx /= this.scaleX, i.dy /= this.scaleY), null != this.currentElement && (i.target = this.currentElement), i.scene = this, i
        }, this.selectElement = function(t) {
            var e = n.getElementByXY(t.x, t.y);
            if (null != e)
                if (t.target = e, e.mousedownHander(t), e.selectedHandler(t), n.notInSelectedNodes(e)) t.ctrlKey || n.cancleAllSelected(), n.addToSelected(e);
                else {
                    1 == t.ctrlKey && (e.unselectedHandler(), this.removeFromSelected(e));
                    for (var i = 0; i < this.selectedElements.length; i++) {
                        var s = this.selectedElements[i];
                        s.selectedHandler(t)
                    }
                }
            else t.ctrlKey || n.cancleAllSelected();
            this.currentElement = e
        }, this.mousedownHandler = function(e) {
            var i = this.toSceneEvent(e);
            if (this.mouseDown = !0, this.mouseDownX = i.x, this.mouseDownY = i.y, this.mouseDownEvent = i, this.mode == t.SceneMode.normal) this.selectElement(i), (null == this.currentElement || this.currentElement instanceof t.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
            else {
                if (this.mode == t.SceneMode.drag && 1 == this.translate) return this.lastTranslateX = this.translateX, void(this.lastTranslateY = this.translateY);
                this.mode == t.SceneMode.select ? this.selectElement(i) : this.mode == t.SceneMode.edit && (this.selectElement(i), (null == this.currentElement || this.currentElement instanceof t.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
            }
            n.dispatchEvent("mousedown", i)
        }, this.mouseupHandler = function(e) {
            this.stage.cursor != t.MouseCursor.normal && (this.stage.cursor = t.MouseCursor.normal), n.clearOperations();
            var i = this.toSceneEvent(e);
            null != this.currentElement && (i.target = n.currentElement, this.currentElement.mouseupHandler(i)), this.dispatchEvent("mouseup", i), this.mouseDown = !1
        }, this.dragElements = function(e) {
            if (null != this.currentElement && 1 == this.currentElement.dragable)
                for (var i = 0; i < this.selectedElements.length; i++) {
                    var s = this.selectedElements[i];
                    if (0 != s.dragable) {
                        var n = t.util.clone(e);
                        n.target = s, s.mousedragHandler(n)
                    }
                }
        }, this.mousedragHandler = function(e) {
            var i = this.toSceneEvent(e);
            this.mode == t.SceneMode.normal ? null == this.currentElement || this.currentElement instanceof t.Link ? 1 == this.translate && (this.stage.cursor = t.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + i.dx, this.translateY = this.lastTranslateY + i.dy) : this.dragElements(i) : this.mode == t.SceneMode.drag ? 1 == this.translate && (this.stage.cursor = t.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + i.dx, this.translateY = this.lastTranslateY + i.dy) : this.mode == t.SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(i) : 1 == this.areaSelect && this.areaSelectHandle(i) : this.mode == t.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof t.Link ? 1 == this.translate && (this.stage.cursor = t.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + i.dx, this.translateY = this.lastTranslateY + i.dy) : this.dragElements(i)), this.dispatchEvent("mousedrag", i)
        }, this.areaSelectHandle = function(t) {
            var e = t.offsetLeft,
                i = t.offsetTop,
                h = this.mouseDownEvent.offsetLeft,
                o = this.mouseDownEvent.offsetTop,
                a = e >= h ? h : e,
                r = i >= o ? o : i,
                l = Math.abs(t.dx) * this.scaleX,
                c = Math.abs(t.dy) * this.scaleY,
                u = new s(a, r, l, c);
            n.clearOperations().addOperation(u), e = t.x, i = t.y, h = this.mouseDownEvent.x, o = this.mouseDownEvent.y, a = e >= h ? h : e, r = i >= o ? o : i, l = Math.abs(t.dx), c = Math.abs(t.dy);
            for (var d = a + l, f = r + c, g = 0; g < n.childs.length; g++) {
                var v = n.childs[g];
                v.x > a && v.x + v.width < d && v.y > r && v.y + v.height < f && n.notInSelectedNodes(v) && (v.selectedHandler(t), n.addToSelected(v))
            }
        }, this.mousemoveHandler = function(e) {
            this.mousecoord = {
                x: e.x,
                y: e.y
            };
            var i = this.toSceneEvent(e);
            if (this.mode == t.SceneMode.drag) return void(this.stage.cursor = t.MouseCursor.open_hand);
            this.mode == t.SceneMode.normal ? this.stage.cursor = t.MouseCursor.normal : this.mode == t.SceneMode.select && (this.stage.cursor = t.MouseCursor.normal);
            var s = n.getElementByXY(i.x, i.y);
            null != s ? (n.mouseOverelement && n.mouseOverelement !== s && (i.target = s, n.mouseOverelement.mouseoutHandler(i)), n.mouseOverelement = s, 0 == s.isMouseOver ? (i.target = s, s.mouseoverHandler(i), n.dispatchEvent("mouseover", i)) : (i.target = s, s.mousemoveHandler(i), n.dispatchEvent("mousemove", i))) : n.mouseOverelement ? (i.target = s, n.mouseOverelement.mouseoutHandler(i), n.mouseOverelement = null, n.dispatchEvent("mouseout", i)) : (i.target = null, n.dispatchEvent("mousemove", i))
        }, this.mouseoverHandler = function(t) {
            var e = this.toSceneEvent(t);
            this.dispatchEvent("mouseover", e)
        }, this.mouseoutHandler = function(t) {
            var e = this.toSceneEvent(t);
            this.dispatchEvent("mouseout", e)
        }, this.clickHandler = function(t) {
            var e = this.toSceneEvent(t);
            this.currentElement && (e.target = this.currentElement, this.currentElement.clickHandler(e)), this.dispatchEvent("click", e)
        }, this.dbclickHandler = function(t) {
            var e = this.toSceneEvent(t);
            this.currentElement ? (e.target = this.currentElement, this.currentElement.dbclickHandler(e)) : n.cancleAllSelected(), this.dispatchEvent("dbclick", e)
        }, this.mousewheelHandler = function(t) {
            var e = this.toSceneEvent(t);
            this.dispatchEvent("mousewheel", e)
        }, this.touchstart = this.mousedownHander, this.touchmove = this.mousedragHandler, this.touchend = this.mousedownHander, this.keydownHandler = function(t) {
            this.dispatchEvent("keydown", t)
        }, this.keyupHandler = function(t) {
            this.dispatchEvent("keyup", t)
        }, this.addEventListener = function(t, e) {
            var i = this,
                s = function(t) {
                    e.call(i, t)
                };
            return this.messageBus.subscribe(t, s), this
        }, this.removeEventListener = function(t) {
            this.messageBus.unsubscribe(t)
        }, this.removeAllEventListener = function() {
            this.messageBus = new t.util.MessageBus
        }, this.dispatchEvent = function(t, e) {
            return this.messageBus.publish(t, e), this
        };
        var h = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
            o = this;
        return h.forEach(function(t) {
            o[t] = function(e) {
                null != e ? this.addEventListener(t, e) : this.dispatchEvent(t)
            }
        }), this.zoom = function(t, e) {
            null != t && 0 != t && (this.scaleX = t), null != e && 0 != e && (this.scaleY = e)
        }, this.zoomOut = function(t) {
            0 != t && (null == t && (t = .8), this.scaleX /= t, this.scaleY /= t)
        }, this.zoomIn = function(t) {
            0 != t && (null == t && (t = .8), this.scaleX *= t, this.scaleY *= t)
        }, this.getBound = function() {
            return {
                left: 0,
                top: 0,
                right: this.stage.canvas.width,
                bottom: this.stage.canvas.height,
                width: this.stage.canvas.width,
                height: this.stage.canvas.height
            }
        }, this.getElementsBound = function() {
            return t.util.getElementsBound(this.childs)
        }, this.translateToCenter = function(t) {
            var e = this.getElementsBound(),
                i = this.stage.canvas.width / 2 - (e.left + e.right) / 2,
                s = this.stage.canvas.height / 2 - (e.top + e.bottom) / 2;
            t && (i = t.canvas.width / 2 - (e.left + e.right) / 2, s = t.canvas.height / 2 - (e.top + e.bottom) / 2), this.translateX = i, this.translateY = s
        }, this.setCenter = function(t, e) {
            var i = t - this.stage.canvas.width / 2,
                s = e - this.stage.canvas.height / 2;
            this.translateX = -i, this.translateY = -s
        }, this.centerAndZoom = function(t, e, i) {
            if (this.translateToCenter(i), null == t || null == e) {
                var s = this.getElementsBound(),
                    n = s.right - s.left,
                    h = s.bottom - s.top,
                    o = this.stage.canvas.width / n,
                    a = this.stage.canvas.height / h;
                i && (o = i.canvas.width / n, a = i.canvas.height / h);
                var r = Math.min(o, a);
                if (r > 1) return;
                this.zoom(r, r)
            }
            this.zoom(t, e)
        }, this.getCenterLocation = function() {
            return {
                x: n.stage.canvas.width / 2,
                y: n.stage.canvas.height / 2
            }
        }, this.doLayout = function(t) {
            t && t(this, this.childs)
        }, this.toJson = function() {
            var t = this,
                e = "{";
            this.serializedProperties.length, this.serializedProperties.forEach(function(i) {
                var s = t[i];
                "background" == i && (s = t._background.src), "string" == typeof s && (s = '"' + s + '"'), e += '"' + i + '":' + s + ","
            }), e += '"childs":[';
            var i = this.childs.length;
            return this.childs.forEach(function(t, s) {
                e += t.toJson(), i > s + 1 && (e += ",")
            }), e += "]", e += "}"
        }, n
    }
    e.prototype = new t.Element;
    var i = {};
    Object.defineProperties(e.prototype, {
        background: {
            get: function() {
                return this._background
            },
            set: function(t) {
                if ("string" == typeof t) {
                    var e = i[t];
                    null == e && (e = new Image, e.src = t, e.onload = function() {
                        i[t] = e
                    }), this._background = e
                } else this._background = t
            }
        }
    }), t.Scene = e
}(JTopo),
function(t) {
    function e() {
        this.initialize = function() {
            e.prototype.initialize.apply(this, arguments), this.elementType = "displayElement", this.x = 0, this.y = 0, this.width = 32, this.height = 32, this.visible = !0, this.alpha = 1, this.rotate = 0, this.scaleX = 1, this.scaleY = 1, this.strokeColor = "22,124,255", this.borderColor = "22,124,255", this.fillColor = "22,124,255", this.shadow = !1, this.shadowBlur = 5, this.shadowColor = "rgba(0,0,0,0.5)", this.shadowOffsetX = 3, this.shadowOffsetY = 6, this.transformAble = !1, this.zIndex = 0;
            var t = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
            this.serializedProperties = this.serializedProperties.concat(t)
        }, this.initialize(), this.paint = function(t) {
            t.beginPath(), t.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", t.rect(-this.width / 2, -this.height / 2, this.width, this.height), t.fill(), t.stroke(), t.closePath()
        }, this.getLocation = function() {
            return {
                x: this.x,
                y: this.y
            }
        }, this.setLocation = function(t, e) {
            return this.x = t, this.y = e, this
        }, this.getCenterLocation = function() {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            }
        }, this.setCenterLocation = function(t, e) {
            return this.x = t - this.width / 2, this.y = e - this.height / 2, this
        }, this.getSize = function() {
            return {
                width: this.width,
                height: this.heith
            }
        }, this.setSize = function(t, e) {
            return this.width = t, this.height = e, this
        }, this.getBound = function() {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width,
                bottom: this.y + this.height,
                width: this.width,
                height: this.height
            }
        }, this.setBound = function(t, e, i, s) {
            return this.setLocation(t, e), this.setSize(i, s), this
        }, this.getDisplayBound = function() {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width * this.scaleX,
                bottom: this.y + this.height * this.scaleY
            }
        }, this.getDisplaySize = function() {
            return {
                width: this.width * this.scaleX,
                height: this.height * this.scaleY
            }
        }, this.getPosition = function(t) {
            var e, i = this.getBound();
            return "Top_Left" == t ? e = {
                x: i.left,
                y: i.top
            } : "Top_Center" == t ? e = {
                x: this.cx,
                y: i.top
            } : "Top_Right" == t ? e = {
                x: i.right,
                y: i.top
            } : "Middle_Left" == t ? e = {
                x: i.left,
                y: this.cy
            } : "Middle_Center" == t ? e = {
                x: this.cx,
                y: this.cy
            } : "Middle_Right" == t ? e = {
                x: i.right,
                y: this.cy
            } : "Bottom_Left" == t ? e = {
                x: i.left,
                y: i.bottom
            } : "Bottom_Center" == t ? e = {
                x: this.cx,
                y: i.bottom
            } : "Bottom_Right" == t && (e = {
                x: i.right,
                y: i.bottom
            }), e
        }
    }

    function i() {
        this.initialize = function() {
            i.prototype.initialize.apply(this, arguments), this.elementType = "interactiveElement", this.dragable = !1, this.selected = !1, this.showSelected = !0, this.selectedLocation = null, this.isMouseOver = !1;
            var t = "dragable,selected,showSelected,isMouseOver".split(",");
            this.serializedProperties = this.serializedProperties.concat(t)
        }, this.initialize(), this.paintSelected = function(t) {
            0 != this.showSelected && (t.save(), t.beginPath(), t.strokeStyle = "rgba(168,202,255, 0.9)", t.fillStyle = "rgba(168,202,236,0.7)", t.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), t.fill(), t.stroke(), t.closePath(), t.restore())
        }, this.paintMouseover = function(t) {
            return this.paintSelected(t)
        }, this.isInBound = function(t, e) {
            return t > this.x && t < this.x + this.width * Math.abs(this.scaleX) && e > this.y && e < this.y + this.height * Math.abs(this.scaleY)
        }, this.selectedHandler = function() {
            this.selected = !0, this.selectedLocation = {
                x: this.x,
                y: this.y
            }
        }, this.unselectedHandler = function() {
            this.selected = !1, this.selectedLocation = null
        }, this.dbclickHandler = function(t) {
            this.dispatchEvent("dbclick", t)
        }, this.clickHandler = function(t) {
            this.dispatchEvent("click", t)
        }, this.mousedownHander = function(t) {
            this.dispatchEvent("mousedown", t)
        }, this.mouseupHandler = function(t) {
            this.dispatchEvent("mouseup", t)
        }, this.mouseoverHandler = function(t) {
            this.isMouseOver = !0, this.dispatchEvent("mouseover", t)
        }, this.mousemoveHandler = function(t) {
            this.dispatchEvent("mousemove", t)
        }, this.mouseoutHandler = function(t) {
            this.isMouseOver = !1, this.dispatchEvent("mouseout", t)
        }, this.mousedragHandler = function(t) {
            var e = this.selectedLocation.x + t.dx,
                i = this.selectedLocation.y + t.dy;
            this.setLocation(e, i), this.dispatchEvent("mousedrag", t)
        }, this.addEventListener = function(e, i) {
            var s = this,
                n = function(t) {
                    i.call(s, t)
                };
            return this.messageBus || (this.messageBus = new t.util.MessageBus), this.messageBus.subscribe(e, n), this
        }, this.dispatchEvent = function(t, e) {
            return this.messageBus ? (this.messageBus.publish(t, e), this) : null
        }, this.removeEventListener = function(t) {
            this.messageBus.unsubscribe(t)
        }, this.removeAllEventListener = function() {
            this.messageBus = new t.util.MessageBus
        };
        var e = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(","),
            s = this;
        e.forEach(function(t) {
            s[t] = function(e) {
                null != e ? this.addEventListener(t, e) : this.dispatchEvent(t)
            }
        })
    }

    function s() {
        this.initialize = function() {
            s.prototype.initialize.apply(this, arguments), this.editAble = !1, this.selectedPoint = null
        }, this.getCtrlPosition = function(t) {
            var e = 5,
                i = 5,
                s = this.getPosition(t);
            return {
                left: s.x - e,
                top: s.y - i,
                right: s.x + e,
                bottom: s.y + i
            }
        }, this.selectedHandler = function(e) {
            s.prototype.selectedHandler.apply(this, arguments), this.selectedSize = {
                width: this.width,
                height: this.height
            }, e.scene.mode == t.SceneMode.edit && (this.editAble = !0)
        }, this.unselectedHandler = function() {
            s.prototype.unselectedHandler.apply(this, arguments), this.selectedSize = null, this.editAble = !1
        };
        var e = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
        this.paintCtrl = function(t) {
            if (0 != this.editAble) {
                t.save();
                for (var i = 0; i < e.length; i++) {
                    var s = this.getCtrlPosition(e[i]);
                    s.left -= this.cx, s.right -= this.cx, s.top -= this.cy, s.bottom -= this.cy;
                    var n = s.right - s.left,
                        h = s.bottom - s.top;
                    t.beginPath(), t.strokeStyle = "rgba(0,0,0,0.8)", t.rect(s.left, s.top, n, h), t.stroke(), t.closePath(), t.beginPath(), t.strokeStyle = "rgba(255,255,255,0.3)", t.rect(s.left + 1, s.top + 1, n - 2, h - 2), t.stroke(), t.closePath()
                }
                t.restore()
            }
        }, this.isInBound = function(t, i) {
            if (this.selectedPoint = null, 1 == this.editAble)
                for (var n = 0; n < e.length; n++) {
                    var h = this.getCtrlPosition(e[n]);
                    if (t > h.left && t < h.right && i > h.top && i < h.bottom) return this.selectedPoint = e[n], !0
                }
            return s.prototype.isInBound.apply(this, arguments)
        }, this.mousedragHandler = function(t) {
            if (null == this.selectedPoint) {
                var e = this.selectedLocation.x + t.dx,
                    i = this.selectedLocation.y + t.dy;
                this.setLocation(e, i), this.dispatchEvent("mousedrag", t)
            } else {
                if ("Top_Left" == this.selectedPoint) {
                    var s = this.selectedSize.width - t.dx,
                        n = this.selectedSize.height - t.dy,
                        e = this.selectedLocation.x + t.dx,
                        i = this.selectedLocation.y + t.dy;
                    e < this.x + this.width && (this.x = e, this.width = s), i < this.y + this.height && (this.y = i, this.height = n)
                } else if ("Top_Center" == this.selectedPoint) {
                    var n = this.selectedSize.height - t.dy,
                        i = this.selectedLocation.y + t.dy;
                    i < this.y + this.height && (this.y = i, this.height = n)
                } else if ("Top_Right" == this.selectedPoint) {
                    var s = this.selectedSize.width + t.dx,
                        i = this.selectedLocation.y + t.dy;
                    i < this.y + this.height && (this.y = i, this.height = this.selectedSize.height - t.dy), s > 1 && (this.width = s)
                } else if ("Middle_Left" == this.selectedPoint) {
                    var s = this.selectedSize.width - t.dx,
                        e = this.selectedLocation.x + t.dx;
                    e < this.x + this.width && (this.x = e), s > 1 && (this.width = s)
                } else if ("Middle_Right" == this.selectedPoint) {
                    var s = this.selectedSize.width + t.dx;
                    s > 1 && (this.width = s)
                } else if ("Bottom_Left" == this.selectedPoint) {
                    var s = this.selectedSize.width - t.dx,
                        e = this.selectedLocation.x + t.dx;
                    s > 1 && (this.x = e, this.width = s);
                    var n = this.selectedSize.height + t.dy;
                    n > 1 && (this.height = n)
                } else if ("Bottom_Center" == this.selectedPoint) {
                    var n = this.selectedSize.height + t.dy;
                    n > 1 && (this.height = n)
                } else if ("Bottom_Right" == this.selectedPoint) {
                    var s = this.selectedSize.width + t.dx;
                    s > 1 && (this.width = s);
                    var n = this.selectedSize.height + t.dy;
                    n > 1 && (this.height = n)
                }
                this.dispatchEvent("resize", t)
            }
        }
    }
    e.prototype = new t.Element, Object.defineProperties(e.prototype, {
        cx: {
            get: function() {
                return this.x + this.width / 2
            },
            set: function(t) {
                this.x = t - this.width / 2
            }
        },
        cy: {
            get: function() {
                return this.y + this.height / 2
            },
            set: function(t) {
                this.y = t - this.height / 2
            }
        }
    }), i.prototype = new e, s.prototype = new i, t.DisplayElement = e, t.InteractiveElement = i, t.EditableElement = s
}(JTopo),
function(t) {
    function e(i) {
        this.initialize = function(i) {
            e.prototype.initialize.apply(this, arguments), this.elementType = "node", this.zIndex = t.zIndex_Node, this.text = i, this.font = "12px Consolas", this.fontColor = "255,255,255", this.borderWidth = 0, this.borderColor = "255,255,255", this.borderRadius = null, this.dragable = !0, this.textPosition = "Bottom_Center", this.textOffsetX = 0, this.textOffsetY = 0, this.transformAble = !0, this.inLinks = null, this.outLinks = null;
            var s = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
            this.serializedProperties = this.serializedProperties.concat(s)
        }, this.initialize(i), this.paint = function(t) {
            if (this.image) {
                var e = t.globalAlpha;
                t.globalAlpha = this.alpha, null != this.alarmImage && null != this.alarm ? t.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height) : t.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height), t.globalAlpha = e
            } else t.beginPath(), t.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius || 0 == this.borderRadius ? t.rect(-this.width / 2, -this.height / 2, this.width, this.height) : t.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius), t.fill(), t.closePath();
            this.paintText(t), this.paintBorder(t), this.paintCtrl(t), this.paintAlarmText(t)
        }, this.paintAlarmText = function(t) {
            if (null != this.alarm && "" != this.alarm) {
                var e = this.alarmColor || "255,0,0",
                    i = this.alarmAlpha || .5;
                t.beginPath(), t.font = this.alarmFont || "10px 寰蒋闆呴粦";
                var s = t.measureText(this.alarm).width + 6,
                    n = t.measureText("鐢�").width + 6,
                    h = this.width / 2 - s / 2,
                    o = -this.height / 2 - n - 8;
                t.strokeStyle = "rgba(" + e + ", " + i + ")", t.fillStyle = "rgba(" + e + ", " + i + ")", t.lineCap = "round", t.lineWidth = 1, t.moveTo(h, o), t.lineTo(h + s, o), t.lineTo(h + s, o + n), t.lineTo(h + s / 2 + 6, o + n), t.lineTo(h + s / 2, o + n + 8), t.lineTo(h + s / 2 - 6, o + n), t.lineTo(h, o + n), t.lineTo(h, o), t.fill(), t.stroke(), t.closePath(), t.beginPath(), t.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillText(this.alarm, h + 2, o + n - 4), t.closePath()
            }
        }, this.paintText = function(t) {
            var e = this.text;
            if (null != e && "" != e) {
                t.beginPath(), t.font = this.font;
                var i = t.measureText(e).width,
                    s = t.measureText("鐢�").width;
                t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                var n = this.getTextPostion(this.textPosition, i, s);
                t.fillText(e, n.x, n.y), t.closePath()
            }
        }, this.paintBorder = function(t) {
            if (0 != this.borderWidth) {
                t.beginPath(), t.lineWidth = this.borderWidth, t.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                var e = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? t.rect(-this.width / 2 - e, -this.height / 2 - e, this.width + this.borderWidth, this.height + this.borderWidth) : t.JTopoRoundRect(-this.width / 2 - e, -this.height / 2 - e, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius), t.stroke(), t.closePath()
            }
        }, this.getTextPostion = function(t, e, i) {
            var s = null;
            return null == t || "Bottom_Center" == t ? s = {
                x: -this.width / 2 + (this.width - e) / 2,
                y: this.height / 2 + i
            } : "Top_Center" == t ? s = {
                x: -this.width / 2 + (this.width - e) / 2,
                y: -this.height / 2 - i / 2
            } : "Top_Right" == t ? s = {
                x: this.width / 2,
                y: -this.height / 2 - i / 2
            } : "Top_Left" == t ? s = {
                x: -this.width / 2 - e,
                y: -this.height / 2 - i / 2
            } : "Bottom_Right" == t ? s = {
                x: this.width / 2,
                y: this.height / 2 + i
            } : "Bottom_Left" == t ? s = {
                x: -this.width / 2 - e,
                y: this.height / 2 + i
            } : "Middle_Center" == t ? s = {
                x: -this.width / 2 + (this.width - e) / 2,
                y: i / 2
            } : "Middle_Right" == t ? s = {
                x: this.width / 2,
                y: i / 2
            } : "Middle_Left" == t && (s = {
                x: -this.width / 2 - e,
                y: i / 2
            }), null != this.textOffsetX && (s.x += this.textOffsetX), null != this.textOffsetY && (s.y += this.textOffsetY), s
        }, this.setImage = function(t, e) {
            if (null == t) throw new Error("Node.setImage(): 鍙傛暟Image瀵硅薄涓虹┖!");
            var i = this;
            if ("string" == typeof t) {
                var s = l[t];
                null == s ? (s = new Image, s.src = t, s.onload = function() {
                    l[t] = s, 1 == e && i.setSize(s.width, s.height), i.image = s, i.alarmColor = null == i.alarmColor ? "255,0,0" : i.alarmColor
                }) : (e && this.setSize(s.width, s.height), i.image = s, i.alarmColor = null == i.alarmColor ? "255,0,0" : i.alarmColor)
            } else this.image = t, i.alarmColor = null == i.alarmColor ? "255,0,0" : i.alarmColor, 1 == e && this.setSize(t.width, t.height)
        }, this.removeHandler = function(t) {
            var e = this;
            this.outLinks && (this.outLinks.forEach(function(i) {
                i.nodeA === e && t.remove(i)
            }), this.outLinks = null), this.inLinks && (this.inLinks.forEach(function(i) {
                i.nodeZ === e && t.remove(i)
            }), this.inLinks = null)
        }
    }

    function i() {
        i.prototype.initialize.apply(this, arguments)
    }

    function s(t) {
        this.initialize(), this.text = t, this.elementType = "TextNode", this.paint = function(t) {
            t.beginPath(), t.font = this.font, this.width = t.measureText(this.text).width, this.height = t.measureText("鐢�").width, t.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillText(this.text, -this.width / 2, this.height / 2), t.closePath(), this.paintBorder(t), this.paintCtrl(t), this.paintAlarmText(t)
        }
    }

    function n(t, e, i) {
        this.initialize(), this.text = t, this.href = e, this.target = i, this.elementType = "LinkNode", this.isVisited = !1, this.visitedColor = null, this.paint = function(t) {
            t.beginPath(), t.font = this.font, this.width = t.measureText(this.text).width, this.height = t.measureText("鐢�").width, this.isVisited && null != this.visitedColor ? (t.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")", t.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")") : (t.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"), t.fillText(this.text, -this.width / 2, this.height / 2), this.isMouseOver && (t.moveTo(-this.width / 2, this.height), t.lineTo(this.width / 2, this.height), t.stroke()), t.closePath(), this.paintBorder(t), this.paintCtrl(t), this.paintAlarmText(t)
        }, this.mousemove(function() {
            var t = document.getElementsByTagName("canvas");
            if (t && t.length > 0)
                for (var e = 0; e < t.length; e++) t[e].style.cursor = "pointer"
        }), this.mouseout(function() {
            var t = document.getElementsByTagName("canvas");
            if (t && t.length > 0)
                for (var e = 0; e < t.length; e++) t[e].style.cursor = "default"
        }), this.click(function() {
            "_blank" == this.target ? window.open(this.href) : location = this.href, this.isVisited = !0
        })
    }

    function h(t) {
        this.initialize(arguments), this._radius = 20, this.beginDegree = 0, this.endDegree = 2 * Math.PI, this.text = t, this.paint = function(t) {
            t.save(), t.beginPath(), t.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", t.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0), t.fill(), t.closePath(), t.restore(), this.paintText(t), this.paintBorder(t), this.paintCtrl(t), this.paintAlarmText(t)
        }, this.paintSelected = function(t) {
            t.save(), t.beginPath(), t.strokeStyle = "rgba(168,202,255, 0.9)", t.fillStyle = "rgba(168,202,236,0.7)", t.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0), t.fill(), t.stroke(), t.closePath(), t.restore()
        }
    }

    function o(t, e, i) {
        this.initialize(), this.frameImages = t || [], this.frameIndex = 0, this.isStop = !0;
        var s = e || 1e3;
        this.repeatPlay = !1;
        var n = this;
        this.nextFrame = function() {
            if (!this.isStop && null != this.frameImages.length) {
                if (this.frameIndex++, this.frameIndex >= this.frameImages.length) {
                    if (!this.repeatPlay) return;
                    this.frameIndex = 0
                }
                this.setImage(this.frameImages[this.frameIndex], i), setTimeout(function() {
                    n.nextFrame()
                }, s / t.length)
            }
        }
    }

    function a(t, e, i, s, n) {
        this.initialize();
        var h = this;
        this.setImage(t), this.frameIndex = 0, this.isPause = !0, this.repeatPlay = !1;
        var o = s || 1e3;
        n = n || 0, this.paint = function(t) {
            if (this.image) {
                var e = this.width,
                    s = this.height;
                t.save(), t.beginPath(), t.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                var h = (Math.floor(this.frameIndex / i) + n) * s,
                    o = Math.floor(this.frameIndex % i) * e;
                t.drawImage(this.image, o, h, e, s, -e / 2, -s / 2, e, s), t.fill(), t.closePath(), t.restore(), this.paintText(t), this.paintBorder(t), this.paintCtrl(t), this.paintAlarmText(t)
            }
        }, this.nextFrame = function() {
            if (!this.isStop) {
                if (this.frameIndex++, this.frameIndex >= e * i) {
                    if (!this.repeatPlay) return;
                    this.frameIndex = 0
                }
                setTimeout(function() {
                    h.isStop || h.nextFrame()
                }, o / (e * i))
            }
        }
    }

    function r() {
        var t = null;
        return t = arguments.length <= 3 ? new o(arguments[0], arguments[1], arguments[2]) : new a(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), t.stop = function() {
            t.isStop = !0
        }, t.play = function() {
            t.isStop = !1, t.frameIndex = 0, t.nextFrame()
        }, t
    }
    var l = {};
    e.prototype = new t.EditableElement, i.prototype = new e, Object.defineProperties(i.prototype, {
        alarmColor: {
            get: function() {
                return this._alarmColor
            },
            set: function(e) {
                if (this._alarmColor = e, null != this.image) {
                    var i = t.util.genImageAlarm(this.image, e);
                    i && (this.alarmImage = i)
                }
            }
        }
    }), s.prototype = new i, n.prototype = new s, h.prototype = new i, Object.defineProperties(h.prototype, {
        radius: {
            get: function() {
                return this._radius
            },
            set: function(t) {
                this._radius = t;
                var e = 2 * this.radius,
                    i = 2 * this.radius;
                this.width = e, this.height = i
            }
        },
        width: {
            get: function() {
                return this._width
            },
            set: function(t) {
                this._radius = t / 2, this._width = t
            }
        },
        height: {
            get: function() {
                return this._height
            },
            set: function(t) {
                this._radius = t / 2, this._height = t
            }
        }
    }), o.prototype = new i, a.prototype = new i, r.prototype = new i, t.Node = i, t.TextNode = s, t.LinkNode = n, t.CircleNode = h, t.AnimateNode = r
}(JTopo),
function(t) {
    function e(t, e) {
        var i = [];
        if (null == t || null == e) return i;
        if (t && e && t.outLinks && e.inLinks)
            for (var s = 0; s < t.outLinks.length; s++)
                for (var n = t.outLinks[s], h = 0; h < e.inLinks.length; h++) {
                    var o = e.inLinks[h];
                    n === o && i.push(o)
                }
        return i
    }

    function i(t, i) {
        var s = e(t, i),
            n = e(i, t),
            h = s.concat(n);
        return h
    }

    function s(t) {
        var e = i(t.nodeA, t.nodeZ);
        return e = e.filter(function(e) {
            return t !== e
        })
    }

    function n(t, e) {
        return i(t, e).length
    }

    function h(e, i, o) {
        function a(e, i) {
            var s = t.util.lineF(e.cx, e.cy, i.cx, i.cy),
                n = e.getBound(),
                h = t.util.intersectionLineBound(s, n);
            return h
        }
        this.initialize = function(e, i, s) {
            if (h.prototype.initialize.apply(this, arguments), this.elementType = "link", this.zIndex = t.zIndex_Link, 0 != arguments.length) {
                this.text = s, this.nodeA = e, this.nodeZ = i, this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []), this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []), this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []), this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []), null != this.nodeA && this.nodeA.outLinks.push(this), null != this.nodeZ && this.nodeZ.inLinks.push(this), this.caculateIndex(), this.font = "12px Consolas", this.fontColor = "255,255,255", this.lineWidth = 2, this.lineJoin = "miter", this.transformAble = !1, this.bundleOffset = 20, this.bundleGap = 12, this.textOffsetX = 0, this.textOffsetY = 0, this.arrowsRadius = null, this.arrowsOffset = 0, this.dashedPattern = null, this.path = [];
                var n = "text,font,fontColor,lineWidth,lineJoin".split(",");
                this.serializedProperties = this.serializedProperties.concat(n)
            }
        }, this.caculateIndex = function() {
            var t = n(this.nodeA, this.nodeZ);
            t > 0 && (this.nodeIndex = t - 1)
        }, this.initialize(e, i, o), this.removeHandler = function() {
            var t = this;
            this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(e) {
                return e !== t
            })), this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(e) {
                return e !== t
            }));
            var e = s(this);
            e.forEach(function(t, e) {
                t.nodeIndex = e
            })
        }, this.getStartPosition = function() {
            var t = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return t
        }, this.getEndPosition = function() {
            var t;
            return null != this.arrowsRadius && (t = a(this.nodeZ, this.nodeA)), null == t && (t = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            }), t
        }, this.getPath = function() {
            var t = [],
                e = this.getStartPosition(),
                i = this.getEndPosition();
            if (this.nodeA === this.nodeZ) return [e, i];
            var s = n(this.nodeA, this.nodeZ);
            if (1 == s) return [e, i];
            var h = Math.atan2(i.y - e.y, i.x - e.x),
                o = {
                    x: e.x + this.bundleOffset * Math.cos(h),
                    y: e.y + this.bundleOffset * Math.sin(h)
                },
                a = {
                    x: i.x + this.bundleOffset * Math.cos(h - Math.PI),
                    y: i.y + this.bundleOffset * Math.sin(h - Math.PI)
                },
                r = h - Math.PI / 2,
                l = h - Math.PI / 2,
                c = s * this.bundleGap / 2 - this.bundleGap / 2,
                u = this.bundleGap * this.nodeIndex,
                d = {
                    x: o.x + u * Math.cos(r),
                    y: o.y + u * Math.sin(r)
                },
                f = {
                    x: a.x + u * Math.cos(l),
                    y: a.y + u * Math.sin(l)
                };
            return d = {
                x: d.x + c * Math.cos(r - Math.PI),
                y: d.y + c * Math.sin(r - Math.PI)
            }, f = {
                x: f.x + c * Math.cos(l - Math.PI),
                y: f.y + c * Math.sin(l - Math.PI)
            }, t.push({
                x: e.x,
                y: e.y
            }), t.push({
                x: d.x,
                y: d.y
            }), t.push({
                x: f.x,
                y: f.y
            }), t.push({
                x: i.x,
                y: i.y
            }), t
        }, this.paintPath = function(t, e) {
            if (this.nodeA === this.nodeZ) return void this.paintLoop(t);
            t.beginPath(), t.moveTo(e[0].x, e[0].y);
            for (var i = 1; i < e.length; i++) null == this.dashedPattern ? t.lineTo(e[i].x, e[i].y) : t.JTopoDashedLineTo(e[i - 1].x, e[i - 1].y, e[i].x, e[i].y, this.dashedPattern);
            if (t.stroke(), t.closePath(), null != this.arrowsRadius) {
                var s = e[e.length - 2],
                    n = e[e.length - 1];
                this.paintArrow(t, s, n)
            }
        }, this.paintLoop = function(t) {
            t.beginPath();
            var e = this.bundleGap * (this.nodeIndex + 1) / 2;
            Math.PI + Math.PI / 2, t.arc(this.nodeA.x, this.nodeA.y, e, Math.PI / 2, 2 * Math.PI), t.stroke(), t.closePath()
        }, this.paintArrow = function(e, i, s) {
            var n = this.arrowsOffset,
                h = this.arrowsRadius / 2,
                o = i,
                a = s,
                r = Math.atan2(a.y - o.y, a.x - o.x),
                l = t.util.getDistance(o, a) - this.arrowsRadius,
                c = o.x + (l + n) * Math.cos(r),
                u = o.y + (l + n) * Math.sin(r),
                d = a.x + n * Math.cos(r),
                f = a.y + n * Math.sin(r);
            r -= Math.PI / 2;
            var g = {
                    x: c + h * Math.cos(r),
                    y: u + h * Math.sin(r)
                },
                v = {
                    x: c + h * Math.cos(r - Math.PI),
                    y: u + h * Math.sin(r - Math.PI)
                };
            e.beginPath(), e.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", e.moveTo(g.x, g.y), e.lineTo(d, f), e.lineTo(v.x, v.y), e.stroke(), e.closePath()
        }, this.paint = function(t) {
            if (null != this.nodeA && null != !this.nodeZ) {
                var e = this.getPath(this.nodeIndex);
                this.path = e, t.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", t.lineWidth = this.lineWidth, this.paintPath(t, e), e && e.length > 0 && this.paintText(t, e)
            }
        };
        var r = -(Math.PI / 2 + Math.PI / 4);
        this.paintText = function(t, e) {
            var i = e[0],
                s = e[e.length - 1];
            if (4 == e.length && (i = e[1], s = e[2]), this.text && this.text.length > 0) {
                var n = (s.x + i.x) / 2 + this.textOffsetX,
                    h = (s.y + i.y) / 2 + this.textOffsetY;
                t.save(), t.beginPath(), t.font = this.font;
                var o = t.measureText(this.text).width,
                    a = t.measureText("鐢�").width;
                if (t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", this.nodeA === this.nodeZ) {
                    var l = this.bundleGap * (this.nodeIndex + 1) / 2,
                        n = this.nodeA.x + l * Math.cos(r),
                        h = this.nodeA.y + l * Math.sin(r);
                    t.fillText(this.text, n, h)
                } else t.fillText(this.text, n - o / 2, h - a / 2);
                t.stroke(), t.closePath(), t.restore()
            }
        }, this.paintSelected = function(t) {
            t.shadowBlur = 10, t.shadowColor = "rgba(0,0,0,1)", t.shadowOffsetX = 0, t.shadowOffsetY = 0
        }, this.isInBound = function(e, i) {
            if (this.nodeA === this.nodeZ) {
                var s = this.bundleGap * (this.nodeIndex + 1) / 2,
                    n = t.util.getDistance(this.nodeA, {
                        x: e,
                        y: i
                    }) - s;
                return Math.abs(n) <= 3
            }
            for (var h = !1, o = 1; o < this.path.length; o++) {
                var a = this.path[o - 1],
                    r = this.path[o];
                if (1 == t.util.isPointInLine({
                        x: e,
                        y: i
                    }, a, r)) {
                    h = !0;
                    break
                }
            }
            return h
        }
    }

    function o(t, e, i) {
        this.initialize = function() {
            o.prototype.initialize.apply(this, arguments), this.direction = "horizontal"
        }, this.initialize(t, e, i), this.getStartPosition = function() {
            var t = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return "horizontal" == this.direction ? this.nodeZ.cx > t.x ? t.x += this.nodeA.width / 2 : t.x -= this.nodeA.width / 2 : this.nodeZ.cy > t.y ? t.y += this.nodeA.height / 2 : t.y -= this.nodeA.height / 2, t
        }, this.getEndPosition = function() {
            var t = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            };
            return "horizontal" == this.direction ? this.nodeA.cy < t.y ? t.y -= this.nodeZ.height / 2 : t.y += this.nodeZ.height / 2 : t.x = this.nodeA.cx < t.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width, t
        }, this.getPath = function(t) {
            var e = [],
                i = this.getStartPosition(),
                s = this.getEndPosition();
            if (this.nodeA === this.nodeZ) return [i, s];
            var h, o, a = n(this.nodeA, this.nodeZ),
                r = (a - 1) * this.bundleGap,
                l = this.bundleGap * t - r / 2;
            return "horizontal" == this.direction ? (h = s.x + l, o = i.y - l, e.push({
                x: i.x,
                y: o
            }), e.push({
                x: h,
                y: o
            }), e.push({
                x: h,
                y: s.y
            })) : (h = i.x + l, o = s.y - l, e.push({
                x: h,
                y: i.y
            }), e.push({
                x: h,
                y: o
            }), e.push({
                x: s.x,
                y: o
            })), e
        }, this.paintText = function(t, e) {
            if (this.text && this.text.length > 0) {
                var i = e[1],
                    s = i.x + this.textOffsetX,
                    n = i.y + this.textOffsetY;
                t.save(), t.beginPath(), t.font = this.font;
                var h = t.measureText(this.text).width,
                    o = t.measureText("鐢�").width;
                t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", t.fillText(this.text, s - h / 2, n - o / 2), t.stroke(), t.closePath(), t.restore()
            }
        }
    }

    function a(t, e, i) {
        this.initialize = function() {
            a.prototype.initialize.apply(this, arguments), this.direction = "vertical", this.offsetGap = 44
        }, this.initialize(t, e, i), this.getStartPosition = function() {
            var t = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return "horizontal" == this.direction ? t.x = this.nodeZ.cx < t.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : t.y = this.nodeZ.cy < t.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height, t
        }, this.getEndPosition = function() {
            var t = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            };
            return "horizontal" == this.direction ? t.x = this.nodeA.cx < t.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : t.y = this.nodeA.cy < t.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height, t
        }, this.getPath = function(t) {
            var e = this.getStartPosition(),
                i = this.getEndPosition();
            if (this.nodeA === this.nodeZ) return [e, i];
            var s = [],
                h = n(this.nodeA, this.nodeZ),
                o = (h - 1) * this.bundleGap,
                a = this.bundleGap * t - o / 2,
                r = this.offsetGap;
            return "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (r = -r), s.push({
                x: e.x,
                y: e.y + a
            }), s.push({
                x: e.x + r,
                y: e.y + a
            }), s.push({
                x: i.x - r,
                y: i.y + a
            }), s.push({
                x: i.x,
                y: i.y + a
            })) : (this.nodeA.cy > this.nodeZ.cy && (r = -r), s.push({
                x: e.x + a,
                y: e.y
            }), s.push({
                x: e.x + a,
                y: e.y + r
            }), s.push({
                x: i.x + a,
                y: i.y - r
            }), s.push({
                x: i.x + a,
                y: i.y
            })), s
        }
    }

    function r(t, e, i) {
        this.initialize = function() {
            r.prototype.initialize.apply(this, arguments)
        }, this.initialize(t, e, i), this.paintPath = function(t, e) {
            if (this.nodeA === this.nodeZ) return void this.paintLoop(t);
            t.beginPath(), t.moveTo(e[0].x, e[0].y);
            for (var i = 1; i < e.length; i++) {
                var s = e[i - 1],
                    n = e[i],
                    h = (s.x + n.x) / 2,
                    o = (s.y + n.y) / 2;
                o += (n.y - s.y) / 2, t.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", t.lineWidth = this.lineWidth, t.moveTo(s.x, s.cy), t.quadraticCurveTo(h, o, n.x, n.y), t.stroke()
            }
            if (t.stroke(), t.closePath(), null != this.arrowsRadius) {
                var a = e[e.length - 2],
                    r = e[e.length - 1];
                this.paintArrow(t, a, r)
            }
        }
    }
    h.prototype = new t.InteractiveElement, o.prototype = new h, a.prototype = new h, r.prototype = new h, t.Link = h, t.FoldLink = o, t.FlexionalLink = a, t.CurveLink = r
}(JTopo),
function(t) {
    function e(i) {
        this.initialize = function(i) {
            e.prototype.initialize.apply(this, null), this.elementType = "container", this.zIndex = t.zIndex_Container, this.width = 100, this.height = 100, this.childs = [], this.alpha = .5, this.dragable = !0, this.childDragble = !0, this.visible = !0, this.fillColor = "10,100,80", this.borderWidth = 0, this.borderColor = "255,255,255", this.borderRadius = null, this.font = "12px Consolas", this.fontColor = "255,255,255", this.text = i, this.textPosition = "Bottom_Center", this.textOffsetX = 0, this.textOffsetY = 0, this.layout = new t.layout.AutoBoundLayout
        }, this.initialize(i), this.add = function(t) {
            this.childs.push(t), t.dragable = this.childDragble
        }, this.remove = function(t) {
            for (var e = 0; e < this.childs.length; e++)
                if (this.childs[e] === t) {
                    t.parentContainer = null, this.childs = this.childs.del(e), t.lastParentContainer = this;
                    break
                }
        }, this.removeAll = function() {
            this.childs = []
        }, this.setLocation = function(t, e) {
            var i = t - this.x,
                s = e - this.y;
            this.x = t, this.y = e;
            for (var n = 0; n < this.childs.length; n++) {
                var h = this.childs[n];
                h.setLocation(h.x + i, h.y + s)
            }
        }, this.doLayout = function(t) {
            t && t(this, this.childs)
        }, this.paint = function(t) {
            this.visible && (this.layout && this.layout(this, this.childs), t.beginPath(), t.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius || 0 == this.borderRadius ? t.rect(this.x, this.y, this.width, this.height) : t.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), t.fill(), t.closePath(), this.paintText(t), this.paintBorder(t))
        }, this.paintBorder = function(t) {
            if (0 != this.borderWidth) {
                t.beginPath(), t.lineWidth = this.borderWidth, t.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                var e = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? t.rect(this.x - e, this.y - e, this.width + this.borderWidth, this.height + this.borderWidth) : t.JTopoRoundRect(this.x - e, this.y - e, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius), t.stroke(), t.closePath()
            }
        }, this.paintText = function(t) {
            var e = this.text;
            if (null != e && "" != e) {
                t.beginPath(), t.font = this.font;
                var i = t.measureText(e).width,
                    s = t.measureText("鐢�").width;
                t.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                var n = this.getTextPostion(this.textPosition, i, s);
                t.fillText(e, n.x, n.y), t.closePath()
            }
        }, this.getTextPostion = function(t, e, i) {
            var s = null;
            return null == t || "Bottom_Center" == t ? s = {
                x: this.x + this.width / 2 - e / 2,
                y: this.y + this.height + i
            } : "Top_Center" == t ? s = {
                x: this.x + this.width / 2 - e / 2,
                y: this.y - i / 2
            } : "Top_Right" == t ? s = {
                x: this.x + this.width - e,
                y: this.y - i / 2
            } : "Top_Left" == t ? s = {
                x: this.x,
                y: this.y - i / 2
            } : "Bottom_Right" == t ? s = {
                x: this.x + this.width - e,
                y: this.y + this.height + i
            } : "Bottom_Left" == t ? s = {
                x: this.x,
                y: this.y + this.height + i
            } : "Middle_Center" == t ? s = {
                x: this.x + this.width / 2 - e / 2,
                y: this.y + this.height / 2 + i / 2
            } : "Middle_Right" == t ? s = {
                x: this.x + this.width - e,
                y: this.y + this.height / 2 + i / 2
            } : "Middle_Left" == t && (s = {
                x: this.x,
                y: this.y + this.height / 2 + i / 2
            }), null != this.textOffsetX && (s.x += this.textOffsetX), null != this.textOffsetY && (s.y += this.textOffsetY), s
        }, this.paintMouseover = function() {}, this.paintSelected = function(t) {
            t.shadowBlur = 10, t.shadowColor = "rgba(0,0,0,1)", t.shadowOffsetX = 0, t.shadowOffsetY = 0
        }
    }
    e.prototype = new t.InteractiveElement, t.Container = e
}(JTopo),
function(t) {
    function e(t) {
        var e = 0,
            i = 0;
        t.forEach(function(t) {
            e += t.cx, i += t.cy
        });
        var s = {
            x: e / t.length,
            y: i / t.length
        };
        return s
    }

    function i(i, s) {
        null == s && (s = {});
        var n = s.cx,
            h = s.cy,
            o = s.minRadius,
            a = s.nodeDiameter,
            r = s.hScale || 1,
            l = s.vScale || 1;
        if (s.beginAngle || 0, s.endAngle || 2 * Math.PI, null == n || null == h) {
            var c = e(i);
            n = c.x, h = c.y
        }
        var u = 0,
            d = [],
            f = [];
        i.forEach(function(t) {
            null == s.nodeDiameter ? (t.diameter && (a = t.diameter), a = t.radius ? 2 * t.radius : Math.sqrt(2 * t.width * t.height), f.push(a)) : f.push(a), u += a
        }), i.forEach(function(t, e) {
            var i = f[e] / u;
            d.push(Math.PI * i)
        });
        var g = (i.length, d[0] + d[1]),
            v = f[0] / 2 + f[1] / 2,
            p = v / 2 / Math.sin(g / 2);
        null != o && o > p && (p = o);
        var m = p * r,
            y = p * l,
            x = s.animate;
        if (x) {
            var w = x.time || 1e3,
                b = 0;
            i.forEach(function(e, i) {
                b += 0 == i ? d[i] : d[i - 1] + d[i];
                var s = n + Math.cos(b) * m,
                    o = h + Math.sin(b) * y;
                t.Animate.stepByStep(e, {
                    x: s - e.width / 2,
                    y: o - e.height / 2
                }, w).start()
            })
        } else {
            var b = 0;
            i.forEach(function(t, e) {
                b += 0 == e ? d[e] : d[e - 1] + d[e];
                var i = n + Math.cos(b) * m,
                    s = h + Math.sin(b) * y;
                t.cx = i, t.cy = s
            })
        }
        return {
            cx: n,
            cy: h,
            radius: m,
            radiusA: m,
            radiusB: y
        }
    }

    function s(t, e) {
        return function(i) {
            var s = i.childs;
            if (!(s.length <= 0))
                for (var n = i.getBound(), h = s[0], o = (n.width - h.width) / e, a = (n.height - h.height) / t, r = (s.length, 0), l = 0; t > l; l++)
                    for (var c = 0; e > c; c++) {
                        var u = s[r++],
                            d = n.left + o / 2 + c * o,
                            f = n.top + a / 2 + l * a;
                        if (u.setLocation(d, f), r >= s.length) return
                    }
        }
    }

    function n(t, e) {
        return null == t && (t = 0), null == e && (e = 0),
            function(i) {
                var s = i.childs;
                if (!(s.length <= 0))
                    for (var n = i.getBound(), h = n.left, o = n.top, a = 0; a < s.length; a++) {
                        var r = s[a];
                        h + r.width >= n.right && (h = n.left, o += e + r.height), r.setLocation(h, o), h += t + r.width
                    }
            }
    }

    function h() {
        return function(t, e) {
            if (e.length > 0) {
                for (var i = 1e7, s = -1e7, n = 1e7, h = -1e7, o = s - i, a = h - n, r = 0; r < e.length; r++) {
                    var l = e[r];
                    l.x <= i && (i = l.x), l.x >= s && (s = l.x), l.y <= n && (n = l.y), l.y >= h && (h = l.y), o = s - i + l.width, a = h - n + l.height
                }
                t.x = i, t.y = n, t.width = o, t.height = a
            }
        }
    }

    function o(e) {
        var i = [],
            s = e.filter(function(e) {
                return e instanceof t.Link || (i.push(e), !1)
            });
        return e = i.filter(function(t) {
            for (var e = 0; e < s.length; e++)
                if (s[e].nodeZ === t) return !1;
            return !0
        }), e = e.filter(function(t) {
            for (var e = 0; e < s.length; e++)
                if (s[e].nodeA === t) return !0;
            return !1
        })
    }

    function a(t) {
        var e = 0,
            i = 0;
        return t.forEach(function(t) {
            e += t.width, i += t.height
        }), {
            width: e / t.length,
            height: i / t.length
        }
    }

    function r(t, e, i, s) {
        e.x += i, e.y += s;
        for (var n = p(t, e), h = 0; h < n.length; h++) r(t, n[h], i, s)
    }

    function l(t, e) {
        function i(e, n) {
            var h = p(t, e);
            null == s[n] && (s[n] = {}, s[n].nodes = [], s[n].childs = []), s[n].nodes.push(e), s[n].childs.push(h);
            for (var o = 0; o < h.length; o++) i(h[o], n + 1), h[o].parent = e
        }
        var s = [];
        return i(e, 0), s
    }

    function c(e, i, s) {
        return function(n) {
            function h(h, o) {
                for (var a = t.layout.getTreeDeep(h, o), c = l(h, o), u = c["" + a].nodes, d = 0; d < u.length; d++) {
                    var f = u[d],
                        g = (d + 1) * (i + 10),
                        v = a * s;
                    "down" == e || ("up" == e ? v = -v : "left" == e ? (g = -a * s, v = (d + 1) * (i + 10)) : "right" == e && (g = a * s, v = (d + 1) * (i + 10))), f.setLocation(g, v)
                }
                for (var p = a - 1; p >= 0; p--)
                    for (var m = c["" + p].nodes, y = c["" + p].childs, d = 0; d < m.length; d++) {
                        var x = m[d],
                            w = y[d];
                        if ("down" == e ? x.y = p * s : "up" == e ? x.y = -p * s : "left" == e ? x.x = -p * s : "right" == e && (x.x = p * s), w.length > 0 ? "down" == e || "up" == e ? x.x = (w[0].x + w[w.length - 1].x) / 2 : ("left" == e || "right" == e) && (x.y = (w[0].y + w[w.length - 1].y) / 2) : d > 0 && ("down" == e || "up" == e ? x.x = m[d - 1].x + m[d - 1].width + i : ("left" == e || "right" == e) && (x.y = m[d - 1].y + m[d - 1].height + i)), d > 0)
                            if ("down" == e || "up" == e) {
                                if (x.x < m[d - 1].x + m[d - 1].width)
                                    for (var b = m[d - 1].x + m[d - 1].width + i, E = Math.abs(b - x.x), T = d; T < m.length; T++) r(n.childs, m[T], E, 0)
                            } else if (("left" == e || "right" == e) && x.y < m[d - 1].y + m[d - 1].height)
                            for (var P = m[d - 1].y + m[d - 1].height + i, M = Math.abs(P - x.y), T = d; T < m.length; T++) r(n.childs, m[T], 0, M)
                    }
            }
            var o = null;
            null == i && (o = a(n.childs), i = o.width, ("left" == e || "right" == e) && (i = o.width + 10)), null == s && (null == o && (o = a(n.childs)), s = 2 * o.height), null == e && (e = "down");
            var c = t.layout.getRootNodes(n.childs);
            if (c.length > 0) {
                h(n.childs, c[0]);
                var u = t.util.getElementsBound(n.childs),
                    d = n.getCenterLocation(),
                    f = d.x - (u.left + u.right) / 2,
                    g = d.y - (u.top + u.bottom) / 2;
                n.childs.forEach(function(e) {
                    e instanceof t.Node && (e.x += f, e.y += g)
                })
            }
        }
    }

    function u(e) {
        return function(i) {
            function s(t, i, n) {
                var h = p(t, i);
                if (0 != h.length) {
                    null == n && (n = e);
                    var o = 2 * Math.PI / h.length;
                    h.forEach(function(e, h) {
                        var a = i.x + n * Math.cos(o * h),
                            r = i.y + n * Math.sin(o * h);
                        e.setLocation(a, r);
                        var l = n / 2;
                        s(t, e, l)
                    })
                }
            }
            var n = t.layout.getRootNodes(i.childs);
            if (n.length > 0) {
                s(i.childs, n[0]);
                var h = t.util.getElementsBound(i.childs),
                    o = i.getCenterLocation(),
                    a = o.x - (h.left + h.right) / 2,
                    r = o.y - (h.top + h.bottom) / 2;
                i.childs.forEach(function(e) {
                    e instanceof t.Node && (e.x += a, e.y += r)
                })
            }
        }
    }

    function d(t, e, i, s, n, h) {
        for (var o = [], a = 0; i > a; a++)
            for (var r = 0; s > r; r++) o.push({
                x: t + r * n,
                y: e + a * h
            });
        return o
    }

    function f(t, e, i, s, n, h) {
        var o = n ? n : 0,
            a = h ? h : 2 * Math.PI,
            r = a - o,
            l = r / i,
            c = [];
        o += l / 2;
        for (var u = o; a >= u; u += l) {
            var d = t + Math.cos(u) * s,
                f = e + Math.sin(u) * s;
            c.push({
                x: d,
                y: f
            })
        }
        return c
    }

    function g(t, e, i, s, n, h) {
        var o = h || "bottom",
            a = [];
        if ("bottom" == o)
            for (var r = t - i / 2 * s + s / 2, l = 0; i >= l; l++) a.push({
                x: r + l * s,
                y: e + n
            });
        else if ("top" == o)
            for (var r = t - i / 2 * s + s / 2, l = 0; i >= l; l++) a.push({
                x: r + l * s,
                y: e - n
            });
        else if ("right" == o)
            for (var r = e - i / 2 * s + s / 2, l = 0; i >= l; l++) a.push({
                x: t + n,
                y: r + l * s
            });
        else if ("left" == o)
            for (var r = e - i / 2 * s + s / 2, l = 0; i >= l; l++) a.push({
                x: t - n,
                y: r + l * s
            });
        return a
    }

    function d(t, e, i, s, n, h) {
        for (var o = [], a = 0; i > a; a++)
            for (var r = 0; s > r; r++) o.push({
                x: t + r * n,
                y: e + a * h
            });
        return o
    }

    function v(t, e) {
        if (t.layout) {
            var i = t.layout,
                s = i.type,
                n = null;
            if ("circle" == s) {
                var h = i.radius || Math.max(t.width, t.height);
                n = f(t.cx, t.cy, e.length, h, t.layout.beginAngle, t.layout.endAngle)
            } else if ("tree" == s) {
                var o = i.width || 50,
                    a = i.height || 50,
                    r = i.direction;
                n = g(t.cx, t.cy, e.length, o, a, r)
            } else {
                if ("grid" != s) return;
                n = d(t.x, t.y, i.rows, i.cols, i.horizontal || 0, i.vertical || 0)
            }
            for (var l = 0; l < e.length; l++) e[l].setCenterLocation(n[l].x, n[l].y)
        }
    }

    function p(e, i) {
        for (var s = [], n = 0; n < e.length; n++) e[n] instanceof t.Link && e[n].nodeA === i && s.push(e[n].nodeZ);
        return s
    }

    function m(t, e, i) {
        var s = p(t.childs, e);
        if (0 == s.length) return null;
        if (v(e, s), 1 == i)
            for (var n = 0; n < s.length; n++) m(t, s[n], i);
        return null
    }

    function y(e, i) {
        function s(t, e) {
            var i = t.x - e.x,
                s = t.y - e.y;
            r += i * h, l += s * h, r *= o, l *= o, l += a, e.x += r, e.y += l
        }

        function n() {
            if (!(++c > 150)) {
                for (var t = 0; t < u.length; t++) u[t] != e && s(e, u[t], u);
                setTimeout(n, 1e3 / 24)
            }
        }
        var h = .01,
            o = .95,
            a = -5,
            r = 0,
            l = 0,
            c = 0,
            u = i.getElementsByClass(t.Node);
        n()
    }

    function x(t, e) {
        function i(t, e, n) {
            var h = p(t, e);
            n > s && (s = n);
            for (var o = 0; o < h.length; o++) i(t, h[o], n + 1)
        }
        var s = 0;
        return i(t, e, 0), s
    }
    t.layout = t.Layout = {
        layoutNode: m,
        getNodeChilds: p,
        adjustPosition: v,
        springLayout: y,
        getTreeDeep: x,
        getRootNodes: o,
        GridLayout: s,
        FlowLayout: n,
        AutoBoundLayout: h,
        CircleLayout: u,
        TreeLayout: c,
        getNodesCenter: e,
        circleLayoutNodes: i
    }
}(JTopo),
function(t) {
    function e() {
        var e = new t.CircleNode;
        return e.radius = 150, e.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], e.datas = [.3, .3, .4], e.titles = ["A", "B", "C"], e.paint = function(t) {
            var i = 2 * e.radius,
                s = 2 * e.radius;
            e.width = i, e.height = s;
            for (var n = 0, h = 0; h < this.datas.length; h++) {
                var o = this.datas[h] * Math.PI * 2;
                t.save(), t.beginPath(), t.fillStyle = e.colors[h], t.moveTo(0, 0), t.arc(0, 0, this.radius, n, n + o, !1), t.fill(), t.closePath(), t.restore(), t.beginPath(), t.font = this.font;
                var a = this.titles[h] + ": " + (100 * this.datas[h]).toFixed(2) + "%",
                    r = t.measureText(a).width,
                    l = (t.measureText("鐢�").width, (n + n + o) / 2),
                    c = this.radius * Math.cos(l),
                    u = this.radius * Math.sin(l);
                l > Math.PI / 2 && l <= Math.PI ? c -= r : l > Math.PI && l < 2 * Math.PI * 3 / 4 ? c -= r : l > 2 * Math.PI * .75, t.fillStyle = "#FFFFFF", t.fillText(a, c, u), t.moveTo(this.radius * Math.cos(l), this.radius * Math.sin(l)), l > Math.PI / 2 && l < 2 * Math.PI * 3 / 4 && (c -= r), l > Math.PI, t.fill(), t.stroke(), t.closePath(), n += o
            }
        }, e
    }

    function i() {
        var e = new t.Node;
        return e.showSelected = !1, e.width = 250, e.height = 180, e.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], e.datas = [.3, .3, .4], e.titles = ["A", "B", "C"], e.paint = function(t) {
            var i = 3,
                s = (this.width - i) / this.datas.length;
            t.save(), t.beginPath(), t.fillStyle = "#FFFFFF", t.strokeStyle = "#FFFFFF", t.moveTo(-this.width / 2 - 1, -this.height / 2), t.lineTo(-this.width / 2 - 1, this.height / 2 + 3), t.lineTo(this.width / 2 + i + 1, this.height / 2 + 3), t.stroke(), t.closePath(), t.restore();
            for (var n = 0; n < this.datas.length; n++) {
                t.save(), t.beginPath(), t.fillStyle = e.colors[n];
                var h = this.datas[n],
                    o = n * (s + i) - this.width / 2,
                    a = this.height - h - this.height / 2;
                t.fillRect(o, a, s, h);
                var r = "" + parseInt(this.datas[n]),
                    l = t.measureText(r).width,
                    c = t.measureText("鐢�").width;
                t.fillStyle = "#FFFFFF", t.fillText(r, o + (s - l) / 2, a - c), t.fillText(this.titles[n], o + (s - l) / 2, this.height / 2 + c), t.fill(), t.closePath(), t.restore()
            }
        }, e
    }
    t.BarChartNode = i, t.PieChartNode = e
}(JTopo),
function(t) {
    function e(e, i) {
        var s, n = null;
        return {
            stop: function() {
                return s ? (window.clearInterval(s), n && n.publish("stop"), this) : this
            },
            start: function() {
                var t = this;
                return s = setInterval(function() {
                    e.call(t)
                }, i), this
            },
            onStop: function(e) {
                return null == n && (n = new t.util.MessageBus), n.subscribe("stop", e), this
            }
        }
    }

    function i(t, i) {
        i = i || {};
        var s = i.gravity || .1,
            n = i.dx || 0,
            h = i.dy || 5,
            o = i.stop,
            a = i.interval || 30,
            r = new e(function() {
                o && o() ? (h = .5, this.stop()) : (h += s, t.setLocation(t.x + n, t.y + h))
            }, a);
        return r
    }

    function s(t, i, s, n, h) {
        var o = 1e3 / 24,
            a = {};
        for (var r in i) {
            var l = i[r],
                c = l - t[r];
            a[r] = {
                oldValue: t[r],
                targetValue: l,
                step: c / s * o,
                isDone: function(e) {
                    var i = this.step > 0 && t[e] >= this.targetValue || this.step < 0 && t[e] <= this.targetValue;
                    return i
                }
            }
        }
        var u = new e(function() {
            var e = !0;
            for (var s in i) a[s].isDone(s) || (t[s] += a[s].step, e = !1);
            if (e) {
                if (!n) return this.stop();
                for (var s in i)
                    if (h) {
                        var o = a[s].targetValue;
                        a[s].targetValue = a[s].oldValue, a[s].oldValue = o, a[s].step = -a[s].step
                    } else t[s] = a[s].oldValue
            }
            return this
        }, o);
        return u
    }

    function n(t) {
        null == t && (t = {});
        var e = t.spring || .1,
            i = t.friction || .8,
            s = t.grivity || 0,
            n = (t.wind || 0, t.minLength || 0);
        return {
            items: [],
            timer: null,
            isPause: !1,
            addNode: function(t, e) {
                var i = {
                    node: t,
                    target: e,
                    vx: 0,
                    vy: 0
                };
                return this.items.push(i), this
            },
            play: function(t) {
                this.stop(), t = null == t ? 1e3 / 24 : t;
                var e = this;
                this.timer = setInterval(function() {
                    e.nextFrame()
                }, t)
            },
            stop: function() {
                null != this.timer && window.clearInterval(this.timer)
            },
            nextFrame: function() {
                for (var t = 0; t < this.items.length; t++) {
                    var h = this.items[t],
                        o = h.node,
                        a = h.target,
                        r = h.vx,
                        l = h.vy,
                        c = a.x - o.x,
                        u = a.y - o.y,
                        d = Math.atan2(u, c);
                    if (0 != n) {
                        var f = a.x - Math.cos(d) * n,
                            g = a.y - Math.sin(d) * n;
                        r += (f - o.x) * e, l += (g - o.y) * e
                    } else r += c * e, l += u * e;
                    r *= i, l *= i, l += s, o.x += r, o.y += l, h.vx = r, h.vy = l
                }
            }
        }
    }

    function h(t, e) {
        function i() {
            return n = setInterval(function() {
                return g ? void h.stop() : (t.rotate += o || .2, void(t.rotate > 2 * Math.PI && (t.rotate = 0)))
            }, 100), h
        }

        function s() {
            return window.clearInterval(n), h.onStop && h.onStop(t), h
        }
        var n = (e.context, null),
            h = {},
            o = e.v;
        return h.run = i, h.stop = s, h.onStop = function(t) {
            return h.onStop = t, h
        }, h
    }

    function o(t, e) {
        function i() {
            return window.clearInterval(o), a.onStop && a.onStop(t), a
        }

        function s() {
            var s = e.dx || 0,
                r = e.dy || 2;
            return o = setInterval(function() {
                return g ? void a.stop() : (r += h, void(t.y + t.height < n.stage.canvas.height ? t.setLocation(t.x + s, t.y + r) : (r = 0, i())))
            }, 20), a
        }
        var n = e.context,
            h = e.gravity || .1,
            o = null,
            a = {};
        return a.run = s, a.stop = i, a.onStop = function(t) {
            return a.onStop = t, a
        }, a
    }

    function a(e, i) {
        function s(i, s, n, h, o) {
            var a = new t.Node;
            return a.setImage(e.image), a.setSize(e.width, e.height), a.setLocation(i, s), a.showSelected = !1, a.dragable = !1, a.paint = function(t) {
                t.save(), t.arc(0, 0, n, h, o), t.clip(), t.beginPath(), null != this.image ? t.drawImage(this.image, -this.width / 2, -this.height / 2) : (t.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")", t.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2), t.fill()), t.closePath(), t.restore()
            }, a
        }

        function n(i, n) {
            var h = i,
                o = i + Math.PI,
                a = s(e.x, e.y, e.width, h, o),
                l = s(e.x - 2 + 4 * Math.random(), e.y, e.width, h + Math.PI, h);
            e.visible = !1, n.add(a), n.add(l), t.Animate.gravity(a, {
                context: n,
                dx: .3
            }).run().onStop(function() {
                n.remove(a), n.remove(l), r.stop()
            }), t.Animate.gravity(l, {
                context: n,
                dx: -.2
            }).run()
        }

        function h() {
            return n(i.angle, a), r
        }

        function o() {
            return r.onStop && r.onStop(e), r
        }
        var a = i.context,
            r = (e.style, {});
        return r.onStop = function(t) {
            return r.onStop = t, r
        }, r.run = h, r.stop = o, r
    }

    function r(t, e) {
        function i(t) {
            t.visible = !0, t.rotate = Math.random();
            var e = o.stage.canvas.width / 2;
            t.x = e + Math.random() * (e - 100) - Math.random() * (e - 100), t.y = o.stage.canvas.height, t.vx = 5 * Math.random() - 5 * Math.random(), t.vy = -25
        }

        function s() {
            return i(t), a = setInterval(function() {
                return g ? void r.stop() : (t.vy += h, t.x += t.vx, t.y += t.vy, void((t.x < 0 || t.x > o.stage.canvas.width || t.y > o.stage.canvas.height) && (r.onStop && r.onStop(t), i(t))))
            }, 50), r
        }

        function n() {
            window.clearInterval(a)
        }
        var h = .8,
            o = e.context,
            a = null,
            r = {};
        return r.onStop = function(t) {
            return r.onStop = t, r
        }, r.run = s, r.stop = n, r
    }

    function l() {
        g = !0
    }

    function c() {
        g = !1
    }

    function u(e, i) {
        function s() {
            return f = setInterval(function() {
                if (g) return void d.stop();
                var t = h.y + a + Math.sin(c) * l;
                e.setLocation(e.x, t), c += u
            }, 100), d
        }

        function n() {
            window.clearInterval(f)
        }
        var h = i.p1,
            o = i.p2,
            a = (i.context, h.x + (o.x - h.x) / 2),
            r = h.y + (o.y - h.y) / 2,
            l = t.util.getDistance(h, o) / 2,
            c = Math.atan2(r, a),
            u = i.speed || .2,
            d = {},
            f = null;
        return d.run = s, d.stop = n, d
    }

    function d(t, e) {
        function i() {
            return a = setInterval(function() {
                if (g) return void o.stop();
                var e = n.x - t.x,
                    i = n.y - t.y,
                    a = e * h,
                    r = i * h;
                t.x += a, t.y += r, .01 > a && .1 > r && s()
            }, 100), o
        }

        function s() {
            window.clearInterval(a)
        }
        var n = e.position,
            h = (e.context, e.easing || .2),
            o = {},
            a = null;
        return o.onStop = function(t) {
            return o.onStop = t, o
        }, o.run = i, o.stop = s, o
    }

    function f(t, e) {
        function i() {
            return l = setInterval(function() {
                t.scaleX += h, t.scaleY += h, t.scaleX >= n && s()
            }, 100), r
        }

        function s() {
            r.onStop && r.onStop(t), t.scaleX = o, t.scaleY = a, window.clearInterval(l)
        }
        var n = (e.position, e.context, e.scale || 1),
            h = .06,
            o = t.scaleX,
            a = t.scaleY,
            r = {},
            l = null;
        return r.onStop = function(t) {
            return r.onStop = t, r
        }, r.run = i, r.stop = s, r
    }
    t.Animate = {}, t.Effect = {};
    var g = !1;
    t.Effect.spring = n, t.Effect.gravity = i, t.Animate.stepByStep = s, t.Animate.rotate = h, t.Animate.scale = f, t.Animate.move = d, t.Animate.cycle = u, t.Animate.repeatThrow = r, t.Animate.dividedTwoPiece = a, t.Animate.gravity = o, t.Animate.startAll = c, t.Animate.stopAll = l
}(JTopo),
function(t) {
    function e(t, e) {
        var i = [];
        if (0 == t.length) return i;
        var s = e.match(/^\s*(\w+)\s*$/);
        if (null != s) {
            var n = t.filter(function(t) {
                return t.elementType == s[1]
            });
            null != n && n.length > 0 && (i = i.concat(n))
        } else {
            var h = !1;
            if (s = e.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == s || s.length < 5) && (s = e.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), h = !0), null != s && s.length >= 5) {
                var o = s[1],
                    a = s[2],
                    r = s[3],
                    l = s[4];
                n = t.filter(function(t) {
                    if (t.elementType != o) return !1;
                    var e = t[a];
                    return 1 == h && (e = parseInt(e)), "=" == r ? e == l : ">" == r ? e > l : "<" == r ? l > e : "<=" == r ? l >= e : ">=" == r ? e >= l : "!=" == r && e != l
                }), null != n && n.length > 0 && (i = i.concat(n))
            }
        }
        return i
    }

    function i(t) {
        if (t.find = function(t) {
                return s.call(this, t)
            }, n.forEach(function(e) {
                t[e] = function(t) {
                    for (var i = 0; i < this.length; i++) this[i][e](t);
                    return this
                }
            }), t.length > 0) {
            var e = t[0];
            for (var i in e) {
                var h = e[i];
                "function" == typeof h && ! function(e) {
                    t[i] = function() {
                        for (var i = [], s = 0; s < t.length; s++) i.push(e.apply(t[s], arguments));
                        return i
                    }
                }(h)
            }
        }
        return t.attr = function(t, e) {
            if (null != t && null != e)
                for (var i = 0; i < this.length; i++) this[i][t] = e;
            else {
                if (null != t && "string" == typeof t) {
                    for (var s = [], i = 0; i < this.length; i++) s.push(this[i][t]);
                    return s
                }
                if (null != t)
                    for (var i = 0; i < this.length; i++)
                        for (var n in t) this[i][n] = t[n]
            }
            return this
        }, t
    }

    function s(s) {
        var n = [],
            h = [];
        this instanceof t.Stage ? (n = this.childs, h = h.concat(n)) : this instanceof t.Scene ? n = [this] : h = this, n.forEach(function(t) {
            h = h.concat(t.childs)
        });
        var o = null;
        return o = "function" == typeof s ? h.filter(s) : e(h, s), o = i(o)
    }
    var n = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",");
    t.Stage.prototype.find = s, t.Scene.prototype.find = s
}(JTopo),
function(t) {
    function e(t, e) {
        this.x = t, this.y = e
    }

    function i(t) {
        this.p = new e(0, 0), this.w = new e(1, 0), this.paint = t
    }

    function s(t, e, i) {
        return function(s) {
            for (var n = 0; e > n; n++) t(), i && s.turn(i), s.move(3)
        }
    }

    function n(t, e) {
        var i = 2 * Math.PI;
        return function(s) {
            for (var n = 0; e > n; n++) t(), s.turn(i / e)
        }
    }

    function h(t, e, i) {
        return function(s) {
            for (var n = 0; e > n; n++) t(), s.resize(i)
        }
    }

    function o(t) {
        var e = 2 * Math.PI;
        return function(i) {
            for (var s = 0; t > s; s++) i.forward(1), i.turn(e / t)
        }
    }

    function a(t) {
        var e = 4 * Math.PI;
        return function(i) {
            for (var s = 0; t > s; s++) i.forward(1), i.turn(e / t)
        }
    }

    function r(t, e, i, s) {
        return function(n) {
            for (var h = 0; e > h; h++) t(), n.forward(1), n.turn(i), n.resize(s)
        }
    }
    var l = {};
    i.prototype.forward = function(t) {
        var e = this.p,
            i = this.w;
        return e.x = e.x + t * i.x, e.y = e.y + t * i.y, this.paint && this.paint(e.x, e.y), this
    }, i.prototype.move = function(t) {
        var e = this.p,
            i = this.w;
        return e.x = e.x + t * i.x, e.y = e.y + t * i.y, this
    }, i.prototype.moveTo = function(t, e) {
        return this.p.x = t, this.p.y = e, this
    }, i.prototype.turn = function(t) {
        var e = (this.p, this.w),
            i = Math.cos(t) * e.x - Math.sin(t) * e.y,
            s = Math.sin(t) * e.x + Math.cos(t) * e.y;
        return e.x = i, e.y = s, this
    }, i.prototype.resize = function(t) {
        var e = this.w;
        return e.x = e.x * t, e.y = e.y * t, this
    }, i.prototype.save = function() {
        return null == this._stack && (this._stack = []), this._stack.push([this.p, this.w]), this
    }, i.prototype.restore = function() {
        if (null != this._stack && this._stack.length > 0) {
            var t = this._stack.pop();
            this.p = t[0], this.w = t[1]
        }
        return this
    }, l.Tortoise = i, l.shift = s, l.spin = n, l.polygon = o, l.spiral = r, l.star = a, l.scale = h, t.Logo = l
}(window);