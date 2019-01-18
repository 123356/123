﻿new Vue({
    el: "#app",
    data: {
        tableHeight: 0,
        dateType:0,
        tableCol: [
            {
                title: '2019年新源医院能源消耗周报表',
                align: 'center',
                children: [
                    {
                        title: '日期',
                        align: 'center',
                        key: 'dateTime',
                    },
                    {
                        title: '报表类型',
                        align: 'center',
                        key: 'reportType',
                    },
                    {
                        title: '用电量(kW·h)',
                        align: 'center',
                        key: 'elec',
                    },
                    {
                        title: '同比上月%',
                        align: 'center',
                        key: 'elecTb',
                    },
                    {
                        title: '用水(m³)',
                        align: 'center',
                        key: 'water',
                    },
                    {
                        title: '同比上月%',
                        align: 'center',
                        key: 'waterTb',
                    },
                    {
                        title: '总计费用(万)',
                        align: 'center',
                        key: 'money',
                    },
                    {
                        title: '同比上月%',
                        align: 'center',
                        key: 'moneyTb',
                    },
                ]
            },


            
            
        ],
        tableData: [
            { dateTime: '1月2日', reportType: '内科能耗周报表', elec: 100, elecTb: 3, water: 120, waterTb: 5, money: 12, moneyTb: 4 },
            { dateTime: '1月2日', reportType: '内科能耗周报表', elec: 100, elecTb: 3, water: 120, waterTb: 5, money: 12, moneyTb: 4 },
            { dateTime: '1月3日', reportType: '内科能耗周报表', elec: 100, elecTb: 3, water: 120, waterTb: 5, money: 12, moneyTb: 4 },
        ],
        reportType: [
            { name: 0, type: '总报表' }, { name: 1,type: '科室报表' },
        ],
        departmentList: [
            { id: 0, name: '眼科' }, { id: 1, name: '内科' }, { id: 2, name: '外科' }
        ],
        curDateType: 'date',
        curReportType: 0,
        closable:true,
        curDepart:0,
        
    },
    methods: {
        dateTypeChange: function (e) {
            console.log(e)
            var that = this
            switch (parseInt(e)) {
                case 0:
                    that.curDateType = 'date'
                    //that.tableCol[0].children[3].title = '同比昨日%'
                    
                    console.log(that.curDateType)
                    break;
                case 1:
                    this.curDateType = 'date'
                    console.log(that.curDateType)
                    break;
                case 2:
                    that.curDateType = 'month'
                    console.log(that.curDateType)
                    break
                case 3:
                    that.curDateType = 'year'
                    console.log(that.curDateType)
                    break;
            }
        },
        departmentChange: function (e) {

        },
        dropdownClick: function (e) {
            console.log(e)
            this.curReportType = e
        },

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
