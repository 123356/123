new Vue({
    el: "#app",
    data: {
        loading: true,
        UID: null,
        Uname:'',
        tableHeight: 0,
        dateType: 0,
        tableCol: [
            {
                title: '时间',
                align: 'center',
                key: 'RecordTime',
                //render: (h, params) => {
                //    var time = params.row.RecordTime.split(' ')[0]
                //    return h('div', [
                //        h('span', {
                            
                //        }, time),
                //    ])
                //}
            },
            {
                title: '区域',
                align: 'center',
                key: 'Name',
            },
            {
                title: '设备',
                align: 'center',
                key: 'DeviceName',
            },
            {
                title: '能耗(元)',
                align: 'center',
                key: 'DValue',
                sortable: true
            },
            {
                title: '类型',
                align: 'center',
                key: 'TypeName',
            },

        ],
        tableData: [],
        searchForm: {
            time: null,//日期
            did: null,//设备
            ksid: [],//科室
            cotypeid: '0',//能源类型,
            PID:0
        },
        typeList: [],
        departMentList: [],
        deviceList: [],
        isUnitSelect: 0,
        departName: null,
        treeData: [],
        page: 1,
        rows: 20,
        total: 0,
        stationRomm: [],
        PID:"0"
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
                throw new ReferenceError(e.message)
            })
        },
        getSelectTree: function () {
            var arr = []
            arr.push(this.treeData)
            var that = this
            $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            $('#StationID').combotree({
                data: arr,
                multiple: true,
                editable: true,
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
                    }

                },
                onChange: function (newvla, oldval) {
                    that.searchForm.ksid = newvla
                },
                onLoadSuccess: function (node, data) {
                },
              
            })
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
        //科室下拉框
        getDepartMentList: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMSetting/GetTreeData",
                method: "post",
                body: {
                    unitID: that.UID,
                    item_type: 2,
                    unitName: that.Uname
                }
            }).then(function (res) {
                that.departMentList = res.data
                var data = res.data
                that.foreachTree(data)
                that.treeData = data
                that.getSelectTree()
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //设备下拉框
        getDeviceCombox: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetDeviceCombox',
                method: 'post',
                body: {
                    uid: this.UID
                }
            }).then(function (res) {
                that.deviceList = res.data
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //站室下拉框
        getStation: function () {
            var that = this
            this.$http({
                url: '/BaseInfo/BindPDRInfo?showall=1',
                method:'post'
            })
                .then(function (res) {
                    that.stationRomm = res.data
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //查询
        getEneryList: function () {
            this.loading = true
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryList',
                method: 'post',
                body: {
                    uid: that.UID,
                    time: that.formaterDate(),
                    did: that.searchForm.did,
                    cotypeid: that.searchForm.cotypeid,
                    ksid: [...that.searchForm.ksid].join(',').toString(),
                    page: that.page,
                    rows: that.rows,
                    
                }
            }).then(function (res) {
                that.tableData = res.data.datas
                that.total = res.data.total
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        pageChange: function (e) {
            this.page = e
            this.getEneryList()
        },
        sizeChange: function (e) {
            this.rows = e
            this.getEneryList()
        },
        formaterDate: function () {
            if (this.searchForm.time) {
                var temp = new Date(this.searchForm.time)
                return temp.toLocaleDateString().replace(/\//g, "-") + " " 
            }
            return ""
        },
        setHeight: function () {
            this.tableHeight = $(".bottomView").height() - 36
        }
    },
    beforeMount: function () {
        this.UID = $.cookie("enUID")
        this.Uname = $.cookie("enUName")
        var that = this
        that.tableHeight = $(".bottomView .con").height()-40
       
        window.addEventListener("resize", () => {
            that.tableHeight = $(".bottomView .con").height()
        });
        //this.getStation()
        this.getCollectDevTypeList()
        this.getDepartMentList()
        this.getDeviceCombox()
        this.getEneryList()
    },
    mounted: function () {
    }
})



