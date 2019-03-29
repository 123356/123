new Vue({
    el: '#buildReport',
    data: {
        loading:true,
        UID: null,
        UnitName: null,
        dateType: 1,//日期类型
        dateTypeText: 'date',
        dateTypeList: [
            { type: 1, name: '日' }, { type: 2, name: '月' }, { type: 3, name: '年' },
        ],
        comList: [],//单位
        time: new Date(),//日期
        isUnitAreaSelect: [],//当前选中区域IDs
        isUnitElecSubSelect: [],//当前选中用电分项IDs
        departName: null,
        areaTree: [],//区域树
        elecSubItemTree: [],//分项用电树
        treeType: 1,
        userBtn: [],//操作按钮
        curTimeStr: null,
        labelData: [],//标签,
        label: [],
        info: null,
        list_item: null,
        list_area: null,
        itemHJ: [],
        itemTotal: 0,
        areaHJ: [],
        areaTotal: 0,
        

    },
    filters: {
        isnull: function (e) {
            if (!e) {
                return '--'
            } else {
                return e
            }
        }
    },
    methods: {
        //设置组织区域树树下拉框
        getSelectTree: function (type) {
            var arr = []
            var that = this
            var id = ""
            if (type == 1) {
                arr.push(this.elecSubItemTree)
                id = "elecID"
                $("#ElecSubTree").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding' ><input data-options='lines:true' style='width: 200px; height: 30px;' id='elecID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            } else {
                arr.push(this.areaTree)
                id = "DID"
                $("#areaTree").html("<div class='leftmenu' id='leftmenu2'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding' ><input data-options='lines:true' style='width: 200px; height: 30px;' id='DID' /></div><div><ul class='one' id='menuinfo2'></ul></div></div></div>");
            }
            $('#' + id).combotree({
                data: arr,
                multiple: true,
                editable: true,
                panelMinHeight: 300,
                onBeforeSelect: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#' + id).combotree('tree').tree("expand", node.target); //展开
                        return false;
                    }
                },
                onClick: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#' + id).combo('showPanel');

                    } else {
                        //if (type == 1) {
                        //    that.isUnitElecSubSelect = node.id
                        //} else {
                        //    that.isUnitAreaSelect = node.id
                        //}

                    }
                },
                onLoadSuccess: function (node, data) {
                    //if (type == 1) {
                    //    $("#" + id).combotree("setValue", that.isUnitElecSubSelect);
                    //} else {
                    //    $("#" + id).combotree("setValue", that.isUnitAreaSelect);
                    //}

                },
                onChange: function (newval, oldval) {
                    if (type == 1) {
                        that.isUnitElecSubSelect = newval
                        //$("#" + id).combotree("setValue", that.isUnitElecSubSelect);
                    } else {
                        that.isUnitAreaSelect = newval
                        //$("#" + id).combotree("setValue", that.isUnitAreaSelect);
                    }
                }
            })
        },
        //遍历树
        foreachTree: function (node, type) {
            if (!node) {
                return;
            }
            node.text = node.name
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    if (!node.children[i].children) {
                        node.children[i].text = node.children[i].name
                    }
                    this.foreachTree(node.children[i], type);
                }
            } else {
                var val = 0
                if (type == 1) {
                    val = this.isUnitElecSubSelect.length
                } else {
                    val = this.isUnitAreaSelect.length
                }

                if (node.id != 0 && val == 0) {
                    if (type == 1) {
                        //this.isUnitElecSubSelect.push(node.id)
                    } else {
                        // this.isUnitAreaSelect.push(node.id)
                    }

                    this.departName = node.name
                }
            }
        },
        // 组织区域/用电分项树
        getTreeData: function (type) {
            this.treeType = type
            var that = this
            this.$http({
                url: '/energyManage/EMSetting/GetTreeData',
                method: 'POST',
                params: {
                    unitID: that.UID,
                    item_type: type,
                    unitName: that.UnitName
                }
            })
                .then(function (res) {
                    var data = res.data
                    that.foreachTree(data, type)
                    if (type == 1) {
                        that.elecSubItemTree = data
                    } else {
                        that.areaTree = data
                    }

                    that.getSelectTree(type)
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
                if (that.UID == null) {
                    if (res.data.length > 0) {
                        that.UID = res.data[0].UnitID
                        $.cookie("enUID", that.UID, { expires: 7 })
                        $.cookie("enUName", res.data[0].UnitName, { expires: 7 })
                        that.UnitName = res.data[0].UnitName

                    }
                    
                }
            }).catch(function (e) {
                    throw new ReferenceError(e.message)
                }).finally(function () {
                    this.getTreeData(1)
                    this.getTreeData(2)
                })
        },
        //单位下拉框change
        comChange: function (e) {
            this.UID = e.value
            
            $.cookie("enUID", e.value, { expires: 7 })
            $.cookie("enUName", e.label, { expires: 7 })
            this.getTreeData(1)
            this.getTreeData(2)
        },
        dateChange: function () {
           // this.curTimeStr = this.formaterDate()
        },
        //日期类型
        dateTypeChange: function (e) {
            switch (e.value) {
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
            //this.curTimeStr = this.formaterDate()
            
        },
        getTimes: function () {
            var arr = []
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
                    var temp = new Date(this.time)
                    temp = new Date(temp.getFullYear(), (temp.getMonth() + 1), 0)
                    var col = temp.getDate()
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
        //标签下拉框
        getLabelData: function () {
            var that = this
            this.$http({
                url: '/ReportForms/GetLabelList',
                method: 'post',
                body: {
                    uid: this.UID
                }
            })
                .then(function (res) {
                    that.labelData = res.data
                })
                .catch(function (e) {

                })
        },
        //操作按钮
        getUserBtn: function () {
            var that = this
            var url = window.location.pathname;
            this.$http({
                url: '/SysInfo/UserButtonList2',
                method: 'post',
                params: {
                    CurrUrl: url
                }
            })
                .then(function (res) {
                    that.userBtn = res.data
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        userMenuClick: function (method) {
            switch (method) {
                case 'dosearch()':
                    this.loading = true
                    this.UnitName = $.cookie("enUName")
                    this.curTimeStr = this.formaterDate()
                    this.getTimes()
                    
                    this.getReport()
                    break;
            }
        },
        //报表数据
        getReport: function () {
            var that = this
            this.$http({
                url: '/ReportForms/GetItemFrom',
                method: 'post',
                body: {
                    uid: this.UID,
                    itemids: [...this.isUnitElecSubSelect].join(','),
                    areaids: [...this.isUnitAreaSelect].join(','),
                    type: this.dateType,
                    time: this.formaterDate(),
                    lables: [...this.label].join(',')
                }
            })
                .then(function (res) {
                    var data = res.data
                    for (var i in data.list_item) {
                        var count = 0
                        for (var j in data.list_item[i].Value) {
                            count += isNaN(parseFloat(data.list_item[i].Value[j])) ? 0 : parseFloat(data.list_item[i].Value[j])

                        }
                        data.list_item[i].count = count.toFixed(2)
                    }
                    for (var i in data.list_area) {
                        var count = 0
                        for (var j in data.list_area[i].Value) {
                            count += isNaN(parseFloat(data.list_area[i].Value[j])) ? 0 : parseFloat(data.list_area[i].Value[j])

                        }
                        data.list_area[i].count = count.toFixed(2)
                    }

                    that.list_item = data.list_item
                    that.list_area = data.list_area


                    that.totalCom(data.list_item, 1)
                    that.totalCom(data.list_area,2)

                })
                .catch(function (e) {

                })
                .finally(function () {
                    that.loading=false
                })
        },
        totalCom: function (data,type) {
            var sumTotal = 0
            var xTotal = []
            var arr = []
            for (var i in data) {
                arr.push(data[i].Value)
                for (var j in data[i].Value) {
                    sumTotal += isNaN(parseFloat(data[i].Value[j])) ? 0 : parseFloat(data[i].Value[j])
                }
            }
            var col = 0
            switch (this.dateType) {
                case 1:
                    col = 24
                    break
                case 2:
                    var temp = new Date(this.time)
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

            
            if (type == 1) {
                this.itemHJ = xTotal
                this.itemTotal = sumTotal.toFixed(2)
            } else {
                this.areaHJ = xTotal
                this.areaTotal = sumTotal.toFixed(2)
            }

           
        },
        //日期格式化
        formaterDate: function () {
            var time = new Date(this.time)
            if (this.dateType == 1) {
                time = time.toLocaleDateString().replace(/\//g, "-")
            } else if (this.dateType == 2) {
                time = time.getFullYear() + "-" + (time.getMonth() + 1)
            } else if (this.dateType == 3) {
                time = time.getFullYear()
            }
            return time
        },
        //打印
        openOrPrint: function () {
            window.print()
        },
        //导出
        ExcelPort: function () {
            var time =
                window.open('/ReportForms/GetExtItemFrom?uid=' + this.UID + "&time=" + this.formaterDate() + "&type=" + this.dateType + "&itemids=" + [...this.isUnitElecSubSelect].join(',') + "&areaids=" + [...this.isUnitAreaSelect].join(',') + '&lables=' + [...this.label].join(','), '_blank');
        }
    },
    beforeMount: function () {
        if ($.cookie("enUID")) {
            this.UID = parseInt($.cookie("enUID"))
            this.UnitName = $.cookie("enUName")
        }

        this.getUnitComobxList()
        this.getUserBtn()
        this.getTimes()
        this.getLabelData()
        this.curTimeStr = this.formaterDate()
        this.getReport()
    },
    mounted: function () {
        //获取用电分项、组织区域树
        //this.getTreeData(1)
        //this.getTreeData(2)
    }
})
