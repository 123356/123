new Vue({
    el: "#app",
    data: {
        analysisTableHeight: 0,
        treeData: [
            {
                title: '医院楼层结构',
                id: 0,
                expand: true,//是否打开子节点
                children: [
                    {
                        title: '一楼',
                        expand: true,
                        id: 1,
                        children: [
                            {
                                title: '内科',
                                expand: true,
                                id: 2,
                                children: [
                                    {
                                        title: '内科诊室一',
                                        id: 3
                                    },
                                    {
                                        title: '内科诊室二',
                                        id: 4
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ],

        departFrameSrc:'/EnergyEfficiency/DepartData',
        
    },
    methods: {
        selectChange: function (res) {
            console.log(res[0].id)
        },
       
       
    },
    beforeMount: function () {
      
        
       
       
    },
    mounted: function () {
       
    }
})

function setScroll() {
    var scroll = $(".left .treeList").scrollTop()
    if (scroll == 1) {
        $(".left .treeList").scrollTop(0)
    } else {
        $(".left .treeList").scrollTop(1)
    }
    $(".left .treeList").scroll(function () {
        var width = $(".left .treeList").width()
        $(this).width(width + 32)
        $(".left .treeList").css("padding-right", "15px")
    })
}
$(function () {
   
    setScroll()
    window.onresize = function () {
        setScroll()
    };

    
})
