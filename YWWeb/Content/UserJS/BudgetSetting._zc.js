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
        editName:'编辑',
        allMonthData: [
            { month: 1, money: 110 },
            { month: 2, money: 90 },
            { month: 3, money: 56 },
            { month: 4, money: 78 },
            { month: 5, money: 110 },
            { month: 6, money: 123 },
            { month: 7, money: 56 },
            { month: 8, money: 79 },
            { month: 9, money: 90 },
            { month: 10, money: 45 },
            { month: 11, money: 67 },
            { month: 12, money: 89 },
        ],
        energyData: [
            { type: '电', money: 55 },
            { type: '水', money: 20 },
            { type: '气', money: 10 },
            { type: '热', money: 5 },
            { type: '油', money: 55 },
        ],
        departBudgetData: [
            { name: '门诊科', money: 10 },
            { name: '急诊科', money: 10 },
            { name: '收费科', money: 5 },
            { name: '后勤室', money: 10 },
            { name: '放射科', money: 7 },
            { name: '住院部', money: 9 },
            { name: '药房室', money: 10 },
            { name: '化验科', money: 3 },
            { name: '手术室', money: 10 },
            { name: '外租区', money: 7 },
            { name: 'B超室', money: 10 },
            { name: '行政楼', money: 8 },
        ],
        departMoneyData: [
            { name: '门诊科', money: 10 },
            { name: '急诊科', money: 10 },
            { name: '收费科', money: 5 },
            { name: '后勤室', money: 10 },
            { name: '放射科', money: 7 },
            { name: '住院部', money: 9 },
            { name: '药房室', money: 10 },
            { name: '化验科', money: 3 },
            { name: '手术室', money: 10 },
            { name: '外租区', money: 7 },
            { name: 'B超室', money: 10 },
            { name: '行政楼', money: 8 },
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
        }
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
