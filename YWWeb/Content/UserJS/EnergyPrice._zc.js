var validateLadderValue = function (rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入阶梯范围"));
    } else if (!/^([0-9]{1,}),([0-9]{1,})$/.test(value)) {
        return callback(new Error("请正确输入阶梯范围"))
    } else {
        callback();
    }
};
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
            UID: null,
            CollTypeID: null,
            Ladder: null,
            LadderValue: null,
            Price:null,
        },
        searchForm: {
            uid: null,
            colltypeid: null,
            level: null,
            page: 1,
            rows: 20,
        },
        totalRow:100,
        rules: {
            UID: [
                { required: true, type: 'number', message: '请选择单位', trigger: 'change' },
            ],
            CollTypeID: [
                { required: true, type: 'number',message: '请选择能源类型', trigger: 'change' },
            ],
            Ladder: [
                { required: true, type: 'number', message: '请选择阶梯', trigger: 'change' },
            ],
            LadderValue: [
                { validator: validateLadderValue, trigger: 'blur' }
                //{ required: true, message: '请输入阶梯范围', trigger: 'blur' },
            ],
            Price: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
        },
        tableColumn: [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '单位名称',
                key: 'UnitName',
                align: 'center'
            },
            {
                title: '能源类型',
                key: 'CollTypeName',
                align: 'center'
            },
            {
                title: '阶梯',
                key: 'Ladder',
                align: 'center'
            },
            {
                title: '阶梯范围',
                key: 'LadderValue',
                align: 'center'
            },
            {
                title: '单价',
                key: 'Price',
                align: 'center'
            },
        ],
        tableData: [],
        userMenus: [],//权限按钮
        comList: [],//单位下拉框
        //阶梯
        ladders: [
            { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 },
        ],
        enTypeList: [],//能源类型,
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
        //单位下拉框
        getComList: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMHome/GetUnitComobxList",
                method: 'post',
            })
            .then(function (res) {
                that.comList = res.data
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //获取能源类型
        getEnTypeList: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMHome/GetCollectDevTypeList",
                method: 'post',
            })
                .then(function (res) {
                    that.enTypeList = res.data
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //判断是否已经存在
        isExists: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMHome/GetPriceListModel",
                method: 'post',
                body: {
                    uid: this.setForm.UID,
                    colltypeid: this.setForm.CollTypeID,
                    level: this.Ladder,
                }
            })
                .then(function (res) {
                    if (res.data == "yes") {
                        that.$Modal.confirm({
                            title: '提示',
                            content: '<p>数据已存在，是否覆盖？</p>',
                            onOk: () => {
                                that.editPrice()
                            },
                            onCancel: () => {
                                that.setPriceVisable = false
                                that.curSelection = []
                            }
                        });
                    } else {
                        that.editPrice()
                    }
                })
                .catch(function (e) {
                   
                })
        },
        //编辑电价
        editPrice: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMHome/AddEneryPrice",
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
                that.getTableData()
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
                url: "/energyManage/EMHome/GetEneryPriceList",
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
                url: "/energyManage/EMHome/DeleteEneryPrice",
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
                    that.isExists()
                    //that.editPrice()

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
        this.getComList()
        this.getEnTypeList()
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
