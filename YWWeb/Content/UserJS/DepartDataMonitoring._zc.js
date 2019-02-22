new Vue({
    el: "#app",
    data: {
        uid: null,
        uName:'',
        analysisTableHeight: 0,
        treeData: [],
        departFrameSrc: '',
        
    },
    methods: {
        //tree data
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
                    res.data.open = true
                    that.init(res.data)
                    var did = null
                    if (res.data) {
                        if (res.data.children.length > 0) {
                            did = res.data.children[0].id
                        }
                    }
                    that.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + did
                   /* if (res.data.children.length > 0) {
                        that.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + res.data.children[0].id
                        res.data.children[0].selected=true
                    } else {
                        that.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=null'
                    }
                    this.treeData = [
                        {
                            title: this.uName,
                            id: this.uid,
                            //selected: true,
                            expand: true,//是否打开子节点
                            children: that.traverseTree(res.data).children
                        }

                    ]*/
                    
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        init: function (data) {
            var setting = {
                check: {
                    enable: false
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
                    onClick: nodeClick
                }
            };

            var zNodes = data
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            function nodeClick(event,treeId, treeNode) {
                $("#departFrame").attr("src", '/EnergyEfficiency/DepartData?DepartmentID=' + treeNode.id)
                this.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + treeNode.id
            }
        },
       

        selectChange: function (res) {
            this.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + res[0].id
            document.getElementById('departFrame').contentWindow.location.reload(true);
        },
       
        

    },
    beforeMount: function () {
        this.uid = $.cookie("enUID")
        this.uName = $.cookie("enUName")
        
        this.getTreeData()
       
    },
    mounted: function () {
       
    }
})

function setScroll() {
    var treeWidth = $(".left").width()
    $(".left .treeList").width(treeWidth + 32)
    document.getElementsByClassName(".treeList").scrollTop = 100
}
$(function () {
    setScroll()
    window.onresize = function () {
        setScroll()
    };

    
})
