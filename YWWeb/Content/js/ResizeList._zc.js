//datagrid宽度高度自动调整的函数
$.fn.extend({
    resizeDataGrid: function(pageHeight, pageWidth, heightMargin, widthMargin, minHeight, minWidth) {
        var height = pageHeight - heightMargin;
        var width = pageWidth - widthMargin;
        height = height < minHeight ? minHeight : height;
        width = width < minWidth ? minWidth : width;
        $(this).datagrid('resize', {
            height: height,
            width: width
        });
    }
});
var pageHeight, pageWidth;
if (typeof window.innerHeight != 'undefined') {
    //针对非IE8及其以下的浏览器
    pageHeight = window.innerHeight;
    pageWidth = window.innerWidth;
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    //    if (!isChrome) {
    //        pageHeight = pageHeight - 10;
    //    }
}


var vm = new Vue({
    el: "#powerControl",
    data: {
        modal: false, //模态框
        assist: {
            RefrigerationHeat: 0,
            weeks: [{
                    value: '1',
                    label: '周一'
                },
                {
                    value: '2',
                    label: '周二'
                },
                {
                    value: '3',
                    label: '周三'
                },
                {
                    value: '4',
                    label: '周四'
                },
                {
                    value: '5',
                    label: '周五'
                },
                {
                    value: '6',
                    label: '周六'
                },
                {
                    value: '7',
                    label: '周日'
                },
            ],
        },

        value: {
            DTU_CTR_TMP: {
                id: -1,
                temp: 16,
                modelStatu: null
            },
            DTU_CTR_MODEL: {
                id: -1,
                value: null
            },
            DTU_DI: {
                id: -1,
                value: null
            },
        }
    },
    methods: {
        ReadData(id) {
            var obj = {
                version: "v0.0.0.1",
                type: 2,
                content: { tagID: id, value: 0 }
            }
            this.send(JSON.stringify(obj));
        },
        SetData(id) {
            var obj = {
                version: "v0.0.0.1", type: 1,
                content: { tagID: id, value: null }
            }
            for (var key in this.value) {
                if (key == "DTU_CTR_TMP" && id == this.value[key].id) { //空调
                    if (this.value[key].modelStatu == null) {
                        vm.$Message.error("请先配置数据");
                        return
                    } else {
                        var arr = [];
                        if (this.assist.RefrigerationHeat == 1 && this.value[key].modelStatu == 1) {
                            arr[0] = 1;
                        } else if (this.value[key].modelStatu == 1) {
                            arr[0] = 3;
                        } else {
                            arr[0] = 0;
                        }
                        arr[1] = this.value[key].temp;
                    }
                    obj.content.value = this.byteToShort(arr);
                } else if (key == "DTU_CTR_MODEL" && id == this.value[key].id) { //季节
                    obj.content.value = this.value[key].value;
                } else if (key == "DTU_DI" && id == this.value[key].id) { //插座开关
                    obj.content.value = this.value[key].value;
                }
            }
            if (obj.content.value || obj.content.value==0 ) {
               this.send(JSON.stringify(obj));
            } else {
                vm.$Message.error("请先配置数据");
            }
        },
        intToBytes: function (value) {
            var bytes = new Array(2);
            bytes[0] = value & 0xff;
            bytes[1] = (value >> 8) & 0xFF
            return bytes;
        },
        byteToShort: function (value) {
            var bytes = (value[1] & 0xff) << 8 | (value[0]) & 0xff;
            return bytes;
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        intToBytes: function (value) 
        {
                var bytes = new Array(2);
                bytes[0] = value & 0xff;
                bytes[1] = (value >> 8) & 0xFF
                return bytes;
        },
        byteToShort: function (value) 
        {
            var bytes = (value[1] & 0xff) << 8 | (value[0]) & 0xff;
            return bytes;
        },
        mqtt() {
            var that = this;
            var wsbroker = "59.110.153.200";
            location.hostname;
            var wsport = 15675;
            //连接选项
            var client;
            var options = {
                timeout: 30,
                userName: "webctr",
                password: "!@#23&Qbn",
                keepAliveInterval: 10,
                onSuccess: function(e) {
                    console.log(("连接成功"));
                    client.subscribe('/ny/control_result/' + window.pid, {
                        qos: 2
                    });
                },
                onFailure: function(message) {
                    console.log("连接失败 ");
                    setTimeout(function() {
                        that.mqtt();
                    }, 10000);
                }
            };
            client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + this.guid());
            if (location.protocol == "https:") {
                console.log("https")
                options.useSSL = true;
            }
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
            client.onMessageArrived = function (res) {
                data = JSON.parse(res.payloadString);
                res = JSON.parse(data.content);
                console.log('接收');
                console.log(res)
                if (res.statu==1 && data.type == 1){
                    vm.$Message.success("配置成功");
                } else if (res.statu == 1 && data.type == 1){
                    vm.$Message.error("配置失败");
                if (res.PointType == "DTU_CTR_TMP") { //空调
                    that.assist.RefrigerationHeat = parseInt(res.modelStatu) == 1 ? 1 : 0;
                    that.value.DTU_CTR_TMP.modelStatu = parseInt(res.modelStatu) == 0? 0:1;
                    that.value.DTU_CTR_TMP.temp = parseInt(res.temp);
                    vm.$Message.success("读取成功");
                } else if (res.PointType == "DTU_CTR_MODEL") { //季节
                    that.value['DTU_CTR_MODEL'].value = parseInt(res.pv);
                    vm.$Message.success("读取成功");
                } else if (res.PointType == "DTU_DI") { //插座开关
                    that.value['DTU_DI'].value = parseInt(res.pv);
                    vm.$Message.success("读取成功");
                } 
            };
            //发送
            that.send = function (data) {
                console.log('发送');
                console.log(data);
                var message = new Paho.MQTT.Message(data);
                message.destinationName = '/ny/control/' + window.pid;
                client.send(message);
            }
        }
    }
})
function power() {
    if ($('#list_data').datagrid('getSelected')) {
        $.post("/energyManage/EMSetting/GetTageID", { "pid": pid, "cid": parseInt($('#list_data').datagrid('getSelected').CID) }, function(data) {
            for (var a = 0, b = 0; a < data.length; a++) {
                var obj = vm.value[data[a]['数据类型']];
                if (obj) {
                    b += data[a].TagID;
                    obj.id = data[a].TagID
                }
            }
            if (b > 0) {
                vm.modal = !vm.modal
            } else {
                vm.$Message.warning("该回路没有采集数据");
            }
        });
    } else {
        vm.$Message.warning("请选择回路");
    }
}



$('#list_data').resizeDataGrid(pageHeight, pageWidth, 2, 10, 0, 0);
$(window).resize(function() {
    var pageHeight, pageWidth;
    if (typeof window.innerHeight != 'undefined') {
        //针对非IE8及其以下的浏览器
        pageHeight = window.innerHeight;
        pageWidth = window.innerWidth;
        var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
        //        if (!isChrome) {
        //            pageHeight = pageHeight - 10;
        //        }
    }
    $('#list_data').resizeDataGrid(pageHeight, pageWidth, 2, 10, 0, 0);
});