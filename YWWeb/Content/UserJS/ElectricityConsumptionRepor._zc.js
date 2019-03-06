new Vue({
    el: '#dayReport',
    data: {
        loading: true,
        hours: [],
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
        tdWidth: 0,
        isHide: true,
        dayTotal: 0,
        hourTotal: []
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
        },
        //用户类型
        getUserType: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindCircuitTypeByPID',
                method: 'POST',
                params: {
                    PID: this.PID,
                    iType: 0
                }
            })
                .then(function (res) {

                    if (res.data.length > 0) {
                        that.userTypeList = res.data
                        that.userType = res.data[0].id
                    }

                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //报表查询
        getReport: function () {
            var that = this
            //this.getUrlParam()
            this.$http({
                url: '/ReportForms/getPowerQualityData',
                method: 'POST',
                params: {
                    pid: this.PID,
                    Time: this.getDate(),
                    type: 1
                }
            })
                .then(function (res) {
                    that.info = res.data
                    that.totalCom(res.data)

                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                    
                })
                .finally(function () {
                    that.loading = false
                })
        },
        totalCom: function (data) {
            var dayTotal = 0
            var hourTotal = []
            var arr = []
            for (var i in data) {
                for (var j in data[i].list_data) {
                    arr.push(data[i].list_data[j].Value)
                    for (var n in data[i].list_data[j].Value) {
                        dayTotal += isNaN(parseFloat(data[i].list_data[j].Value[n])) ? 0 : parseFloat(data[i].list_data[j].Value[n])

                    }
                }
            }
            for (var h = 0; h < 24; h++) {
                var count = 0
                for (var i in arr) {
                    for (var j in arr[i]) {
                        if (h == j) {
                            count += isNaN(parseFloat(arr[i][j])) ? 0 : parseFloat(arr[i][j])
                        }
                    }
                }
                hourTotal.push({
                    "index": h,
                    "val": count.toFixed(2)
                })
            }
            this.dayTotal = dayTotal.toFixed(2)
            this.hourTotal = hourTotal
        },
        //打印
        openOrPrint: function () {
            //window.open('/ReportForms/ElectricityConsumptionRepor?pid=' + this.PID + "&Time=" + this.getDate() + "&isHide=false", '_blank');
            window.print()
        },
        //导出
        ExcelPort: function () {
            var time =
                window.open('/ReportForms/ExportData?pid=' + this.PID + "&Time=" + this.getDate() + "&isHide=false" + "&type=" + 1, '_blank');
        },
        getDate: function () {
            var date = new Date(this.dateTime)
            var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
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
        //获取每天小时数
        getHours: function () {
            var arr = new Array()
            for (var i = 1; i < 25; i++) {
                if (i < 10) {
                    arr.push("0" + i + ":00")
                } else {
                    arr.push(i + ":00")
                }
            }
            this.hours = arr
        },
        dateChange: function () {
            this.curTimeStr = this.getDate()
        },
        getUrlParam: function () {
            var par = window.location.search.substr(1).split("&")
            if (par.length > 1) {
                this.PID = par[0].split("=")[1]
                this.dateTime = par[1].split("=")[1]
                this.curTimeStr = par[1].split("=")[1]
                this.isHide = par[2].split("=")[1]
            }
        }
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


        this.dateTime = new Date()
        this.curTimeStr = this.getDate()
        this.getHours()
        this.getUserBtn()
        this.getStation()
    },
    mounted: function () {

    },
    created: function () {
    }
})