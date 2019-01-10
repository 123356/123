new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        analysisTableHeight:0,
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                key: 'time'
            },
            {
                title: '用水(m³)',
                align: 'center',
                key: 'water'
            },
            {
                title: '用电(kW·h)',
                align: 'center',
                key: 'power'
            },
            {
                title: '用热',
                align: 'center',
                key: 'heat'
            },
            {
                title: '温度(°C)',
                align: 'center',
                width: 60,
                key: 'temperature'
            },
            {
                title: '人流量(人)',
                align: 'center',
                width: 100,
                key: 'visitorsFlowrate'
            },
            {
                title: '建筑面积(㎡)',
                align: 'center',
                width: 100,
                key: 'area'
            },
           
        ],
        analysisData: [
            { time: '2018-12-22 12:35:00', water:123,  power: 124, heat:344,  temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
        ],
        barAndLineChart: null,
        dateType:0,
        treeData: [
            {
                title: '医院楼层结构',
                id:0,
                expand: true,//是否打开子节点
                children: [
                    {
                        title: '一楼',
                        expand: true,
                        id:1,
                        children: [
                            {
                                title: '内科',
                                expand: true,
                                id:2,
                                children: [
                                    {
                                        title: '内科诊室一',
                                        id:3
                                    },
                                    {
                                        title: '内科诊室二',
                                        id:4
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ],
        userMneus: [
            { name: '能源总览', url: '/EnergyEfficiency/EnergyOverview' },
            { name: '能源分析', url: '/EnergyEfficiency/DepartDataMonitoring' },
            { name: '能源消耗', url: '/EnergyEfficiency/Consume' },
            { name: '能源公示', url: '/EnergyEfficiency/EnergyPublicity' },
            { name: '预算管理', url: '/EnergyEfficiency/BudgetSetting' },
            { name: '能源查询', url: '/EnergyEfficiency/EnergyQuery' },
            { name: '能源审计', url: '/EnergyEfficiency/EnergyAudit' },
            { name: '能源报告', url: '/EnergyEfficiency/ElectricityReport' },
            
        ],
        activeIndex: 0,
        frameSrc:'/EnergyEfficiency/EnergyOverview'
    },
    methods: {


        selectChange: function (res) {
            console.log(res[0].id)
        },
        userBtnClick: function (e) {
            if (this.activeIndex == e) {
                $("#energyFrame").attr("src", this.userMneus[e].url)
            }
                this.activeIndex = e
            console.log(this.userMneus[e].url)
            this.frameSrc = this.userMneus[e].url

        },
        setWidth: function () {
            var that = this
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.leftWidth = width + 52
            }
        },
        setHeight: function () {
           // this.listHeight = $(".left .list").height() - 21
            this.analysisTableHeight = $(".right .bottom").height()-40
        }
    },
    beforeMount: function () {
        var that = this
       /*function setWidth2() {
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.listWidth = width + 32 
            }
        }
      
        setWidth2()
        */
        setInterval(function () {
            //setWidth2()
            that.setHeight()
        }, 100)
        
       
       
    },
    mounted: function () {
        /*this.createBarAndLine()
        window.addEventListener("resize", () => {
            barAndLineChart.resize();
        });*/
    }
})

function setScroll() {
    var scroll = $(".left .treeList").scrollTop()
    if (scroll == 1) {
        $(".left .treeList").scrollTop(0)
    } else {
        $(".left .treeList").scrollTop(1)
    }
    $(".left .treeList").scroll(function () {
        var width = $(".left .treeList").width()
        $(this).width(width + 32)
        $(".left .treeList").css("padding-right", "15px")
    })
}
$(function () {
   
    setScroll()
    window.onresize = function () {
        setScroll()
    };

    
})
