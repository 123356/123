new Vue({
    el: "#app",
    data: {
        loading: true,
        uid: null,
        uName: null,
        height: 0,
        width: 0,
        num: 110,
        editIconShow: false,
        editDisable: true,
        slectYear: '',
        editType: 0,
        editName: '编辑',
        sumDataSet: {
            GeneralBudget: 0,//计划能耗
            BudgetBalance: 0,//余量
            SurplusValue: 0,//剩余预算

        },
        //各月能源预算总值
        sumAllMonthData: 0,
        //各月能源预算
        allMonthData: [],
        sumEnergyData: 0,
        //各类型能源平均值
        energyData: [],
        sumDepartBudgetData: 0,
        departBudgetData: [],
        departMoneyData: [],
        setForm: {
            elecPriceF: null,
            elecPriceP: null,
            elecPriceG: null,
            elecPriceJ: null,
            waterPriceL1: null,
            waterPriceL2: null,
            waterPriceL3: null,
            useWater1: null,
            useWater2: null,
            useWater3: null,
            gasPrice: null,
        },
        setPriceVisable: false,
        rules: {
            elecPriceF: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            elecPriceP: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            elecPriceG: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            elecPriceJ: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            waterPriceL1: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            gasPrice: [
                { required: true, type: 'number', message: '请输入单价', trigger: 'change' },
            ],
            useWater1: [
                { required: true, type: 'number', message: '请输入用水量', trigger: 'change' },
            ],
        },
        curMonth: 1,
        curEnType: "电",
        everyMonthBalance: 0,
        enTypeBalance: 0,
        departBalance: 0,
        departAvgBalance: 0,
        isInit: true,
        isEdit: true,
        treeModalVisable: false,
        treeSelectList: [],
        cotypeid: null,//当前能源类型表格id
        isAdd: false,//是否显示编辑部门按钮
        Area: 0,
        Bili: 0,
        rightList: []
    },
    filters: {
        toFIxed2: function (e) {
            return e.toFixed(2)
        },
        toMoney: function (num) {
            num = num.toFixed(2);
            num = parseFloat(num)
            num = num.toLocaleString();
            return num;//返回的是字符串23,245.12保留2位小数
        }
    },
    methods: {
        //获取最左边数据
        getYearbugGetData: function () {
            var that = this
            var year = new Date(this.slectYear)
            this.$http.post(
                '/energyManage/EMHome/GetYearbugGetData',
                {
                    uid: this.uid,
                    year: year.getFullYear()
                }
            )
            .then(function (res) {
                if (res.data != "no Data") {
                    that.sumDataSet = res.data

                    that.getMonthBugGetbyYearID(res.data.ID)
                    that.sumAllMonthData = that.sumDataSet.SurplusValue
                    that.isInit = false
                } else {
                    that.clearAllData()
                }
                that.getLastYearArea()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        //清空数据
        clearAllData: function () {
            this.sumDataSet = {
                GeneralBudget: 0,//计划能耗
                BudgetBalance: 0,//余量
                SurplusValue: 0,//剩余预算
            }
            this.sumAllMonthData = 0
            this.allMonthData = []
            this.sumDepartBudgetData = 0
            this.departBudgetData = []
            this.departMoneyData = []
            this.curMonth = null
            this.curEnType = null
            this.everyMonthBalance = 0
            this.enTypeBalance = 0
            this.departBalance = 0
            this.departAvgBalance = 0
            this.isInit = true
            this.isEdit = true
            this.treeSelectList = []
            this.isAdd = false
            this.cotypeid = null
            this.energyData = []
            this.sumEnergyData = 0
        },
        //初始化table
        initTableData: function (data) {
            var that = this
            this.$http({
                url: data.url,
                method: 'POST',
                body: data.params
            })
                .then(function (res) {
                    if (res.data) {
                        switch (data.index) {
                            case 1:
                                that.allMonthData = res.data
                                that.everyMonthBalance = that.sumAllMonthData - that.totalComputation("allMonthData")
                                that.getYearBugGetDataByMonth(res.data[0].ID)
                                that.getRightData()
                                that.sumEnergyData = res.data[0].MonthBudget//能源总预算
                                break;
                            case 2:
                                that.energyData = res.data
                                that.enTypeBalance = that.sumEnergyData - that.totalComputation("energyData")//能源当前余额
                                that.getYearBugGetDataByType(res.data[0].ID)
                                that.sumDepartBudgetData = res.data[0].GeneralBudget //科室总预算
                                that.isAdd = true
                                break;
                            case 3:
                                that.departBudgetData = res.data
                                that.departBalance = that.sumDepartBudgetData - that.totalComputation("departBudgetData") //科室当前余额
                                that.treeSelectList = res.data
                                that.getYearBugGetDataBydepar()
                                break;
                            case 4:
                                that.departMoneyData = res.data
                                that.departAvgBalance = that.sumDepartBudgetData - that.totalComputation("departMoneyData") //科室当前余额
                                break;
                        }

                    } else {
                        if (data.index == 2) {
                            that.isAdd = false
                        }
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                })
        },
        //获取第一个表格数据
        getMonthBugGetbyYearID: function (id) {
            var that = this
            var data = {
                url: '/energyManage/EMHome/GetMonthBugGetbyYearID',
                obj: this.allMonthData,
                index: 1,
                params: {
                    yearid: id
                }
            }
            this.initTableData(data)
        },
        //获取第2个表格数据
        getYearBugGetDataByMonth: function (id) {
            var that = this
            var data = {
                url: '/energyManage/EMHome/GetYearBugGetDataByMonth',
                obj: this.energyData,
                index: 2,
                params: {
                    monthid: id
                }
            }
            this.initTableData(data)
        },
        //获取第3个表格数据
        getYearBugGetDataByType: function (id) {
            this.cotypeid = id
            var that = this
            var data = {
                url: '/energyManage/EMHome/getYearBugGetDataByType',
                obj: this.departBudgetData,
                index: 3,
                params: {
                    coid: id
                }
            }
            this.initTableData(data)
        },
        //获取第4个表格数据
        getYearBugGetDataBydepar: function () {
            var that = this
            var data = {
                url: '/energyManage/EMHome/GetYearBugGetDataBydepar',
                obj: this.departMoneyData,
                index: 4,
                params: {
                    coid: this.cotypeid
                }
            }
            this.initTableData(data)
        },

        //获取树
        getTreeData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMSetting/GetTreeData',
                method: 'POST',
                params: {
                    unitID: that.uid,
                    item_type: 2,
                    unitName: that.uName
                }
            })
            .then(function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].EneryUserID = res.data[i].id
                }
                res.data.open = true
                that.initTree(res.data)
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        initTree: function (data) {
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: false
                },
                callback: {
                    onCheck: nodeCheck
                }
            };
            var zNodes = data
            var zTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            var getNodes = zTree.getNodes()
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.transformToArray(treeObj.getNodes());
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i].isParent) {
                    treeObj.setChkDisabled(nodes[i], true);
                }
            }

            if (this.departBudgetData.length != 0) {
                this.traverseTree(zTree, getNodes[0])
            }
            var that = this
            function nodeCheck(event, treeId, treeNode) {
                var isCheck = treeNode.checked
                if (isCheck) {
                    treeNode.EName = treeNode.name
                    treeNode.GeneralBudget = 0
                    treeNode.EneryUserID = treeNode.id
                    treeNode.CollTypeID = this.cotypeid
                    that.treeSelectList.push(treeNode)
                    //that.departMoneyData.push(treeNode)
                } else {
                    that.changeTreeSelect(treeNode.id)
                }
            }
        },
        //遍历树,设置默认选中节点
        traverseTree: function (zTree, node) {
            if (!node) {
                return;
            }
            
            var that = this
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    that.traverseTree(zTree, node.children[i]);
                    //设置默认选项
                    for (var j = 0; j < that.departBudgetData.length; j++) {
                        if (node.children[i].id == that.departBudgetData[j].EneryUserID) {
                            zTree.checkNode(node.children[i], true)
                            break
                        }
                    }
                }
            }
        },
        //取消选中树节点
        changeTreeSelect: function (id) {
            for (var i = 0; i < this.treeSelectList.length; i++) {
                if (this.treeSelectList[i].EneryUserID == id) {
                    this.treeSelectList.splice(i, 1)
                    this.departMoneyData.splice(i, 1)
                    break
                }
            }
        },
        selectTreeOk: function () {
            if (this.treeSelectList.length > 0) {
                var eneruserids = new Array()
                for (var i = 0; i < this.treeSelectList.length; i++) {
                    eneruserids.push(this.treeSelectList[i].EneryUserID)
                }
                eneruserids = [...eneruserids].join(',')
                this.addEnUserBudget(eneruserids)
            }
            this.treeModalVisable = false
        },
        //添加部门
        addEnUserBudget: function (ids) {
            //var zTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            //var getNodes = zTree.getNodes()
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.transformToArray(treeObj.getNodes());
            var arr = []
            for (var i in nodes) {
                if (nodes[i].checked) {
                    arr.push(nodes[i].id)
                }
            }
            

            var that = this
            this.$http({
                url: '/energyManage/EMHome/AddEnUserBudget',
                method: 'POST',
                params: {
                    cotypeid: this.cotypeid,
                    eneryids: [...arr].join(',')
                }
            })
            .then(function (res) {
                that.treeSelectList = []
                that.getYearBugGetDataByType(that.cotypeid)
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        selectTreeCancel: function () {
            if (this.treeSelectList.length == 0) {
                this.getTreeData()
            }
            this.getYearBugGetDataByType(this.cotypeid)
        },
        showTreeModal: function () {
            this.treeModalVisable = true
            this.treeSelectList = []
            this.getYearBugGetDataByType(this.cotypeid)
            this.getTreeData()
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
        //验证预算是否合格
        checkBudget: function () {
            if (this.everyMonthBalance != 0 || this.enTypeBalance != 0 || this.departBalance != 0 || this.departAvgBalance != 0) {
                this.$Modal.warning({
                    title: '信息提示',
                    content: '数据已保存，但有余额需要调整'
                });
            } else {
                this.$Modal.success({
                    title: '信息提示',
                    content: '数据保存成功'
                });
            }
        },
        //总计划能耗设置
        sumPlanChange: function (e) {
            this.sumDataSet.SurplusValue = e - this.sumDataSet.BudgetBalance
            this.sumAllMonthData = this.sumDataSet.SurplusValue
            this.everyMonthBalance = this.sumAllMonthData - this.totalComputation("allMonthData")
        },
        allowanceChange: function (e) {
            this.sumDataSet.SurplusValue = this.sumDataSet.GeneralBudget - e
            if (this.isInit) {
                //各月预算平均值
                var monAvg = parseFloat(this.sumAllMonthData / 12)
                //各类型能源平均值
                var typeAvg = parseFloat(monAvg / this.energyData.length)
                //科室预算平均
                var departBugAvg = parseFloat(typeAvg / this.treeSelectList.length)
                this.sumEnergyData = monAvg
                this.sumDepartBudgetData = typeAvg
                for (i in this.allMonthData) {
                    this.allMonthData[i].money = monAvg
                }
                this.setAvg("energyData", typeAvg)
                this.setAvg("departBudgetData", departBugAvg)
                this.setAvg("departMoneyData", departBugAvg)
            }
        },
        //y余量设置
        BudgetBalanceChange: function (e) {
            this.sumDataSet.SurplusValue = this.sumDataSet.GeneralBudget - e
            this.sumAllMonthData = this.sumDataSet.SurplusValue
            this.everyMonthBalance = this.sumAllMonthData - this.totalComputation("allMonthData")
        },
        //设置平均值
        setAvg: function (type, val) {
            var data = null
            switch (type) {
                case "energyData":
                    data = this.energyData;
                    break;
                case "departBudgetData":
                    data = this.departBudgetData
                    break;
                case "departMoneyData":
                    data = this.departMoneyData
                    break;
            }
            for (i in data) {
                data[i].GeneralBudget = val
            }
        },
        //修改或添加数据
        upadteOrAddData: function (data) {
            var that = this
            this.$http({
                url: data.url,
                method: 'POST',
                body: data.params
            })
            .then(function (res) {
                if (res.data === "ok") {
                    that.changeDataByType(data.index)
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        changeDataByType: function (index) {
            switch (index) {
                case 0:
                    //最左侧
                    this.getYearbugGetData()
                    break;
                case 1:
                    //table1
                    break;
                case 2:
                    //table2
                    break;
                case 3:
                    //table3
                    break;
                case 4:
                    //table3
                    break;
            }
        },
        //编辑最左侧数据
        editLeftData: function (par) {
            var data = {
                url: '/energyManage/EMHome/UpdateYearBudGet',
                params: par,
                index: 0
            }
            this.upadteOrAddData(data)
        },


        //编辑table
        editTable: function (par, index, url) {
            var data = {
                url: url,
                params: par,
                index: index
            }
            this.upadteOrAddData(data)
        },
        //最左侧输入框失去焦点
        sumBlur: function () {
            var year = new Date(this.slectYear)
            var data = {
                year: year.getFullYear(),
                uid: this.uid,
                GeneralBudget: this.sumDataSet.GeneralBudget,
                BudgetBalance: this.sumDataSet.BudgetBalance
            }
            this.editLeftData(data)
        },
        tableBlur: function (type, item) {
            var val = 0
            if (type == 1) {
                val = item.MonthBudget
            } else {
                val = item.GeneralBudget
            }
            var url = ''
            var data = {
                id: item.ID,
                value: val
            }
            switch (type) {
                case 1:
                    //table1
                    data.yearid = item.YearID
                    data.month = item.Month
                    url = '/energyManage/EMHome/UpdateMonthBudget'
                    break;
                case 2:
                    //table2
                    data.monthid = item.MonthID
                    data.cotypeid = item.CollTypeID
                    url = '/energyManage/EMHome/UpdateContypeBudget'
                    break;
                case 3:
                    //table3
                    data.cotypeid = item.CollTypeID
                    data.eneruserid = item.EneryUserID
                    url = '/energyManage/EMHome/UpdateEnUserBudget'
                    break;
                case 4:
                    //table4
                    data.cotypeid = item.CollTypeID
                    data.eneruserid = item.EneryUserID
                    url = '/energyManage/EMHome/UpdateDepEnUserBudget'
                    break;
            }
            this.editTable(data, type, url)

        },
        monthClick: function (e) {
            this.curMonth = e.Month
            this.sumEnergyData = e.MonthBudget
            this.getYearBugGetDataByMonth(e.ID)
            this.getRightData()
            //this.enTypeBalance = this.sumEnergyData - this.totalComputation("energyData")
        },
        typeClick: function (e) {
            this.curEnType = e.CollTypeName
            this.sumDepartBudgetData = e.GeneralBudget
            this.getYearBugGetDataByType(e.ID)
            //this.departBalance = this.sumDepartBudgetData - this.totalComputation("departBudgetData")
        },
        //各月
        monthPlanChange: function (e) {
            this.sumEnergyData = e
            var sumMOney = this.totalComputation("allMonthData")
            this.everyMonthBalance = (this.sumDataSet.SurplusValue - sumMOney)
            //能源余额调整
            this.enTypeBalance = this.sumEnergyData - this.totalComputation("energyData")
        },
        //能源
        EnPlanChange: function (e) {
            var sumMOney = this.totalComputation("energyData")
            this.enTypeBalance = (this.sumEnergyData - sumMOney)
            this.sumDepartBudgetData = e
            this.departBalance = this.sumDepartBudgetData - this.totalComputation("departBudgetData")
        },
        departPlanChnage: function (e) {
            var sumMOney = this.totalComputation("departBudgetData")
            this.departBalance = (this.sumDepartBudgetData - sumMOney)
        },
        departAvgChange: function (e) {
            var sumMOney = this.totalComputation("departMoneyData")
            this.departAvgBalance = (this.sumDepartBudgetData - sumMOney)
        },
        //计算总额
        totalComputation: function (type) {
            var data = null
            var sum = 0
            switch (type) {
                case "allMonthData":
                    data = this.allMonthData;
                    break;
                case "energyData":
                    data = this.energyData;
                    break;
                case "departBudgetData":
                    data = this.departBudgetData
                    break;
                case "departMoneyData":
                    data = this.departMoneyData
                    break;
            }
            for (var i = 0; i < data.length; i++) {
                if (type === 'allMonthData') {
                    sum += parseFloat(data[i].MonthBudget)
                } else {
                    sum += parseFloat(data[i].GeneralBudget)
                }
            }
            return sum
        },
        setPriceVisableChange: function (e) {
            if (!e) {
                this.$refs['setForm'].resetFields()
            }
        },

        setPrice: function () {
            this.$refs['setForm'].validate((valid) => {
                if (valid) {
                    console.log("success")

                } else {
                    console.log("error")
                }
            })
        },
        showSetPriceModal: function () {
            this.setPriceVisable = true
        },
        upload: function () {
            $("#uploadFile").click()
        },
        dateChange: function (e) {
            $(".con table tbody tr td").removeClass("trActive")
            $(".con table tbody tr td .ivu-input-number-input").removeClass("activeColor")
            this.editDisable = true
            this.slectYear = e.substring(0, 4)
            var curYear = new Date().getFullYear()
            this.getYearbugGetData()
            if (parseInt(this.slectYear) <= curYear) {
                this.isEdit = false
            } else {
                this.isEdit = true
            }
        },
        //右侧面积数据
        getLastYearArea: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetLastYearArea',
                method: 'POST',
                params: {
                    uid: this.uid,
                    year: new Date(this.slectYear).getFullYear(),
                   
                }
            })
                .then(function (res) {
                    if (res.data) {
                        that.Area = res.data.Area
                        that.Bili = res.data.Bili
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //最右侧数据
        getRightData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetRightData',
                method: 'POST',
                params: {
                    uid: this.uid,
                    year: new Date(this.slectYear).getFullYear(),
                    month: this.curMonth
                }
            })
                .then(function (res) {
                    if (res.data) {
                        that.rightList = res.data
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },

        setHeight: function () {
            var itemHeight = $(".main .main-item").height() - 45
            var titleH = $(".main .main-item .item-title").height()
            var footerH = $(".main .main-item .footer").height()

            this.height = itemHeight - titleH - footerH


        },
        setWidth: function () {

            var itemW = $(".BudgetSetting .main .main-item .con").width()
            //各月能源

            $(".BudgetSetting .main .main-item .allMonthCon").scrollTop(1)
            $(" .BudgetSetting .main .main-item .allMonthCon").width(itemW + 32)
            $(".BudgetSetting .main .main-item .allMonthCon").scroll(function () {
                $(" .BudgetSetting .main .main-item .allMonthCon").css("padding-right", "15px")

            })
            //各部门用电预算

            $(".BudgetSetting .main .main-item .departBudgetCon").scrollTop(1)
            $(" .BudgetSetting .main .main-item .departBudgetCon").width(itemW + 32)
            $(".BudgetSetting .main .main-item .departBudgetCon").scroll(function () {
                $(" .BudgetSetting .main .main-item .departBudgetCon").css("padding-right", "15px")

            })
            //各部门电费均摊

            $(".BudgetSetting .main .main-item .departMoneyCon").scrollTop(1)
            $(" .BudgetSetting .main .main-item .departMoneyCon").width(itemW + 32)
            $(".BudgetSetting .main .main-item .departMoneyCon").scroll(function () {
                $(" .BudgetSetting .main .main-item .departMoneyCon").css("padding-right", "5px")


            })




        }
    },
    beforeMount: function () {
        this.uid = $.cookie("enUID")
        this.uName = $.cookie("enUName")
        this.slectYear = new Date().getFullYear().toString()
        if (parseInt(this.slectYear) <= new Date().getFullYear()) {
            this.isEdit = false
        } else {
            this.isEdit = true
        }
        this.getYearbugGetData()
        //this.getTreeData()
    },
    mounted: function () {
        this.setWidth()
        this.setHeight()
        var that = this
        $(".lastOverflow").width($(".last-main-item").width() + 50)
        window.onresize = function () {
            $(".BudgetSetting .main .main-item .allMonthCon").scrollTop(0)
            $(".BudgetSetting .main .main-item .departBudgetCon").scrollTop(0)
            $(".BudgetSetting .main .main-item .departMoneyCon").scrollTop(0)
            $(".lastOverflow").width($(".last-main-item").width() + 50)
            that.setWidth()
            that.setHeight()
        };
        
    }
})
$(".con table tbody").delegate("tr", "click", function () {
    $(".con table tbody tr td").removeClass("trActive")
    $(".con table tbody tr td .ivu-input-number-input").removeClass("activeColor")
    $(this).find("td").addClass("trActive")
    $(this).find(".ivu-input-number-input").addClass("activeColor")

})
