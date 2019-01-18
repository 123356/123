 function Organization() {
     this.PIDTree = {};
 };
 Organization.prototype = {
     //返回可查看的单位列表
     loadUnitList: function() {
         var that = this;
         $.ajax({
             type: "post",
             url: "/energyManage/EMSetting/GetUnitList",
             data: {},
             success: function(res) {
                 try {
                     var globalUnitID = JSON.parse($.cookie('unitID')).id || res[0].UnitID;
                 } catch {
                     var globalUnitID = res[0].UnitID;
                     $.cookie('unitID', JSON.stringify({
                         id: res[0].UnitID,
                         name: res[0].UnitName
                     }), {
                         expires: 1
                     });
                     that.loadOrganizationTree();
                 }
                 for (var a = 0, arr = []; a < res.length; a++) {
                     if (globalUnitID == res[a].UnitID) {
                         arr.push(
                             `<option value="${res[a].UnitID}" selected = "selected" data-pids="${res[a].PDRList}">${res[a].UnitName}</option>`
                         );
                     } else {
                         arr.push(
                             `<option value="${res[a].UnitID}" data-pids="${res[a].PDRList}">${res[a].UnitName}</option>`
                         );
                     }
                 }
                 $('#unitList').html(arr.join(''));
                 var pids = $("#unitList").find("option:selected").attr('data-pids');
                 if (pids) {
                     that.loadModalTree(pids)
                 } else {
                     alert('该单位没有站室');
                 }
             }
         })
     },
     //返回之前添加的区域  加载到输入框的联想
     loadAreaed: function() {
         var that = this;
         $.ajax({
             type: "post",
             url: "/energyManage/EMSetting/GetHistoryList",
             data: {
                 item_type: that.treeType
             },
             success: function(res) {
                 for (var a = 0, arr = []; a < res.length; a++) {
                     arr.push(`<option value="${res[a].Name}" data-id="${res[a].id}">`);
                 }
                 $('#areaedList').html(arr.join(""));
             }
         })

     },
     //加载模态框树
     loadModalTree: function(pids) {
         var that = this;
         $.ajax({
             type: "post",
             url: "/energyManage/EMSetting/GetCidTree",
             data: {
                 pids: pids
             },
             success: function(res) {
                 var treeList = [];
                 that.cidData = res;
                 that.remakeTree(res, treeList);
                 if (treeList.length == 0) {
                     $('.nometer').show();
                     $('#meterztree').hide();
                 } else {
                     $('.nometer').hide();
                     $('#meterztree').show();
                     $('#meterztree').html("");
                     that.allocationTreeData(treeList);
                 }
                 $('#myModalLabel ').html(JSON.parse($.cookie('unitID')).name);
             }
         })
     },
     //改造树结构
     remakeTree: function(arr, treeList) {
         var pid = -1,
             cid = -1,
             did = -1;
         for (var a = 0; a < arr.length; a++) {
             if (pid != arr[a].PID + '_p') {
                 pid = arr[a].PID + '_p';
                 if (treeList.length == 0) {
                     var pdr = {
                         name: arr[a].Name,
                         id: pid,
                         type: 'pid',
                         pId: 0,
                         open: true,
                         nocheck: true
                     }
                 } else {
                     var pdr = {
                         name: arr[a].Name,
                         id: pid,
                         type: 'pid',
                         pId: treeList[0].id,
                         nocheck: true
                     }
                 }
                 treeList.push(pdr);
             } else if (pid == arr[a].PID + '_p' && did != arr[a].DID + '_d') {
                 did = arr[a].DID + '_d';
                 treeList.push({
                     name: arr[a].DeviceName,
                     id: did,
                     type: 'did',
                     pId: pid,
                     nocheck: true
                 });
                 treeList.push({
                     name: arr[a].CName,
                     id: arr[a].CID + '_c',
                     type: 'cic',
                     pId: did
                 });
             } else if (pid == arr[a].PID + '_p' && did == arr[a].DID + '_d') {
                 treeList.push({
                     name: arr[a].CName,
                     id: arr[a].CID + '_c',
                     type: 'cic',
                     pId: did
                 });
             }
         }
     },
     //加载事件
     loadEvents: function() {
         var that = this;
         $("#unitList").on('change', function() {
             $.cookie('unitID', JSON.stringify({
                 id: $("#unitList").val(),
                 name: $("#unitList").find("option:selected").text()
             }), {
                 expires: 1
             });
         })

         //点击修改
         $('.updatet').on('click', function() {
             $('.right').fadeIn();
             that.editType = "upd";
             $('#title').html("修改");
         })

         //点击模态框确定或取消
         $('.getselect').on('click', function() {
             var arr;
             $('.checkbox_true_full').removeClass("chk");
             var treeObj = $.fn.zTree.getZTreeObj("meterztree");
             arr = treeObj.getCheckedNodes();
             for (var a = 0; a < arr.length; a++) {
                 var id = arr[a].id.substring(0, arr[a].id.indexOf('_'));
                 var html = `<span class="meter" data-id="${id}">${arr[a].name}<i class="close">×</i></span>`;
                 if (that.morefun && $('.reduction').html().indexOf(`data-id="${id}"`) == -1) {
                     $('.reduction').append(html);
                 } else if ($('.addition').html().indexOf(`data-id="${id}"`) == -1) {
                     $('.addition').append(html);
                 }
             }



             //$.fn.zTree.getZTreeObj("meterztree").checkAllNodes(false);
         })

         //重置选中按钮
         $('div.form-control').on('click', function() {
             var treeObj = $.fn.zTree.getZTreeObj('meterztree');

             that.morefun = this.className.indexOf('addition') > -1 ? false : true;
             treeObj.checkAllNodes(false);
         })

         //点击查询
         $('.readt').on('click', function() {
                 var pids = $("#unitList").find("option:selected").attr('data-pids')
                 that.loadOrganizationTree();
                 that.loadModalTree(pids);
                 $('#title').html("查看");
             })
             //点击删除
         $('.deletet').on('click', function() {
                 if ($.fn.zTree.getZTreeObj("Organization").getSelectedNodes().length != 0) {
                     that.editType = 'del';
                     $('#title').html("删除");
                     that.editType = 'del';
                     var zreeobj = $.fn.zTree.getZTreeObj("Organization");
                     var select = zreeobj.getSelectedNodes();
                     $.ajax({
                         type: "post",
                         url: "/energyManage/EMSetting/DeleteSupervisor",
                         data: {
                             parent_id: select[0].pId,
                             unit_id: JSON.parse($.cookie('unitID')).id,
                             child_id: select[0].id
                         },
                         success: function(res) {
                             if (res.length > 0) {
                                 zreeobj.removeNode(select[0]);
                             }
                         }
                     })
                     $('.right').fadeOut();
                 }
             })
             //点击新增
         $('.createt').on('click', function() {
                 if ($.fn.zTree.getZTreeObj("Organization").getSelectedNodes().length != 0) {
                     $('.right').fadeIn();
                     that.editType = 'add';
                     $('#title').html("新建");
                 }
             })
             //点击确定
         $('.saveupdate').on('click', function() {
                 var add = [];
                 var del = [];
                 for (var a = 0; a < $('.addition .meter').length; a++) {
                     add.push($('.addition .meter')[a].getAttribute('data-id'));
                 }
                 for (var a = 0; a < $('.reduction .meter').length; a++) {
                     del.push($('.reduction .meter')[a].getAttribute('data-id'));
                 }
                 $('.addition').attr('data-id', add.join(','));
                 $('.reduction').attr('data-id', del.join(','));


                 if (that.editType == 'add') { //添加
                     that.createNode();
                 } else if (that.editType == 'upd') { //修改
                     that.updatetNode();
                 }
             })
             //点击表的关闭按钮
         $('.addition,.reduction').on('click', '.close', function() {
             $(this).parent('.meter').remove();
         })
         $('.offOut').on('click', function() {
             $('.right').fadeOut();
         })
     },
     //新增节点
     createNode: function() {
         if (!$("#name").val()) {
             alert("名称不可为空。");
             return;
         }
         var zreeobj = $.fn.zTree.getZTreeObj("Organization");
         var select = zreeobj.getSelectedNodes();
         if (select.length == 0) {
             alert('选中一个节点')
         }
         if (zreeobj.getNodesByParam("name", $('#name').val(), null).length > 0) {
             alert('节点不可重复添加');
             return
         }
         var nodes = zreeobj.getNodes();
         for (var a = 0; a < nodes.length; a++) {
             if (nodes[a].name == $('#name').val()) {
                 alert('不能添加重复节点')
                 return
             }

         }


         var data = {
             parent_id: select[0].id || 0,
             unit_id: JSON.parse($.cookie('unitID')).id,
             unit_head: $("#officer").val() || "",
             unit_note: $('#note').val() || "",
             addCid: $('.addition').attr('data-id') || "",
             delCid: $('.reduction').attr('data-id') || "",
             item_type: this.treeType,
             Name: $("#name").val(),
             id: parseInt($(`option[value=${$("#name").val()}]`).attr('data-id')) || 0,
             unit_area: $('#area').val() || 0,
             unit_people: $('#people').val() || 0
         }
         $.ajax({
             type: "post",
             url: "/energyManage/EMSetting/AddTreeNode",
             data: data,
             success: function(res) {
                 if (res.length > 0) {
                     var newNodes = {
                         id: res[0].child_id,
                         name: data.Name,
                         children: [],
                         addCid: res[0].addCid,
                         delCid: res[0].delCid,
                         head: res[0].unit_head,
                         note: res[0].unit_note,
                         area: res[0].unit_area,
                         people: res[0].unit_people
                     };
                     var zTree = $.fn.zTree.getZTreeObj("Organization");
                     var nodeList = zTree.getSelectedNodes();
                     zTree.expandNode(nodeList[0], true);
                     var znodes = zreeobj.addNodes(select[0], newNodes, true);
                     alert('添加成功');
                 }
             }
         });

     },
     //修改节点
     updatetNode: function() {
         var treeObj = $.fn.zTree.getZTreeObj("Organization");
         var nodes = treeObj.getSelectedNodes();
         if (nodes.length > 0) {
             var data = {
                 parent_id: nodes[0].pId,
                 unit_head: $('#officer').val(),
                 unit_note: $('#note').val(),
                 addCid: $('.addition').attr('data-id') || "",
                 delCid: $('.reduction').attr('data-id') || "",
                 item_type: this.treeType,
                 Name: $('#name').val(),
                 id: nodes[0].id,
                 unit_id: JSON.parse($.cookie('unitID')).id,
                 unit_area: $('#area').val(),
                 unit_people: $('#people').val(),
             }
             $.ajax({
                 type: "post",
                 url: "/energyManage/EMSetting/UpdateTreeNode",
                 data: data,
                 success: function(res) {
                     nodes[0].name = data.Name;
                     nodes[0].officer = data.unit_head;
                     nodes[0].note = data.unit_note;
                     nodes[0].addCid = data.addCid;
                     nodes[0].delCid = data.delCid;
                     nodes[0].area = data.unit_area;
                     nodes[0].people = data.unit_people;
                     treeObj.updateNode(nodes[0]);
                 }
             })
         }
     },
     //配置站室内树
     allocationTreeData: function(data) {
         var setting = {
             view: {
                 selectedMulti: false
             },
             check: {
                 enable: true,
                 chkStyle: 'checkbox',
                 radioType: "all",
                 chkboxType: {
                     "Y": "s",
                     "N": "s"
                 }
             },
             data: {
                 simpleData: {
                     enable: true,
                     idKey: "id",
                     pIdKey: "pId",
                     rootPId: 0
                 }
             },
             edit: {}
         };
         var zNodes = data

         function setCheck() {
             setting.check.chkStyle = $("#r1").attr("checked") ? "checkbox" : "checkbox";
             setting.check.enable = (!$("#disablechk").attr("checked"));
             $.fn.zTree.init($("#meterztree"), setting, zNodes);
         }
         $(document).ready(function() {
             $.fn.zTree.init($("#meterztree"), setting, zNodes);
             setCheck();
             $("#r1").bind("change", setCheck);
             $("#r2").bind("change", setCheck);
             $("#disablechk").bind("change", setCheck);
         });
     },
     //配置组织树
     allocationOrganization: function(data) {
         var that = this;
         var setting = {
             view: {
                 selectedMulti: false
             },
             check: {
                 enable: false,
                 chkStyle: 'checkbox',
                 radioType: "all",
             },
             callback: {
                 beforeClick: zTreeBeforeClick
             }
         };

         function zTreeBeforeClick(treeId, treeNode, clickFlag) {
             $('.right').fadeIn();
             $('#name').val(treeNode.name);
             $('#officer').val(treeNode.head);
             $('#note').val(treeNode.note);
             $('.addition').html(that.GetCidView(treeNode.addCid)) //.attr('data-id', treeNode.addCid);
             $('.reduction').html(that.GetCidView(treeNode.delCid)) //.attr('data-id', treeNode.delCid);
             $('#area').val(treeNode.area || "");
             $('#people').val(treeNode.people || "");
         }
         var zNodes = data;
         $.fn.zTree.init($("#Organization"), setting, zNodes);
     },
     GetCidView: function(ids) {
         var that = this;
         console.log(ids)
         if (ids && that.cidData) {
             var cid = that.cidData;
             var id = ids.split(",").map(Number);
             for (var a = 0, arr = []; a < cid.length; a++) {
                 if ($.inArray(cid[a].CID, id) > -1) {
                     arr.push(
                         `<span class="meter" data-id="${cid[a].CID}">${cid[a].CName}<i class="close">×</i></span>`
                     );
                 }
             }
             return arr.join("");
         }
     },
     //加载组织树
     loadOrganizationTree: function() {
         var that = this;
         var unit = JSON.parse($.cookie('unitID'))
         $.ajax({
             type: "post",
             url: "/energyManage/EMSetting/GetTreeData",
             data: {
                 unitID: JSON.parse($.cookie('unitID')).id,
                 item_type: that.treeType,
                 unitName: unit.name
             },
             success: function(res) {
                 var arr = [];
                 res = JSON.parse(res);
                 res.open = true;
                 arr.push(res);
                 that.allocationOrganization(arr);
             }
         })
     },





     //初始化
     init: function() {
         var search = location.search;
         this.treeType = search.substring(search.indexOf('=') + 1);
         if ($.cookie('unitID')) {
             this.loadOrganizationTree();
         }
         this.loadUnitList();
         this.loadEvents();
         this.loadAreaed();

     },
 };



 $(function() {
     var organization = new Organization();
     organization.init();
 });