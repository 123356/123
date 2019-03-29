using EnergyManage.PubClass;
using Loger;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        public ActionResult AreaTreeEdit1()
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
        public JsonResult GetCidTree(string pdrlist) {
            IList<IDAO.Models.t_V_CIDTree> list = DAL.VDeviceInfoState_PDR1DAL.getInstance().GetCidTree(pdrlist);
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
            try {
                if (list.Count() > 0) {
                    for (var a = 0; a < list.Count(); a++) {
                        DeleteSupervisor(list[a].child_id, -1, unit_id);
                    }
                }
            }
            catch
            {
                return Json("数据异常", JsonRequestBehavior.AllowGet);
            }

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

        public void qwe() {
                IList<IDAO.Models.t_EE_PowerForeQuality> powerForeQuality = DAL.PowerForeQualityDAL.getInstance().ForeThanQuality();
                if (powerForeQuality.Count() == 0)
                {
                    Console.WriteLine("预测和实际没有对应数据");
                    return;
                }
                for (var a = 0; a < powerForeQuality.Count(); a++)
                {
                    IDAO.Models.t_EE_ExEnergy1 exEnergy = new IDAO.Models.t_EE_ExEnergy1();
                    //异常占比
                    if (powerForeQuality[a].ForeUsePower == 0)
                    {
                        Console.WriteLine("无效预测");
                        return;
                    }
                    exEnergy.Proportion = powerForeQuality[a].UsePower / powerForeQuality[a].ForeUsePower *100;

                    //查阈值
                    exEnergy.ProportionValue = getProportionValue(powerForeQuality[a].PID, exEnergy.Proportion);
                    if (exEnergy.ProportionValue == -1)
                    {
                        Console.WriteLine("阈值设置异常: 一个PID存在多个阈值设置");
                        return;
                    }
                    else if (exEnergy.ProportionValue == -2)
                    {
                        Console.WriteLine("正常：异常占比在阈值区间内");
                        return;
                    }
                    else if (exEnergy.ProportionValue == -3)
                    {
                        Console.WriteLine("阈值设置异常: 低报 >高报");
                        return;
                    }

                    exEnergy.PID = powerForeQuality[a].PID;
                    exEnergy.CID = powerForeQuality[a].CID;
                    exEnergy.BudgetEnergy = powerForeQuality[a].UsePower;//预计用能
                    exEnergy.ActualEnergy = powerForeQuality[a].ForeUsePower;//实际用能
                    exEnergy.RecordTime = powerForeQuality[a].RecordTime;//时间

                    //查科室
                    IList<IDAO.Models.t_V_EnerProjectType> enerProjectType = DAL.VEnerProjectTypeDAL.getInstance().PidCidGetArea(powerForeQuality[a].PID, powerForeQuality[a].CID);
                    if (enerProjectType.Count() == 0)
                    {
                        Console.WriteLine("没有查到相应科室");
                        //return;
                    }
                    else
                    {
                        exEnergy.enerUserTypeID = enerProjectType[0].id; //区域ID
                        exEnergy.People = enerProjectType[0].unit_people;  //人流量
                        exEnergy.Area = enerProjectType[0].unit_area;  //建筑面积
                    }

                    //查CID其他内容
                    IList<IDAO.Models.t_DM_CircuitInfoEnergy> circuitInfo = DAL.ExEnergyDAL.getInstance().getCircuitInfo(powerForeQuality[a].PID, powerForeQuality[a].CID, powerForeQuality[a].RecordTime);
                    if (circuitInfo.Count() > 0)
                    {
                        exEnergy.CODID = circuitInfo[0].CODID;//用能类型ID
                        exEnergy.Purpose = circuitInfo[0].Purpose;//用途
                        exEnergy.Temperature = circuitInfo[0].Temperature;//温度
                        exEnergy.DID = circuitInfo[0].DID;
                    }
                    //写入
                    IList<IDAO.Models.t_EE_ExEnergy1> list = DAL.ExEnergyDAL.getInstance().InExDeviate(exEnergy);
            }

            //获取阈值
         
        }
        public decimal getProportionValue(int pid, decimal proportion)
        {
            IDAO.Models.t_EE_AlarmConfig alarmobj = new IDAO.Models.t_EE_AlarmConfig();
            alarmobj.PID = pid;
            alarmobj.TypeName = "异常用能";
            IList<IDAO.Models.t_EE_AlarmConfig> alarmConfig = DAL.AlarmConfigDAL.getInstance().GetPueAlarmAfter(alarmobj);
            if (alarmConfig.Count() != 1)
            {
                return -1;
            }
            //低报 取最高
            decimal[] LimitLarr = { (decimal)alarmConfig[0].LimitL1, (decimal)alarmConfig[0].LimitL2, (decimal)alarmConfig[0].LimitL3 };
            decimal LimitL = LimitLarr.Max();
            //高报 取非零最低
            decimal LimitH = 0;
            if (alarmConfig[0].LimitH1 == 0)
            {
                if (alarmConfig[0].LimitH2 == 0)
                {
                    LimitH = (decimal)alarmConfig[0].LimitH2;
                }
                else
                {
                    LimitH = (decimal)alarmConfig[0].LimitH3;
                }
            }
            else
            {
                LimitH = (decimal)alarmConfig[0].LimitH1;
            }
            if (LimitL > LimitH)
            {
                return -3;
            }
            else if (proportion > LimitL && proportion < LimitH)
            {
                return -2;
            }
            else if (proportion < LimitL)
            {
                return LimitL;
            }
            else if (proportion > LimitH)
            {
                return LimitH;
            }
            else
            {
                return -2;
            }
        }











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
            Stopwatch watch = new Stopwatch();
            LogHelper.Debug("GetTreePower begin ...");

            watch.Start();
            IList<IDAO.Models.t_V_EnerProjectType> list;
            list = DAL.VEnerProjectTypeDAL.getInstance().GetTreeData(unitID, item_type);
           

            LogHelper.Debug("111:" + watch.ElapsedMilliseconds);            

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

            LogHelper.Debug("22222:" + watch.ElapsedMilliseconds);
            if (all.Length > 1) {
                all = all.Substring(0, all.Length - 1);
            }
            else
            {
                return Json("没有查到数据");
            }

            string[] arr;
            string pid="", cid="";
            arr = all.Split(',');

            for (var a = 0; a < arr.Count(); a++)
            {
                var arr1 = arr[a].Split('-');
                pid += arr1[0] + ',';
                cid += arr1[1] + ',';
            }
            LogHelper.Debug("333333:" + watch.ElapsedMilliseconds);

            pid = string.Join(",", pid.Substring(0, pid.Length - 1).Split(',').Distinct());
            cid = string.Join(",", cid.Substring(0, cid.Length - 1).Split(',').Distinct());





            IList<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToDay(pid, cid);

            LogHelper.Debug("44444:" + watch.ElapsedMilliseconds);


            for (int a = 0; a < list.Count(); a++)
            {


                decimal use = 0;
                decimal need = 0;
                for (int b = 0; b < power.Count(); b++)
                {
                    if (power[b].ener_use_type.Contains($",{list[a].child_id},"))
                    {
                        use += power[b].UsePower;
                        need += power[b].NeedPower;
                    }
                }


                list[a].UsePower = use;
                list[a].NeedPower = need;

            }



            LogHelper.Debug("5555555:" + watch.ElapsedMilliseconds);

            Tree tree = new Tree();
            tree.id = 0;
            tree.name = unitName;
            tree.pId = -1;
            tree.children = new List<Tree>();

            getTree(list, tree.children, 0);
            string json = JsonConvert.SerializeObject(tree);
            watch.Stop();
            LogHelper.Debug("GetTreePower end ..."+watch.ElapsedMilliseconds);
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
                return Json(new List<int>());
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
            IList<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToMonth(pid, cid);
            var list = power.GroupBy(c => c.RecordTime).Select(c => c.First()).ToList();
            List<IDAO.Models.t_V_EnerPower> json  = new List<IDAO.Models.t_V_EnerPower>();


            for (var a = 0; a < list.Count(); a++)
            {
                IDAO.Models.t_V_EnerPower obj = new IDAO.Models.t_V_EnerPower();
                obj.RecordTime = list[a].RecordTime;
                //obj.UsePower = 0;
                //obj.NeedPower = 0;
                var RecordTime = list[a].RecordTime;
                for (var b = 0; b < power.Count(); b++)
                {
                    if (RecordTime == power[b].RecordTime)
                    {
                        if (addCid.Contains($"{power[b].PID}-{power[b].CID}"))
                        {
                            obj.UsePower += power[b].UsePower;
                            obj.NeedPower += power[b].NeedPower;
                        }
                        if (delCid.Contains($"{power[b].PID}-{power[b].CID}"))
                        {
                            obj.UsePower -= power[b].UsePower;
                            obj.NeedPower -= power[b].NeedPower;
                        }
                    }
                }
                json.Add(obj);
            }
            return Json(json);
        }
        #endregion





    


    }
} 