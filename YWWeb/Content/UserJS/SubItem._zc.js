new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        dateType: 0,
        treeData: [{
            title: '医院楼层结构',
            id: 0,
            expand: true, //是否打开子节点
            children: [{
                title: '一楼',
                expand: true,
                id: 1,
                children: [{
                    title: '内科',
                    expand: true,
                    id: 2,
                    children: [{
                            title: '内科诊室一',
                            id: 3
                        },
                        {
                            title: '内科诊室二',
                            id: 4
                        }
                    ]
                }]
            }, ]
        }],
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
        frameSrc: '',
        comList: [],
        unitID: null,
        selectedCom: 0,
        thirdMenu: []

    },
    methods: {
        //获取三级菜单
        getThirdMenuInfo: function(mid) {
            var that = this
            this.$http({
                    url: '/Home/GetThirdMenuInfo2',
                    method: 'post',
                    params: {
                        mid: mid
                    }
                })
                .then(function(res) {
                    that.thirdMenu = res.data
                        /*if (res.data.length > 0) {
                            that.frameSrc = res.data[0].Location
                        }*/
                })
                .catch(function(e) {
                    throw new ReferenceError(e.message)
                })
        },
        //单位下拉框
        getUnitComobxList: function() {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetUnitComobxList',
                method: 'get',
            }).then(function(res) {
                that.comList = res.data
                if (that.unitID == null) {
                    if (res.data.length > 0) {
                        that.unitID = res.data[0].UnitID
                        $.cookie("enUID", that.unitID, { expires: 7 })
                        $.cookie("enUName", res.data[0].UnitName, { expires: 7 })
                    }
                }
                if (that.unitID != null) {
                    if (that.thirdMenu.length > 0) {
                        that.frameSrc = that.thirdMenu[0].Location
                    }
                }
                that.selectedCom = parseInt($.cookie("enUID"))

            }).catch(function(e) {
                throw new ReferenceError(e.message)
            })
        },
        selectChange: function(res) {
            this.unitID = res.value
            $.cookie("enUID", this.unitID, { expires: 7 })
            $.cookie("enUName", res.label, { expires: 7 })
            window.localStorage.setItem('UnitData', JSON.stringify({ UnitID: this.unitID, UnitName: res.label, PDRList: null }))
            document.getElementById('energyFrame').contentWindow.location.reload(true);
            console.log(JSON.parse(window.localStorage.getItem("UnitData")));
        },
        userBtnClick: function(e, url) {
            if (this.activeIndex == e) {
                $("#energyFrame").attr("src", url)
            }
            this.activeIndex = e
            this.frameSrc = url

        },
    },
    beforeMount: function() {
        var mid = window.location.search.split("=")[1]
        console.log(window.location)
        console.log(mid)
        var id = $.cookie("enUID")
        if (id != null) {
            this.unitID = id
        }
        this.getThirdMenuInfo(mid)
        this.getUnitComobxList()
    },
    mounted: function() {}
})

$(function() {


})