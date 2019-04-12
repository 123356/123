let vm = new Vue({
    el: "#app",
    data: {
        //列表数据
        griData: [],
        //单位
        UnitList: [],
        UnitIndex: 0,
        //cid列表
        CidList: [],
        //树
        tree: {
            cid: [],
            energy: []
        },
        Props: {
            children: 'Children',
            label: 'name'
        },
        treeType: "1",
        node: {
            Children: null,
            ID: null,
            NeedPower: null,
            Remarks: null,
            UsePower: null,
            addCid: null,
            child_id: null,
            delCid: null,
            item_type: null,
            name: null,
            parent_id: null,
            unit_area: null,
            unit_head: null,
            unit_id: null,
            unit_note: null,
            unit_people: null,
        },
        //电表属性缓存
        addCidOld: "",
        delCidOld: "",
        //模态框
        DialogCid: false,
        Dialogtab: false,
        //监听字段
        filterText: "",
        dialogTabQ:0
    },
    computed: {

        //叶节点
        leavesNode: function() {
            let list = [];
            this.traverseTree(list, this.tree.energy);
            return list
        },
        //绑定的所有电表
        CidBinded: function() {
            if (this.leavesNode.length == 0) {
                return [];
            }
            let arr = "";
            for (let a = 0; a < this.leavesNode.length; a++) {
                if (this.leavesNode[a].addCid) {
                    arr += this.leavesNode[a].addCid + ',';
                }
            }
            arr = arr.substr(0, arr.length - 1);
            arr = arr.split(',');
            return arr;
        },
        //没有绑定
        UnBind: function() {
            this.CidList;
            let all = "," + this.CidBinded + ",";
            let list = [];
            for (let a = 0; a < this.CidList.length; a++) {
                if (all.indexOf(`,${this.CidList[a].PID}-${this.CidList[a].CID},`) < 0) {
                    list.push(this.CidList[a]);
                }
            }
            return list;
        },
        //添加电表显示
        AddCidTags: function() {
            if (this.addCidOld == "" || !this.CidList) {
                return []
            }
            let list = [];
            let str = "," + this.addCidOld + ",";
            for (let a = 0; a < this.CidList.length; a++) {
                if (str.indexOf(`,${this.CidList[a].PID}-${this.CidList[a].CID},`) >= 0) {
                    list.push(this.CidList[a]);
                }
            }
            return list
        },
        //重复复绑定
        CidBindMany: function() {
            var ary = this.CidBinded.sort(); //数组排序
            var cffwxmsAry = new Array();
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] == ary[i + 1]) {
                    cffwxmsAry.push(ary[i]);
                }
            }
            var result = [],
                isRepeated;
            for (var k = 0; k < cffwxmsAry.length; k++) {
                isRepeated = false;
                for (var j = 0; j < result.length; j++) {
                    if (cffwxmsAry[k] == result[j]) {
                        isRepeated = true;
                        break;
                    }
                }
                if (!isRepeated) {
                    result.push(cffwxmsAry[k]);
                }
            }
            return result;
        },
        //删除电表显示
        DelCidTage: {
            set: function() {},
            get: function() {
                if (this.delCidOld == "" || !this.CidList) {
                    return [];
                }
                let list = [];
                let str = "," + this.delCidOld + ",";
                for (let a = 0; a < this.CidList.length; a++) {
                    if (str.indexOf(`,${this.CidList[a].PID}-${this.CidList[a].CID},`) >= 0) {
                        list.push(this.CidList[a]);
                    }
                }
                return list
            }
        },
        //单位信息
        UnitData: function() {
            return this.UnitList[this.UnitIndex];
        }
    },
    methods: {
        //点击提交
        submissions: function() {
            this.node.addCid = this.addCidOld;
            this.node.delCid = this.delCidOld;
            this.$http({
                url: "/energyManage/EMSetting/SetEnergyTreeNode",
                method: "post",
                body: this.node
            }).then(function(res) {
                var id = res.data[0].child_id;
                this.$message({
                    message: '已保存节点信息',
                    type: 'success'
                });
                this.$http({
                    url: "/energyManage/EMSetting/GetEnergyTree",
                    method: "POST",
                    body: {
                        UnitID: parseInt(this.UnitData.UnitID),
                        ItemType: parseInt(this.treeType),
                        UnitName: this.UnitData.UnitName,
                    }
                }).then(function(res) {
                    this.tree.energy = res.data;
                    setTimeout(function() {
                        vm.$refs.energy.setCurrentKey(id);
                    })
                })
            })
        },
        //添加节点
        append(data) {
            // if(JSON.stringify(vm.tree.energy).indexOf)
            if (JSON.stringify(vm.tree.energy).indexOf(`"ID":-1,"`) >= 0) {
                this.$message({
                    message: '请先编辑并保存已有的新建节点',
                    type: 'warning'
                });
                return;
            }
            const newChild = { ID: -1, name: '新建节点', Children: [], parent_id: data.child_id, unit_id: this.UnitData.UnitID, item_type: this.treeType, addCid: "", delCid: "" };
            if (!data.Children) {
                this.$set(data, 'Children', []);
            }
            data.Children.push(newChild);
            this.node = newChild;
            this.addCidOld = "";
            this.delCidOld = "";

            setTimeout(() => {
                vm.$refs.energy.setCurrentKey(-1);
            });
        },
        //删除节点
        remove(node, data) {
            this.$alert(`此操作将永久删除 - ${data.name} -节点, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$alert(`再次确认删除  - ${data.name} -节点`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    if (node.ID == -1) {
                        const parent = node.parent;
                        const Children = parent.data.Children || parent.data;
                        const index = Children.findIndex(d => d.ID === data.ID);
                        Children.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return;
                    }
                    this.$http({
                        url: "/energyManage/EMSetting/DeleteEnergyNode",
                        method: "post",
                        body: { parent_id: data.parent_id, child_id: data.child_id, unit_id: this.UnitData.UnitID, }
                    }).then(function(res) {
                        if (res.data.length >= 0) {
                            const parent = node.parent;
                            const Children = parent.data.Children || parent.data;
                            const index = Children.findIndex(d => d.ID === data.ID);
                            Children.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                type: 'info ',
                                message: '删除操作异常'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'success ',
                        message: '已取消删除'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'success ',
                    message: '已取消删除'
                });
            });
        },
        //cid模态框点击确定
        ModalBoxClickOk: function(e) {
            let cids = vm.$refs.cidtree.getCheckedNodes(true, false);
            let str = "";
            for (let a = 0; a < cids.length; a++) {
                str += `${cids[a].PID}-${cids[a].CID},`
            }
            str = str.substr(0, str.length - 1);
            if (this.cidtype > 0) {
                this.addCidOld = str;
                this.addecho = this.$refs.cidtree.getCheckedKeys();
            } else {
                this.delCidOld = str;
                this.delecho = this.$refs.cidtree.getCheckedKeys();
            }
            this.DialogCid = false;
        },
        //筛选CID树
        filterCidNode(value, data, node) {
            if (!value) {
                data.disabled = false;
                return true;
            }
            var bool = data.name.indexOf(value) == -1;
            data.disabled = bool;
            return !bool;
        },
        //cid模态框关闭时
        closedDialog: function() {
            this.$refs.cidtree.setCheckedKeys([]);
        },
        //cid模态框打开之后
        openedDialog: function() {
            let str, arr;
            if (this.cidtype > 0) {
                arr = this.addCidOld;
            } else {
                arr = this.delCidOld;
            }
            if (arr.length == 0) {
                return;
            }
            if (this.$refs.cidtree != undefined) {
                this.$refs.cidtree.setCheckedKeys(arr.split(','));
            }
        },
        //站室表格
        showTab: function(n) {
            this.dialogTabQ = n;
            this.Dialogtab = true;
            this.griData = [];
            console.log(n)

            if (n == 2) {
                //未绑定
                let obj1 = {};
                obj1.nodeID = 0;
                obj1.nodeName = "无";
                let str1 = [];
                for (let a = 0; a < this.UnBind.length; a++) {
                    str1.push({
                        pid: this.UnBind[a].PID,
                        did: this.UnBind[a].DID,
                        cid: this.UnBind[a].CID,
                        DName: this.UnBind[a].DName,
                        CName: this.UnBind[a].CName,
                    })
                }
                obj1.binded = str1;
                obj1.bindedNum = this.UnBind.length;
                this.griData.unshift(obj1)
            } else {
                for (let a = 0; a < this.leavesNode.length; a++) {
                    var obj = {};
                    obj.nodeID = this.leavesNode[a].ID;
                    obj.nodeName = this.leavesNode[a].name;
                    var arr1 = [];
                    for (let i = 0; i < this.CidList.length; i++) {
                        var arr = this.leavesNode[a].addCid.split(',');
                        for (let j = 0; j < arr.length; j++) {
                            if (`${this.CidList[i].PID}-${this.CidList[i].CID}` == arr[j]) {
                                arr1.push({
                                    pid: this.CidList[a].PID,
                                    did: this.CidList[a].DID,
                                    cid: this.CidList[a].CID,
                                    DName: this.CidList[a].DName,
                                    CName: this.CidList[a].CName,
                                })
                            }
                        }
                    }
                    obj.binded = arr1;
                    obj.bindedNum = this.leavesNode[a].addCid.split(',').length;
                    let str = "," + this.leavesNode[a].addCid + ",";
                    let array = [];
                    for (let b = 0; b < this.CidBindMany.length; b++) {
                        if (str.indexOf(',' + this.CidBindMany[b] + ',') >= 0) {
                            array.push(this.CidBindMany[b])
                        }
                    }
                    obj.bindss = array.join(" ");
                    if (obj.bindss != "") {
                        this.griData.unshift(obj)
                    } else {
                        this.griData.push(obj)
                    }
                }
            }
        },
        //关闭表格
        closeTab: function() {
            this.Dialogtab = false
        },
        //还原
        RevertToCid: function(type) {
            let str = "",
                str1 = "";
            if (type > 0) {
                str = "addCidOld";
                str1 = "addCid";
            } else {
                str = "delCidOld";
                str1 = "delCid";
            }
            this[str] = this.node[str1];

        },
        //关闭cid标签
        TagHandleClose(pid, cid, type) {
            let str;
            if (type > 0) {
                str = "addCidOld";
            } else {
                str = "delCidOld";
            }
            let arr = this[str].split(',');
            for (let a = 0; a < arr.length; a++) {
                if (arr[a] == pid + "-" + cid) {
                    arr.splice(a, 1);
                    break;
                }
            }
            this[str] = arr.join(',');
        },
        //继承子项
        InheritCid: function(type) {
            let str = "",
                str1 = "";
            if (type > 0) {
                str = "addCidOld";
                str1 = "addCid";
            } else {
                str = "delCidOld";
                str1 = "delCid";
            }
            var cid = this[str] + ",";
            let list = [];
            this.traverseTree(list, [this.node]);

            for (let a = 0; a < list.length; a++) {
                cid += list[a][str1] + ",";
            }
            cid = cid.substr(0, cid.length - 1).substr(1, cid.length);
            cid = this.unique5(cid.split(',')).join(',');
            this[str] = cid;
        },
        //数组去重
        unique5: function(array) {
            array.sort();
            var temp = [array[0]];
            for (var i = 1; i < array.length; i++) {
                if (array[i] !== temp[temp.length - 1]) {
                    temp.push(array[i]);
                }
            }
            return temp;
        },
        //递归树
        traverseTree: function(list, Children) {
            if (Children.length != 0) {
                for (let a = 0; a < Children.length; a++) {
                    if (Children[a].Children.length != 0) {
                        this.traverseTree(list, Children[a].Children);
                    } else {
                        list.push(Children[a]);
                    }
                }
            }
        },
        //点击加号 添加电表
        ClickAddCidTagBtn: function(type) {
            this.cidtype = type;
            this.DialogCid = true;
        },
        //点击能源树节点
        TreeNodeClick: function(node) {
            this.node = node;
            this.addCidOld = node.addCid || "";
            this.delCidOld = node.delCid || "";
        },
        //加载能源树
        GetEnergyTree: function() {
            this.$http({
                url: "/energyManage/EMSetting/GetEnergyTree",
                method: "POST",
                body: {
                    UnitID: parseInt(this.UnitData.UnitID),
                    ItemType: parseInt(this.treeType),
                    UnitName: this.UnitData.UnitName,
                }
            }).then(function(res) {
                if (res.data.length > 0) {
                    this.tree.energy = res.data;
                    this.node = res.data[0];
                } else {
                    this.tree.energy = [];
                    for (var i in this.node) {
                        this.node[i] = null;
                    }
                }
                this.addCidOld = this.node.addCid || "";
                this.delCidOld = this.node.delCid || "";
                setTimeout(function() {
                    vm.$refs.energy.setCurrentKey(vm.updataNodeID || vm.node.ID);
                })
            })
        },
        //加载CID原始数据
        GetCidData: function(data) {
            if (localStorage.getItem("data" + this.UnitData.UnitID)) {
                this.CidList = JSON.parse(localStorage.getItem("data" + this.UnitData.UnitID));
                return;
            }
            this.$http({
                url: "/energyManage/EMSetting/GetCidData",
                method: "POST",
                body: this.UnitData
            }).then(function(res) {
                this.CidList = res.data;
                localStorage.setItem("data" + this.UnitData.UnitID, JSON.stringify(res.data));
            })
        },
        //加载CID树
        GetCidTree: function() {
            if (localStorage.getItem("tree" + this.UnitData.UnitID)) {
                this.tree.cid = JSON.parse(localStorage.getItem("tree" + this.UnitData.UnitID));
                return;
            }
            this.$http({
                url: "/energyManage/EMSetting/GetCidTree",
                method: "POST",
                body: this.UnitData
            }).then(function(res) {
                var json = JSON.stringify(res.data);
                json = json.replace(/}/g, `,"disabled":false}`);
                localStorage.setItem("tree" + this.UnitData.UnitID, json);
                this.tree.cid = JSON.parse(json);
            })
        },
        //加载单位列表
        GetUnitList: function() {
            let that = this;
            this.$http({
                url: "/energyManage/EMSetting/GetUnitList",
                method: "post",
                body: {}
            }).then(function(res) {
                this.UnitList = res.data;
                this.info();
            })
        },
        //初始化
        info: function() {
            this.GetCidTree();
            this.GetEnergyTree();
            this.GetCidData();
        }
    },
    watch: {
        filterText(val) {
            this.$refs.cidtree.filter(val)
        }
    },
    created: function() {
        this.GetUnitList()
    },
    beforeMount: function() {},
    mounted: function() {

    },
    update: function() {
        this.info();
    }
})