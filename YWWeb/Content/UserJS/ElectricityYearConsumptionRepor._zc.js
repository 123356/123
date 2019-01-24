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
        curTimeStr:''
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
        },
        //用户类型
        getUserType: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindCircuitTypeByPID',
                method: 'POST',
                params: {
                    PID: this.PID,
                    iType:0
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
            this.getUrlParam()
            this.$http({
                url: '/ReportForms/getPowerQualityData',
                method: 'POST',
                params: {
                    pid: this.PID,
                    Time: new Date(this.year).getFullYear(),
                    type:3
                }
            })
                .then(function (res) {
                    that.info = res.data
                    that.loading = false
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                    that.loading = false
                })
        },
        //打印
        openOrPrint: function () {
            window.open('/ReportForms/ElectricityYearConsumptionRepor?pid=' + this.PID + "&Time=" + new Date(this.year).getFullYear() + "&isHide=false", '_blank');
            window.print()
        },
        //导出
        ExcelPort: function () {
            window.open('/ReportForms/ExportData?pid=' + this.PID + "&Time=" + new Date(this.year).getFullYear()+ "&isHide=false" + "&type=" + 3, '_blank');
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
        getUrlParam: function () {
            var par = window.location.search.substr(1).split("&")
            if (par.length > 1) {
                console.log(par[0].split("=")[1])
                console.log(par[1].split("=")[1])
                this.PID = par[0].split("=")[1]
                this.year = par[1].split("=")[1]
                this.curTimeStr = par[1].split("=")[1]
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
        this.year = new Date().getFullYear().toString()
        this.curTimeStr = new Date().getFullYear().toString()
        this.getUserBtn()
        this.getStation()
    }
})