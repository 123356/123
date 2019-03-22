using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.PubClass;
using System.Data;
using Newtonsoft.Json;
using YWWeb;

namespace YWWeb.Controllers
{
    public class EnergyEfficiencyController : UserControllerBaseEx
    {
        //
        // GET: /EnergyEfficiency/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Overview()//电能-能效总览
        {
            return View();
        }
        public ActionResult JianguPingfeng()//电能-尖谷平峰
        {
            return View();
        }
        public ActionResult JianguPingfengSet()//电能-尖谷平峰设置列表
        {
            return View();
        }
        public ActionResult JianguPingfengEdit()//电能-尖谷平峰设置详情
        {
            return View();
        }
        public ActionResult AlarmProcessing()//电能-报警
        {
            return View();
        }
        public ActionResult LineLossStatistics()//电能-损耗分析
        {
            return View();
        }
        public ActionResult LoadAnalysis()//电能-负荷分析
        {
            return View();
        }
        public ActionResult ElectricityAnalysis()//电能-用电分析
        {
            return View();
        }
        public ActionResult PowerUseReport()//电能-用电报表
        {
            return View();
        }
        public ActionResult RequirementAnalysis()//电能-需量分析
        {
            return View();
        }
        public ActionResult OverviewList()
        {
            return View();
        }
        public ActionResult Consume()
        {
            return View();
        }
        public ActionResult SubItem()
        {
            return View();
        }
        public ActionResult DepartDataMonitoring()
        {
            return View();
        }
        public ActionResult BudgetSetting()
        {
            return View();
        }
        public ActionResult EnergyPublicity()
        {
            return View();
        }
        public ActionResult EnergyQuery()
        {
            return View();
        }
        public ActionResult EnergyAudit()
        {
            return View();
        }
        public ActionResult RoomDataMonitoring()
        {
            return View();
        }
        public ActionResult EnergyOverview()
        {
            return View();
        }
        public ActionResult Control()
        {
            return View();
        }
        public ActionResult DepartData()
        {
            return View();
        }
        public ActionResult ElectricityReport()
        {
            return View();
        }
        public ActionResult EnergyPrice()
        {
            return View();
        }
        public ActionResult IntelligentLighting()
        {
            return View();
        }
        //获取尖谷平峰方案列表
        [Login]
        public ActionResult PlanData(int pid, string stagename, int rows, int page)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<t_CM_OffPeakPlan> Plan = new List<t_CM_OffPeakPlan>();
                if (pid > 0)
                    Plan = bll.t_CM_OffPeakPlan.Where(j => j.PID == pid).ToList();
                else
                    Plan = bll.ExecuteStoreQuery<t_CM_OffPeakPlan>("SELECT  * FROM t_CM_OffPeakPlan WHERE PID in (" + pdrlist + ")").ToList();

                if (!stagename.Equals(""))
                    Plan = Plan.Where(m => m.StageName.Contains(stagename)).ToList();

