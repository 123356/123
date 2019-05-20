new Vue({
    el: "#app",
    data: {
        setPriceVisable: false,
        loading:true,
        uid: null,
        uName:null,
        height: 0,
        width:0,
        num: 110,
        setForm: {
            cfg_id: null,
            cfg_info: null,
            remark: null
        },
        searchForm: {
            type:0,
            page: 1,
            rows: 20,
        },
        totalRow:100,
        rules: {
            cfg_id: [
                { required: true, type: 'number', message: '请选择类型', trigger: 'change' },
            ],
            cfg_info: [
                { required: true, message: '请输入内容', trigger: 'change' },
            ],
        },
        tableColumn: [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '类型',
                key: 'cfg_id',
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                display: "block"
                            }
                        }, proTYpe(params.row.cfg_id)),
                    ])
                }
            },
            {
                title: '数据',
                key: 'cfg_info',
                align: 'center'
            },
            {
                title: '修改时间',
                key: 'cfg_modify_time',
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                display: "block"
                            }
                        }, jsonDateFormat(params.row.cfg_modify_time)),
                    ])
                }
            },
            {
                title: '备注',
                key: 'remark',
                align: 'center'
            }
        ],
        tableData: [],
        userMenus: [],//权限按钮
        typeList: [{id:1,value:"离线地图"},{id:2,value:"MQTT"}],//类型下垃框
        curSelection:[]
    },
    methods: {
        curPageChange: function (vurPage) {
            this.searchForm.page = vurPage
            this.loading = true
            this.getTableData()
        },
        pageSizeChange: function (size) {
            this.searchForm.rows = size
            this.loading = true
            this.getTableData()
        },
        //获取权限按钮
        getUserMenus: function () {
            var that = this
            this.$http({
                url: "/SysInfo/UserButtonList2",
                method: 'post',
                params: {
                    CurrUrl: window.location.pathname
                }
            })
            .then(function (res) {
                    
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].src = '/Content/images/Icon16/'+res.data[i].Icon
                }
                that.userMenus = res.data
            })
            .catch(function (e) {
                    throw new ReferenceError(e.message)
            })
        },
        //编辑电价
        editPrice: function () {
            var that = this
            this.$http({
                url: "/Home/AddorUpdateCfg",
                method: 'post',
                params: this.setForm
            })
            .then(function (res) {
                    if (res.data > 0) {
                        that.$Message.success('编辑成功');
                    } else {
                        that.$Message.error('编辑失败');
                    }
                that.setPriceVisable = false
                that.curSelection = []
                //that.getTableData()
            })
            .catch(function (e) {
                    that.$Message.error('请求失败');
                throw new ReferenceError(e.message)
            })
        },
        //获取table数据
        getTableData: function () {
            var that = this
            this.$http({
                url: "/Home/GetsettingCfg",
                method: 'post',
                params: this.searchForm
            })
            .then(function (res) {
                that.tableData = res.data.list
                that.totalRow = res.data.total
                that.loading = false
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
                that.loading = false
            })
        },

        selectionChange: function (selection) {
            this.curSelection = selection
        },
        //条件查询
        selectChange: function (e) {
            this.getTableData()
        },
        //删除
        delete: function () {
            var that = this
            this.$http({
                url: "/Home/DeleteCfg",
                method: 'post',
                params: {
                    ID: this.curSelection[0].ID
                }
            })
            .then(function (res) {
                if (res.data > 0) {
                    that.$Message.success('删除成功');
                } else {
                    that.$Message.error('删除失败');
                }
                that.curSelection = []
                that.getTableData()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        userMenuClick: function (type) {
            switch (type) {
                case 'add()':
                    this.setPriceVisable = true
                    break;
                case 'edit()':
                    this.edit()
                    break;
                case 'Delete()':
                    if (this.curSelection.length != 1) {
                        this.$Modal.warning({
                            title: '信息提示',
                            content: '请选择一项要删除的数据'
                        });
                        return
                    }
                    var that = this
                    this.$Modal.confirm({
                        title: '信息提示',
                        content: '确定要删除吗',
                        onOk: () => {
                            that.delete()
                        },
                        onCancel: () => {
                            that.curSelection = []
                            that.getTableData()
                        }
                    });
                    
                    break;
            }
        },

        edit: function () {
            if (this.curSelection.length != 1) {
                this.$Modal.warning({
                    title: '信息提示',
                    content: '请选择一项要编辑的数据'
                });
                return
            }

            this.setPriceVisable = true
            this.setForm = this.curSelection[0]
            
            
        },
        setPriceVisableChange: function (e) {
            if (!e) {
                this.$refs['setForm'].resetFields()
                this.getTableData()
                this.curSelection = []
            }
        },
        
        setPrice: function () {
            var that = this
            this.$refs['setForm'].validate((valid) => {
                if (valid) {
                    that.editPrice()

                } else {
                    console.log("error")
                }
            })
        },
        showSetPriceModal: function () {
            this.setPriceVisable = true
        },


        setHeight: function () {
            var headerH = $(".formView").height()
            var wH = $(".tableMain").height()
            var h = wH - headerH 
            this.height = h - 35
        }
    },
    beforeMount: function () {
        this.getUserMenus()
        this.getTableData()
    },
    mounted: function () {
        this.setHeight()
        var that = this
        window.onresize = function () {
            that.setHeight()
        };
        

    }
})
//判断类型
function proTYpe(data) {
    var type = ""
    switch (data) {
        case 1:
            type = "离线地图"
            break;
        case 2:
            type = "MQQT"
            break;
    }
    return type
}

function jsonDateFormat(jsonDate) {//json日期格式转换为正常格式
 try {
  var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hours = date.getHours()<10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds = date.getSeconds()<10 ? "0" + date.getSeconds() : date.getSeconds();
  return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
 } catch (ex) {
  return "";
 }
}