new Vue({
    el: '#DistributionReport',
    data: {
        loading: true,
        UID: null,
        UnitName: null,
        comList: [],
        cruPname: null,
        PID: null,
        userBtn: [],
        userTypeList: [],
        userType: null,
        dateType: 1,
        dateTypeText: 'date',
        stationList: [],
        userType: null,
        dateTime: new Date(),
        info: [],
        xTotal: [],
        sumTotal: 0,
        curTimeStr: null,
        times: []
    },
    methods: {
        //单位下拉框
        getUnitComobxList: function () {

            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetUnitComobxList',
                method: 'get',
            }).then(function (res) {
                that.comList = res.data
                if (that.UID == null) {
                    if (res.data.length > 0) {
                        that.UID = res.data[0].UnitID
                        localStorage.setItem('UnitData', JSON.stringify({ enUID: that.UID, enName: res.data[0].UnitName }))
                    }
                }
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
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
        dateChange: function () {
            
        },
        formaterDate: function () {
            var time = new Date(this.dateTime)
            if (this.dateType == 1) {
                time = time.toLocaleDateString().replace(/\//g, "-")
            } else if (this.dateType == 2) {
                time = time.getFullYear() + "-" + (time.getMonth() + 1)
            } else if (this.dateType == 3) {
                time = time.getFullYear()
            }
            return time
        },
        getTimes: function () {
            var arr = new Array()
            switch (this.dateType) {
                case 1:
                    for (var i = 1; i < 25; i++) {
                        if (i < 10) {
                            arr.push("0" + i + ":00")
                        } else {
                            arr.push(i + ":00")
                        }
                    }
                    this.times = arr
                    break
                case 2:
                    var temp = new Date(this.dateTime)
                    temp = new Date(temp.getFullYear(), (temp.getMonth() + 1), 0)
                    col = temp.getDate()
                    for (var i = 1; i <= col; i++) {
                        arr.push(i)
                    }
                    this.times = arr
                    break
                case 3:
                    for (var i = 1; i < 13; i++) {
                        arr.push(i)
                    }
                    this.times = arr
                    break
            }
        },
        getReport: function () {
            var that = this
            //this.getUrlParam()
            this.$http({
                url: '/ReportForms/getPowerQualityData',
                method: 'POST',
                params: {
                    pid: this.PID,
                    Time: this.formaterDate(),
                    type: this.dateType,
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
        totalCom: function (data) {
            var sumTotal = 0
            var xTotal = []
            var arr = []
            for (var i in data) {
                for (var j in data[i].list_data) {
                    arr.push(data[i].list_data[j].Value)
                    for (var n in data[i].list_data[j].Value) {
                        sumTotal += isNaN(parseFloat(data[i].list_data[j].Value[n])) ? 0 : parseFloat(data[i].list_data[j].Value[n])
                    }
                }
            }
            var col = 0
            switch (this.dateType) {
                case 1:
                    col = 24
                    break
                case 2:
                    var temp = new Date(this.dateTime)
                    temp = new Date(temp.getFullYear(), (temp.getMonth() + 1), 0)
                    col = temp.getDate()
                    break
                case 3:
                    col = 12
                    break
            }
            for (var h = 0; h < col; h++) {
                var count = 0
                for (var i in arr) {
                    for (var j in arr[i]) {
                        if (h == j) {
                            count += isNaN(parseFloat(arr[i][j])) ? 0 : parseFloat(arr[i][j])
                        }
                    }
                }
                xTotal.push({
                    "index": h,
                    "val": count.toFixed(2)
                })
            }
            this.sumTotal = sumTotal.toFixed(2)
            this.xTotal = xTotal
        },
        stationChange: function (e) {
            this.cruPname = e.label
            this.PID = e.value
            $.cookie('cookiepid', this.PID, { expires: 7, path: '/' });
        },
        //用电类型
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

        dateTypeChange: function (e) {
            switch (e) {
                case 1:
                    this.dateTypeText = "date"
                    break
                case 2:
                    this.dateTypeText = "month"
                    break
                case 3:
                    this.dateTypeText = "year"
                    break
            }
        },
        comChange: function (e) {
            this.UID = e.value,
            this.UnitName = e.label
            localStorage.setItem('UnitData', JSON.stringify({ enUID: e.value, enName: e.label }))
        },
        //打印
        openOrPrint: function () {
            $(".reportView").show()
            $(".newReport").hide()
            window.print()
            $(".reportView").hide()
            $(".newReport").show()

        },
        //导出
        ExcelPort: function () {
            var time =
                window.open('/ReportForms/ExportData?pid=' + this.PID + "&Time=" + this.formaterDate() + "&isHide=false" + "&type=" + this.dateType + "&itemtype=" + this.userType, '_blank');
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
        userMenuClick: function (e) {
            switch (e) {
                case 'dosearch()':
                    this.loading = true
                    this.getReport()
                    this.getTimes()
                    this.curTimeStr = this.formaterDate()
                    this.setHeight()
                    break;
            }
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.UID = unitData.enUID
                this.UnitName = unitData.enName
            }
        }
    },
    beforeMount: function () {
        this.getUnitData()
        this.getUnitComobxList()
        this.getTimes()
        this.getUserBtn()
        this.getStation()
        this.curTimeStr = this.formaterDate()


    },
    mounted: function () {

    }
})