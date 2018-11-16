using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using S5001Web.PubClass;
using Newtonsoft.Json;

namespace S5001Web.Controllers
{
    public class StateController : Controller
    {
        //
        // GET: /State/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Overview()//状态总览
        {
            return View();
        }
        public ActionResult RunningState()//状态-实时-运行状态
        {
            return View();
        }
        public ActionResult DeviceState()//状态-实时-设备状态
        {
            return View();
        }
        public ActionResult DeviceStateRealTime()//状态-实时-设备状态
        {
            return View();
        }
        public ActionResult EquipmentLedger()//状态-实时-设备台账
        {
            return View();
        }
        public ActionResult InfraredMonitor()//状态-实时-双视监测
        {
            return View();
        }
        public ActionResult InfraredMonitorDetail()//状态-实时-双视监测-报警报告弹窗
        {
            return View();
        }
        public ActionResult AlarmProcessing()//状态-报警-运行报警
        {
            return View();
        }
        public ActionResult MechanicsCharacteristic()//状态-实时-机械特性
        {
            return View();
        }
        public ActionResult Robot()//机器人
        {
            return View();
        }
        public ActionResult FaceRecognition()//人脸识别
        {
            return View();
        }
        public ActionResult AccessControl()//门禁系统
        {
            return View();
        }
        public ActionResult TouchScreen()//触摸屏
        {
            return View();
        }
        public string PowerRateRank(int pid)
        {
            string result = "";
            string strsql = "SELECT STUFF((SELECT ','+CONVERT(varchar,DID) FROM t_CM_PointsInfo where  PID=" + pid + " FOR XML PATH('')),1,1,'') as TagID";
            return result;
        }
        //获取设备列表
        [Login]
        public ActionResult PointsInfoData(string tagname, string Position, int did, int rows, int page)
        {
            try
            {
                string query = " 1=1";
                if (did > 0)
                    query = query + " and did=" + did;
                if (!tagname.Equals(""))
                    query = query + " and tagname like '%" + tagname + "%'";
                if (!Position.Equals(""))
                    query = query + " and Remarks like '%" + Position + "%'";

                List<t_CM_PointsInfo> list = bll.P_PointsInfo("t_CM_PointsInfo", "*", "tagid", rows, page, true, query).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        /// <summary>
        /// 状态首页
        /// </summary>
        /// <param name="pid">配电房ID</param>
        /// <param name="did">设备ID</param>
        /// <returns></returns>
        [Login]
        public ActionResult StateData(int pid, int did)
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

                List<t_EE_PowerQualityDaily> todaylist = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(todaysql).ToList();//当前
                List<t_EE_PowerQualityDaily> beforelist = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(beforesql).ToList();//环比

                int factortime = 0, currenttime = 0, voltagetime = 0;//时长
                double fpyfactor = 0, fpycurrent = 0, fpyvoltage = 0;//合格率
                double maxtemperature = 0, mintemperature = 0;//温度
                double maxpower = 0, minpower = 0, maxpowerrate = 0;//负荷
                float todaymaxpower = 0; //负荷
                float nowfactor = 0, minfactor = 0; //功率因数
                float nowcurrent = 0, mincurrent = 0; //电流
                float nowvoltage = 0, minvoltage = 0; //电压
                double factorlinevalue = 0.9f, voltagelinevalue = 30, currentlinevalue = 30;//越限值

                List<string> listx = new List<string>();
                List<float> listtodaypow = new List<float>();
                List<float> listbeforepow = new List<float>();
                List<float> listtodaytem = new List<float>();
                List<float> listbeforetem = new List<float>();
                List<float> listfactormax = new List<float>();
                List<float> listcurrentmax = new List<float>();
                List<float> listvoltagemax = new List<float>();
                List<float> listfactormin = new List<float>();
                List<float> listcurrentmin = new List<float>();
                List<float> listvoltagemin = new List<float>();
                List<float> listpowermax = new List<float>();

                //当前
                if (todaylist.Count > 0)
                {
                    var todayresult = from p in todaylist.AsEnumerable() group p by p.RecordTime into g select new { g.Key, SumPower = g.Sum(p => p.Power), MaxPower = g.Max(p => p.Power), MaxTemperature = g.Max(p => p.MaxTemperature), AFactorMax = g.Max(p => p.AFactor), UnBalanceIaMax = g.Max(p => p.UnBalanceIa), UnBalanceUaMax = g.Max(p => p.UnBalanceUa), AFactorMin = g.Min(p => p.AFactor), UnBalanceIaMin = g.Min(p => p.UnBalanceIa), UnBalanceUaMin = g.Min(p => p.UnBalanceUa), AFactorCount = g.Count(p => (double)p.AFactor >= factorlinevalue), UnBalanceIaCount = g.Count(p => (double)p.UnBalanceIa <= currentlinevalue), UnBalanceUaCount = g.Count(p => (double)p.UnBalanceUa <= voltagelinevalue) };
                    foreach (var model in todayresult)
                    {
                        //x轴坐标显
                        listx.Add(Convert.ToDateTime(model.Key).ToString("HH:mm"));
                        listtodaypow.Add(model.SumPower == null ? 0 : (float)model.SumPower);
                        listpowermax.Add(model.MaxPower == null ? 0 : (float)model.MaxPower);
                        listtodaytem.Add(model.MaxTemperature == null ? 0 : (float)model.MaxTemperature);
                        listfactormax.Add(model.AFactorMax == null ? 0 : (float)model.AFactorMax);
                        listcurrentmax.Add(model.UnBalanceIaMax == null ? 0 : (float)model.UnBalanceIaMax);
                        listvoltagemax.Add(model.UnBalanceUaMax == null ? 0 : (float)model.UnBalanceUaMax);
                        listfactormin.Add(model.AFactorMin == null ? 0 : (float)model.AFactorMin);
                        listcurrentmin.Add(model.UnBalanceIaMin == null ? 0 : (float)model.UnBalanceIaMin);
                        listvoltagemin.Add(model.UnBalanceUaMin == null ? 0 : (float)model.UnBalanceUaMin);

                        //合格率
                        factortime += model.AFactorCount;
                        currenttime += model.UnBalanceIaCount;
                        voltagetime += model.UnBalanceUaCount;
                    }
                }

                //环比
                if (beforelist.Count > 0)
                {
                    var beforeresult = from p in beforelist.AsEnumerable() group p by p.RecordTime into g select new { g.Key, SumPower = g.Sum(p => p.Power), MaxTemperature = g.Max(p => p.MaxTemperature), AFactor = g.Max(p => p.AFactor), UnBalanceIa = g.Max(p => p.UnBalanceIa), UnBalanceUa = g.Max(p => p.UnBalanceUa) };
                    foreach (var model in beforeresult)
                    {
                        listbeforepow.Add(model.SumPower == null ? 0 : (float)model.SumPower);
                        listbeforetem.Add(model.MaxTemperature == null ? 0 : (float)model.MaxTemperature);
                    }
                }

                //设备容器
                float totalpower = 0;
                List<t_DM_DeviceInfo> devicelist = bll.t_DM_DeviceInfo.ToList();
                var deviceresult = from d in devicelist join b in todaylist on d.DID equals b.DID group d by new { d.DID, d.Z } into g select new { DID = g.Key.DID, Z = g.Key.Z };
                if (deviceresult != null)
                {
                    foreach (var item in deviceresult)
                    {
                        totalpower += float.Parse(item.Z == "" ? "0" : item.Z == null ? "0" : item.Z);
                    }
                }
                //今日最高负荷
                if (listpowermax.Count > 0)
                    todaymaxpower = listpowermax.Max();
                //最高负载率
                if (todaymaxpower > 0 && totalpower > 0)
                    maxpowerrate = Math.Round(todaymaxpower / totalpower * 100, 2);

                //功率因数
                if (listfactormax.Count > 0)
                    nowfactor = listfactormax.Max();
                if (listfactormin.Count > 0)
                    minfactor = listfactormin.Min();
                if (factortime > 0 && todaylist.Count > 0)
                    fpyfactor = Math.Round((float)factortime / todaylist.Count * 100, 2);

                if (listcurrentmax.Count > 0)
                    nowcurrent = listcurrentmin.Max();
                if (listcurrentmin.Count > 0)
                    mincurrent = listcurrentmin.Min();
                if (currenttime > 0 && todaylist.Count > 0)
                    fpycurrent = Math.Round((float)currenttime / todaylist.Count * 100, 2);

                if (listvoltagemax.Count > 0)
                    nowvoltage = listvoltagemax.Max();
                if (listvoltagemin.Count > 0)
                    minvoltage = listvoltagemin.Min();
                if (voltagetime > 0 && todaylist.Count > 0)
                    fpyvoltage = Math.Round((float)voltagetime / todaylist.Count * 100, 2);


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
                //最高温度max min
                if (listtodaytem.Count > 0 && listbeforetem.Count > 0)
                {
                    if (listtodaytem.Max() > listbeforetem.Max())
                        maxtemperature = Math.Ceiling(listtodaytem.Max() * 1.01);
                    else
                        maxtemperature = Math.Ceiling(listbeforetem.Max() * 1.01);
                    if (listtodaytem.Min() < listbeforepow.Min())
                        mintemperature = Math.Floor(listtodaytem.Min() * 0.99);
                    else
                        mintemperature = Math.Floor(listbeforetem.Min() * 0.99);
                }

                strJson = JsonConvert.SerializeObject(listx) + "$" + JsonConvert.SerializeObject(listbeforepow) + "$" + JsonConvert.SerializeObject(listtodaypow) + "$" + JsonConvert.SerializeObject(minpower + "," + maxpower + "," + todaymaxpower + "," + maxpowerrate) + "$" +
                                      JsonConvert.SerializeObject(listbeforetem) + "$" + JsonConvert.SerializeObject(listtodaytem) + "$" + JsonConvert.SerializeObject(mintemperature + "," + maxtemperature) + "$" +
                                      JsonConvert.SerializeObject(fpyfactor + "," + minfactor + "," + nowfactor) + "$" +
                                      JsonConvert.SerializeObject(fpycurrent + "," + mincurrent + "," + nowcurrent) + "$" +
                                      JsonConvert.SerializeObject(fpyvoltage + "," + minvoltage + "," + nowvoltage);

            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
                strJson = "异常！";
            }
            return Content(strJson);
        }

