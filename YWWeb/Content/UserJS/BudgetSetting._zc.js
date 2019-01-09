new Vue({
    el: "#app",
    data: {
        height: 0,
        width:0,
        num: 110,
        editIconShow: false,
        editDisable: true,
        slectYear: '2018',
        editType: 0,
        editName: '编辑',
        sumDataSet: {
            plannEnConsumption: 0,//计划能耗
            allowance: 0,//余量
            SurplusBudget: 0,//剩余预算
            
        },
        //各月能源预算总值
        sumAllMonthData:0,
        //各月能源预算
        allMonthData: [
            { month: 1, money: 0 },
            { month: 2, money: 0 },
            { month: 3, money: 0 },
            { month: 4, money: 0 },
            { month: 5, money: 0 },
            { month: 6, money: 0 },
            { month: 7, money: 0 },
            { month: 8, money: 0 },
            { month: 9, money: 0 },
            { month: 10, money: 0 },
            { month: 11, money: 0 },
            { month: 12, money: 0 },
        ],
        sumEnergyData:0,
        //各类型能源平均值
        energyData: [
            { type: '电', money: 0 },
            { type: '水', money: 0 },
            { type: '气', money: 0 },
            { type: '热', money: 0 },
            { type: '油', money: 0 },
        ],
        sumDepartBudgetData:0,
        departBudgetData: [
            { name: '门诊科', money: 0 },
            { name: '急诊科', money: 0 },
            { name: '收费科', money: 0 },
            { name: '后勤室', money: 0 },
            { name: '放射科', money: 0 },
            { name: '住院部', money: 0 },
            { name: '药房室', money: 0 },
            { name: '化验科', money: 0 },
            { name: '手术室', money: 0 },
            { name: '外租区', money: 0 },
            { name: 'B超室', money: 0 },
            { name: '行政楼', money: 0 },
        ],
        departMoneyData: [
            { name: '门诊科', money: 0 },
            { name: '急诊科', money: 0 },
            { name: '收费科', money: 0 },
            { name: '后勤室', money: 0 },
            { name: '放射科', money: 0 },
            { name: '住院部', money: 0 },
            { name: '药房室', money: 0 },
            { name: '化验科', money: 0 },
            { name: '手术室', money: 0 },
            { name: '外租区', money: 0 },
            { name: 'B超室', money: 0 },
            { name: '行政楼', money: 0 },
        ],
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
            useWater3:null,
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
            useWater1:[
                { required: true, type: 'number', message: '请输入用水量', trigger: 'change' },
            ],
        },
        curMonth: 1,
        curEnType: "电",
        everyMonthBalance: 0,
        enTypeBalance: 0,
        departBalance: 0,
        departAvgBalance: 0,
        isInit: true
    },
    methods: {
        edit: function () {
            if (this.editType == 1) {
                this.editType = 0
                this.editName = '编辑'
                this.editIconShow = false;
                this.editDisable = true;
            } else {
                this.editType = 1
                this.editName = '保存'
                this.editIconShow = true;
                this.editDisable = false;
            }
            
        },
        //总计划能耗设置
        sumPlanChange: function (e) {
            this.sumAllMonthData = e
            if (this.isInit) {
                //各月预算平均值
                var monAvg = parseFloat(e / 12).toFixed(2)
                //各类型能源平均值
                var typeAvg = parseFloat(monAvg / this.energyData.length).toFixed(2)
                //科室预算平均
                var departBugAvg = parseFloat(monAvg / this.departBudgetData.length).toFixed(2)
                this.sumEnergyData = monAvg
                this.sumDepartBudgetData = departBugAvg
                for (i in this.allMonthData) {
                    this.allMonthData[i].money = monAvg
                }
                this.setAvg("energyData", typeAvg)
                this.setAvg("departBudgetData", departBugAvg)
                this.setAvg("departMoneyData", departBugAvg)
            }
            this.sumAllMonthData = e
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
                data[i].money = val
            }
        },
        monthClick: function (month) {
            console.log(month)
            this.curMonth = month
        },
        monthPlanChange: function (e) {
            console.log(this.totalComputation("allMonthData"))
            var sumMOney = this.totalComputation("allMonthData")
            this.everyMonthBalance = (this.sumAllMonthData - sumMOney).toFixed(2)
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
            for (i in data) {
                sum += parseFloat(data[i].money)
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
        dateChange: function () {
            $(".con table tbody tr td").removeClass("trActive")
            $(".con table tbody tr td .ivu-input-number-input").removeClass("activeColor")
            this.editDisable = true
        },
        setHeight: function () {
            var itemHeight = $(".main .main-item").height()-45
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
       
       
    },
    mounted: function () {
        this.setWidth()
        this.setHeight()
        var that = this
        window.onresize = function () {
           
            $(".BudgetSetting .main .main-item .allMonthCon").scrollTop(0)
            $(".BudgetSetting .main .main-item .departBudgetCon").scrollTop(0)
            $(".BudgetSetting .main .main-item .departMoneyCon").scrollTop(0)
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
$(function () {


    
})
