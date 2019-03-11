using EnergyManage.PubClass;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.Lib.Base;

namespace EnergyManage.Controllers
{
    public class EMSettingController : UserControllerBaseEx
    {
        // GET: energyManage/Home
        public ActionResult Index()
        {
            return View();
        }
        //组织区域管理编辑工具
        public ActionResult AreaTreeEdit()
        {
            return View();
        }

        //组织区域管理展示
        public ActionResult AreaTree()
        {
            return View();
        }
        #region 
        /// <summary>
        /// 返回该单位的组织区域树数据
        /// </summary>
        /// <param name="unitID"></param>
        /// <param name="item_type"></param>
        /// <param name="unitName"></param>
        /// <returns></returns>
        public ActionResult GetTreeData(int unitID,int item_type,string unitName)
        {
            IList<IDAO.Models.t_V_EnerProjectType> list;
            list = DAL.VEnerProjectTypeDAL.getInstance().GetTreeData(unitID, item_type);
            if (list.Count() == 0 && item_type==1)
            {
               DAL.VEnerProjectTypeDAL.getInstance().AddProjectTemplate(unitID, item_type);
                list = DAL.VEnerProjectTypeDAL.getInstance().GetTreeData(unitID, item_type);
            }
            Tree tree = new Tree();
            tree.id = 0;
            tree.name = unitName;
            tree.pId = -1;
            tree.children = new List<Tree>();
            getTree(list, tree.children, 0);
            string json = JsonConvert.SerializeObject(tree);
            return  Content(json);
        }



   
  


        /// <summary>
        /// 返回该用户权限可见的单位列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUnitList()
        {
            IList<IDAO.Models.t_CM_Unit> list = DAL.UnitDAL.getInstance().GetUnitList(CurrentUser.UNITList);
            return Json(list);
        }
        /// <summary>
        /// 返回cid树
        /// </summary>
        /// <param name="pids"></param>
        /// <returns></returns>
        public JsonResult GetCidTree(string pids) {
            IList<IDAO.Models.t_V_DeviceInfoState_PDR1> list = DAL.VDeviceInfoState_PDR1DAL.getInstance().GetCidTree(pids);
            return Json(list);
        }
        /// <summary>
        /// 拼接tree数据
        /// </summary>
        public void getTree(IList<IDAO.Models.t_V_EnerProjectType> data, List<Tree> arr, int childID)
        {
            try
            {
                for (var a = 0; a < data.Count(); a++)
                {
                    if (data[a].parent_id == childID)
                    {
                        Tree tree = new Tree();
                        tree.id = data[a].child_id;
                        tree.name = data[a].Name;
                        tree.pId = data[a].parent_id;
                        tree.addCid = data[a].addCid;
                        tree.delCid = data[a].delCid;
                        tree.note = data[a].unit_note;
                        tree.head = data[a].unit_head;
                        tree.area = data[a].unit_area;
                        tree.people = data[a].unit_people;
                        tree.UsePower = data[a].UsePower;
                        tree.NeedPower = data[a].NeedPower;
                        tree.children = new List<Tree>();
                         arr.Add(tree);
                        getTree(data, tree.children, tree.id);
                    }
                }
            }
            catch {
            }
        }


