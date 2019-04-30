new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        dateType: 0,
        activeIndex: 0,
        frameSrc: '',
        comList: [],
        unitID: null,
        selectedCom: 0,
        thirdMenu: []
    },
    methods: {
        //获取三级菜单
        getThirdMenuInfo: function (mid) {
            var that = this
            var params = {
                mid: mid
            }
            getThirdMenuInfoAPI(params).then(function (res) {
                that.thirdMenu = res.data
                that.getUnitComobxList()
            }).catch(function (e) { throw new ReferenceError(e.message) })
        },
        //单位下拉框
        getUnitComobxList: function () {
            var that = this
            getUnitListDataAPI().then(function (res) {
                that.comList = res.data
                if (that.unitID == null) {
                    if (res.data.length > 0) {
                        that.unitID = res.data[0].UnitID
                        localStorage.setItem('UnitData', JSON.stringify({ enUID: that.unitID, enName: res.data[0].UnitName }))
                    }
                }
                else {
                    var count = 0
                    for (var i in res.data) {
                        if (that.unitID == res.data[i].UnitID) {
                            count++
                        }
                    }
                    if (count == 0) {
                        if (res.data.length > 0) {
                            that.unitID = res.data[0].UnitID
                            localStorage.setItem('UnitData', JSON.stringify({ enUID: that.unitID, enName: res.data[0].UnitName }))
                        }
                    } else {
                        for (var i in res.data) {
                            if (that.unitID == res.data[i].UnitID) {
                                localStorage.setItem('UnitData', JSON.stringify({ enUID: that.unitID, enName: res.data[i].UnitName }))
                            }
                        }
                    }
                }
                that.selectedCom = that.unitID
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                if (that.thirdMenu.length > 0) {
                    that.frameSrc = that.thirdMenu[0].Location
                    console.log("frameSrc：" + that.frameSrc)
                }
            })
        },
        selectChange: function (res) {
            this.unitID = res.value
            //$.cookie("enUID", this.unitID, { expires: 7 })
            //$.cookie("enUName", res.label, { expires: 7 })
            localStorage.setItem('UnitData', JSON.stringify({ enUID: res.value, enName: res.label }))
            document.getElementById('energyFrame').contentWindow.location.reload(true);
        },
        userBtnClick: function (e, url) {
            if (this.activeIndex == e) {
                $("#energyFrame").attr("src", url)
            }
            this.activeIndex = e
            this.frameSrc = url
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.unitID = unitData.enUID
            }
        }
    },
    beforeMount: function () {
        var mid = window.location.search.split("=")[1]
        this.getUnitData()
        this.getThirdMenuInfo(mid)
        
    },
    mounted: function () { }
})
