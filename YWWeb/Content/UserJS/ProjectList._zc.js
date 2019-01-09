new Vue({
    el: "#projectList",
    data: {
        tableHeihgt: 0,
        editVisible: false,
        tableLoading: false,
        isCheck: false,
        selectArr: [],
        page: {
            curPage: 1,
            size: 50,
            total: 0
        },
      
        searchForm: {
            proNam: '',
            type: '',
            areaid: null,
            creatTime: ''
        },

        projectCol: [{
                type: 'index',
                width: 50,
                align: 'center'
            },
            {
                type: 'selection',
                width: 30,
                align: 'center'
            },
            {
                title: '合同编号',
                align: 'center',

                key: 'ConNo'
            },
            {
                title: '项目名称',
                align: 'center',
                key: 'ProjectName',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                "text-align": "left",
                                display: "block"
                            }
                        }, params.row.ProjectName),
                    ]);
                }
            },
            {
                title: '客户名称',
                align: 'center',
                key: 'CtrPName',
                /*render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                "text-align": "left",
                                display: "block"
                            }
                        }, params.row.CtrPName),
                    ]);
                }*/
            },
            {
                title: '负责人',
                align: 'center',
                key: 'person'
            },
            {
                title: '合同名称',
                align: 'center',
                key: 'CtrName',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                "text-align": "left",
                                display: "block"
                            }
                        }, params.row.CtrName),
                    ]);
                }
            },
            {
                title: '客户联系人',
                align: 'center',
                key: 'LinkMan'
            },
            {
                title: '联系电话',
                align: 'center',
                key: 'Tel'
            },
            {
                title: '开始日期',
                align: 'center',
                key: 'createDate'
            },
            {
                title: '竣工日期',
                align: 'center',
                key: 'end_time'
            },
            {
                title: '合同类型',
                align: 'center',
                key: 'Type',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                display: "block"
                            }
                        }, proTYpe(params.row.Type)),
                    ])
                }
            },
            {
                title: '创建时间',
                align: 'center',
                key: 'createDate'
            },
        ],
        projectData: [],
        proType: [
            { id: "1", Type: "工程施工" },
            { id: "2", Type: "电力设计" },
            { id: "3", Type: "设备产品" },
            { id: "4", Type: "运维实验" },
            { id: "5", Type: "管理" },
            { id: "6", Type: "系统开发" },
            { id: "7", Type: "设计管理" },
            { id: "8", Type: "测绘" },
        ],
        proRegionData: [],
        userInfo: [],
        ctrList: [],
        editForm: {
            ConNo:'',
            ProjectName: '',
            Type: null,
            CtrName: '',
            ConMoneys: null,
            AmountMoney:null,
            end_time: '',
            UnitCity: null,
            Adress: '',
            Coordination: '',
            UID: null,
            LinkMan: '',
            Tel: '',
            Personid: null,
            BudgetUser: null,
            ProjectManager: null,
            ItemUsers: [],
            Personids: [],
            Approvers: [],
            CtrInfo: '',
            id: null,
        },
        addForm: {
            ConNo:'',
            ProjectName: '',
            Type: null,
            CtrName: '',
            ConMoneys: null,
            end_time: '',
            UnitCity: null,
            Adress: '',
            Coordination: '',
            UID: null,
            LinkMan: '',
            Tel: '',
            Personid: null,
            BudgetUser: null,
            ProjectManager: null,
            ItemUsers: [],
            Personids: [],
            Approvers: [],
            CtrInfo: '',
            id: null,
        },
        rules: {
            ProjectName: [
                { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            ConNo: [
                { required: true, message: '请输入编号', trigger: 'blur' }
            ],
            Type: [
                { required: true, message: '请选择项目类型', trigger: 'change' }
            ],
            CtrName: [
                { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            ConMoneys: [
                { required: true,  message: '请输入金额', trigger: 'blur' },
                { validator: moneyValidate, trigger: 'blur'}
            ],
            AmountMoney: [
                { validator: moneyValidate, trigger: 'blur' }
            ],
            end_time: [
                { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
            ],
            UnitCity: [
                { required: true, type: 'number', message: '请选择区域', trigger: 'change' }
            ],
            Adress: [
                { required: true, message: '请输入地址', trigger: 'blur' }
            ],
            Coordination: [
                { required: true, validator: locationValidate, trigger: 'blur' }
            ],
            UID: [
                { required: true, message: '请选择客户', trigger: 'change' }
            ],
            LinkMan: [
                { required: true, message: '请输入客户联系人', trigger: 'blur' }
            ],
            Tel: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
                { validator: mobilePhoneValidate, trigger: 'blur'},
            ],
            Personid: [
                { required: true, type: 'number', message: '请选择项目经理', trigger: 'change' }
            ],
            BudgetUser: [
                { required: true, type: 'number', message: '请选择预算专员', trigger: 'change' }
            ],
            ProjectManager: [
                { required: true, type: 'number', message: '请选择工程经理', trigger: 'change' }
            ],
            ItemUsers: [
                { required: true, type: 'array', message: '请选择管理人', trigger: 'change' },
            ],
            Personids: [
                { required: true, type: 'array', message: '请选择抄送人', trigger: 'change' },
            ],
            Approvers: [
                { required: true, type: 'array', message: '请选择审批人', trigger: 'change' },
            ],
        },
        type: 0,
        userButton: [],
        state:''

    },
    methods: {
        rowClick:function(data,index){
            console.log(index)

            
        },
        selectChange: function(e) {
            console.log(e)
        },
        //项目区域数据
        getRegion: function() {
            var that = this
            this.$http({
                    url: "/BaseInfo/BindCity",
                    method: "get",
                })
                .then(function (res) {
                    that.proRegionData = res.data
                })
                .catch(function(e) {
                    console.log(e)
                })
        },
        //userInfo
        getUserInfo: function() {
            var that = this
            this.$http({
                    url: "/Energy/getUserInfo",
                    method: 'post'
                })
                .then(function(res) {
                    that.userInfo = JSON.parse(res.data)
                })
                .catch(function(e) {
                    console.log(e)
                })
        },
        //客户列表
        getCtrList: function() {
            var that = this
            this.$http({
                    url: "/ES/UnitComboData?isall=" + "false",
                    method: 'post'
                })
                .then(function(res) {
                    that.ctrList = res.data
                })
                .catch(function(e) {
                    console.log(e)
                })
        },
        //新增
        add: function() {
            this.type = 0
            this.editVisible = true
        },
        //编辑保存
        editSave: function() {
            var that = this
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    var data = data = Object.assign({}, that.editForm);
                    var time = new Date(data.end_time)
                    time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
                    data.end_time = time
                    data.Approvers = data.Approvers.join(",")
                    data.ItemUsers = data.ItemUsers.join(",")
                    data.Personids = data.Personids.join(",")
                    that.$http({
                            url: "/Home/saveConstract",
                            method: "post",
                            params: data
                        })
                        .then(function(res) {
                            that.editVisible = false
                            that.getConstractData()
                        })
                        .catch(function(e) {

                        })

                } else {

                }
            })
        },
        //选中一项selection已选中数据，row当前选中数据
        onSelect: function(selection, row) {
            console.log(row)
            this.selectArr = selection;
            console.log(selection)
        },
        //取消选中某一行
        selectCancel: function(selection, row) {
            console.log(selection)
            console.log(row)
            this.selectArr = selection
        },
        //全选
        selectAll: function(selection) {
            console.log(selection)
            this.selectArr = selection
        },
        //取消全选
        selectAllCancel: function(selection) {
            console.log(selection)
            this.selectArr = selection
        },
        //获取table数据
        getConstractData: function() {
            this.tableLoading = true
            var that = this
            var time = this.searchForm.creatTime
            if (time != "") {
                time = new Date(time)
                time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()

            }
            this.$http({
                    url: '/Home/LoadConstractDatas',
                    method: 'post',
                    params: {
                        proNam: this.searchForm.proNam,
                        type: this.searchForm.type,
                        areaid: this.searchForm.areaid,
                        creatTime: time,
                        rows: this.page.size,
                        page: this.page.curPage,

                    }
                })
                .then(function(res) {
                    console.log(res.data)
                    var data = res.data
                    that.page.total = data.total
                    that.projectData = data.rows
                    that.tableLoading = false
                    that.getUserBtn()
                    console.log(this.userButton)
                })
                .catch(function(e) {
                    console.log(e)
                    this.tableLoading = false
                })
        },
        //条件查询
        search: function() {
            this.getConstractData()
        },
        //删除
        deletePro: function() {
            var that = this
            var length = this.selectArr.length
            if (length == 0) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要删除的行",
                    onOk: () => {

                    },
                });
            } else {


                this.$Modal.confirm({
                    title: '信息提示',
                    content: '<p>确定要删除吗？</p>',
                    onOk: () => {
                        var arr = new Array()
                        for (var i = 0; i < this.selectArr.length; i++) {
                            arr[i] = this.selectArr[i].id
                        }
                        this.$http({
                                url: "/Constract/DeleteConstract",
                                method: "post",
                                params: {
                                    id: arr.join(",")
                                }
                            })
                            .then(function(res) {
                                that.getConstractData()
                                that.selectArr = []
                            })
                            .catch(function(e) {

                            })
                    },
                    onCancel: () => {

                    }
                });
            }
        },
        //编辑信息
        editPro: function() {
            var length = this.selectArr.length
            if (length != 1) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要编辑的行",
                    onOk: () => {

                    },
                });
            } else {
                this.state = this.selectArr[0].Isaccomplish
                
                var data = Object.assign({}, this.selectArr[0])
                console.log(data.ItemUsers)
                console.log(data.Personids)
                console.log(data.Approvers)
                data.ItemUsers = data.ItemUsers.split(",")
                data.Personids = data.personids.split(",")
                data.Approvers = data.Approvers.split(",")
                data.UnitCity = parseInt(data.UnitCity)
                data.Personid = parseInt(data.personid)
                data.BudgetUser = parseInt(data.BudgetUser)
                data.ProjectManager = parseInt(data.ProjectManager)
                for (var i = 0; i < data.ItemUsers.length; i++) {
                    data.ItemUsers[i] = parseInt(data.ItemUsers[i])
                }
                for (var i = 0; i < data.Approvers.length; i++) {
                    data.Approvers[i] = parseInt(data.Approvers[i])
                }
                for (var i = 0; i < data.Personids.length; i++) {
                    data.Personids[i] = parseInt(data.Personids[i])
                }

                this.editForm = data
                this.editVisible = true
            }
        },
        //查看详情
        check: function() {
            var length = this.selectArr.length
            if (length != 1) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要查看的行",
                    onOk: () => {

                    },
                });
            } else {
                this.isCheck = true;
                this.editVisible = true;

                var data = Object.assign({}, this.selectArr[0])
                console.log(data.ItemUsers)
                console.log(data.Personids)
                console.log(data.Approvers)
                data.ItemUsers = data.ItemUsers.split(",")
                data.Personids = data.personids.split(",")
                data.Approvers = data.Approvers.split(",")
                data.UnitCity = parseInt(data.UnitCity)
                data.Personid = parseInt(data.personid)
                data.BudgetUser = parseInt(data.BudgetUser)
                data.ProjectManager = parseInt(data.ProjectManager)
                for (var i = 0; i < data.ItemUsers.length; i++) {
                    data.ItemUsers[i] = parseInt(data.ItemUsers[i])
                }
                for (var i = 0; i < data.Approvers.length; i++) {
                    data.Approvers[i] = parseInt(data.Approvers[i])
                }
                for (var i = 0; i < data.Personids.length; i++) {
                    data.Personids[i] = parseInt(data.Personids[i])
                }

                this.editForm = data
                this.editVisible = true
            }
        },
        // 关闭
        shutDown: function() {
            this.editVisible = false;
            setTimeout(() => {
                this.isCheck = false;
            }, 300);
        },
        //事项详情modal显示状态
        editVisibleChange: function(e) {
            if (!e) {
                
                this.$refs['editForm'].resetFields()
                setTimeout(() => {
                    this.isCheck = false;
                }, 300);
            } else {

            }

        },
        clearForm: function() {
            this.editForm = {
                ProjectName: '',
                Type: null,
                CtrName: '',
                ConMoneys: null,
                end_time: '',
                UnitCity: null,
                Adress: '',
                Coordination: '',
                UID: null,
                LinkMan: '',
                Tel: '',
                Personid: null,
                BudgetUser: null,
                ProjectManager: null,
                ItemUsers: [],
                Personids: [],
                Approvers: [],
                CtrInfo: '',
                id: null,
            }
        },
        //size改变
        sizeChange: function(size) {
            this.page.size = size
            this.getConstractData()
        },
        //页面改变
        pageChange: function(page) {
            this.page.curPage = page
            this.getConstractData()
        },
        settableHeight: function() {
            var loc = $(".btnView").offset().top
            if (loc > 15) {
                var top = $(".searchForm").height(40)
            }
            var height = $(window).height() - 30
            var top = $(".searchForm").height()
            var bottom = $(".pageView").height()
            this.tableHeihgt = height - top - bottom - 65
        },
        getUserBtn: function() {
            var that = this
            var url = window.location.pathname;
            this.$http({
                    url: "/SysInfo/UserButtonList",
                    method: 'post',
                    params: {
                        CurrUrl: url
                    }
                })
                .then(function(res) {
                    var data = JSON.parse(res.data) + ""
                    $("#tempUserBtn").html(data)
                    var arr = []
                    var btnArr = $("#tempUserBtn button")
                    var html = ""
                    for (var i = 0; i < btnArr.length; i++) {
                        var btnData = {
                            title: btnArr[i].attributes[0].value,
                            className: btnArr[i].attributes[2].value,
                            event: btnArr[i].attributes[1].value.split("(")[0],
                            icon: btnArr[i].children[0].attributes[0].value
                        }
                        html += '<button class="page_table_but" title="' + btnData.title + '" v-on:click="' + btnData.event + '"><img src="' + btnData.icon + '"></button>'
                        arr.push(btnData)
                    }

                    this.userButton = arr

                })
                .catch(function(e) {

                    console.log(e)
                })


        },
        handleClick: function(e) {
            switch (e) {
                case "add":
                    this.add()
                    break;
                case "edit":
                    this.editPro()
                    break;
                case "dosearch":
                    this.search()
                    break;
                case "Delete":
                    this.deletePro()
                    break;
                case "detail":
                    //查看详细
                    this.check();
                    break;
            }
        },
        //确认完成
        queRenProject: function () {
            this.$http({
                url: "/Home/QueRenProject",
                method: "post",
                params: {
                    id: this.selectArr[0].id
                }
            })
            .then(function (res) {

            })
            .catch(function (e) {
                console.log(e)
            })
        }

    },
    beforeMount: function() {
        this.settableHeight()
        var that = this

        function setHeight() {
            var loc = $(".btnView").offset().top
            if (loc > 15) {
                var top = $(".searchForm").height(40)
            }
            var height = $(window).height() - 30
            var top = $(".searchForm").height()
            var bottom = $(".pageView").height()
            that.tableHeihgt = height - top - bottom - 65
        }
        setInterval(setHeight, 100)
        this.getUserInfo()
        this.getConstractData()
        this.getRegion()
        this.getCtrList()

    },
    created() {


    },
})

//判断项目类型
function proTYpe(data) {
    var type = ""
    switch (data) {
        case "1":
            type = "工程施工"
            break;
        case "2":
            type = "电力设计"
            break;
        case "3":
            type = "设备产品"
            break;
        case "4":
            type = "运维实验"
            break;
        case "5":
            type = "管理"
            break;
        case "6":
            type = "系统开发"
            break;
        case "7":
            type = "设计管理"
            break;
        case "8":
            type = "测绘"
            break;
    }
    return type
}