        //最大负荷排序
        [Login]
        public ActionResult StateMaxLoad(int pid = 0, int did = 0)
        {
            string strJson = "";
            try
            {
                string result = "", max = "0"; ;
                string sql = "SELECT * FROM t_DM_CircuitInfo where 1=1";
                if (pid > 0)
                {
                    sql += " and pid =" + pid;
                }
                if (did > 0)
                {
                    List<t_DM_DeviceInfo> dl = bll.t_DM_DeviceInfo.Where(o => o.DID == did).ToList();
                    if (!dl[0].B.Equals(""))
                        sql += " and did =" + dl[0].B;
                    else
                        sql += " and did =" + did;
                }
                List<t_DM_CircuitInfo> Clist = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(sql).ToList();
                List<Rank> RankList = new List<Rank>();
                foreach (t_DM_CircuitInfo c in Clist)
                {

                    List<t_EE_PowerQualityDaily> PElist = bll.t_EE_PowerQualityDaily.Where(k => k.CID == c.CID).OrderByDescending(l => l.Power).ToList();
                    if (PElist.Count > 0)
                    {
                        Rank Ra = new Rank();
                        Ra.CName = c.CName;
                        Ra.MValue = (double)PElist[0].Power;
                        RankList.Add(Ra);
                    }
                }
                //重新排序
                RankList = RankList.OrderByDescending(J => J.MValue).ToList();
                foreach (Rank R in RankList)
                {
                    result += "{\"CName\":\"" + R.CName + "\",\"MaxValue\":" + R.MValue + "},";
                }
                strJson = "[" + result.TrimEnd(',') + "]";
            }
            catch (Exception ex)
            {
                strJson = ex.ToString();
            }
            return Content(strJson);
        }
        public class Rank
        {
            public string CName { get; set; }
            public Double MValue { get; set; }
        }
    }
}
