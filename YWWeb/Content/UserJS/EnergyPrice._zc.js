new Vue({
    el: "#app",
    data: {
        setPriceVisable: false,
        loading:false,
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
                { required: true, message: '请输入阶梯范围', trigger: 'blur' },
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
                key: 'name'
            },
            {
                title: '能源类型',
                key: 'type'
            },
            {
                title: '阶梯',
                key: 'level'
            },
        ],
        tableData: [],
        userMenus: [],//权限按钮
        comList: [],//单位下拉框
        //阶梯
        ladders: [
            { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 },
        ],
        enTypeList:[],//能源类型
    },
    methods: {
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
        //编辑电价
        editPrice: function () {
            var that = this
            this.$http({
                url: "/energyManage/EMHome/AddEneryPrice",
                method: 'post',
                params: this.setForm
            })
            .then(function (res) {
                    that.setPriceVisable = false
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

                    break;
                case 'Delete()':

                    break;
            }
        },


        edit: function () {
            if (this.editType == 1) {
                this.editType = 0
                this.editName = '编辑'
                this.editIconShow = false;
                this.editDisable = true;
                //验证预算是否合格
                this.checkBudget()

            } else {
                this.editType = 1
                this.editName = '保存'
                this.editIconShow = true;
                this.editDisable = false;
            }
            
        },
        setPriceVisableChange: function (e) {
            if (!e) {
                this.$refs['setForm'].resetFields()
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
            console.log(this.height)
        }
    },
    beforeMount: function () {
        this.getUserMenus()
        this.getComList()
        this.getEnTypeList()
    },
    mounted: function () {
        this.setHeight()
        var that = this
        window.onresize = function () {
            that.setHeight()
        };
        

    }
})


$(function () {


    
})
