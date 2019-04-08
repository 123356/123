﻿new Vue({
    el: "#app",
    data: {
        uid: null,
        uName: '',
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
                body: {
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
                            sessionStorage.setItem('parentDepartName', res.data.children[0].name)
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
