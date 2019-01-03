new Vue({
    el: "#app",
    data: {
        tableHeight: 0,
        dateType:0,
        tableCol: [
            {
                title: '序号',
                align: 'center',
                key: 'order',
            },
            {
                title: '名称',
                align: 'center',
                key: 'name',
            },
            {
                title: '台数',
                align: 'center',
                key: 'count',
            },
            {
                title: '流量m³/h',
                align: 'center',
                key: 'flow',
            },
            {
                title: '扬程m',
                align: 'center',
                key: 'lift',
            },
            {
                title: '电机功率kW',
                align: 'center',
                key: 'power',
            },
            {
                title: '运行时间',
                align: 'center',
                key: 'time',
            },
            
        ],
        tableData: [
            { order: 1, name: '消防泵', count: 1, flow: '100-200', lift: '123-321', power: 90, time: '234h' },
            { order: 2, name: '消防泵', count: 1, flow: '100-200', lift: '123-321', power: 90, time: '234h' },
            { order: 3, name: '消防泵', count: 1, flow: '100-200', lift: '123-321', power: 90, time: '234h' },
            { order: 4, name: '消防泵', count: 1, flow: '100-200', lift: '123-321', power: 90, time: '234h' },
        ],
        
    },
    methods: {



        setHeight: function () {
            this.tableHeight = $(".bottomView").height() 
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
