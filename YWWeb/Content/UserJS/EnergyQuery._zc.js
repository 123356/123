new Vue({
    el: "#app",
    data: {
        loading: true,
        UID: null,
        tableHeight: 0,
        dateType: 0,
        tableCol: [
            {
                title: '时间',
                align: 'center',
                key: 'RecordTime',
            },
            {
                title: '科室',
                align: 'center',
                key: 'Name',
            },
            {
                title: '设备',
                align: 'center',
                key: 'DeviceName',
            },
            {
                title: '能耗',
                align: 'center',
                key: 'DValue',
                sortable: true
            },
            {
                title: '类型',
                align: 'center',
                key: 'TypeName',
            },

        ],
        tableData: [],
        searchForm: {
            time: null,//日期
            did: null,//设备
            ksid: [],//科室
            cotypeid: null,//能源类型
        },
        typeList: [],
        departMentList: [],
        deviceList: []
    },
    methods: {
        //类型下拉框
        getCollectDevTypeList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetCollectDevTypeList',
                method: 'get',
            }).then(function (res) {
                // console.log(res.data)
                that.typeList = res.data
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //科室下拉框
        getDepartMentList: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMSetting/GetHistoryList",
                method: "post",
                body: {
                    unitID: that.UID,
                    item_type: 2
                }
            }).then(function (res) {
                that.departMentList = res.data
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //设备下拉框
        getDeviceCombox: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetDeviceCombox',
                method: 'post',
            }).then(function (res) {
                that.deviceList = res.data
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //查询
        getEneryList: function () {
            this.loading = true
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryList',
                method: 'post',
                body: {
                    uid: that.UID,
                    time: that.formaterDate(),
                    did: that.searchForm.did,
                    cotypeid: that.searchForm.cotypeid,
                    ksid: [...that.searchForm.ksid].join(',').toString()
                }
            }).then(function (res) {
                that.tableData = res.data
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        formaterDate: function () {
            if (this.searchForm.time) {
                var temp = new Date(this.searchForm.time)
                return temp.toLocaleDateString().replace(/\//g, "-") + " " 
            }
            return ""
        },
        setHeight: function () {
            this.tableHeight = $(".bottomView").height() - 36
        }
    },
    beforeMount: function () {
        this.UID = $.cookie("enUID")
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".bottomView .con").height()
        }, 100)
        this.getCollectDevTypeList()
        this.getDepartMentList()
        this.getDeviceCombox()
        this.getEneryList()
    },
    mounted: function () {
    }
})



