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
            {
                title: '楼层',
                align: 'center',
                key: 'floor',
                sortable: true
            },
        ],
        tableData: [
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', floor:1},
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', floor:2 },
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100,  type: '水', floor: 3 },
            { time: '2018-12-28', department: '内科', sb: '设备1', energy: 100, type: '水', floor: 4 },
        ],
        searchForm: {
            time: null,
            equipment: null,
            department: [],
            people: null,
            type: null,
            floor:null
        },
        
    },
    methods: {
        setHeight: function () {
            this.tableHeight = $(".bottomView").height() - 36
            console.log("height")
        }
    },
    beforeMount: function () {
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".bottomView .con").height() 
        }, 100)
    },
    mounted: function () {
        
    }
})


$(function () {


    
})