        /// <summary>
        /// 添加节点
        /// </summary>
        /// <returns></returns>
        public JsonResult AddTreeNode(int parent_id,int unit_id,string unit_head,string unit_note,string addCid,string delCid,int item_type, string Name,int id,int unit_area,int unit_people)
        {
            //先查之前历史有没有  
            if (id == -1) {
                IList<IDAO.Models.t_EE_EnerUserType> checklist = DAL.EnerUserTypeDAL.getInstance().CheckHistory(Name, item_type);
                if (checklist.Count != 0) {
                    id = checklist[0].id;
                }
            }
            //没有增加历史  获取id
            if (id == -1)
            {
                IList<IDAO.Models.t_EE_EnerUserType> addlist = DAL.EnerUserTypeDAL.getInstance().AddHistory(Name, item_type);
                id = addlist[0].id;
            }
            //增加关联关系  
            IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().AddRelationship(id, parent_id, unit_id, unit_head, unit_note, addCid, delCid, unit_area, unit_people);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 修改节点
        /// </summary>
        /// <returns></returns>
        [AuthorizeIgnore]
        public JsonResult UpdateTreeNode(int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid, int item_type, string Name, int id,int unit_area,int unit_people)
        {
            var updateTypeID = -1;
            //先查之前历史有没有  
            try
            {
                IList<IDAO.Models.t_EE_EnerUserType> checklist = DAL.EnerUserTypeDAL.getInstance().CheckHistory(Name, item_type);
                updateTypeID = checklist[0].id;
            }
            catch
            {
                updateTypeID = -1;
            }
            //没有就增加
            if (updateTypeID == -1)
            {
                IList<IDAO.Models.t_EE_EnerUserType> addlist = DAL.EnerUserTypeDAL.getInstance().AddHistory(Name, item_type);
                updateTypeID = addlist[0].id;
            }
            //修改自己本身的关系
            IList<IDAO.Models.t_V_EnerProjectType> list = DAL.VEnerProjectTypeDAL.getInstance().UpdateRelationship(id, parent_id, unit_id, unit_head, unit_note, addCid, delCid, updateTypeID, unit_area, unit_people);
            //修改上下级间的关系
            DAL.EnerUserProjectDAL.getInstance().UpdateSupervisor(id, updateTypeID, unit_id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 返回已有的区域类型 用于输入联想
        /// </summary>
        /// <returns></returns>
        [AuthorizeIgnore]
        public JsonResult GetHistoryList( int unitID,int item_type)
        { 
            IList<IDAO.Models.t_V_EnerProjectType> list = DAL.VEnerProjectTypeDAL.getInstance().GetHistoryList( item_type, unitID); 
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteSupervisor(int parent_id,int child_id,int unit_id)
        {
            IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().DeleteSupervisor(parent_id, child_id, unit_id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public class PidandCid {
            public int pid { set; get; }
            public string cid { set; get; }
        }


        public class Tree
        {
            public int id { set; get; }
            public string name { set; get; }
            public int? pId { set; get; }
            public string head { set; get; }
            public string note { set; get; }
            public string addCid { set; get; }
            public string delCid { set; get; }
            public int area { set; get; }
            public int people { set; get; }
            public decimal UsePower { set; get; }
            public decimal NeedPower { set; get; }
            public List<Tree> children { set; get; }
        }
        #endregion

        #region
        public JsonResult GetTageID( int pid, int cid )
		{
			IList<IDAO.Models.t_CM_PointsInfoBase1> list = DAL.PointsInfoDAL.getInstance().GetTageID( pid, cid );
			return(Json( list, JsonRequestBehavior.AllowGet ) );
		}


        /// <summary>
        /// 查询当天累计用电
        /// </summary>
        /// <param name="unitID"></param>
        /// <param name="item_type"></param>
        /// <param name="unitName"></param>
        /// <returns></returns>
        public ActionResult GetTreePower(int unitID, int item_type, string unitName)
        {
            IList<IDAO.Models.t_V_EnerProjectType> list;
            list = DAL.VEnerProjectTypeDAL.getInstance().GetTreeData(unitID, item_type);
            if (list.Count() == 0 && item_type == 1)
            {
                DAL.VEnerProjectTypeDAL.getInstance().AddProjectTemplate(unitID, item_type);
                list = DAL.VEnerProjectTypeDAL.getInstance().GetTreeData(unitID, item_type);
            }
            string all = "" ;
            for(var a = 0; a < list.Count(); a++)
            {
                if (!string.IsNullOrEmpty(list[a].addCid))
                    all += list[a].addCid + ",";
                if (!string.IsNullOrEmpty(list[a].delCid))
                    all += list[a].delCid+",";
            }
            all = all.Substring(0, all.Length - 1);

            string[] arr;
            string pid="", cid="";
            arr = all.Split(',');

            for (var a = 0; a < arr.Count(); a++)
            {
                var arr1 = arr[a].Split('-');
                pid += arr1[0] + ',';
                cid += arr1[1] + ',';
            }
            pid = string.Join(",", pid.Substring(0, pid.Length - 1).Split(',').Distinct());
            cid = string.Join(",", cid.Substring(0, cid.Length - 1).Split(',').Distinct());

            IList<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToDay(pid, cid);
            for (var a = 0; a < power.Count(); a++) {
                for (var b = 0; b < list.Count(); b++) {
                    if (list[b].addCid.Contains($"{power[a].PID}-{power[a].CID}")) {
                        list[b].UsePower += power[a].UsePower;
                        list[b].NeedPower += power[a].NeedPower;
                    }
                    if (list[b].delCid.Contains($"{power[a].PID}-{power[a].CID}"))
                    {
                        list[b].UsePower -= power[a].UsePower;
                        list[b].NeedPower -= power[a].NeedPower;
                    }
                }
            }
            Tree tree = new Tree();
            tree.id = 0;
            tree.name = unitName;
            tree.pId = -1;
            tree.children = new List<Tree>();
            getTree(list, tree.children, 0);
            string json = JsonConvert.SerializeObject(tree);
            return Content(json);
        }

        /// <summary>
        /// 查询当月用电量
        /// </summary>
        /// <param name="addCid"></param>
        /// <param name="delCid"></param>
        /// <returns></returns>
        public ActionResult GetTreePowerMonth(string addCid, string delCid) {
            if (addCid == "" && delCid == "")
            {
                return Json("无效参数");
            }
            var all = "";
            if (string.IsNullOrEmpty(addCid)) {
                all = delCid; 
            }
            else if (string.IsNullOrEmpty(delCid)) {
                all = addCid;
            }
            else {
                all = addCid + "," + delCid;
                all = string.Join(",", all.Split(',').Distinct().ToArray());
            }
            string[] arr;
            string pid = "", cid = "";
            arr = all.Split(',');
            for (var a = 0; a < arr.Count(); a++)
            {
                var arr1 = arr[a].Split('-');
                pid += arr1[0] + ',';
                cid += arr1[1] + ',';
            }
            pid = string.Join(",", pid.Substring(0, pid.Length - 1).Split(',').Distinct());
            cid = string.Join(",", cid.Substring(0, cid.Length - 1).Split(',').Distinct());
            List<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToMonth(pid, cid).Distinct().ToList();
            var list = power.GroupBy(c => c.RecordTime).Select(c => c.First()).ToList();
            for (var a = 0; a < list.Count(); a++) {
                list[a].UsePower = 0;
                list[a].NeedPower = 0;
                for (var b = 0; b < power.Count(); b++) {
                    if (list[a].RecordTime == power[b].RecordTime)
                    {
                        if (addCid.Contains($"{list[a].PID}-{list[a].CID}"))
                        {
                            list[a].UsePower += power[b].UsePower;
                            list[a].NeedPower += power[b].UsePower;
                        }
                        if (delCid.Contains($"{list[a].PID}-{list[a].CID}"))
                        {
                            list[a].UsePower -= power[b].UsePower;
                            list[a].NeedPower -= power[b].UsePower;
                        }
                    }
                }
            }
            return Json(list);
        }
        #endregion
    }
} 