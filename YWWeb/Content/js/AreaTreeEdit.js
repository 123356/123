var vm = new Vue({
    el: '#app',
    data: { nodeEditTyped: 'sea', value2: '1', theme1: 'light', treeType: 1, untiList: null, node: { title: "", addCid: "", delCid: "", area: 0, people: 0, note: "", head: "" }, modal1: false, subitemTree: [], areaTree: [], UnitData: {}, cidEdit: null, cidTree: [], addCid: "", delCid: "", buttonProps: { type: 'default', size: 'small', }, show: true, typeHistory: [] },
    methods: {
        changeTab: function() { if (this.treeType == 1) { this.getSubitemTree() } else { this.getAreaTree() } },
        handleClose(id, type) { if (type == 'add') { for (var a = 0; a < this.addCid.length; a++) { if (this.addCid[a].id == id) { this.addCid.splice(a, 1); break } } } else { for (var a = 0; a < this.delCid.length; a++) { if (parseInt(this.delCid[a].id) == id) { this.delCid.splice(a, 1); break } } } },
        ModalonOk: function() {
            if (this.cidEdit == 'add') { this.oldCidSelectedAdd = this.addCid } else { this.oldCidSelectedDel = this.delCid }
            for (key in this.oldCidTree) { this.oldCidTree[key].checked = false }
            this.cidTree = this.finishCidData(this.oldCidTree)
        },
        ModalonCancel: function() {
            if (this.cidEdit == 'add') { this.addCid = this.oldCidSelectedAdd } else { this.delCid = this.oldCidSelectedDel }
            for (key in this.oldCidTree) { this.oldCidTree[key].checked = false }
            this.cidTree = this.finishCidData(this.oldCidTree)
        },
        showCidModel: function(d) {
            var that = this;
            this.modal1 = true;
            this.cidEdit = d;
            var addCid = this.ViewToPIDCId(this.addCid);
            var delCid = this.ViewToPIDCId(this.delCid);
            if (d == "add") { this.oldCidSelectedAdd = this.addCid } else { this.oldCidSelectedDel = this.delCid }
            for (key in this.oldCidTree) { if (d == "add" && addCid.indexOf(`${this.oldCidTree[key].PID}-${this.oldCidTree[key].CID}`) > -1) { this.oldCidTree[key].checked = true } if (d == "del" && delCid.indexOf(`${this.oldCidTree[key].PID}-${this.oldCidTree[key].CID}`) > -1) { this.oldCidTree[key].checked = true } }
            this.cidTree = this.finishCidData(this.oldCidTree)
        },
        selectedCidNode: function(data) { this.cidselect = data; var list = []; for (var a = 0; a < data.length; a++) { if (data[a].type == 'cid') { list.push({ pid: data[a].pid, id: parseInt(data[a].id), title: data[a].title }) } } if (this.cidEdit == 'add') { this.addCid = list } else { this.delCid = list } },
        loadUnitList: function() {
            var that = this;
            this.$http({ url: "/energyManage/EMSetting/GetUnitList", method: "post", body: {} }).then(function(res) {
                if (!$.cookie('UnitData')) {
                    this.UnitData = res.data[0];
                    $.cookie('UnitData', JSON.stringify(res.data[0]), { expires: 7, path: '/' });
                    this.getSubitemTree();
                    this.getPDRList()
                }
                this.untiList = res.data
            }).catch(function(e) {})
        },
        changeUnitID: function(e) {
            for (var a = 0; a < this.untiList.length; a++) {
                if (this.untiList[a].UnitID == e) {
                    this.UnitData = this.untiList[a];
                    $.cookie('UnitData', JSON.stringify(this.untiList[a]), { expires: 7, path: '/' })
                }
            }
            if (this.treeType == 1) { this.getSubitemTree() } else { this.getAreaTree() }
            this.getPDRList()
        },
        getSubitemTree: function() {
            var that = this;
            this.$http({ url: "/energyManage/EMSetting/GetTreeData", method: "post", body: { unitID: that.UnitData.UnitID, item_type: 1, unitName: that.UnitData.UnitName } }).then(function(res) { that.subitemTree = that.strNameToTitle(res.data) }).catch(function(e) {})
        },
        strNameToTitle: function(data) {
            var str = JSON.stringify(data);
            str = str.replace(/name/g, "title").replace(`,"children":[]`, "").replace(/{/g, `{"expand":"true",`);
            var arr = [];
            arr.push(JSON.parse(str));
            arr[0].render = (h, { root, node, data }) => { return h('span', { style: { display: 'inline-block', width: '100%' } }, [h('span', [h('Icon', { props: { type: 'ios-folder-outline' }, style: { marginRight: '8px' } }), h('span', data.title)]), h('span', { style: { display: 'inline-block', float: 'right', marginRight: '32px' } }, [h('Button', { props: Object.assign({}, this.buttonProps, { icon: 'ios-add', type: 'primary' }), style: { marginRight: '8px' }, on: { click: () => { this.append(data, root) } } }), h('Button', { props: Object.assign({}, this.buttonProps, { icon: 'ios-search-outline', type: 'primary' }), on: { click: () => { this.search(data) } } }), ])]) };
            arr[0].selected = true;
            return arr
        },
        getAreaTree: function() {
            var that = this;
            this.$http({ url: "/energyManage/EMSetting/GetTreeData", method: "post", body: { unitID: that.UnitData.UnitID, item_type: 2, unitName: that.UnitData.UnitName } }).then(function(res) { that.areaTree = that.strNameToTitle(res.data) }).catch(function(e) {})
        },
        getPDRList: function() {
            var that = this;
            if (!that.UnitData.PDRList) { return }
            this.$http({ url: "/energyManage/EMSetting/GetCidTree", method: "post", body: { pids: that.UnitData.PDRList, } }).then(function(res) {
                that.oldCidTree = res.data;
                that.cidTree = that.finishCidData(res.data)
            }).catch(function(e) {})
        },
        finishCidData: function(data) {
            var tree = [];
            for (var a = 0, pid = -1, cid = -1, did = -1; a < data.length; a++) {
                if (pid != data[a].PID) {
                    tree.push({ title: data[a].Name, type: 'pid', id: data[a].PID + "_p", children: [{ title: data[a].DeviceName, type: 'did', id: data[a].DID + "_d", children: [{ title: data[a].CName, type: 'cid', id: data[a].CID + "_c", children: [], pid: data[a].PID, expand: data[a].expand || false, checked: data[a].checked || false, }] }] });
                    pid = data[a].PID;
                    did = data[a].DID;
                    cid = data[a].CID
                } else if (pid == data[a].PID && did != data[a].DID) {
                    var pidlen = tree.length - 1;
                    tree[pidlen].children.push({ title: data[a].DeviceName, type: 'did', id: data[a].DID + "_d", children: [{ title: data[a].CName, type: 'cid', id: data[a].CID + "_c", pid: data[a].PID, expand: data[a].expand || false, checked: data[a].checked || false, }] });
                    did = data[a].DID;
                    cid = data[a].CID
                } else if (pid == data[a].PID && did == data[a].DID) {
                    var pidlen = tree.length - 1;
                    var didlen = tree[pidlen].children.length - 1;
                    tree[pidlen].children[didlen].children.push({ title: data[a].CName, type: 'cid', id: data[a].CID + "_c", pid: data[a].PID, expand: data[a].expand || false, checked: data[a].checked || false, })
                }
            }
            return tree
        },
        renderContent(h, { root, node, data }) { var that = this; return h('span', { style: { display: 'inline-block', width: '100%' } }, [h('span', [h('Icon', { props: { type: 'ios-paper-outline' }, style: { marginRight: '8px' } }), h('span', data.title)]), h('span', { style: { display: 'inline-block', float: 'right', marginRight: '32px' } }, [h('Button', { props: Object.assign({}, that.buttonProps, { icon: 'ios-add' }), style: { marginRight: '8px' }, on: { click: () => { that.append(data, root) } } }), h('Button', { props: Object.assign({}, that.buttonProps, { icon: 'ios-remove' }), style: { marginRight: '8px' }, on: { click: () => { that.remove(root, node, data) } } }), h('Button', { props: Object.assign({}, that.buttonProps, { icon: 'ios-build-outline' }), style: { marginRight: '8px' }, on: { click: () => { that.update(root, node, data) } } }), h('Button', { props: Object.assign({}, that.buttonProps, { icon: 'ios-search-outline' }), on: { click: () => { that.search(root, node, data) } } }), ])]) },
        append(data, root) {
            this.node = {};
            this.node.parent_id = data.id;
            this.treeParent = data;
            this.nodeEditTyped = "add";
            this.addCid = [];
            this.delCid = [];
            this.node.root = JSON.stringify(root)
        },
        remove(root, node, data) {
            var that = this;
            this.$Modal.confirm({
                title: '提示',
                content: `<p>确认删除节点-<span style="color:#FF534D;font-weight:800">${data.title}</span></p>`,
                onOk: () => {
                    this.$http({ url: "/energyManage/EMSetting/DeleteSupervisor", method: "post", body: { parent_id: data.pId, child_id: data.id, unit_id: that.UnitData.UnitID, } }).then(function(res) {
                        if (res.data.length) { this.$Message.success("删除成功") } else { this.$Message.error("删除失败") }
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey).node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1)
                    }).catch(function(e) { this.$Message.error("数据异常") })
                },
            })
        },
        update(root, node, data) {
            if (data) { this.node = data } else { this.node = root }
            this.addCid = this.PIDCIdToView(this.node.addCid);
            this.delCid = this.PIDCIdToView(this.node.delCid);
            this.node.parent_id = data.pId;
            this.node.id = node.node.id;
            this.nodeEditTyped = "upd";
            this.node.root = JSON.stringify(root)
        },
        search(root, node, data) {
            if (data) { this.node = data } else { this.node = root }
            this.nodeEditTyped = "sea";
            this.addCid = this.PIDCIdToView(this.node.addCid);
            this.delCid = this.PIDCIdToView(this.node.delCid)
        },
        submitForm() {
            var that = this;
            if (!this.node.title) { this.$Message.warning("节点名称不能为空"); return }
            if (that.node.area && !/^[0-9]+.?[0-9]*$/.test(that.node.area)) { this.$Message.warning("面积请输入数字"); return }
            if (that.node.people && !/^[0-9]+.?[0-9]*$/.test(that.node.people)) { this.$Message.warning("人数请输入数字"); return }
            if (this.nodeEditTyped == 'add') {
                if (this.node.root && this.node.root.indexOf(`"${that.node.title}"`) > 0) { this.$Message.warning("节点不能循环绑定"); return }
                delete this.node.root;
                this.node.addCid = this.ViewToPIDCId(this.addCid);
                this.node.delCid = this.ViewToPIDCId(this.delCid);
                var name = that.node.title;
                this.$http({ url: "/energyManage/EMSetting/AddTreeNode", method: "post", body: { parent_id: that.node.parent_id, unit_id: that.UnitData.UnitID, unit_head: that.node.head, unit_note: that.node.note, addCid: that.node.addCid || "", delCid: that.node.delCid || "", item_type: that.treeType, Name: name, id: -1, unit_area: that.node.area || 0, unit_people: that.node.people || 0, } }).then(function(res) {
                    console.log(this.treeParent.children[0])

                    if (res.data.length) {
                        const children = this.treeParent.children || [];
                        children.push({
                            pId: res.data[0].parent_id,
                            title: name,
                            area: res.data[0].unit_area || 0,
                            people: res.data[0].unit_people || 0,
                            id: res.data[0].child_id,
                            head: res.data[0].unit_head,
                            note: res.data[0].unit_note,
                            addCid: res.data[0].addCid || "",
                            delCid: res.data[0].delCid || "",
                            expand: true
                        });
                        this.$set(this.treeParent, 'children', children);
                        this.$Message.success("添加成功")
                    } else { this.$Message.error("添加失败") }
                }).catch(function(e) { this.$Message.error("数据异常") })
            } else if (this.nodeEditTyped == 'upd') {
                this.node.addCid = this.ViewToPIDCId(this.addCid);
                this.node.delCid = this.ViewToPIDCId(this.delCid);
                var name = that.node.title;
                this.$http({ url: "/energyManage/EMSetting/UpdateTreeNode", method: "post", body: { parent_id: that.node.parent_id, unit_id: that.UnitData.UnitID, unit_head: that.node.head, unit_note: that.node.note, addCid: that.node.addCid || "", delCid: that.node.delCid || "", item_type: that.treeType, Name: name, id: that.node.id, unit_area: that.node.area, unit_people: that.node.people, } }).then(function(res) { if (res.data.length) { this.$Message.success("修改成功") } else { this.$Message.error("修改失败") } }).catch(function(e) { this.$Message.error("数据异常") })
            }
        },
        ViewToPIDCId(arr) { if (arr != undefined || arr.length > 0) { for (var a = 0, list = []; a < arr.length; a++) { list[a] = arr[a].pid + "-" + arr[a].id } return list.join(',') } else { return "" } },
        PIDCIdToView(str) {
            if (str) {
                var str = str.split(',');
                for (var a = 0, arr = []; a < str.length; a++) {
                    var q = str[a].split('-');
                    var obj = { pid: q[0], id: q[1] };
                    for (var b = 0; b < this.oldCidTree.length; b++) { if (this.oldCidTree[b].CID == obj.id && this.oldCidTree[b].PID == obj.pid) { obj.title = this.oldCidTree[b].CName; break } }
                    arr.push(obj)
                }
                return arr
            } else { return "" }
        },
    },
    updated: function() {
        this.$nextTick(() => {
            this.$refs.side_menu.updateOpened();
            this.$refs.side_menu.updateActiveName()
        })
    },
    beforeMount: function() {
        if ($.cookie('UnitData')) {
            this.UnitData = JSON.parse($.cookie('UnitData'));
            this.getSubitemTree();
            this.getPDRList()
        }
        this.loadUnitList()
    }
})