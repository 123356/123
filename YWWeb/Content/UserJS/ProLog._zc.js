new Vue({
    el: "#log",
    data: {
        searchForm: {
            username: '',
            content: '',
            time:''
        },
        page:{
            page:1,
            rows:20,
            total:0
        },
        LogColumns: [
                     {
                         type: 'index',
                         width: 60,
                         align: 'center'
                     },
                    {
                        title: '操作人',
                        align: 'center',
                        key: 'UserName'
                    },
                    
                    {
                        title: '操作描述',
                        align: 'center',
                        key: 'Remarks',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        "text-align": "left",
                                        display: "block"
                                    }
                                }, params.row.Remarks),
                            ]);
                        }
                    },
                    {
                        title: '操作时间',
                        align: 'center',
                        key: 'CreatTime',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        "text-align": "center",
                                        display: "block"
                                    }
                                }, ChangeDateFormat(params.row.CreatTime)),
                            ]);
                        }
                    }
        ],
        logData: [],
        tableHeight: 0,
        tableLoading:false
    },
    methods: {
        
        getLogData: function () {
            var time = this.searchForm.time
            if (time != "") {
                var month = time.getMonth() + 1
                if (month < 10) {
                    month = "0"+month
                }
                var day = time.getDate()
                if (day < 10) {
                    day = "0"+day
                }
                time = time.getFullYear() + "-" + month+ "-" + day
            }

            this.tableLoading = true
            var that = this
            this.$http({
                url: "/Home/GetLog",
                params: {
                    page: this.page.page,
                    rows:this.page.rows,
                    username: this.searchForm.username,
                    content: this.searchForm.content,
                    time: time,
                }

            })
            .then(function (res) {
                that.page.total = res.data.length
                that.logData = res.data
                this.tableLoading = false
            })
            .catch(function (e) {
                console.log(e)
            })
        },
        
        seacch: function(){
            this.getLogData()
        },
        sizeChange:function(size){
            this.page.rows = size
            this.getLogData()
        },
        curPageChange: function (page) {
            this.page.page = page
            this.getLogData()
        },
        setHeight: function () {
            var h = $(window).height()
            var top = $(".searchForm").height()
            var page = $(".pageView").height()
            this.tableHeight = h-top-page-90
        },
        
    },
    beforeMount: function () {
        this.getLogData()
        this.setHeight()
        setInterval(this.setHeight,100)
    }
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