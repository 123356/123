new Vue({
    el: "#app",
    data: {
        uid: null,
        uName: '',
        analysisTableHeight: 0,
        treeData: [],
        departFrameSrc: '',
    },
    methods: {
        //区域树
        getTreeData: function () {
            var that = this
            var params = {
                UnitID: that.uid,
                ItemType: 2,
                UnitName: that.uName
            }
            getEnergyTreeAPI(params).then(function (res) {
                var data = res.data[0]
                data.open = true
                that.foreachTree(data)
                var arr = []
                that.init(data)
                var did = null
                if (data) {
                    if (data.Children.length > 0) {
                        did = data.Children[0].ID
                        sessionStorage.setItem('parentDepartName', data.Children[0].name)
                    }
                }
                that.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + did
            })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //遍历树
        foreachTree: function (node) {
            if (!node) {
                return;
            }
            node.text = node.name
            node.children = node.Children
            node.id = node.ID
            node.open = true
            if (node.Children && node.Children.length > 0) {
                for (var i = 0; i < node.Children.length; i++) {
                    if (!node.Children[i].Children) {
                        node.Children[i].text = node.Children[i].name
                        node.Children[i].open = true
                        node.Children[i].children = node.Children[i].Children
                        node.Children[i].id = node.Children[i].ID
                    }
                    this.foreachTree(node.Children[i]);
                }
            }
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
            function nodeClick(event, treeId, treeNode) {
                if (treeNode.level != 0) {
                    $("#departFrame").attr("src", '/EnergyEfficiency/DepartData?DepartmentID=' + treeNode.id)
                    this.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + treeNode.id
                    sessionStorage.setItem("isParent", treeNode.isParent)
                    sessionStorage.setItem('parentDepartName', treeNode.name)
                }

            }
        },
        selectChange: function (res) {
            this.departFrameSrc = '/EnergyEfficiency/DepartData?DepartmentID=' + res[0].id

            document.getElementById('departFrame').contentWindow.location.reload(true);
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.uid = unitData.enUID
                this.uName = unitData.enName
            }
        }
    },
    beforeMount: function () {
        this.getUnitData()
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
