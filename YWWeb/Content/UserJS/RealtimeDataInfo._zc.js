var vm = new Vue({
    el: "#app",
    data: {
        pageNumMax: 0,
        pageSize: 0,
        pageNum: 1,
        PID: $.cookie('cookiepid'),
        DID: 0,
        CID: 0,
        DTID: 0,
        DeviceTypeNameList: [], //类别
        DeviceNameList: [], //设备名称
        CNameList: [], //回路/调度号

        loading: true,
        style: {
            tab: {
                width: '100%',
                margin: '10px',
            },
        },
        columns: [{
            title: '类别',
            key: 'DeviceTypeName',
            align: 'center',
            height: '40px',
        }, {
            title: '设备名称',
            key: 'DeviceName',
            align: 'center'

        }, {
            title: '回路/调度号',
            key: 'CName',
            align: 'center'
        }, {
            title: '监测类型',
            key: 'Position',
            align: 'center'
        }, {
            title: '测值',
            key: 'PV',
            align: 'center',
        }, {
            title: '单位',
            key: 'Units',
            align: 'center'
        }, {
            title: '采集时间',
            key: 'RecTime',
            align: 'center',
        }],
        data: [],
    },
    watch: {
        newPV: {
            handler: function(val, oldVal) {
                var that = this;
                if (oldVal.length == 0 || !oldVal[0]) {
                    return
                }
                for (let i = 0; i < val.length; i++) {
                    if (oldVal[i] != val[i]) {
                        this.data[i].cellClassName.PV = 'activat';
                        setTimeout(function() {
                            that.data[i].cellClassName.PV = '';
                        }, 700)

                    }
                }
            },
            deep: true,
        },
        newRecTime: {
            handler: function(val, oldVal) {
                var that = this;
                if (oldVal.length == 0 || !oldVal[0]) {
                    return
                }
                for (let i = 0; i < val.length; i++) {
                    if (oldVal[i] != val[i]) {
                        this.data[i].cellClassName.RecTime = "activat";
                        setTimeout(function() {
                            that.data[i].cellClassName.RecTime = "";
                        }, 700)

                    }
                }
            },
            deep: true,
        }
    },
    computed: {
        newPV: function() {
            for (var a = 0, arr = []; a < this.data.length; a++) {
                if (this.data[a]) {
                    arr.push(this.data[a].PV);
                }
            }
            return arr;
        },
        newRecTime: function() {
            for (var a = 0, arr = []; a < this.data.length; a++) {
                if (this.data[a]) {
                    arr.push(this.data[a].RecTime);
                }
            }
            return arr;
        },
    },
    methods: {
        changePage: function(e) {
            this.pageNum = e;
            this.tab();
        },
        tab: function(a) {
            var that = this;
            if (a == 1) {
                that.BindDevice();
                that.Bind();
            } else if (a == 2) {
                that.Bind();
            }


            that.loading = true;
            this.$http({
                url: '/DataInfo/GetTaskJson',
                method: 'Post',
                body: {
                    pid: that.PID,
                    pageSize: that.pageSize,
                    pageNum: that.pageNum,
                    did: parseInt(that.DID),
                    cid: parseInt(that.CID),
                    tdid: parseInt(that.DTID)
                }
            }).then(function (res) {
                console.log(res.data)
                for (var i = 0, arr = []; i < res.data.aaData.length; i++) {
                    arr.push(res.data.aaData[i].TagID);
                    res.data.aaData[i].PV = '';
                    res.data.aaData[i].RecTime = '';
                    res.data.aaData[i].cellClassName = { PV: '', RecTime: '' }
                }
                that.data = res.data.aaData;


                that.loading = false;
                that.pageNumMax = res.data.iTotalRecords;
                that.PV(arr.join(','));
            }).catch(function(e) {
                throw new ReferenceError(e.message);
                that.loading = false;
            })
        },
        PV: function(str) {
            var that = this;
            this.$http({
                url: '/DataInfo/GetTagIdPV',
                method: 'Post',
                body: {
                    pid: that.PID,
                    tages: str || '0'
                }
            }).then(function(res) {
                if (res.data.length > 0) {
                    that.merge(that.data, res.data);
                }
            }).catch(function(e) {
                throw new ReferenceError(e.message);
            })
        },
        merge: function(data, pv) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < pv.length; j++) {
                    if (data[i].TagID == pv[j].TagID) {
                        data[i].PV = pv[j].PV;
                        data[i].RecTime = this.conversionDate(pv[j].RecTime.replace(/\//g, "").replace(/Date\(/g, "").replace(/\)/g, ""));
                    }
                }
            }
        },
        merge1: function(data, pv) {
            for (var i = 0; i < data.length; i++) {
                for (var j in pv) {
                    if (data[i].TagID == j) {
                        data[i].PV = Number(pv[j].PV);
                        data[i].RecTime = this.conversionDate((new Date()).valueOf());
                    }
                }
            }
        },
        conversionDate: function(str) {
            var time = new Date(parseInt(str));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var str = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
            return str
        },
        add0: function(m) { return m < 10 ? '0' + m : m },
        mqtt: function() {
            var that = this;
            var wsbroker, wsport

            if (location.protocol == "https:") {
                wsbroker = "yw.ife360.com";
                wsport = 15673;
            } else {
                wsbroker = "59.110.153.200";
                wsport = 15675;
            }
            //连接选项
            var client;
            var options = {
                timeout: 30,
                userName: "webguest",
                password: "!@#23&Qbn",
                keepAliveInterval: 10,
                onSuccess: function(e) {
                    console.log(("连接成功"));
                    client.subscribe('/ny/' + that.PID, {
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
            client.onMessageArrived = function(res) {
                var payload = JSON.parse(res.payloadString);
                var data = payload.content;
                if (!payload.type) {
                    return;
                }
                if (payload.type == 6) {
                    that.merge1(that.data, data)
                }
            }
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        BindValueType: function() {
            var that = this;
            this.$http({
                url: '/BaseInfo/BindValueType',
                method: 'Post',
                body: {
                    pid: this.PID,
                }
            }).then(function(res) {
                that.DeviceTypeNameList = res.data;
                that.DTID = res.data[0].DTID;
                that.progress++;
            }).catch(function(e) {
                throw new ReferenceError(e.message);
            })

        },
        BindDevice: function(a, b) {
            var that = this;
            this.$http({
                url: '/DataInfo/BindDevice',
                method: 'Post',
                body: {
                    pid: a,
                    DTID: b || 1
                }
            }).then(function(res) {
                that.DeviceNameList = res.data;
                that.progress++;
                that.DID = res.data[0].DID;
            }).catch(function(e) {
                throw new ReferenceError(e.message);
            })
        },
        Bind: function() {
            var that = this;
            that.$http({
                url: '/DataInfo/BindC',
                method: 'Post',
                body: {
                    pid: that.PID,
                    DID: that.DID || 1,
                    DTID: that.DTID || 1
                }
            }).then(function(res) {
                that.CNameList = res.data;
                that.CID = res.data[0].CID;
                that.progress++;
            }).catch(function(e) {
                throw new ReferenceError(e.message);
            })

        }

    },
    beforeMount: function() {
        var that = this;
        that.progress = 0;
        that.BindValueType(that.PID);
        that.BindDevice(that.PID, 1);
        that.Bind(that.PID, 0, 1);

    },
    mounted: function() {
        var that = this;
        that.style.tab.height = that.$refs.main.clientHeight - that.$refs.body.$el.offsetTop - that.$refs.foot.clientHeight * 2 + 'px';
        that.pageSize = parseInt((parseInt(that.style.tab.height) - document.getElementsByTagName('th')[0].clientHeight - 1) / document.getElementsByTagName('td')[0].clientHeight) - 1;

        var timer = setInterval(function() {

            if (that.progress == 3) {
                that.tab();
                clearInterval(timer);
            }
        }, 500)

        that.mqtt();

    }
})