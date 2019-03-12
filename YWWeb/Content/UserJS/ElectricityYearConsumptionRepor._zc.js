new Vue({
    el: '#yearReport',
    data: {
        loading:true,
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        info: [],
        PID: null,
        year: null,
        userType: null,
        stationList: [],
        userTypeList: [],
        reportInfo: null,
        userBtn: [],
        cruPname: '',
        curTimeStr: '',
        monthTotal:[],
        yearTotal:0
    },
    methods: {
        //获取站室信息
        getStation: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindPDRInfo?showall=0',
                method:'POST'
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
        stationChange: function (val) {
            this.cruPname = val.label
            this.PID = val.value
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
                    iType:2
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
                    Time: new Date(this.year).getFullYear(),
                    type: 3,
                    itemtype: this.userType
                }
            })
                .then(function (res) {
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
                that.totalCom(res.data)
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
                that.setHeight()
            })
        },
        setHeight: function () {
            $(".pHeight").each(function () {
                var pHeight = $(this).context.clientHeight
                var cHeight = $(this).parent().find(".cHeight").height()
                if (pHeight > cHeight) {
                    $(this).parent().find(".cHeight").height(pHeight + 1)
                } else {
                    $(this).parent().find(".cHeight").css("height", "100%")
                }

            })
        },
        //计算总额
        totalCom: function (data) {
            var monthTotal = []
            var yearTotal = 0
            var arr = []
            for (var i in data) {
                for (var j in data[i].list_data) {
                    arr.push(data[i].list_data[j].Value)
                    for (var n in data[i].list_data[j].Value) {
                        yearTotal += isNaN(parseFloat(data[i].list_data[j].Value[n])) ? 0 : parseFloat(data[i].list_data[j].Value[n])
                    }
                    
                }
            }
            for (var h = 0; h < 12; h++) {
                var count = 0
                for (var i in arr) {
                    for (var j in arr[i]) {
                        if (h == j) {
                            count += isNaN(parseFloat(arr[i][j])) ? 0 : parseFloat(arr[i][j])
                        }
                    }
                }
                monthTotal.push({
                    "index": h,
                    "val": count.toFixed(2)
                })
            }
            this.monthTotal = monthTotal
            this.yearTotal = yearTotal.toFixed(2)
        },
        //打印
        openOrPrint: function () {
           // window.open('/ReportForms/ElectricityYearConsumptionRepor?pid=' + this.PID + "&Time=" + new Date(this.year).getFullYear() + "&isHide=false", '_blank');
            window.print()
        },
        //导出
        ExcelPort: function () {
            window.open('/ReportForms/ExportData?pid=' + this.PID + "&Time=" + new Date(this.year).getFullYear() + "&isHide=false" + "&type=" + 3 + "&itemtype=" + this.userType, '_blank');
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
        dateChange: function () {
            this.curTimeStr = new Date(this.year).getFullYear().toString()
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
        this.year = new Date().getFullYear().toString()
        this.curTimeStr = new Date().getFullYear().toString()
        this.getUserBtn()
        this.getStation()
    }
})