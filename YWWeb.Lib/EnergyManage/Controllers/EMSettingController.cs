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
        #region 树
        /// 返回该用户权限可见的单位列表
        public JsonResult GetUnitList()
        {
            IList<IDAO.Models.t_CM_Unit> list = DAL.UnitDAL.getInstance().GetUnitList(CurrentUser.UNITList);
            return Json(list);
        }

        /// 返回cid树
        public JsonResult GetCidTree(int UnitID,string UnitName,string PDRList)
        {

            if (UnitID == 0 || UnitName == "" || PDRList == "")
            {
                return Json("参数异常:参数为空");
            }

            IList<IDAO.Models.t_V_CidTree> tree = DAL.VDeviceInfoState_PDR1DAL.getInstance().GetCidTree(UnitID, UnitName, PDRList);
            return Json(tree);
        }

        //返回CID数据
        public JsonResult GetCidData(int UnitID=0, string UnitName="", string PDRList = "")
        {
            if (UnitID == 0 || UnitName == "" || PDRList == "")
            {
                return Json("参数异常:参数为空");
            }

            IList<IDAO.Models.t_V_DeviceInfoState_PDR1> tree = DAL.VDeviceInfoState_PDR1DAL.getInstance().GetCidData(UnitID, UnitName, PDRList);
            return Json(tree);
        }

        //返回能源树
        public JsonResult GetEnergyTree(int UnitID=0, int ItemType=0, string UnitName="")
        {
            if (UnitID == 0 || ItemType == 0 || UnitName == "") {
                return Json("参数异常:参数为空");
            }
            List<IDAO.Models.t_V_EnerProjectTypeTree> list = DAL.VEnerProjectTypeDAL.getInstance().GetEnergyTree(UnitID, ItemType, UnitName);
            if(list.Count() == 0)
            {
                DAL.VEnerProjectTypeDAL.getInstance().DefaultNode(UnitID, ItemType);
                list = DAL.VEnerProjectTypeDAL.getInstance().GetEnergyTree(UnitID, ItemType, UnitName);
            }
            return Json(list);
        }

        //编辑能源树信息
        public JsonResult SetEnergyTreeNode(IDAO.Models.t_V_EnerProjectType data)
        {
             if (data.ID == -1)
            {
                //查是否有这个名字的类型
                IList<IDAO.Models.t_EE_EnerUserType> name = DAL.EnerUserTypeDAL.getInstance().GetEnerTypeToID(data.name, data.item_type);

                if (name.Count > 1)
                {
                    return Json("error:类型名称和ID一对多");
                }
                //新增节点 名字类型已经存在
                if (name.Count()==1) {
                    data.ID = name[0].id;
                }
                //新增节点 名字类型不存在  
                else if(name.Count() == 0)
                {
                    IList<IDAO.Models.t_EE_EnerUserType> addName = DAL.EnerUserTypeDAL.getInstance().AddEnerNameType(data.name, data.item_type);
                    data.ID = addName[0].id;
                }
                IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().addTreeNode(data);
                IList<IDAO.Models.t_EE_CircuitInfoEnerType> list1 = DAL.EnerUserProjectDAL.getInstance().setCidEneeruseType(data);
                return Json(list);
            }
            else {
                IList<IDAO.Models.t_EE_EnerUserType> names = DAL.EnerUserTypeDAL.getInstance().GetEnerTypeToName(data.ID, data.item_type);
                if (names.Count > 1) {
                    return Json("error:类型名称和ID一对多");
                }
                //现有节点不改名字  只改属性
                if (names[0].Name ==  data.name)
                {
                    IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().updataTreeNode(data);
                    IList<IDAO.Models.t_EE_CircuitInfoEnerType> list1 = DAL.EnerUserProjectDAL.getInstance().setCidEneeruseType(data);

                    return Json(list);
                }
                else
                {
                    //查是否有这个名字的类型
                    IList<IDAO.Models.t_EE_EnerUserType> name = DAL.EnerUserTypeDAL.getInstance().GetEnerTypeToID(data.name, data.item_type);
                    if (name.Count > 1)
                    {
                        return Json("error:类型名称和ID一对多");
                    }
                    //新增节点 名字类型已经存在
                    if (name.Count() == 1)
                    {
                        data.ID = name[0].id;
                    }
                    //新增节点 名字类型不存在  
                    else if (name.Count() == 0)
                    {
                        IList<IDAO.Models.t_EE_EnerUserType> addName = DAL.EnerUserTypeDAL.getInstance().AddEnerNameType(data.name, data.item_type);
                        data.ID = addName[0].id;
                    }
                    //改id
                    IList<IDAO.Models.t_EE_EnerUserProject> id = DAL.EnerUserProjectDAL.getInstance().updataTreeNodeId(data);
                    //改属性
                    IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().updataTreeNode(data);
                    IList<IDAO.Models.t_EE_CircuitInfoEnerType> list1 = DAL.EnerUserProjectDAL.getInstance().setCidEneeruseType(data);

                }
            }
            return Json(data);
        }

        public JsonResult DeleteEnergyNode(int parent_id=0,int child_id=0,int unit_id=0)
        {
            if (parent_id == 0 || child_id == 0 || unit_id == 0)
            {
                return Json("参数异常:参数为空");
            }

            IList<IDAO.Models.t_EE_EnerUserProject> list = DAL.EnerUserProjectDAL.getInstance().DeleteEnergyNode(parent_id, child_id, unit_id);
            try {
                if (list.Count() > 0) {
                    for (var a = 0; a < list.Count(); a++) {
                        DeleteEnergyNode(list[a].child_id, -1, unit_id);
                    }
                }
            }
            catch
            {
                return Json("数据异常", JsonRequestBehavior.AllowGet);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region 用能异常
        public void qwe() {
                IList<IDAO.Models.t_EE_PowerForeQuality> powerForeQuality = DAL.PowerForeQualityDAL.getInstance().ForeThanQuality();
                //IList<IDAO.Models.t_EE_PowerForeQuality> powerForeQuality = DAL.PowerForeQualityDAL.getInstance().ForeThanQuality123(date);
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
                        continue;
                    }
                    exEnergy.Proportion = powerForeQuality[a].UsePower / powerForeQuality[a].ForeUsePower *100;

                    //查阈值
                    exEnergy.ProportionValue = getProportionValue(powerForeQuality[a].PID, exEnergy.Proportion);
                    if (exEnergy.ProportionValue == -1)
                    {
                        Console.WriteLine("阈值设置异常: 一个PID存在多个阈值设置");
                    continue;
                    }
                    else if (exEnergy.ProportionValue == -2)
                    {
                        Console.WriteLine("正常：异常占比在阈值区间内");
                    continue;
                    }
                    else if (exEnergy.ProportionValue == -3)
                    {
                        Console.WriteLine("阈值设置异常: 低报 >高报");
                    continue;
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
                    continue;
                    }
                    else
                    {
                        exEnergy.enerUserTypeID = enerProjectType[0].ID; //区域ID
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

        public JsonResult GetTageID( int pid=0, int cid=0 )
		{
            if (pid == 0 || cid == 0 )
            {
                return Json("参数异常:参数为空");
            }
            IList<IDAO.Models.t_CM_PointsInfoBase1> list = DAL.PointsInfoDAL.getInstance().GetTageID( pid, cid );
			return(Json( list, JsonRequestBehavior.AllowGet ) );
		}

        public ActionResult GetEnergyTreePower(DateTime time,int UnitID=0, int ItemType=0, string UnitName ="") {

            if (UnitID == 0 || ItemType == 0 || UnitName=="")
            {
                return Json("参数异常:参数为空");
            }
            List<IDAO.Models.t_V_EnerProjectTypeTree> list = DAL.VEnerProjectTypeDAL.getInstance().GetEnergyTreePower(UnitID, ItemType, UnitName, time);
            return Json(list);
        }

    // 查询当月用电量
    public ActionResult GetTreePowerMonth(string addCid, string delCid,DateTime time) {

            if (addCid == "" && delCid == "")
            {
                return Json("参数异常:参数为空");
            }

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
            IList<IDAO.Models.t_V_EnerPower> power = DAL.VEnerProjectTypeDAL.getInstance().GetElectricityToMonth(pid, cid,time);

            //判断闰年
            int year = int.Parse(time.Year.ToString());
            int i = year % 4;
            int j = year % 400;
            int month = int.Parse(time.Month.ToString());
            int day = 0;
            int[] ms = {4,6,9,11};

            if ((i == 0 || j == 0) && month==2)
            {
                day = 28;
            }
            else if(month == 2)
            {
                day = 29;
            }else if (ms.Contains(month))
            {
                day = 30;
            }
            else
            {
                day = 31;
            }
            List<DateTime> list = new List<DateTime>();
            for (int a = 0; a < day; a++) 
            {
                var d = new DateTime(year, month, a + 1);
                list.Add(d);
            }
   
            //var list = power.GroupBy(c => c.RecordTime).Select(c => c.First()).ToList();
            List<IDAO.Models.t_V_EnerPower> json  = new List<IDAO.Models.t_V_EnerPower>();
            list.Sort((left, right) =>
            {
                if (left > right)
                    return 1;
                else if (left == right)
                    return 0;
                else
                    return -1;
            });

            for (var a = 0; a < list.Count(); a++)
            {
                IDAO.Models.t_V_EnerPower obj = new IDAO.Models.t_V_EnerPower();
                obj.RecordTime = list[a];
                //obj.UsePower = 0;
                //obj.NeedPower = 0;
                var RecordTime = list[a];
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