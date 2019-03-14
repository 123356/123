
new Vue({
    el: '#alarmTable',
    data: {
        tableHeight: 0,
        tableLoading:false,
        alarmColumns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
                title: '报警类型',
                key: 'ALarmType',
                align: 'center'
            },
            {
                title: '报警时间',
                key: 'AlarmDateTime',
                align: 'center'
            },
            {
                title: '站室名称',
                key: 'PDRName',
                align: 'center'
            },
            {
                title: '设备名称',
                key: 'DevicesName',
                align: 'center'
            },
            {
                title: '点名称',
                key: 'TagName',
                align: 'center'
            },
            {
                title: '描述',
                key: 'AlarmCate',
                align: 'center'
            },
            {
                title: '通讯状态',
                key: 'AlarmState',
                align: 'center',
                render: (h, params) => {
                    var con ="通讯断开"
                    if (params.row.AlarmState == 0) {
                        con = "通讯正常"
                    }
                    return h('div', [
                        h('span', {
                            
                        }, con),
                    ]);
                }
            },
        ],
        alarmData: [],
        searchForm:{
            pid: 0,
            startdate: null,
            enddate:null
        },
        page: {
            curPage: 1,
            size: 50,
            total: 0
        },
        rooms: [],
        userButton:[]
    },
    methods: {
        getRooms: function () {
            var that = this
            this.$http({
                url: "/BaseInfo/BindPDRInfo?showall=1",
                method:'post'
            })
            .then(function (res) {
                that.rooms = res.data
                
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //table数据
        getTableData: function () {
            var that = this
            this.tableLoading = true
            this.converDate()
            this.$http({
                url: '/AlarmManage/AlarmSysTableDate',
                method: 'post',
                params: {
                    enddate: that.searchForm.enddate,
                    page: that.page.curPage,
                    pid: that.searchForm.pid,
                    rom:Math.random(),
                    rows: that.page.size,
                    startdate: that.searchForm.startdate
                }
            })
            .then(function (res) {
                this.page.total = res.data.total
                this.alarmData = res.data.rows
                this.tableLoading = false
                that.getBtn()
            })
            .catch(function (e) {
                console.log(e)
                this.tableLoading = false
            })
        },
        //查询
        dosearch:function(){
            this.getTableData()
        },
        formaterDate: function (time) {
            var date = new Date(time)
            date = date.toLocaleDateString().replace(/\//g, "-") 
            return date
        },
        //导出
        export1: function () {
            this.$http({
                url: "/AlarmManage/ExportAlarmSysTableData",
                methods: 'post',
                params :{
                    pid: this.searchForm.pid,
                    startdate: this.formaterDate(this.searchForm.startdate),
                    enddate: this.formaterDate(this.searchForm.enddate)
                }
            })
            .then(function (res) {
                window.open('http://' + window.location.host + res.data);
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        //打印
       
        initDate: function(){
            var Startdate = new Date();
            Startdate.setDate(Startdate.getDate() - 10);
            var DS = Startdate.getFullYear() + "-" + (Startdate.getMonth() + 1) + "-" + Startdate.getDate();
            this.searchForm.startdate = DS
            var end = new Date()
            this.searchForm.enddate = end.getFullYear()+"-"+(end.getMonth()+1)+"-"+end.getDate()
        },
        startDateChange: function (date,type) {
            
            if (new Date(date) > new Date(this.searchForm.enddate)) {
                this.searchForm.enddate = date
            }
        },
        endDateChange: function (date, type) {
         
            if (new Date(date) > new Date(this.searchForm.enddate)) {
                this.searchForm.startdate = date
            }
        },
        //size改变
        sizeChange: function (size) {
            this.page.size = size
            this.getTableData()
        },
        //页面改变
        pageChange: function (page) {
            this.page.curPage = page
            this.getTableData()
        },
        roomChange: function (res) {
           $.cookie('cookiepid', res, { expires: 7, path: '/' });
            this.getTableData()
        },
        settableHeight: function () {
            var height = $(window).height()
            this.tableHeight = height - 120
        },
        getBtn: function () {
            var url = window.location.pathname;
            this.$http({
                url: "/SysInfo/UserButtonList",
                method: 'post',
                params: {
                    CurrUrl: url
                }
            })
            .then(function (res) {
                var data = JSON.parse(res.data)+""
                $("#tempBtn").html(data)
                var arr = []
                var btnArr = $("#tempBtn button")
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
            .catch(function (e) {
                
                console.log(e)
            })
            
            /*
            */
        },
        handleClick: function (e) {
            switch(e){
                case "dosearch":
                    this.dosearch()
                    break;
                case "export1":
                    this.export1()
                    break;
            }

        },
        converDate: function () {
            var start = new Date(this.searchForm.startdate)
            var end = new Date(this.searchForm.enddate)
            this.searchForm.startdate = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()
            this.searchForm.enddate = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate()
        },
    },
    
    beforeMount: function () {
        this.settableHeight()
        this.searchForm.pid = $.cookie('cookiepid')
        this.initDate()
        this.getRooms()
        this.getTableData()
        
        var btns = $("#userbutton button")
        setInterval(this.settableHeight, 100)

    },
    mounted: function () {
       
        
        
    }
})