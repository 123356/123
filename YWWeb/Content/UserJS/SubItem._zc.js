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
            this.$http({
                url: '/Home/GetThirdMenuInfo2',
                method: 'post',
                body: {
                    mid: mid
                }
            })
            .then(function (res) {
                that.thirdMenu = res.data
               
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //单位下拉框
        getUnitComobxList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetUnitComobxList',
                method: 'get',
            }).then(function (res) {
                
                that.comList = res.data
                if (that.unitID == null) {
                    if (res.data.length > 0) {
                        that.unitID = res.data[0].UnitID
                        $.cookie("enUID", that.unitID, { expires: 7 })
                        $.cookie("enUName", res.data[0].UnitName, { expires: 7 })
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
                            $.cookie("enUID", res.data[0].UnitID, { expires: 7 })
                            $.cookie("enUName", res.data[0].UnitName, { expires: 7 })
                        }
                    } else {
                        that.unitID = parseInt($.cookie("enUID"))
                        for (var i in res.data) {
                            if (that.unitID == res.data[i].UnitID) {
                                $.cookie("enUName", res.data[i].UnitName, { expires: 7 })
                            }
                        }
                    }
                   
                }
                that.selectedCom = that.unitID

            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                if (that.thirdMenu.length > 0) {
                    that.frameSrc = that.thirdMenu[0].Location
                }
            })
        },
        selectChange: function (res) {
            this.unitID = res.value
            $.cookie("enUID", this.unitID, { expires: 7 })
            $.cookie("enUName", res.label, { expires: 7 })
            window.localStorage.setItem('UnitData', JSON.stringify({ UnitID: $.cookie("enUID"), UnitName: $.cookie("enUName"), PDRList: null }))
            document.getElementById('energyFrame').contentWindow.location.reload(true);
        },
        userBtnClick: function (e, url) {
            if (this.activeIndex == e) {
                $("#energyFrame").attr("src", url)
            }
            this.activeIndex = e
            this.frameSrc = url
        },
    },
    beforeMount: function () {
        var mid = window.location.search.split("=")[1]
        var id = $.cookie("enUID")
        window.localStorage.setItem('UnitData', JSON.stringify({ UnitID: $.cookie("enUID"), UnitName: $.cookie("enUName") }))
        if (id != null) {
            this.unitID = id
        }
        this.getThirdMenuInfo(mid)
        this.getUnitComobxList()
    },
    mounted: function () { }
})
