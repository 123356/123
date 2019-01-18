new Vue({
    el: "#app",
    data: {
        tableHeight: 0,
        dateType:0,
        tableCol: [
            {
                title: '时间',
                align: 'center',
                key: 'time',
            },
            {
                title: '科室',
                align: 'center',
                key: 'department',
            },
            {
                title: '设备',
                align: 'center',
                key: 'sb',
            },
            {
                title: '能耗',
                align: 'center',
                key: 'energy',
                sortable: true
            },
            {
                title: '类型',
                align: 'center',
                key: 'type',
            },
            
        ],
        tableData: [
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', },
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', },
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', },
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100, type: '水',  },
        ],
        searchForm: {
            time: null,
            equipment: null,
            department: [],
            people: null,
            type: null,
            floor:null
        },
        typeList: [],
        departMentList:[]
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
                console.log(e)
            })
        },
        //科室下拉框
        getDepartMentList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetComobxList',
                method: 'get',
            }).then(function (res) {
                that.departMentList = res.data
            }).catch(function (e) {
                console.log(e)
            })
        },
        setHeight: function () {
            this.tableHeight = $(".bottomView").height() - 36
        }
    },
    beforeMount: function () {
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".bottomView .con").height() 
        }, 100)
        this.getCollectDevTypeList()
        this.getDepartMentList()
    },
    mounted: function () {
        
    }
})


$(function () {


    
})
