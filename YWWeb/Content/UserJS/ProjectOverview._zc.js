
new Vue({
    el: "#projectOverview",
    data: {
        unitProId: null,
        loading: true,
        height: 0,
        rightBottomHeight: '',
        rightListWIdth: '',
        dates: [],
        curDate: '',
        listHeight: '',
        matterType: 1,
        matterVisible: false,
        logMatterVisible: false,
        editMatterVisible: false,
        editReasonVisible: false,
        hintModalVisable: false,
        successVisable: false,
        hintType: '',
        approvalResultVisable: false,
        approvalReult: {
            state: 0,
            imgSrc: '',
            resultInfo: ''
        },
        decDisabled: true,
        uploadListShow: true,
        formDisabled: true,
        hintInfo: {
            title: '',
            con: ''
        },
        //事项表单
        matterForm: {
            DefTempID: null,//事项id
            PersonID: null,//负责人id
            Name: '',//事项名称
            EndTime: null,//完成时间
            BeforDay: 7,//提醒时间
            Moneys: null,//金额
            PeopleCopied: [],//抄送人
            Conid: null,
            IsOk: 0,
            IsiNvoice:'0'
        },
        //点击事项表单
        editForm: {
            DefTempID: null,//事项id
            PersonID: null,//负责人id
            Name: '',//事项名称
            EndTime: null,//完成时间
            BeforDay: 7,//提醒时间
            Moneys: null,//金额
            PeopleCopied: [],//抄送人
            Conid: null,
            IsOk: 0,
            IsiNvoice: '0'
        },
        //日志表单
        logMatterForm: {
            DefTempID: 35,//施工事项id
            Name: '施工日志',//施工事项name
            StartTime: '',
            PeopleCopied: [],//抄送人
            period: 7,//施工周期
            PersonID: null,//负责人
            Subcontractors: '',//分包单位
            Isemphasis: '0',//是否包含
            emphasisName: [],//重点工程项目
            Conid: 0,
            IsOk: 0
        },
        editLogMatterForm: {
            DefTempID: 35,//施工事项id
            Name: '施工日志',//施工事项name
            StartTime: '',
            PeopleCopied: [],//抄送人
            period: 7,//施工周期
            PersonID: null,//负责人
            Subcontractors: '',//分包单位
            Isemphasis: '0',//是否包含
            emphasisName: [],//重点工程项目
            Conid: 0,
            IsOk: 0
        },
        //编辑原因表单
        reasonForm: {
            reason: '',
        },
        matterRules: {
            DefTempID: [
                { required: true, type: 'number', message: '请选择事项', trigger: 'change' }
            ],
            PersonID: [
                { required: true, type: 'number', message: '请选择负责人', trigger: 'change' },
            ],
            PeopleCopied: [
                { required: true, type: 'array', message: '请选择负抄送人', trigger: 'change' },
            ],
            finshDate: [
                { required: true, type: 'date', message: '请选择完成时间', trigger: 'change' }
            ],
            BeforDay: [
                { required: true, type: 'number', message: '请输入提醒时间', trigger: 'change' },
            ],
            StartTime: [
                { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
            ],
            EndTime: [
                { required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }
            ],
            Name: [
                { required: true, message: '请输入事项名称', trigger: 'blur' },

            ],
            Moneys: [
                { required: true, type: 'number', message: '请输入金额', trigger: 'blur' },

            ],
            dec: [
                 { required: true, message: '请输入说明', trigger: 'blur' },
            ],
            Subcontractors: [
                { required: true, message: '请输入分包单位', trigger: 'blur' },
            ],
            dateRange: [
                { required: true, type: 'array', message: '请选择结束时间', trigger: 'change' }
            ],
            period: [
                { required: true, type: 'number', message: '请输入施工周期', trigger: 'change' },
            ],
            reason: [
                { required: true, message: '请输入编辑原因', trigger: 'blur' },
            ],
        },
        //反馈信息table
        feedBackColumns: [
            {
                title: '反馈信息',//文字内容
                key: 'Remark'
            },
            {
                title: '大小',//反馈人
                key: 'FileSize',
                align: 'center'
            },
            {
                title: '反馈时间',
                key: 'CommitTime',
                align: 'center',
                render: (h, params) => {
                    return h('span',
                       {
                       }, ChangeDateFormat(params.row.CommitTime))
                }
            },
            {
                title: '照片',
                key: 'absolutePath',
                render: (h, params) => {
                    return h('img', {
                        attrs: {
                            src: params.row.absolutePath,
                            style: 'width: 30px;height:30px;margin:5px 0px 5px 5px ',
                            "data-original": params.row.absolutePath,
                            id: params.row.ID
                        },
                        on: {
                            click: () => {
                                //imClick2()
                                var id = params.row.ID + ""
                                
                                 
                                new Viewer(document.getElementById(id), {
                                    url: 'data-original',

                                });

                            }
                        }
                    })
                },
                /*render: (h, params) => {
                    
                    return h('div', params.row.FilePath.map(v => { // 遍历后台params.row.FilePath
                        return h('img',
                           {
                            
                               attrs: {
                                   src: v,
                                   style: 'width: 30px;height:30px;margin:5px 0px 5px 5px',
                                   "data-original": v
                               },
                           })
                    })
                    )
                }*/

            },
        ],
        //反馈信息table数据
        feedBackData: [],
        //审批状态table
        approveColumns: [
            {
                type: 'selection',
                width: 30,
                align: 'center'
            },
            {
                title: '名称',
                key: 'FileName'
            },
            {
                title: '上传人',
                key: 'CommitUser',
                align: 'center'
            },
            {
                title: '大小',
                key: 'FileSize',
                align: 'center'
            },
            {
                title: '时间',
                key: 'CommitTime',
                align: 'center',
                render: (h, params) => {

                    return h('span',
                       {
                       }, ChangeDateFormat(params.row.CommitTime))
                }
            },
          /*  {
                title: '操作',
                align:'center',
                render: (h, params) => {
                    var that = this
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'button',
                                size: 'small',
                                shape: "circle",
                                icon:"ios-search"
                            },
                            attrs:{
                                title:'查看'
                            },
                            style: {
                                marginRight: '5px',
                                background: 'linear-gradient(to bottom, #7fd4c1 , #5bb09d)',
                                color:'#fff'
                            },
                            on: {
                                click: () => {
                                    window.open(params.row.absolutePath)
                                    
                                }
                            }
                        }),
                        h('Button', {
                            props: {
                                type: 'button',
                                size: 'small',
                                shape: "circle",
                                icon: "ios-cloud-download-outline"
                            },
                            attrs: {
                                title: '下载'
                            },
                            style: {
                                marginRight: '5px',
                                background: 'linear-gradient(to bottom, #f9bc61 , #efa05e)',
                                color: '#fff'
                            },
                            on: {
                                click: () => {
                                    console.log(params.row.absolutePath)
                                    window.open(params.row.absolutePath)
                                    
                                }
                            }
                        }),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                shape: "circle",
                                icon: "ios-trash-outline"
                               
                            },
                            attrs: {
                                title: '删除',
                                
                            },
                            style: {
                                marginRight: '5px',
                                background: 'linear-gradient(to bottom, #ec754d , #e76653)',
                                color: '#fff'
                            },
                            on: {
                                click: () => {
                                    //删除文件
                                    console.log(params.row.ID)
                                    
                                   $.post({
                                        url: "/Home/DeleteFileByID",
                                        method: "post",
                                        data: {
                                            id: params.row.ID
                                        },
                                        success: function (res) {
                                            //$("#fileTable tr:eq(" + params.index + ")").remove()
                                        },
                                        error: function (e) {
                                            console.log(e)
                                        }
                                    })
                                    
                                }
                            }
                        })
                    ]);
                }

            },*/
        ],
        //审批状态table数据
        approveData: [],
        approveTempData: [],
        proList: [],
        curProIndex: 0,
        proId: 0,
        proInfo: '',
        memorandum: [],
        calendarDate: '',
        matterData: [],
        moneyData: [],
        constructData: [],
        people: [],//负责人
        editPeople: [],
        matters: [],//事项类型
        matterDetailInfo: {},
        matterId: 0,
        editLog: [],
        file: [],
        uploadData: {},
        isHaveRole: {},
        lastLog: {},
        csPeoples: [],
        logProDIsable: true,
        sumMoney: null,
        editDecDisabled: true,
        matters1: [],
        matters2: [],
        matters3: [],
        fileArray: [],
        userButton: [],
        allTempBW: [],
        type1: 0,
        type2: 0,
        type3: 0,
        tempByID: {},
        modalTitle:'新增事项管理'

    },

    methods: {
        //查看文件
        searchFile: function () {
            console.log(this.fileArray)
            if (this.fileArray.length > 1 || this.fileArray.length == 0) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要查看的文件",
                    onOk: () => {

                    },
                });
            } else {
                window.open(this.fileArray[0].absolutePath)
            }
        },
        //下载
        downloadFile: function () {
            if (this.fileArray.length > 1 || this.fileArray.length == 0) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要下载的文件",
                    onOk: () => {

                    },
                });
            } else {
                window.open(this.fileArray[0].absolutePath)
            }
        },
        //删除
        delFile: function () {
            if (this.fileArray.length == 0) {
                this.$Modal.warning({
                    title: "信息提示",
                    top: 200,
                    content: "请选择要删除的文件",
                    onOk: () => {

                    },
                });
            } else {
                var data = this.fileArray
                var that = this
                this.$Modal.confirm({
                    title: '信息提示',
                    content: '<p>确定要删除吗？</p>',
                    onOk: () => {
                        for (var i = 0; i < data.length; i++) {
                            that.delFileInterface(data[i].ID)
                        }
                    },
                    onCancel: () => {

                    }
                });
            }
        },
        //删除文件
        delFileInterface: function (id) {
            var that = this
            this.$http({
                url: "/Home/DeleteFileByID",
                method: "post",
                params: {
                    id: id
                }
            })
            .then(function (res) {
                that.getTempDetail(that.matterId)
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        getUserBtn: function () {
            var that = this
            var url = window.location.pathname;
            this.$http({
                url: "/SysInfo/UserButtonList",
                method: 'post',
                params: {
                    CurrUrl: url
                }
            })
                .then(function (res) {
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

                        arr.push(btnData)
                        console.log("事件" + btnData.event)
                    }

                    this.userButton = arr

                })
                .catch(function (e) {

                    console.log(e)
                })


        },
        fileSelectChange: function (selection) {
            console.log(selection)
            this.fileArray = selection
        },
        moneyChange: function (e) {
            var sum = this.proInfo.conMoney
            var temp = (this.matterForm.Moneys / sum) * 100
            this.sumMoney = temp.toFixed(2)
        },
        editmoneyChange: function (e) {
            var sum = this.proInfo.conMoney
            var temp = (this.editForm.Moneys / sum) * 100
            this.sumMoney = temp.toFixed(2)
        },
        //项目列表
        getProList: function () {
            var that = this
            this.$http({
                url: "/Home/GetUnfinishedPrject",
                method: "post"
            })
            .then(function (res) {
                that.proList = res.data
                var data = res.data

                if (that.unitProId != null) {
                    that.proId = that.unitProId
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == that.unitProId) {
                            that.curProIndex = i
                            break;
                        }
                    }

                } else {
                    that.proId = res.data[0].id
                }

                that.allMethod()
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        proClick: function (e, proId) {
            $.cookie('proId', null, { expires: 7, path: '/' });

            this.curProIndex = e
            this.proId = proId
            this.setStateBtnStyle()
            this.allMethod()
            this.getAllBWData()
            this.changeCalendar()
            
        },
        //重置事项状态
        setStateBtnStyle: function () {
            $(".btn-group .btn").removeClass("active")
            $(".matterStateBtn .btn:eq(0)").addClass("active")
            $(".moneyStateBtn .btn:eq(0)").addClass("active")
            $(".sgStateBtn .btn:eq(0)").addClass("active")
        },
        allMethod: function () {
            //项目信息
            this.getProInfo()
            this.getRoleByPro()
            //备忘提醒
            this.getConTemp()

            //事项记录
            this.getTemLog(0, 1)
            this.getTemLog(0, 2)
            this.getTemLog(0, 3)
            this.getAllBWData()
            var that = this
            setInterval(function () {
                that.getTemLog(that.type1, 1)
                that.getTemLog(that.type2, 2)
                that.getTemLog(that.type3, 3)
            }, 5000)

        },
        //项目信息
        getProInfo: function () {
            var that = this
            this.$http({
                url: '/Home/GetProjectByID',
                method: 'post',
                params: {
                    id: this.proId
                }
            }).
            then(function (res) {
                that.proInfo = res.data
                that.csPeoples = res.data.personids
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //备忘提醒
        getConTemp: function () {
            console.log(this.calendarDate)
            var time = this.calendarDate
            var that = this
            this.$http({
                url: "/Home/GetConTemp",
                method: 'post',
                params: {
                    conid: this.proId,
                    time: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
                }
            })
            .then(function (res) {
                that.memorandum = res.data
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        getcalendar: function () {
            var time = $.cookie('calendar');
            var isClick = $.cookie('isClick');
            if (time != this.calendarDate && time != null) {
                this.calendarDate = new Date(time)
                console.log(this.calendarDate)
                this.getConTemp()
            }
            if (isClick) {

                this.changeCalendar()
            }
        },
        //事项记录
        getTemLog: function (isok, type) {
            var that = this
            this.$http({
                url: "/Home/GetTemLog",
                method: 'post',
                params: {
                    conid: this.proId,
                    isok: isok,
                    type: type
                }
            })
            .then(function (res) {
                switch (type) {
                    case 1:
                        that.matterData = res.data
                        break;
                    case 2:
                        that.moneyData = res.data
                        break;
                    case 3:
                        that.constructData = res.data
                        break;

                }

            })
            .catch(function (e) {
                console.log(e)
            })

        },
        //事项状态切换
        isokChange: function (isok, type) {
            switch (type) {
                case 1:
                    this.type1 = isok
                    break
                case 2:
                    this.type2 = isok
                    break
                case 3:
                    this.type3 = isok
            }
            this.getTemLog(isok, type)
        },
        setHeight: function () {

            var h = $(window).height();
            this.height = h - 20
            this.rightBottomHeight = (h - 270) + "px"
            this.listHeight = (h - 370) + "px"

            var width = $(".right-bottom .list").width() + 17
            this.rightListWIdth = width + "px"

        },
        //新增事项弹框显示
        showModal: function (type) {
            if (type == 2) {
                this.matterForm.Moneys = null
                this.sumMoney = null
                this.modalTitle = "新增资金管理"
            }
            if (type == 1) {
                this.modalTitle = "新增事项管理"
            }
            this.matterType = type
            this.matterVisible = true

            this.peopleDisable()

        },
        peopleDisable: function () {

            for (var i = 0; i < this.csPeoples.length; i++) {
                this.csPeoples[i] = parseInt(this.csPeoples[i])
            }
            this.matterForm.PeopleCopied = this.csPeoples
            this.logMatterForm.PeopleCopied = this.csPeoples
            console.log(this.matterForm.PeopleCopied)
            console.log(this.logMatterForm.PeopleCopied)
            var arr = this.csPeoples
            var people = this.people
            for (var i = 0; i < people.length; i++) {
                people[i].disable = false
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == people[i].UserID) {
                        people[i].disable = true
                        break
                    }
                }
            }
            this.people = people
        },
        //负责人数据
        getUserInfo: function () {
            var that = this
            this.$http({
                url: "/Energy/getUserInfo",
                method: 'post'
            })
            .then(function (res) {
                that.people = JSON.parse(res.data)
                that.loading = false
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //获取事项下拉框数据
        getMatters: function (type) {
            var that = this
            this.$http({
                url: "/Energy/GetDefaultTemp",
                method: 'post',
                params: {
                    type: type
                }
            })
            .then(function (res) {
                if (type == 1) {
                    that.matters1 = res.data
                } else if (type == 2) {
                    that.matters2 = res.data
                } else {
                    that.matters3 = res.data
                }

            })
            .catch(function (e) {
                console.log(e)
                that.loading = false
            })
        },
        lohModal: function () {
            this.logMatterVisible = true
            this.matterType = 3
            this.peopleDisable()
        },
        //新增事项
        addMatter: function (name) {
            var data = {}
            console.log(this.matterType)

            var that = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.matterType != 3) {
                        this.matterForm.Conid = this.proId
                        data = Object.assign({}, this.matterForm);
                        data.EndTime = data.EndTime.getFullYear() + "-" + (data.EndTime.getMonth() + 1) + "-" + data.EndTime.getDate()
                    } else {
                        this.logMatterForm.Conid = this.proId
                        data = Object.assign({}, this.logMatterForm);
                        data.StartTime = data.StartTime.getFullYear() + "-" + (data.StartTime.getMonth() + 1) + "-" + data.StartTime.getDate()
                        if (data.emphasisName.length > 0) {
                            data.emphasisName = data.emphasisName.join(",")
                        }

                    }
                    data.PeopleCopied = data.PeopleCopied.join(",")
                    data.Type = that.matterType
                    console.log("添加" + data.period)
                    if (this.matterType != 3) {
                        this.addMatteTemp(data)
                    } else {
                        console.log("添加施工日志")
                        // for (var i = 0; i < parseInt(data.period) ; i++) {
                        that.addMatteTemp(data)

                        //}
                    }


                } else {
                    console.log("fail")
                }
            })

        },
        addMatteTemp: function (data) {
            var that = this
            this.$http({
                url: "/Home/addConTemp",
                method: "post",
                params: data
            })
             .then(function (res) {
                 that.getAllBWData()
                 if (that.matterType != 3) {
                     that.matterVisible = false
                 } else {
                     that.logMatterVisible = false
                 }
                 that.getTemLog(0, that.matterType)

                 that.changeCalendar()
             })
              .catch(function (e) {
                  console.log(e)
              })
        },

        //事项下拉框change
        matterChange: function (e) {

            if (e != undefined) {

                if (e.value == 17) {
                    this.decDisabled = false
                } else {
                    this.decDisabled = true
                    if (this.matterType != 3) {
                        this.matterForm.Name = e.label
                    } else {
                        this.logMatterForm.Name = e.label
                    }

                }
            }

        },
        //事项详情
        getTempDetail: function (id) {
            var that = this
            this.$http({
                url: "/Home/getTempDetail",
                method: "post",
                params: {
                    id: id
                }
            })
            .then(function (res) {
                // that.matterDetailInfo = res.data
                that.getAllBWData()
               
                that.matterDetailInfo = res.data
                
                console.log(that.matterDetailInfo)
                that.approveData = res.data.filelist
                that.feedBackData = res.data.imglist
                that.changeCalendar()

                //that.getUserBtn()
            })
            .catch(function (e) {
                console.log(e)
            })
        },
       
       
        //事项详情modal显示
        matterDetail: function (e, id) {
            if (e == 3) {
           
            }
            this.matterType = e

            this.matterId = id
            this.getTempDetail(id)
            this.getTempByID(id)
            this.editMatterVisible = true
            this.getEditLog()




        },
        //根据id查询事项
        getTempByID: function (id) {
            var that = this
            this.$http({
                url: "/Home/GetTempByID",
                method: "post",
                params: {
                    id: id
                }
            })
            .then(function (res) {
               that.tempByID = res.data
                if (that.matterType != 3) {
                    that.$refs['editForm'].resetFields()
                }
                var data = res.data
                if (data.PeopleCopied != null) {
                    var arr = data.PeopleCopied.split(",")
                    for (var i = 0; i < arr.length; i++) {
                        arr[i] = parseInt(arr[i])
                    }
                    var people = this.people
                    for (var i = 0; i < people.length; i++) {
                        people[i].disable = false
                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j] == people[i].UserID) {
                                people[i].disable = true
                                break
                            }
                        }
                    }
                    this.people = people
                }
                if (that.matterType == 2) {
                    var temp = (data.Moneys / this.proInfo.conMoney) * 100
                    this.sumMoney = temp.toFixed(2)
                }
                if (that.matterType != 3) {
                    var temp = {
                        DefTempID: data.DefTempID,//事项id
                        PersonID: data.PersonID,//负责人id
                        Name: data.Name,//事项名称
                        EndTime: data.EndTime,//完成时间
                        BeforDay: data.BeforDay,//提醒时间
                        Moneys: data.Moneys,//金额
                        PeopleCopied: arr,//抄送人
                        Conid: data.conid,
                        IsOk: data.IsOk,
                        IsiNvoice: data.IsiNvoice+""
                    }
                    temp.EndTime = ChangeDateFormat(temp.EndTime)
                    that.editForm = temp
                } else {
                    var emphasisName = data.emphasisName
                    if (emphasisName != null) {
                        emphasisName = data.emphasisName.split(",")
                    }
                    var temp = {
                        DefTempID: data.DefTempID,//施工事项id
                        Name: data.Name,//施工事项name
                        StartTime: ChangeDateFormat(data.StartTime),
                        PeopleCopied: arr,//抄送人
                        period: data.period,//施工周期
                        PersonID: data.PersonID,//负责人
                        Subcontractors: data.Subcontractors,//分包单位
                        Isemphasis: data.Isemphasis + "",//是否包含
                        emphasisName: emphasisName,//重点工程项目
                        Conid: data.conid,
                        IsOk: data.IsOk
                    }

                    that.editLogMatterForm = temp

                }
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //获取编辑记录
        getEditLog: function () {
            var that = this
            console.log(that.matterId)
            this.$http({
                url: "/Home/GetLog",
                method: "post",
                params: {
                    id: that.matterId
                }
            })
            .then(function (res) {
                that.editLog = res.data
                if (res.data.length > 0) {
                    that.lastLog = res.data[res.data.length - 1]
                }

            })
            .catch(function (e) {

            })
        },
        //编辑原因提交
        reasonSubmit: function () {
            var that = this
            console.log(that.reasonForm.reason)
            this.$refs['reasonForm'].validate((valid) => {
                if (valid) {

                    that.$http({
                        url: '/Home/AddLog',
                        method: 'post',
                        params: {
                            id: that.matterId,
                            rearmks: that.reasonForm.reason
                        }
                    })
                    .then(function (res) {
                        console.log("success")
                        that.formDisabled = false
                        this.editReasonVisible = false
                        if (that.editLogMatterForm.Isemphasis == '0') {
                            that.logProDIsable = true
                        } else {
                            that.logProDIsable = false
                        }
                        if (that.matterType == 1) {
                            if (this.editForm.DefTempID == 17) {
                                that.editDecDisabled = false
                            }
                        }

                    })
                    .catch(function (e) {
                        console.log(e)
                    })

                } else {
                    console.log("fail")
                }
            })
        },
        IsemphasisChange: function (e) {

            if (e == "1") {
                this.logProDIsable = false
            } else {
                this.logProDIsable = true
            }
        },
        //点击编辑事项按钮
        editMatter: function () {
            this.getEditLog()
            this.editReasonVisible = true

        },
        //编辑事项提交
        editMatterSubmit: function () {
            var formName = ''
            switch (this.matterType) {
                case 1:
                    formName = "editForm"
                    break
                case 2:
                    formName = "editForm"
                    break
                case 3:
                    formName = "editLogMatterForm"
                    this.editLogMatterForm.StartTime = new Date(this.editLogMatterForm.StartTime)
                    break

            }
            console.log("starttime：" + this.editLogMatterForm.StartTime)
            var that = this
            if (that.matterType != 3) {
                for (var i = 0; i < that.approveTempData.length; i++) {
                    that.uploadFile(that.approveTempData[i])
                    if (i == (that.approveTempData.length - 1)) {
                        that.getTempDetail(that.matterId)
                        that.approveTempData = []
                        that.$Modal.success({
                            title: "信息提示",
                            content: "上传成功"
                        });
                        that.$http({
                            url: "/Home/UpdateState",
                            mrthod: "post",
                            params: {
                                isok: 3,
                                id:that.matterId
                            }
                        })
                    }
                }
            }
            if (!this.formDisabled) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log("success")

                        that.editMatterInterFace()
                        that.setStateBtnStyle()

                    } else {
                        console.log("fail")
                    }
                })
            } else {
                that.editMatterVisible = false
            }



        },
        //编辑事项操作
        editMatterInterFace: function () {
            var that = this
            var data = {}
            switch (this.matterType) {
                case 1:
                    data = Object.assign({}, this.editForm)
                    data.EndTime = data.EndTime.getFullYear() + "-" + (data.EndTime.getMonth() + 1) + "-" + data.EndTime.getDate()
                    break
                case 2:
                    data = Object.assign({}, this.editForm)
                    data.EndTime = data.EndTime.getFullYear() + "-" + (data.EndTime.getMonth() + 1) + "-" + data.EndTime.getDate()
                    break
                case 3:

                    data = Object.assign({}, this.editLogMatterForm)
                    console.log(this.editLogMatterForm.StartTime)
                    data.StartTime = data.StartTime.getFullYear() + "-" + (data.StartTime.getMonth() + 1) + "-" + data.StartTime.getDate()
                    if (data.emphasisName.length > 0) {
                        data.emphasisName = data.emphasisName.join(",")
                    }

                    break
            }
            if (data.PeopleCopied != null) {
                data.PeopleCopied = data.PeopleCopied.join(",")
            }
            data.id = this.matterId
            data.Type = this.matterType
            this.$http({
                url: "/Home/addConTemp",
                method: "post",
                params: data
            })
              .then(function (res) {
                  that.editMatterVisible = false
                  that.getTemLog(0, that.matterType)
              })
              .catch(function (e) {
                  console.log(e)
              })

        },
        editMatterChange: function (e) {
            if (e != undefined) {
                if (this.matterType == 1) {
                    if (e.value == 17) {
                        this.editDecDisabled = false
                    } else {
                        this.editDecDisabled = true
                    }
                }
                if (e.value == 0) {
                    this.decDisabled = false
                } else {
                    this.decDisabled = true
                    if (this.matterType != 3) {
                        this.editForm.Name = e.label
                    } else {
                        this.editLogMatterForm.Name = e.label
                    }

                }
            }
        },
        //删除事项
        deleteMatterSub: function () {
            var that = this
            this.$http({
                url: "/Home/DeleteItem",
                method: "post",
                params: {
                    id: this.matterId
                }
            }).
            then(function (res) {
                that.getTemLog(0, that.matterType)
                that.setStateBtnStyle()
                that.editMatterVisible = false
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //点击删除事项
        deleteMatter: function () {
            this.hintInfo = {
                title: '事项删除',
                con: '确定删除？整个页面将无法恢复'
            }
            this.hintType = "删除"
            this.hintModalVisable = true

        },
        //上传文件
        beforeUpload: function (file) {
            //this.file.push(file);
            console.log(file)
            console.log($.cookie("username"))
            var size = file.size / 1024
            var date = new Date()
            var data = {
                FileName: file.name,
                CommitUser: $.cookie("username"),
                FileSize: size.toFixed(2) + "kb",
                CommitTime: date.getFullYear() + "-" + (date.getMonth() + 1) + date.getDate()
            }
            this.approveTempData.push(file)
            this.approveData.push(data)


            return false;
        },
        uploadFile: function (file) {
            var formdata = new FormData();
            formdata.append("fileData", file);
            formdata.append("fk_id", this.matterId);
            formdata.append("Modules", "matter");

            var that = this
            $.ajax({
                type: "post",
                url: "/Home/UploadFile",
                data: formdata,
                dataType: 'json',
                processData: false, // 告诉jQuery不要去处理发送的数据
                contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                xhrFields: { withCredentials: true },
                async: true,    //默认是true：异步，false：同步。
                success: function () {
                    console.log("上传成功")


                }
            })
        },

        uploadProgress: function (event, file, fileList) {
            this.uploadListShow = true
            console.log(this.uploadData)
        },
        uploadSuccess: function (response, file, fileList) {
            console.log(this.uploadData)
            this.uploadListShow = false
        },
        //事项详情modal显示状态
        editVisibleChange: function (e) {
            if (!e) {
                if (this.matterType != 3) {
                    this.$refs['matterForm'].resetFields()
                    this.$refs['editForm'].resetFields()
                } else {


                }
                this.approveTempData = []
                this.editDecDisabled = true
                this.formDisabled = true
                this.logProDIsable = true
            } else {


                this.getRole()
            }

        },
        addVisibleChange: function (e) {
            if (!e) {

                this.$refs['matterForm'].resetFields()
                if (this.matterType == 2) {
                    this.matterForm.Moneys = null
                }
                this.decDisabled = true


            } else {


                this.getRole()
            }

        },
        loaAddVisibleChange: function (e) {
            if (!e) {
                this.$refs['logMatterForm'].resetFields()
                this.logMatterForm.emphasisName = []
            } else {
                console.log(this.logMatterForm.PeopleCopied)
            }


        },
        //编辑事项原因modal显示状态
        reasonVisibleChange: function (e) {
            this.$refs['reasonForm'].resetFields()
        },
        //审批或审批拒绝
        updateState: function (type) {
            var data = {}
            //4审批通过，5 审批拒绝
            if (type == 4) {
                data = {
                    id: this.matterId
                }
            } else {
                data = {
                    id: this.matterId,
                    reason: this.reasonForm.reason
                }
            }
            data.isok = type
            var that = this
            this.$http({
                url: "/Home/UpdateState",
                method: "post",
                params: data
            })
            .then(function (res) {
                if (type == 1) {
                    that.approvalResultVisable = true
                } else {
                    that.approvalResultVisable = false
                    that.editMatterVisible = false
                    that.approvalResultVisable = false
                    that.allMethod()

                }
                that.getTemLog(0, that.matterType)
                that.setStateBtnStyle()
            })
            .catch(function (e) {

            })


        },
        //审批确定刷新列表
        approvalSure: function () {
            this.approvalResultVisable = false
            this.editMatterVisible = false
            this.getTemLog(0, that.matterType)
            this.setStateBtnStyle()
        },
        //点击审批
        approval: function () {
            this.hintInfo = {
                title: '事项审批',
                con: '您好，请确认事项内容是否完成'
            }
            this.hintType = "审批"
            this.hintModalVisable = true
        },

        //删除或审批
        approvalOrDel: function () {
            if (this.hintType == "审批") {
                //审批操作
                this.approvalReult = {
                    state: 1,
                    imgSrc: '/Content/images/project/pass1.png',
                    resultInfo: '事项审核确认完成'
                }
                this.updateState(4)

            } else {
                //删除操作
                this.deleteMatterSub()
            }
        },
        //删除或审批取消
        approvalOrDelCancel: function () {
            if (this.hintType == "审批") {
                //显示审核未通过弹框
                this.approvalReult = {
                    state: 0,
                    imgSrc: '/Content/images/project/pass0.png',
                    resultInfo: '事项未通过审核'
                }
                this.approvalResultVisable = true
            } else {
                //取消删除，隐藏弹框
                this.hintModalVisable = false
            }
        },
        //审核未通过原因提交
        noPassSub: function () {
            var that = this
            this.$refs['reasonForm'].validate((valid) => {

                if (valid) {
                    that.updateState(5)
                } else {
                    console.log("fail")
                }
            })
        },
        //获取权限
        getRole: function () {
            var that = this
            this.$http({
                url: "/Home/GetIsExaminationUser",
                method: "post",
                params: {
                    conid: this.proId,
                    itemid: this.matterId
                }
            })
            .then(function (res) {
                console.log(res.data)
                that.isHaveRole = res.data
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        getRoleByPro: function(){
            var that = this
            this.$http({
                url: "/Home/GetIsExaminationUser",
                method: "post",
                params: {
                    conid: this.proId,
                   
                }
            })
            .then(function (res) {
                that.isHaveRole = res.data
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        getCurDate: function () {
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            if (month < 10) {
                month = "0" + month
            }
            if (day < 10) {
                day = "0" + day
            }
            // var time = year + "-" + month + "-" + day
            this.calendarDate = new Date()
        },
        //获取全部备忘提醒
        getAllBWData: function (id) {
            var that = this
            this.$http({
                url: "/Home/GetConTemp",
                params: {
                    conid: this.proId
                }
            })
            .then(function (res) {
                that.allTempBW = res.data
                that.changeCalendar()

            })
            .catch(function (e) {
                console.log(e)
            })
        },
        changeCalendar: function () {
            var data = this.allTempBW
            $(".calendar-date .item-curMonth").css("color", "#333")
            $(".calendar-date .item-curMonth").each(function () {
                var time = $(this).attr("data")
                time = time.substring(0, 4) + "/" + time.substring(4, 6) + "/" + time.substring(6, 8)
                for (var i = 0; i < data.length; i++) {
                    if (data[i].StartTime != null) {
                        if (time == data[i].StartTime.split(" ")[0]) {
                            if (data[i].isOk == 4) {
                                $(this).css("color", "#32b194")
                            } else {
                                $(this).css("color", "#ff6515")
                            }
                            

                            break
                        }
                    }

                }
            });
            $.cookie('isClick', false, { expires: 7, path: '/' });
        }
    },

    beforeMount: function () {
        this.unitProId = $.cookie("proId")
        $.cookie('proId', null, { expires: 7, path: '/' });
        var that = this
        this.setHeight()
        function setHeight() {
            var h = $(window).height();
            that.height = h - 20
            that.rightBottomHeight = (h - 270) + "px"
            that.listHeight = (h - 370) + "px"
            var width = $(".right-bottom .list").width() + 17
            that.rightListWIdth = width + "px"
        }
        setInterval(setHeight, 100)
        this.getCurDate()
        this.getProList()
        this.getMatters(1)
        this.getMatters(2)
        this.getMatters(3)
        this.getUserInfo()
        







    }
})


$(function () {
    //滚动条
    $(".right-bottom .list .view").scrollTop(1)
    $(".right-bottom .list .view").scroll(function () {
        $(this).find(".row").css("margin-right", "17px")

    })
    $(".left .listView").scrollTop(1)
    $(".left .listView").scroll(function () {
        var width = $(".left").width()
        $(this).width(width + 17)

    })

    //console.log($(".calendar-date li"))
    $(".calendar-date li").each(function () {
        //console.log($(this).attr("data"))
        /*if($(this).attr("data") == "20181126"){
            $(this).css("color", "#ff6515")
        }*/
    });


})

$(".matterStateBtn .btn").click(function () {
    $(".matterStateBtn .btn").removeClass("active")
    $(this).addClass("active")
})
$(".moneyStateBtn .btn").click(function () {
    $(".moneyStateBtn .btn").removeClass("active")
    $(this).addClass("active")
})

$(".sgStateBtn .btn").click(function () {
    $(".sgStateBtn .btn").removeClass("active")
    $(this).addClass("active")
})
function ChangeDateFormat(val) {
    if (val != null) {
        var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
        //月份为0-11，所以+1，月份小于10时补个0
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }
    return "";
}
function isImag(val) {
    if (val == ".bmp" || val == ".png" || val == ".gif" || val == ".jpg" || val == ".jpeg") {
        return "img"
    }
    if (val == ".mdb" || val == ".xls" || val == ".doc" || val == ".ppt" || val == ".docx" || val == ".docx" || val == ".xlsx") {
        return "office"
    }
    return "other"
}


function imClick(obj) {
    console.log(obj.id)
    var id = obj.id + ""
    new Viewer(document.getElementById(id), {
        url: 'data-original',

    });
}