                string strJson = Common.List2Json(Plan, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //获取设备详情-编辑页面
        [Login]
        public ActionResult PlanInfoDetail(int id)
        {
            string strJson = "";
            List<t_CM_OffPeakPlan> list = bll.t_CM_OffPeakPlan.Where(d => d.ID == id).ToList();
            if (list.Count > 0)
            {
                t_CM_OffPeakPlan info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        [Login]
        public ActionResult ConfigData(int PlanID, int rows, int page)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<t_CM_OffPeakConfig> Plan = bll.t_CM_OffPeakConfig.Where(j => j.PlanID == PlanID).ToList();

                string strJson = Common.List2Json(Plan, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        [Login]
        public string EditPlan(t_CM_OffPeakPlan Plan)
        {
            string result = "0";
            //新增
            try
            {
                if (Plan.ID < 1)
                {
                    Plan.StageName = "新建方案";
                    Plan.CreateDate = DateTime.Now;
                    Plan.UserName = CurrentUser.UserName;
                    bll.t_CM_OffPeakPlan.AddObject(Plan);
                    bll.SaveChanges();
                    result = Plan.ID.ToString();
                    Common.InsertLog("尖谷平峰", CurrentUser.UserName, "新增尖谷平峰方案[方案ID:" + Plan.ID + "]");
                }
                else//修改
                {
                    t_CM_OffPeakPlan model = bll.t_CM_OffPeakPlan.Where(l => l.ID == Plan.ID).First();
                    model.StageName = Plan.StageName;
                    model.DateStart = Plan.DateStart;
                    model.DateEnd = Plan.DateEnd;
                    bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                    bll.SaveChanges();
                    result = model.ID.ToString();
                    Common.InsertLog("尖谷平峰", CurrentUser.UserName, "修改尖谷平峰方案[方案ID:" + Plan.ID + "]");
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return result;

        }
        [Login]
        public string EditPlanConfig(t_CM_OffPeakConfig Config)
        {
            string result = "";
            //新增
            try
            {
                if (Config.ID < 1)
                {
                    bll.t_CM_OffPeakConfig.AddObject(Config);
                    bll.SaveChanges();
                    result = Config.ID.ToString();
                }
                else//修改
                {
                    t_CM_OffPeakConfig model = bll.t_CM_OffPeakConfig.Where(l => l.ID == Config.ID).First();
                    model.StageType = Config.StageType;
                    model.TimeEnd = Config.TimeEnd;
                    model.TimeStart = Config.TimeStart;
                    model.ElePrice = Config.ElePrice;
                    bll.ObjectStateManager.ChangeObjectState(model, EntityState.Modified);
                    bll.SaveChanges();
                    result = Config.ID.ToString();
                }

            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return result;

        }
        //删除方案信息
        [Login]
        public ActionResult DeletePlan(string did)
        {
            string result = "Error";
            try
            {
                List<int> resultlist = new List<string>(did.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_OffPeakPlan> list = bll.t_CM_OffPeakPlan.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                list.ForEach(i =>
                {
                    List<t_CM_OffPeakConfig> clist = bll.t_CM_OffPeakConfig.Where(m => m.PlanID == i.ID).ToList();
                    clist.ForEach(j =>
                    {
                        bll.t_CM_OffPeakConfig.DeleteObject(j);
                    }
                    );
                    //删除设备时，删除对应的配置信息               
                    bll.t_CM_OffPeakPlan.DeleteObject(i);
                    result = "OK";
                });
                bll.SaveChanges();
                Common.InsertLog("尖谷平峰", CurrentUser.UserName, "删除尖谷平峰方案[" + did + "]");//log
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        //删除方案信息
        [Login]
        public ActionResult DeleteConfig(string did)
        {
            string result = "Error";
            try
            {
                List<int> resultlist = new List<string>(did.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_OffPeakConfig> list = bll.t_CM_OffPeakConfig.Where(m => resultlist.Any(a => a == m.ID)).ToList();
                list.ForEach(i =>
                {
                    //删除设备时，删除对应的配置信息               
                    bll.t_CM_OffPeakConfig.DeleteObject(i);
                });
                bll.SaveChanges();
                result = "OK";
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        //尖谷平峰统计
        [Login]
        public ActionResult JGPFData(int pid, int did, int Graphtype, string startdate, string enddate)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string DateStart = "", DateEnd = "";
                switch (Graphtype)
                {
                    case 1:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 6:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 72:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 144:
                        DateEnd = DateTime.Now.AddMonths(1).ToString("yyyy-MM-01 00:00:00");
                        DateStart = DateTime.Now.ToString("yyyy-MM-01 00:00:00");
                        break;
                    case 707:
                        DateEnd = Convert.ToDateTime(enddate).ToString("yyyy-MM-dd 23:59:59"); ;
                        DateStart = startdate;
                        break;
                    case 616:
                        DateEnd = DateTime.Now.AddYears(1).ToString("yyyy-01-01 00:00:00");
                        DateStart = DateTime.Now.ToString("yyyy-01-01 00:00:00");
                        break;
                }
                string SQL = "select * from t_EE_JGPF where RecordDate>='" + DateStart + "' and RecordDate<='" + DateEnd + "'";
                if (pid > 0)
                    SQL += " and pid =" + pid;
                if (did > 0)
                    SQL += " and did =" + did;
                List<t_EE_JGPF> list = bll.ExecuteStoreQuery<t_EE_JGPF>(SQL).ToList();

                DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
                TimeSpan TotalDiff = EndD - StartD;

                int diffCount = 0;
                if (Graphtype == 616)
                    diffCount = (int)TotalDiff.TotalDays / 30;
                else
                    diffCount = (int)TotalDiff.TotalDays;
                string J = "", F = "", P = "", G = "", Date = "";
                double Jt = 0, Ft = 0, Pt = 0, Gt = 0;
                if (list.Count > 0)
                {
                    DateTime Start = Convert.ToDateTime(DateStart);
                    DateTime End = Start.AddDays(1);
                    if (Graphtype == 616)
                    {
                        Start = Convert.ToDateTime(DateStart);
                        End = Start.AddMonths(1);

                    }
                    else
                    {
                        Start = Convert.ToDateTime(DateStart);
                        End = Start.AddDays(1);
                    }
                    for (int i = 0; i < diffCount; i++)
                    {
                        double j = 0, f = 0, p = 0, g = 0;
                        List<t_EE_JGPF> Hislist = list.Where(n => n.RecordDate >= Start && n.RecordDate < End).ToList();
                        if (Hislist.Count > 0)
                        {
                            foreach (t_EE_JGPF jfpg in Hislist)
                            {
                                j += (double)jfpg.Jian;
                                f += (double)jfpg.Feng;
                                p += (double)jfpg.Ping;
                                g += (double)jfpg.Gu;
                            }
                            J += j + ",";
                            F += f + ",";
                            P += p + ",";
                            G += g + ",";

                            Jt += j;
                            Ft += f;
                            Pt += p;
                            Gt += g;
                        }
                        else
                        {
                            J += "0,";
                            F += "0,";
                            P += "0,";
                            G += "0,";
                        }
                        if (Graphtype == 616)
                            Date += Start.ToString("yyyy-MM") + ",";
                        else
                            Date += Start.ToString("yyyy-MM-dd") + ",";

                        if (Graphtype == 616)
                        {
                            Start = Start.AddMonths(1);
                            End = Start.AddMonths(1);
                        }
                        else
                        {
                            Start = Start.AddDays(1);
                            End = Start.AddDays(1);
                        }
                    }
                }
                else
                {
                    diffCount = 0;
                    J += "0,";
                    F += "0,";
                    P += "0,";
                    G += "0,";
                }
                string result = "{\"Count\":\"" + diffCount + "\",\"Jian\":\"" + J.TrimEnd(',') + "\",\"Gu\":\"" + G.TrimEnd(',') + "\",\"Ping\":\"" + P.TrimEnd(',') + "\",\"Feng\":\"" + F.TrimEnd(',') + "\",\"Total\":[" + Jt + "," + Gt + "," + Pt + "," + Ft + "],\"Date\":\"" + Date.TrimEnd(',') + "\"}";
                return Content(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //尖谷平峰统计-能耗对比
        [Login]
        public ActionResult JGPFContrast(int pid, int did, int Graphtype, string startdate, string enddate)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                /* string pdrlist = CurrentUser.PDRList,*/
                string result = "";
                string DateStart = "", DateEnd = "", pmDateStart = "", pmDateEnd = "", pyDateStart = "", pyDateEnd = "";
                //本月时间段
                DateEnd = DateTime.Now.AddMonths(1).ToString("yyyy-MM-01 00:00:00");
                DateStart = DateTime.Now.ToString("yyyy-MM-01 00:00:00");
                //上月时间段
                pmDateEnd = DateTime.Now.ToString("yyyy-MM-01 00:00:00");
                pmDateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-01 00:00:00");
                //去年同期时间段
                pyDateEnd = DateTime.Now.AddYears(-1).AddMonths(1).ToString("yyyy-MM-01 00:00:00");
                pyDateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-01 00:00:00");
                string SQL = "select * from t_EE_JGPF where RecordDate>='" + DateStart + "' and RecordDate<='" + DateEnd + "'",
                     pmSQL = "select * from t_EE_JGPF where RecordDate>='" + pmDateStart + "' and RecordDate<='" + pmDateEnd + "'",
                     pySQL = "select * from t_EE_JGPF where RecordDate>='" + pyDateStart + "' and RecordDate<='" + pyDateEnd + "'";
                if (pid > 0)
                {
                    SQL += " and pid =" + pid;
                    pmSQL += " and pid =" + pid;
                    pySQL += " and pid =" + pid;
                }
                if (did > 0)
                {
                    SQL += " and did =" + did;
                    pmSQL += " and did =" + did;
                    pySQL += " and did =" + did;
                }
                //统计当前时间段
                double J = 0, G = 0, P = 0, F = 0;
                List<t_EE_JGPF> list = bll.ExecuteStoreQuery<t_EE_JGPF>(SQL).ToList();
                foreach (t_EE_JGPF obj in list)
                {
                    if (obj.Jian.HasValue) J += obj.Jian.Value;
                    if (obj.Gu.HasValue) G += obj.Gu.Value;
                    if (obj.Ping.HasValue) P += obj.Ping.Value;
                    if (obj.Feng.HasValue) F += obj.Feng.Value;
                }
                result += "\"thisTime\":[" + J + "," + G + "," + P + "," + F + "],";
                //重置统计-统计上月时间段
                J = 0; G = 0; P = 0; F = 0;
                List<t_EE_JGPF> listpm = bll.ExecuteStoreQuery<t_EE_JGPF>(pmSQL).ToList();
                foreach (t_EE_JGPF obj in listpm)
                {
                    if (obj.Jian.HasValue) J += obj.Jian.Value;
                    if (obj.Gu.HasValue) G += obj.Gu.Value;
                    if (obj.Ping.HasValue) P += obj.Ping.Value;
                    if (obj.Feng.HasValue) F += obj.Feng.Value;
                }
                result += "\"lastMonth\":[" + J + "," + G + "," + P + "," + F + "],";
                //重置统计-统计去年时间段
                J = 0; G = 0; P = 0; F = 0;
                List<t_EE_JGPF> listpy = bll.ExecuteStoreQuery<t_EE_JGPF>(pmSQL).ToList();
                foreach (t_EE_JGPF obj in listpy)
                {
                    if (obj.Jian.HasValue) J += obj.Jian.Value;
                    if (obj.Gu.HasValue) G += obj.Gu.Value;
                    if (obj.Ping.HasValue) P += obj.Ping.Value;
                    if (obj.Feng.HasValue) F += obj.Feng.Value;
                }
                result += "\"lastYear\":[" + J + "," + G + "," + P + "," + F + "]";
                return Content("{" + result + "}");
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //电能表线损统计
        [Login]
        public ActionResult ElectricMeterData(int did, int cid, int Graphtype, string startdate, string enddate)
        {
            try
            {
                //string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string DateStart = "", DateEnd = "";
                string result = "";
                switch (Graphtype)
                {
                    case 1:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 6:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 72:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 144:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 707:
                        DateEnd = Convert.ToDateTime(enddate).ToString("yyyy-MM-dd 23:59:59"); ;
                        DateStart = startdate;
                        break;
                    case 616:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                }
                string SQL = "select * from t_DM_CircuitInfo where 1=1 ";
                if (did > 0)
                    SQL += " and did = " + did;
                if (cid > 0)
                    SQL += " and cid = " + cid;

                List<t_DM_CircuitInfo> CList = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(SQL).ToList();
                foreach (t_DM_CircuitInfo C in CList)
                {
                    int pid = (int)C.PID;
                    string tablename = "t_SM_HisData_" + pid.ToString("00000");
                    string emstr = "";
                    List<t_DM_ElectricMeterInfo> EMlist = bll.t_DM_ElectricMeterInfo.Where(n => n.CID == C.CID).ToList();
                    for (int j = 0; j < 2; j++)
                    {
                        List<t_DM_ElectricMeterInfo> IOlist = EMlist.Where(K => K.IO == j).ToList();
                        if (IOlist.Count > 0)
                        {
                            float EMvalue = 0;
                            t_DM_ElectricMeterInfo EM = IOlist[0];
                            List<t_CM_PointsInfo> Plist = bll.ExecuteStoreQuery<t_CM_PointsInfo>(" select * from t_CM_PointsInfo where TagID in (" + EM.TagIDs + ") and DataTypeID = 52 ").ToList();
                            if (Plist.Count > 0)
                            {
                                List<t_SM_HisData_00001> Hislist = bll.ExecuteStoreQuery<t_SM_HisData_00001>(" select * from " + tablename + " where TagID = " + Plist[0].TagID + " and RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' ").ToList();
                                if (Hislist.Count > 0)
                                {
                                    EMvalue = (float)Hislist.First().PV;
                                }
                            }
                            emstr += "{\"EID\":\"" + EM.EID + "\",\"EName\":\"" + EM.EName + "\",\"IO\":\"" + EM.IO + "\",\"PV\":\"" + EMvalue + "\"},";
                        }
                        else
                        {
                            emstr += "{\"EID\":\"" + 0 + "\",\"EName\":\"无\",\"IO\":\"" + j + "\",\"PV\":\"0\"},";
                        }
                    }
                    result += "{\"CID\":\"" + C.CID + "\",\"CName\":\"" + C.CName + "\",\"EM\":[" + emstr.TrimEnd(',') + "]},";
                }
                return Content("[" + result.TrimEnd(',') + "]");
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //负载分析
        [Login]
        public ActionResult LoadAnalysisData(int pid, int did, int cid, int Graphtype, string startdate, string enddate)
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList), DateStart = "", DateEnd = "", result = "", tablename = "t_EE_PowerQualityDaily";
                switch (Graphtype)
                {
                    case 1:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        tablename = "t_EE_PowerQualityRealTime";
                        break;
                    case 6:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 72:
                        DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        DateStart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 144:
                        DateEnd = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 00:00:00");
                        DateStart = DateTime.Now.ToString("yyyy-MM-01 00:00:00");
                        break;
                    case 707:
                        DateEnd = Convert.ToDateTime(enddate).ToString("yyyy-MM-dd 23:59:59"); ;
                        DateStart = startdate;
                        break;
                    case 616:
                        DateEnd = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 00:00:00");
                        DateStart = DateTime.Now.ToString("yyyy-01-01 00:00:00");
                        break;
                }
                string SQL = "select * from " + tablename + " where RecordTime>='" + DateStart + "' and RecordTime<='" + DateEnd + "'";
                //容量
                double Z = 0;
                if (cid > 0)
                {
                    SQL += " and cid = " + cid;
                    //求回路所属设备的容量
                    List<t_DM_CircuitInfo> cc = bll.t_DM_CircuitInfo.Where(c => c.CID == cid).ToList();
                    if (cc.Count > 0)
                    {
                        List<t_DM_DeviceInfo> dd = bll.t_DM_DeviceInfo.Where(d => d.DID == cc[0].DID).ToList();
                        if (dd.Count > 0)
                        {
                            if (!dd[0].Z.Equals("")) Z = Convert.ToDouble(dd[0].Z);
                        }
                    }
                }
                else if (did > 0)
                {
                    SQL += " and did = " + did;
                    //求回路所属设备的容量
                    List<t_DM_DeviceInfo> dd = bll.t_DM_DeviceInfo.Where(d => d.DID == did).ToList();
                    if (dd.Count > 0)
                    {
                        if (!dd[0].Z.Equals("")) Z = Convert.ToDouble(dd[0].Z);
                    }
                }
                else if (pid > 0)
                {
                    SQL += " and pid = " + pid;
                    //求回路所属设备的容量
                    List<t_DM_DeviceInfo> dd = bll.t_DM_DeviceInfo.Where(d => d.PID == pid).ToList();
                    if (dd.Count > 0)
                    {
                        foreach (t_DM_DeviceInfo d in dd)
                        {
                            if (!dd[0].Z.Equals(""))
                                Z += Convert.ToDouble(dd[0].Z);
                        }
                    }
                }
                DateTime StartD = Convert.ToDateTime(DateStart), EndD = Convert.ToDateTime(DateEnd);
                TimeSpan TotalDiff = EndD - StartD;

                int diffCount = 0, diff = 1;
                if (Graphtype == 616)
                {
                    diffCount = (int)TotalDiff.TotalDays / 30;
                    diff = 30;
                }
                else if (Graphtype == 1)
                {
                    diffCount = (int)TotalDiff.TotalMinutes / 5;
                    diff = 5;
                }
                else
                {
                    diffCount = (int)TotalDiff.TotalDays;
                    diff = 1;
                }

                List<t_EE_PowerQualityDaily> CList = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(SQL).ToList();

                double max = 0, min = 0, total = 0, ave = 0, premax = 0, premin = 0, totalall = 0, Aveall = 0;
                string Maxstr = "", Minstr = "", Avestr = "", Datestr = "", Maxdate = "", Mindate = "";
                DateTime Start = Convert.ToDateTime(DateStart);
                DateTime End = Start.AddDays(diff);
                if (Graphtype == 1)
                {
                    Start = Convert.ToDateTime(DateStart);
                    End = Start.AddMinutes(diff);
                }
                for (int j = 0; j < diffCount; j++)
                {
                    List<t_EE_PowerQualityDaily> Hislist = CList.Where(n => n.RecordTime >= Start && n.RecordTime <= End).ToList();
                    if (Hislist.Count > 0)
                    {
                        double Hpower = 0;
                        if (Hislist[0].Power.HasValue) Hpower = (double)Hislist[0].Power.Value;
                        max = Hpower;
                        min = Hpower;
                        premax = Hpower;
                        premin = Hpower;
                        ave = 0;
                        total = 0;
                        foreach (t_EE_PowerQualityDaily hi in Hislist)
                        {
                            double power = 0;
                            if (hi.Power.HasValue) power = (double)hi.Power.Value;
                            if (power > max) max = power;
                            if (power < min) min = power;
                            if (max > premax)
                            {
                                premax = max;
                                Maxdate = hi.RecordTime.Value.ToString("yyyy-MM-dd HH:mm:ss");
                            }
                            if (min < premin)
                            {
                                premin = min;
                                Mindate = hi.RecordTime.Value.ToString("yyyy-MM-dd HH:mm:ss");
                            }
                            total += power;
                        }
                        ave = total / Hislist.Count;
                        Maxstr += max + ",";
                        Minstr += min + ",";
                        Avestr += Math.Round(ave, 2) + ",";
                    }
                    else
                    {
                        Maxstr += "-,";
                        Minstr += "-,";
                        Avestr += "-,";
                    }
                    if (Graphtype == 616)
                        Datestr += Start.ToString("yyyy-MM") + ",";
                    else if (Graphtype == 1)
                        Datestr += Start.ToString("yyyy-MM-dd HH:mm:ss") + ",";
                    else
                        Datestr += Start.ToString("yyyy-MM-dd") + ",";

                    if (Graphtype == 616)
                    {
                        Start = Start.AddMonths(1);
                        End = End.AddMonths(1);
                    }
                    else if (Graphtype == 1)
                    {
                        Start = Start.AddMinutes(5);
                        End = Start.AddMinutes(5);
                    }
                    else
                    {
                        Start = Start.AddDays(1);
                        End = End.AddDays(1);
                    }
                }

                foreach (t_EE_PowerQualityDaily chi in CList)
                {
                    double power = 0;
                    if (chi.Power.HasValue)
                        power = (double)chi.Power.Value;
                    totalall += power;
                }
                Aveall = totalall / CList.Count;

                result += "{\"Count\":\"" + diffCount + "\",\"Max\":\"" + Maxstr.TrimEnd(',') + "\",\"Min\":\"" + Minstr.TrimEnd(',') + "\",\"Ave\":\"" + Avestr.TrimEnd(',') + "\",\"Date\":\"" + Datestr.TrimEnd(',') + "\",\"allMax\":\"" + premax + "kW " + Maxdate + "\",\"allMin\":\"" + premin + "kW " + Mindate + "\",\"allAve\":\"" + Math.Round(Aveall, 2) + "kW " + "\",\"volu\":\"" + Z + "\"}";
                return Content(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //负载分析
        [Login]
        public ActionResult LoadAnalysisRealTimeData(int pid, int did, int cid, int Graphtype, string startdate, string enddate)
        {
            try
            {

                string pdrlist = HomeController.GetPID(CurrentUser.UNITList), DateStart = "", DateEnd = "", result = "", tablename = "t_EE_PowerQualityRealTime";
                DateEnd = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                DateStart = DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                string SQL = "select * from " + tablename + " where RecordTime>='" + DateStart + "' and RecordTime<='" + DateEnd + "'";
                //容量
                double Z = 0;
                List<t_EE_PowerQualityDaily> CList = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(SQL).ToList();
                double max = 0, min = 0, total = 0, ave = 0, premax = 0, premin = 0, totalall = 0, Aveall = 0;
                string Maxstr = "", Minstr = "", Avestr = "", Datestr = "", Maxdate = "", Mindate = "";
                if (CList.Count > 0)
                {
                    double Hpower = 0;
                    if (CList[0].Power.HasValue) Hpower = (double)CList[0].Power.Value;
                    max = Hpower;
                    min = Hpower;
                    premax = Hpower;
                    premin = Hpower;
                }
                foreach (t_EE_PowerQualityDaily jo in CList)
                {
                    if (jo.Power.HasValue)
                    {
                        double power = 0;
                        if (jo.Power.HasValue) power = (double)jo.Power.Value;
                        if (power > max) max = power;
                        if (power < min) min = power;
                        if (max > premax)
                        {
                            premax = max;
                            Maxdate = jo.RecordTime.Value.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                        if (min < premin)
                        {
                            premin = min;
                            Mindate = jo.RecordTime.Value.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                        Avestr += power + ",";
                        totalall += (double)jo.Power.Value;
                    }
                    else
                    {
                        Avestr += "-,";
                    }
                    Datestr += jo.RecordTime.Value + ",";
                }
                Aveall = totalall / CList.Count;

                result += "{\"Count\":\"" + CList.Count + "\",\"Max\":\"" + max + "\",\"Min\":\"" + min + "\",\"Ave\":\"" + Avestr.TrimEnd(',') + "\",\"Date\":\"" + Datestr.TrimEnd(',') + "\",\"allMax\":\"" + premax + "kW " + Maxdate + "\",\"allMin\":\"" + premin + "kW " + Mindate + "\",\"allAve\":\"" + Math.Round(Aveall, 2) + "kW " + "\",\"volu\":\"" + Z + "\"}";
                return Content(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //public t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}

        /// <summary>
        /// 状态总览
        /// </summary>
        /// <param name="pid">配电房ID</param>
        /// <param name="did">设备ID</param>
        /// <returns></returns>
        [Login]
        public ActionResult OverviewData(int pid, int did)
        {
            string strJson = "";
            try
            {
                string dids = "";
                if (pid > 0)
                    dids = PubClass.Exportdoc.GetDeviceDID(pid);
                if (did > 0)
                {
                    List<t_DM_DeviceInfo> dl = bll.t_DM_DeviceInfo.Where(o => o.DID == did).ToList();
                    if (!string.IsNullOrEmpty(dl[0].B))
                        dids = dl[0].B;
                }

                string strquery = "select * from t_EE_PowerQualityDaily where did in (" + dids + ")";
                string todaysql = strquery + " and datediff(day, RecordTime,getdate())=0 order by recordtime";
                string beforesql = strquery + "and datediff(day, RecordTime,dateadd(day,-1,getdate()))=0 order by recordtime";

                double maxpower = 0, minpower = 0;//负荷
                List<string> listx = new List<string>();
                List<float> listtodaypow = new List<float>();
                List<float> listbeforepow = new List<float>();
                //当前
                List<t_EE_PowerQualityDaily> todaylist = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(todaysql).ToList();
                if (todaylist.Count > 0)
                {
                    var todayresult = from p in todaylist.AsEnumerable() group p by p.RecordTime into g select new { g.Key, SumPower = g.Sum(p => p.Power) };
                    foreach (var model in todayresult)
                    {
                        //x轴坐标显
                        listx.Add(Convert.ToDateTime(model.Key).ToString("HH:mm"));
                        listtodaypow.Add(model.SumPower == null ? 0 : (float)model.SumPower);
                    }
                }
                //环比
                List<t_EE_PowerQualityDaily> beforelist = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(beforesql).ToList();
                if (beforelist.Count > 0)
                {
                    var beforeresult = from p in beforelist.AsEnumerable() group p by p.RecordTime into g select new { g.Key, SumPower = g.Sum(p => p.Power) };
                    foreach (var model in beforeresult)
                    {
                        listbeforepow.Add(model.SumPower == null ? 0 : (float)model.SumPower);
                    }
                }
                //负荷max min
                if (listtodaypow.Count > 0 && listbeforepow.Count > 0)
                {
                    if (listtodaypow.Max() > listbeforepow.Max())
                        maxpower = Math.Ceiling(listtodaypow.Max() * 1.01);
                    else
                        maxpower = Math.Ceiling(listbeforepow.Max() * 1.01);
                    if (listtodaypow.Min() < listbeforepow.Min())
                        minpower = Math.Floor(listtodaypow.Min() * 0.99);
                    else
                        minpower = Math.Floor(listbeforepow.Min() * 0.99);
                }


                //用电量
                string query = "select convert(varchar(10),RecordTime,120) RecordTime,sum(UsePower) UsePower,max(Power)Power,max(NeedPower) NeedPower  from t_EE_PowerQualityDaily where did in (" + dids + ")";
                string tosql = query + " and datediff(month,RecordTime,getdate())=0 group by convert(varchar(10),RecordTime,120) order by RecordTime";
                string besql = query + " and datediff(month,RecordTime,dateadd(month,-1,getdate()))=0 group by convert(varchar(10),RecordTime,120) order by RecordTime";
                string yearsql = " select isnull(sum(usepower),0) TotalUsePower,isnull(max(Power),0) MaxPower from t_EE_PowerQualityDaily where did in (" + dids + ") and datediff(year, RecordTime,getdate())=0";

                float benyue = 0;//本月累计
                float shangyue = 0;//上月总量
                float bennian = 0;//本年累计
                float benyuemax = 0;//本月最大负荷
                float jinnianmax = 0;//今年最大负荷
                float benyuemaxliang = 0;//本月最大需量
                double maxusepower = 0, minusepower = 0;
                List<string> listxz = new List<string>();
                List<float> listtodayusepower = new List<float>();
                List<float> listbeforeusepower = new List<float>();
                List<UsePowerData> tolist = bll.ExecuteStoreQuery<UsePowerData>(tosql).ToList(); //本月电量
                List<UsePowerData> belist = bll.ExecuteStoreQuery<UsePowerData>(besql).ToList(); //上月电量
                List<YearPowerData> yearlist = bll.ExecuteStoreQuery<YearPowerData>(yearsql).ToList(); //本年电量

                bennian = (float)yearlist[0].TotalUsePower;
                jinnianmax = (float)yearlist[0].MaxPower;
                if (tolist.Count > 0)
                {
                    benyuemax = (float)tolist.Max(p => p.Power);
                    benyuemaxliang = (float)tolist.Max(p => p.NeedPower);
                    foreach (var model in tolist)
                    {
                        listtodayusepower.Add((float)model.UsePower);
                        benyue += (float)model.UsePower;
                        if (tolist.Count > belist.Count)
                            listxz.Add(Convert.ToDateTime(model.RecordTime).ToString("dd")); //x轴坐标
                    }
                }
                if (belist.Count > 0)
                {
                    foreach (var model in belist)
                    {
                        listbeforeusepower.Add((float)model.UsePower);
                        shangyue += (float)model.UsePower;
                        if (tolist.Count < belist.Count)
                            listxz.Add(Convert.ToDateTime(model.RecordTime).ToString("dd"));//x轴坐标
                    }
                }
                //用电量max min
                if (listtodayusepower.Count > 0 && listbeforeusepower.Count > 0)
                {
                    if (listtodayusepower.Max() > listbeforeusepower.Max())
                        maxusepower = Math.Ceiling(listtodayusepower.Max() * 1.01);
                    else
                        maxusepower = Math.Ceiling(listbeforeusepower.Max() * 1.01);
                    if (listtodayusepower.Min() < listbeforeusepower.Min())
                        minusepower = Math.Floor(listtodayusepower.Min() * 0.99);
                    else
                        minusepower = Math.Floor(listbeforeusepower.Min() * 0.99);
                }

                //主变容量
                float totalpower = 0;
                string strsql = "select * from t_DM_DeviceInfo d join t_CM_DeviceType dt on d.DTID=dt.DTID where d.DTID=3 and B in (" + dids + ")";
                List<t_DM_DeviceInfo> listd = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(strsql).ToList();
                if (listd.Count > 0)
                    foreach (var item in listd)
                    {
                        totalpower += float.Parse(item.Z == "" ? "0" : item.Z == null ? "0" : item.Z);
                    }
                //主变数量 
                int zhunum = listd.Count;
                //监测回路
                string sqlc = "select * from t_DM_CircuitInfo where 1=1 and did in (" + dids + ")";
                List<t_DM_CircuitInfo> listc = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(sqlc).ToList();
                int huiluenum = listc.Count;

                strJson = JsonConvert.SerializeObject(listx) + "$" + JsonConvert.SerializeObject(listbeforepow) + "$" + JsonConvert.SerializeObject(listtodaypow) + "$" + JsonConvert.SerializeObject(minpower) + "$" + JsonConvert.SerializeObject(maxpower) + "$" +
                               JsonConvert.SerializeObject(listxz) + "$" + JsonConvert.SerializeObject(listbeforeusepower) + "$" + JsonConvert.SerializeObject(listtodayusepower) + "$" + JsonConvert.SerializeObject(minusepower) + "$" + JsonConvert.SerializeObject(maxusepower) + "$" +
                               JsonConvert.SerializeObject(zhunum) + "$" + JsonConvert.SerializeObject(totalpower) + "$" + JsonConvert.SerializeObject(huiluenum) + "$" + JsonConvert.SerializeObject(benyue) + "$" + JsonConvert.SerializeObject(shangyue) + "$" + JsonConvert.SerializeObject(bennian) + "$" + JsonConvert.SerializeObject(benyuemax) + "$" + JsonConvert.SerializeObject(jinnianmax) + "$" + JsonConvert.SerializeObject(benyuemaxliang);
            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "异常！";
            }
            return Content(strJson);
        }

        /// <summary>
        /// 数据列表
        /// </summary>
        /// <param name="PName">配电房名称</param>
        /// <param name="dataSrc">1-日 2-月 3-年</param>
        /// <param name="dtStart"></param>
        /// <param name="dtEnd"></param>
        /// <returns></returns>
        [Login]
        public ActionResult getListData(int PID, int dataSrc, DateTime dtStart, DateTime dtEnd, int rows = 20, int page = 1)
        {
            string strJson = "";
            try
            {
                string DateStart = "", DateEnd = "", tablename = "t_EE_PowerQualityDaily";
                DateEnd = dtEnd.AddDays(1).ToString("yyyy-MM-dd 00:00:00");
                DateStart = dtStart.ToString("yyyy-MM-dd 00:00:00");
                switch (dataSrc)
                {
                    case 1:
                        tablename = "t_EE_PowerQualityDaily";
                        break;
                    case 2:
                        tablename = "[t_EE_PowerQualityMonthly]";
                        break;
                    case 3:
                        tablename = "[t_EE_PowerQualityYearly]";
                        break;
                    default:
                        return Content("error！数据类错误。");

                }

                string strquery = string.Format("select a.*,b.CName from {0} a inner join  t_DM_CircuitInfo b on a.CID=b.CID and a.PID=b.PID where a.PID={1} and [RecordTime]>='{2}' and [RecordTime]<='{3}' order by [RecordTime] desc",
                   tablename, PID, DateStart, DateEnd);


                //当前
                List<UsePowers> todaylist = bll.ExecuteStoreQuery<UsePowers>(strquery).ToList();

                strJson = Common.List2Json(todaylist, rows, page);


            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "error！" + ex.Message;
            }
            return Content(strJson);
        }
        [Login]
        public ActionResult saveData(t_EE_PowerQualityDaily info, int dataSrc)
        {
            string strJson = "";
            try
            {
                string tablename = "t_EE_PowerQualityDaily";
                switch (dataSrc)
                {
                    case 1:
                        tablename = "t_EE_PowerQualityDaily";
                        break;
                    case 2:
                        tablename = "[t_EE_PowerQualityMonthly]";
                        break;
                    case 3:
                        tablename = "[t_EE_PowerQualityYearly]";
                        break;
                    default:
                        return Content("{\"info\":\"数据类型错误.\",\"result\":\"ERROR\"}");
                }

                string strquery = string.Format("update {0} set UsePower={1} where PID={2} and CID={3} and RecordTime='{4}'",
                   tablename, info.UsePower, info.PID, info.CID, info.RecordTime);

                bll.ExecuteStoreCommand(strquery);


                strJson = "{\"info\":\"\",\"result\":\"OK\"}";

            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "{\"info\":\"" + ex.Message + "\",\"result\":\"ERROR\"}";
            }
            return Content(strJson);
        }



        public class UsePowerData
        {
            public string RecordTime { get; set; }
            public double UsePower { get; set; }
            public double Power { get; set; }
            public double NeedPower { get; set; }
        }
        public class YearPowerData
        {
            public double TotalUsePower { get; set; }
            public double MaxPower { get; set; }
        }


        public class UsePowers
        {
            public int PID { get; set; }
            public int CID { get; set; }
            public decimal UsePower { get; set; }
            public DateTime RecordTime { get; set; }
            public string CName { get; set; }
        }

    }
}
