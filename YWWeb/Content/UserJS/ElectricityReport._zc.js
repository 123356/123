new Vue({
    el: "#app",
    data: {
        UID: null,
        UName: null,
        time: null,
        tableHeight: 0,
        dateType: 1,
        tableCol: [],
        tableData: [],
        departmentList: [],
        curDateType: 'date',
        curReportType: 0,
        closable: true,
        curDepart: 0,
        treeData: [],
        isUnitSelect: 0,
        departName: null,
        title:''
    },
    methods: {
        //设置树下拉框
        getSelectTree: function () {
            var arr = []
            arr.push(this.treeData)
            var that = this
            $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            $('#StationID').combotree({
                data: arr,
                panelMinHeight: 300,
                onBeforeSelect: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#StationID').combotree('tree').tree("expand", node.target); //展开
                        return false;
                    }
                },
                onClick: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#StationID').combo('showPanel');
                       
                    } else {
                        that.isUnitSelect = node.id
                        that.getTableData()
                    }
                },
                onLoadSuccess: function (node, data) {
                    $("#StationID").combotree("setValue", that.isUnitSelect);

                    that.getTableData()
                  
                }
            })
        },
        dateChange: function () {
            this.getTableData()
        },
        //遍历树
        foreachTree: function (node) {
            if (!node) {
                return;
            }
            node.text = node.name
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    if (!node.children[i].children) {
                        node.children[i].text = node.children[i].name
                    }
                    this.foreachTree(node.children[i]);
                }
            } else {
                if (node.id != 0 && this.isUnitSelect == 0) {
                    this.isUnitSelect = node.id
                    this.departName = node.name
                }
            }
        },
        // tree data
        getTreeData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMSetting/GetTreeData',
                method: 'POST',
                params: {
                    unitID: that.UID,
                    item_type: 2,
                    unitName: that.UName
                }
            })
                .then(function (res) {
                    var data = res.data
                    that.foreachTree(data)
                    that.treeData = data
                    that.getSelectTree()
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //设置table头
        setTableTitle: function (data) {
            var that = this
           
            
            var type = ""
            switch (this.dateType) {
                case 1:
                    type = "日"
                    break
                case 2:
                    type = "月"
                    break
                case 3:
                    type = "年"
                    break
            }
           
            this.title = this.formaterDate() + this.UName + this.departName + type + "报表"
            var arr = [
                {
                    title: '时间',
                    align: 'center',
                    key:'Time'
                }
            ]
            var keys = Object.keys(data)
            var values = Object.values(data)
           
            for (var i in keys) {
                    var temp = {
                        title: values[i],
                        align: 'center',
                        key: keys[i],
                    }
                    arr.push(temp)
                
            }
            
            this.tableCol = arr
        },
        //获取报表数据
        getTableData: function () {
            var that = this

            this.$http({
                url: '/energyManage/EMHome/GetEnFromData',
                method: 'post',
                body: {
                    uid: that.UID,
                    time: that.formaterDate(),
                    type: that.dateType,
                    DepartmentID: that.isUnitSelect,
                    //uid: 9,
                    //time: '2019-03',
                    //type: 2,
                    //DepartmentID: 381,
                }
            })
                .then(function (res) {
                    var arr = []
                    for (var i in res.data.table) {
                        arr.push(res.data.table[i].value)
                    }
                    that.tableData = arr
                    if (res.data) {
                        that.setTableTitle(res.data.TitleName)
                    } else {
                        that.tableCol = []
                    }
                    
                })
                .catch(function (e) {

                })
                .finally(function () {

                })
        },
        formaterDate: function () {
            var date = new Date(this.time)
            if (this.dateType == 1) {
                date = date.toLocaleDateString().replace(/\//g, "-")
            } else if (this.dateType == 2) {
                date = date.getFullYear() + "-" + (date.getMonth() + 1)
            } else {
                date = date.getFullYear()
            }
           
            return date
        },
        //打印  or 导出
        openOrPrint: function () {

            this.$refs.table.exportCsv({
                filename: '能源报告'
            });
            //window.print()


        },
        dateTypeChange: function (e) {
            var that = this
            switch (parseInt(e)) {
                case 0:
                    that.curDateType = 'date'
                    break;
                case 1:
                    this.curDateType = 'date'

                    break;
                case 2:
                    that.curDateType = 'month'
                    break
                case 3:
                    that.curDateType = 'year'

                    break;
            }
            this.getTableData()
        },
        departmentChange: function (e) {

        },
        dropdownClick: function (e) {
            this.curReportType = e
        },
    },
    beforeMount: function () {
        
        this.UID = $.cookie("enUID")
        this.UName = $.cookie("enUName")
        this.time = new Date()
        var that = this
        setInterval(function () {
            that.tableHeight = $(".bottomView .con").height()-45
        }, 100)
        this.getTreeData()

    },
    mounted: function () {
    }
})
