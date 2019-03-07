new Vue({
    el: '#monthReport',
    data: {
        loading: true,
        days: [],
        info: [],
        PID: null,
        dateTime: null,
        userType: null,
        stationList: [],
        userTypeList: [],
        reportInfo: null,
        userBtn: [],
        cruPname: '',
        curTimeStr: '',
        dayTotal: [],
        monthTotal: 0
    },
    methods: {
        //获取站室信息
        getStation: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindPDRInfo?showall=0',
                method: 'POST'
            })
                .then(function (res) {
                    that.stationList = res.data
                    if ($.cookie('cookiepid') > 0) {
                        that.PID = $.cookie('cookiepid')
                        for (var i = 0; i < res.data.length; i++) {
                            if (that.PID == res.data[i].PID) {
                                that.cruPname = res.data[i].Name
                            }
                        }
                    }
                    else if (res.data.length > 0) {
                        that.PID = res.data[0].PID
                        that.cruPname = res.data[0].Name
                    }
                    that.getUserType()
                    that.getReport()
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        stationChange: function (e) {
            this.cruPname = e.label
            this.PID = e.value
            $.cookie('cookiepid', this.PID, { expires: 7, path: '/' });
            this.getUserType();
        },
        //用户类型
        getUserType: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindCircuitTypeByPID',
                method: 'POST',
                params: {
                    PID: this.PID,
                    iType: 2
                }
            })
                .then(function (res) {

                    if (res.data.length > 0) {
                        that.userTypeList = res.data
                        that.userType = res.data[0].name
                    }

                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //报表查询
        getReport: function () {
            var that = this
            this.$http({
                url: '/ReportForms/getPowerQualityData',
                method: 'POST',
                params: {
                    pid: this.PID,
                    Time: this.getDate(),
                    type: 2,
                    itemtype: this.userType
                }
            })
                .then(function (res) {
                    
                    that.totalCom(res.data)
                    var data = res.data
                    for (var i in data) {
                        for (var j in data[i].list_data) {
                            var count = 0
                            for (var n in data[i].list_data[j].Value) {
                                count += isNaN(parseFloat(data[i].list_data[j].Value[n])) ? 0 : parseFloat(data[i].list_data[j].Value[n])
                            }
                            data[i].list_data[j].count = count.toFixed(2)
                        }
                    }

                    that.info = data
                    
                    
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                    
                })
        },
        //计算总额
        totalCom: function (data) {
            var monthTotal = 0
            var dayTotal = []
            var arr = []
            for (var i in data) {
                for (var j in data[i].list_data) {
                    arr.push(data[i].list_data[j].Value)
                    for (var n in data[i].list_data[j].Value) {
                        monthTotal += isNaN(parseFloat(data[i].list_data[j].Value[n])) ? 0 : parseFloat(data[i].list_data[j].Value[n])
                    }
                    
                }
            }
            for (var h = 0; h < this.days.length; h++) {
                var count = 0
                for (var i in arr) {
                    for (var j in arr[i]) {
                        if (h == j) {
                            count += isNaN(parseFloat(arr[i][j])) ? 0 : parseFloat(arr[i][j])
                        }
                    }
                }
                dayTotal.push({
                    "index": h,
                    "val": count.toFixed(2)
                })
            }
            this.dayTotal = dayTotal
            this.monthTotal = monthTotal.toFixed(2)
        },
        //打印
        openOrPrint: function () {
            //  window.open('/ReportForms/ElectricityMonthConsumptionRepor?pid=' + this.PID + "&Time=" + this.getDate() + "&isHide=false", '_blank');
            window.print()
        },
        //导出
        ExcelPort: function () {
            var time =
                window.open('/ReportForms/ExportData?pid=' + this.PID + "&Time=" + this.getDate() + "&isHide=false" + "&type=" + 2 + "&itemtype=" + this.userType, '_blank');
        },
        getDate: function () {
            var date = new Date(this.dateTime)
            var time = date.getFullYear() + "-" + (date.getMonth() + 1)
            return time
        },
        getUserBtn: function () {
            var that = this
            this.$http({
                url: "/SysInfo/UserButtonList2",
                method: 'post',
                params: {
                    CurrUrl: window.location.pathname
                }
            })
                .then(function (res) {

                    for (var i = 0; i < res.data.length; i++) {
                        res.data[i].src = '/Content/images/Icon16/' + res.data[i].Icon
                    }
                    that.userBtn = res.data
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        userMenuClick: function (e) {
            switch (e) {
                case 'dosearch()':
                    this.loading = true
                    this.getReport()
                    break;
            }
        },
        //获取每月天数
        getDays: function () {
            var curTime = new Date(this.dateTime)
            var d = new Date(curTime.getFullYear(), curTime.getMonth() + 1, 0);
            var arr = new Array()
            for (var i = 1; i <= d.getDate(); i++) {
                arr.push(i)
            }
            this.days = arr
        },
        dateChange: function () {
            this.getDays()
            this.curTimeStr = this.getDate()
        },
    },
    filters: {
        toFixed: function (value) {
            if (!value) {
                return ''
            }
            return value.toFixed(2)
        },
    },
    beforeMount: function () {
        this.dateTime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
        this.curTimeStr = this.getDate()
        this.getDays()
        this.getUserBtn()
        this.getStation()
    }
})