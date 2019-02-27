var vm = new Vue({
    el: "#app",
    data: {
        pageNumMax: 0,
        pageSize: 0,
        pageNum: 1,
        PID: 12,
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
            height: '40px'
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
            align: 'center'
        }, {
            title: '单位',
            key: 'Units',
            align: 'center'
        }, {
            title: '采集时间',
            key: 'RecTime',
            align: 'center'
        }],
        data: []
    },
    methods: {
        changePage: function(e) {
            this.pageNum = e;
            this.tab();
        },
        tab: function() {
            var that = this;
            that.loading = true;
            // that.pageNum = 1;
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
            }).then(function(res) {
                for (var i = 0, arr = []; i < res.data.aaData.length; i++) {
                    arr.push(res.data.aaData[i].TagID);
                    res.data.aaData[i].PV = '';
                    res.data.aaData[i].RecTime = '';
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
            this.$set(this.data, data);
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
            window.data = data;
            this.$set(this.data, data);
        },
        conversionDate: function(str) {
            var timetamp = new Date(parseInt(str));
            return timetamp.toLocaleDateString().replace(/\//g, "-") + " " + timetamp.toTimeString().substr(0, 8)
        },
        mqtt: function() {
            var that = this;
            var wsbroker = "59.110.153.200";
            location.hostname;
            var wsport = 15675;
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
                console.log(data)
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
        }

    },
    beforeMount: function() {
        var that = this;
        that.progress = 0;
        this.$http({
            url: '/BaseInfo/BindValueType',
            method: 'Post',
            body: {
                pid: that.PID,
            }
        }).then(function(res) {
            that.DeviceTypeNameList = res.data;
            that.DTID = res.data[0].DTID;
            that.progress++;
        }).catch(function(e) {
            throw new ReferenceError(e.message);
        })
        this.$http({
            url: '/DataInfo/BindDevice',
            method: 'Post',
            body: {
                pid: that.PID,
                DTID: that.DTID || 1
            }
        }).then(function(res) {
            that.DeviceNameList = res.data;
            that.progress++;
            that.DID = res.data[0].DID;
        }).catch(function(e) {
            throw new ReferenceError(e.message);
        })

        this.$http({
            url: '/DataInfo/BindC',
            method: 'Post',
            body: {
                pid: that.PID,
                DID: that.DID || 0,
                DTID: that.DTID || 1
            }
        }).then(function(res) {
            that.CNameList = res.data;
            that.CID = res.data[0].CID;
            that.progress++;
        }).catch(function(e) {
            throw new ReferenceError(e.message);
        })
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