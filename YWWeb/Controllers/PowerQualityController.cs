using YWWeb.PubClass;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace YWWeb.Controllers
{
    public class PowerQualityController : UserControllerBaseEx
    {
        //
        // GET: /PowerQuality/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        //电流电压
        public ActionResult CurrenVoltage()
        {
            return View();
        }
        public ActionResult PowerFactor()
        {
            return View();
        }
        public ActionResult ThreeUnbalance()
        {
            return View();
        }
        public ActionResult Universal()
        {
            return View();
        }
        public ActionResult HarmonicAnalysis()
        {
            return View();
        }

        //前一天、月饼图
        //totaltype:3 前一日 饼图；
        //totaltype:3 前一日 饼图；
        public string getPowerQualityData_FX(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline, string userType, string areaType, string itemType, int gradeType, int cidsType = 2)
        {
            string result = "";
            try
            {
                string tablename = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "RealTime";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 1:
                        tablename = "Daily";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");

                        DateTime HoursNext = DateTime.Now.AddHours(1);
                        dateend = HoursNext.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = HoursNext.AddHours(-2).ToString("yyyy-MM-dd HH:mm:ss");

                        break;
                    case 2:
                        tablename = "Monthly";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");

                        DateTime DaysNext = DateTime.Now.AddDays(1);
                        dateend = DaysNext.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DaysNext.AddDays(-2).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 3://昨天总用电 饼图；
                        tablename = "Monthly";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");

                        DaysNext = DateTime.Now.AddDays(1);
                        dateend = TimeUtils.getLastDayLastMin(DateTime.Now).ToString();
                        datestart = TimeUtils.getLastDayFirstMin(DateTime.Now).ToString();
                        break;

                    case 13://上月总用电 饼图；
                        tablename = "Monthly";
                        DateTime now = DateTime.Now;
                        datestart = TimeUtils.getLastMonthFirstDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        dateend = TimeUtils.getLastMonthLastDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 14://上周总用电 饼图；
                        tablename = "Monthly";
                        now = DateTime.Now;
                        datestart = TimeUtils.getLastWeekFirstDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        dateend = TimeUtils.getLastWeekLastDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                        //case 4:
                        //    tablename = "Daily";
                        //    dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //    datestart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        //    break;
                }
                //if (datatypeid == 12 || datatypeid == 13)
                //    tablename = "Daily";
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                string mL = "", mR = "";
                ////按设备和配电房统计时，选出最大值
                //if (cid.Equals("") || cid.Equals(0))
                //{
                //    mL = "max(";
                //    mR = ")";
                //}
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 1: //电流
                        DataType = " RecordTime,IsNull(" + mL + "ACurrent" + mR + ",0.404) Aphase,IsNull(" + mL + "BCurrent" + mR + ",0.404) Bphase,IsNull(" + mL + "CCurrent" + mR + ",0.404) Cphase";
                        break;
                    case 2: //电压
                        DataType = " RecordTime,IsNull(" + mL + "AVoltage" + mR + ",0.404) Aphase,IsNull(" + mL + "BVoltage" + mR + ",0.404) Bphase,IsNull(" + mL + "CVoltage" + mR + ",0.404) Cphase";
                        break;
                    case 3: //功率因数
                        DataType = " RecordTime,IsNull(" + mL + "AFactor" + mR + ",0.404) Aphase,IsNull(" + mL + "BFactor" + mR + ",0.404) Bphase,IsNull(" + mL + "CFactor" + mR + ",0.404) Cphase";
                        break;
                    case 4: //电流三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceIa" + mR + ",0.404) Aphase";
                        break;
                    case 5: //电压三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceUa" + mR + ",0.404) Aphase";
                        break;
                    case 6: //最大总相功率因数
                        DataType = " RecordTime,IsNull(" + mL + "Factor" + mR + ",0.404) Aphase";
                        break;
                    case 7: //最大负载率
                        DataType = " RecordTime,IsNull(" + mL + "PowerRate" + mR + ",0.404) Aphase";
                        break;
                    case 8: //线损
                        DataType = " RecordTime,IsNull(" + mL + "EnergyLoss" + mR + ",0.404) Aphase,IsNull(" + mL + "Power" + mR + ",0.404) Bphase";
                        break;
                    case 9: //谐波
                        DataType = " RecordTime,IsNull(" + mL + "Harmonic" + mR + ",0.404) Aphase";
                        break;
                    case 10: //负载
                        DataType = " RecordTime,IsNull(" + mL + "Power" + mR + ",0.404) Aphase";
                        break;
                    case 11: //最高温度
                        DataType = " RecordTime,IsNull(" + mL + "MaxTemperature" + mR + ",0.404) Aphase";
                        break;
                    case 12: //用电量
                        //DataType = " RecordTime,IsNull(" + mL + "UsePower" + mR + ",0.404) Aphase";
                        DataType = "UsePower ";
                        break;
                    case 13: //需量
                        DataType = " RecordTime,IsNull(" + mL + "NeedPower" + mR + ",0.404) Aphase";
                        break;
                }
                string strsql = "select distinct a.RecordTime,a." + DataType + " Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from " + tabname + " a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a." + DataType + " is not null";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid";
                }
                if (!did.Equals("") && !did.Equals(0))
                {
                    strsql += " and a.did=" + did;
                }
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and a.cid=" + cid;
                }
                if (!string.IsNullOrEmpty(userType))
                {
                    strsql += " and b.userType='" + userType + "' ";
                }
                strsql = addCidsLimit(cidsType, strsql, pid);
                if (!string.IsNullOrEmpty(areaType))
                {
                    strsql += " and b.areaType='" + areaType + "' ";
                }
                if (!string.IsNullOrEmpty(itemType))
                {
                    strsql += " and b.itemType='" + itemType + "' ";
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                if (cid.Equals("") || cid.Equals(0))
                {
                    strsql += "   ORDER BY Aphase";
                    strsqlm += " ORDER BY Aphase";
                    strsqly += "  ORDER BY Aphase";
                }
                List<PowerData> list = bll.ExecuteStoreQuery<PowerData>(strsql).ToList();
                string yAxis = "", series1 = "", series2 = "", series3 = "";
                decimal dbTotal = 0;
                Dictionary<string, decimal> dvalue = rebuildData(list);
                foreach (var item in dvalue)//处理，合并相同回路的电量；
                {
                    //"{\"yAxis\":\"['照明', '空调', '电梯', '其他']\",
                    //\"series1\":[{\"value\": 10,\"name\": \"照明\"}, {\"value\": 10,\"name\": \"空调\"}, {\"value\": 30,\"name\": \"电梯\"}, {\"value\": 50,\"name\": \"其他\"}]}";
                    yAxis += "'" + item.Key + "',";
                    series1 += "{\"value\": " + item.Value + ",\"name\": \"" + item.Key + "\"},";
                    dbTotal += item.Value;
                }
                //foreach (PowerData mod in list)//处理，合并相同回路的电量；
                //{
                //    //"{\"yAxis\":\"['照明', '空调', '电梯', '其他']\",
                //    //\"series1\":[{\"value\": 10,\"name\": \"照明\"}, {\"value\": 10,\"name\": \"空调\"}, {\"value\": 30,\"name\": \"电梯\"}, {\"value\": 50,\"name\": \"其他\"}]}";

                //    yAxis += "'" + mod.CName + "',";
                //    series1 += "{\"value\": " + mod.Aphase + ",\"name\": \"" + mod.CName + "\"},";
                //    dbTotal += mod.Aphase;
                //}
                if (datatypeid == 12)//电量计算
                {
                    result = "{\"yAxis\":\"[" + yAxis.TrimEnd(',') + "]\",\"series1\":[" + series1.TrimEnd(',') + "],\"total\":[" + dbTotal.ToString() + "]}";
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }

        private static Dictionary<string, decimal> rebuildData(List<PowerData> list)
        {
            Dictionary<string, decimal> dvalue = new Dictionary<string, decimal>();
            List<string> keys = new List<string>();
            for (int i = 0; i < list.Count; i++)
            {
                if (!keys.Contains(list[i].CName))
                {
                    keys.Add(list[i].CName);
                    dvalue.Add(list[i].CName, list[i].Aphase);
                }
                else
                {
                    dvalue[list[i].CName] = dvalue[list[i].CName] + list[i].Aphase;
                }
            }
            return dvalue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="pid">站室ID</param>
        /// <param name="did">设备ID</param>
        /// <param name="totaltype">统计类型：Daily,Monthly,Yearly</param>       
        /// <param name="datatypeid">数据类型</param>
        /// <param name="datestart">自定义统计：起始时间</param>
        /// <param name="dateend">结束时间</param>
        /// <returns></returns>
        //上一小时、天，排名曲线
        public string getPowerQualityData_PM(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline, string userType, string areaType, string itemType, int gradeType, int cidsType = 3)
        {
            string result = "";
            try
            {
                string tablename = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "RealTime";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 1:
                        tablename = "Daily";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");

                        DateTime HoursNext = DateTime.Now.AddHours(1);
                        dateend = HoursNext.AddHours(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = HoursNext.AddHours(-2).ToString("yyyy-MM-dd HH:mm:ss");

                        break;
                    case 2:
                        tablename = "Monthly";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");

                        DateTime DaysNext = DateTime.Now.AddDays(1);
                        dateend = TimeUtils.getLastDayLastMin(DateTime.Now).ToString();
                        datestart = TimeUtils.getLastDayFirstMin(DateTime.Now).ToString();
                        break;
                    case 3:
                        tablename = "Monthly";
                        //dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");

                        DaysNext = DateTime.Now.AddDays(1);
                        dateend = DaysNext.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DaysNext.AddDays(-2).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 13://上月用电分项排名；
                        tablename = "Monthly";
                        DateTime now = DateTime.Now;
                        datestart = TimeUtils.getLastMonthFirstDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        dateend = TimeUtils.getLastMonthLastDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 14://上周用电分项排名；
                        tablename = "Monthly";
                        now = DateTime.Now;
                        datestart = TimeUtils.getLastWeekFirstDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        dateend = TimeUtils.getLastWeekLastDay(now).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                        //case 4:
                        //    tablename = "Daily";
                        //    dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        //    datestart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        //    break;
                }
                //if (datatypeid == 12 || datatypeid == 13)
                //    tablename = "Daily";
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                string mL = "", mR = "";
                ////按设备和配电房统计时，选出最大值
                //if (cid.Equals("") || cid.Equals(0))
                //{
                //    mL = "max(";
                //    mR = ")";
                //}
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 1: //电流
                        DataType = " RecordTime,IsNull(" + mL + "ACurrent" + mR + ",0.404) Aphase,IsNull(" + mL + "BCurrent" + mR + ",0.404) Bphase,IsNull(" + mL + "CCurrent" + mR + ",0.404) Cphase";
                        break;
                    case 2: //电压
                        DataType = " RecordTime,IsNull(" + mL + "AVoltage" + mR + ",0.404) Aphase,IsNull(" + mL + "BVoltage" + mR + ",0.404) Bphase,IsNull(" + mL + "CVoltage" + mR + ",0.404) Cphase";
                        break;
                    case 3: //功率因数
                        DataType = " RecordTime,IsNull(" + mL + "AFactor" + mR + ",0.404) Aphase,IsNull(" + mL + "BFactor" + mR + ",0.404) Bphase,IsNull(" + mL + "CFactor" + mR + ",0.404) Cphase";
                        break;
                    case 4: //电流三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceIa" + mR + ",0.404) Aphase";
                        break;
                    case 5: //电压三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceUa" + mR + ",0.404) Aphase";
                        break;
                    case 6: //最大总相功率因数
                        DataType = " RecordTime,IsNull(" + mL + "Factor" + mR + ",0.404) Aphase";
                        break;
                    case 7: //最大负载率
                        DataType = " RecordTime,IsNull(" + mL + "PowerRate" + mR + ",0.404) Aphase";
                        break;
                    case 8: //线损
                        DataType = " RecordTime,IsNull(" + mL + "EnergyLoss" + mR + ",0.404) Aphase,IsNull(" + mL + "Power" + mR + ",0.404) Bphase";
                        break;
                    case 9: //谐波
                        DataType = " RecordTime,IsNull(" + mL + "Harmonic" + mR + ",0.404) Aphase";
                        break;
                    case 10: //负载
                        DataType = " RecordTime,IsNull(" + mL + "Power" + mR + ",0.404) Aphase";
                        break;
                    case 11: //最高温度
                        DataType = " RecordTime,IsNull(" + mL + "MaxTemperature" + mR + ",0.404) Aphase";
                        break;
                    case 12: //用电量
                        //DataType = " RecordTime,IsNull(" + mL + "UsePower" + mR + ",0.404) Aphase";
                        DataType = "UsePower ";
                        break;
                    case 13: //需量
                        DataType = " RecordTime,IsNull(" + mL + "NeedPower" + mR + ",0.404) Aphase";
                        break;
                }
                string strsql = "select distinct a.RecordTime,a." + DataType + " Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from " + tabname + " a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a." + DataType + " is not null";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid";
                }
                if (!did.Equals("") && !did.Equals(0))
                {
                    strsql += " and a.did=" + did;
                }
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and a.cid=" + cid;
                }
                if (!string.IsNullOrEmpty(userType))
                {
                    strsql += " and b.userType='" + userType + "' ";
                }
                if (!string.IsNullOrEmpty(areaType))
                {
                    strsql += " and b.areaType='" + areaType + "' ";
                }
                if (!string.IsNullOrEmpty(itemType))
                {
                    strsql += " and b.itemType='" + itemType + "' ";
                }
                strsql = addCidsLimit(cidsType, strsql, pid);
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = strsql + " and a.RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = strsql + " and a.RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                if (cid.Equals("") || cid.Equals(0))
                {
                    strsql += "   ORDER BY Aphase desc";
                    strsqlm += " ORDER BY Aphase desc";
                    strsqly += "  ORDER BY Aphase";
                }
                List<PowerData> list = bll.ExecuteStoreQuery<PowerData>(strsql).ToList();
                string yAxis = "", series1 = "", series2 = "", series3 = "";
                Dictionary<string, decimal> dvalue = rebuildData(list);
                int inn = 0;
                foreach (var item in dvalue.Take(6).OrderBy(p=>p.Value))
                {
                    if (inn < 6)
                    {
                        yAxis += item.Key + ",";
                        series1 += item.Value + ",";
                        inn++;
                    }
                }

                if (datatypeid == 12)//电量计算
                {
                    List<PowerData> listm = bll.ExecuteStoreQuery<PowerData>(strsqlm).ToList(); //上月同期
                    Dictionary<string, decimal> dvalue2 = rebuildData(listm);
                    int i = 0;
                    if (listm.Count > 0)
                        foreach (var item in dvalue2.Take(6).OrderBy(p => p.Value))
                        {
                            if (i < 6)
                            {
                                series2 += item.Value + ",";
                                i++;
                            }
                        }
                    List<PowerData> listy = bll.ExecuteStoreQuery<PowerData>(strsqly).ToList();//去年同期
                    Dictionary<string, decimal> dvalue3 = rebuildData(listy);
                    if (listy.Count > 0)
                        foreach (var item in dvalue3)
                        {
                            series3 += item.Value + ",";
                        }

                    result = "{\"yAxis\":\"" + yAxis.TrimEnd(',') + "\",\"series1\":\"" + series1.TrimEnd(',') + "\",\"series2\":\"" + series2.TrimEnd(',') + "\"}";

                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }

        public ActionResult test()
        {
            return Content("fdsfdsf");
        }
        public ActionResult wxPowerQualityData(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline, string userType, string areaType, string itemType, int gradeType)
        {
            return Content(getPowerQualityData_SSQX(pid, did, cid, totaltype, datatypeid, datestart, dateend, aline, eline, userType, areaType, itemType, gradeType));
        }

        /// <summary>
        ///  //用电量实时曲线  当天
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="did"></param>
        /// <param name="cid">回路ID</param>
        /// <param name="totaltype">时间类型：最近一天、最近一周、最近一月</param>
        /// <param name="datatypeid">数据类型：功率、电流。。。。</param>
        /// <param name="datestart">开始时间</param>
        /// <param name="dateend">结束时间</param>
        /// <param name="aline"></param>
        /// <param name="eline"></param>
        /// <returns></returns>
        public string getPowerQualityData_SSQX(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline, string userType, string areaType, string itemType, int gradeType, int cidsType = 1)
        {
            string result = "";
            try
            {
                string tablename = "";
                List<string> litTime = new List<string>();
                string Unit = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:00");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:00");
                        for (DateTime d=DateTime.Now.AddDays(-1); d < DateTime.Now; d=d.AddHours(1))
                        {
                            litTime.Add(d.ToString("MM-dd HH:00"));
                        }
                        break;
                    case 1:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:00");
                        datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:00");
                        for (DateTime d = DateTime.Now.AddDays(-7); d < DateTime.Now; d = d.AddHours(1))
                        {
                            litTime.Add(d.ToString("MM-dd HH:00"));
                        }
                        break;
                    case 2:
                        tablename = "Monthly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
                        for (DateTime d = DateTime.Now.AddMonths(-1); d < DateTime.Now; d = d.AddDays(1))
                        {
                            litTime.Add(d.ToString("MM-dd 00:00"));
                        }
                        break;
                }
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                string mL = "", mR = "";
                ////按设备和配电房统计时，选出最大值
                //if (cid.Equals("") || cid.Equals(0))
                //{
                //    mL = "max(";
                //    mR = ")";
                //}
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 1: //电流
                        //DataType = " RecordTime,IsNull(" + mL + "ACurrent" + mR + ",0.404) Aphase,IsNull(" + mL + "BCurrent" + mR + ",0.404) Bphase,IsNull(" + mL + "CCurrent" + mR + ",0.404) Cphase";
                        DataType = "ACurrent";
                        break;
                    case 2: //电压
                        //DataType = " RecordTime,IsNull(" + mL + "AVoltage" + mR + ",0.404) Aphase,IsNull(" + mL + "BVoltage" + mR + ",0.404) Bphase,IsNull(" + mL + "CVoltage" + mR + ",0.404) Cphase";
                        DataType = "AVoltage";
                        Unit = "kV";
                        break;
                    case 3: //功率因数
                        //DataType = " RecordTime,IsNull(" + mL + "AFactor" + mR + ",0.404) Aphase,IsNull(" + mL + "BFactor" + mR + ",0.404) Bphase,IsNull(" + mL + "CFactor" + mR + ",0.404) Cphase";
                        DataType = "Factor";
                        break;
                    case 4: //电流三相不平衡
                        //DataType = " RecordTime,IsNull(" + mL + "UnBalanceIa" + mR + ",0.404) Aphase";
                        DataType = "UnBalanceIa";
                        break;
                    case 5: //电压三相不平衡
                        //DataType = " RecordTime,IsNull(" + mL + "UnBalanceUa" + mR + ",0.404) Aphase";
                        DataType = "UnBalanceUa";
                        break;
                    case 6: //最大总相功率因数
                        //DataType = " RecordTime,IsNull(" + mL + "Factor" + mR + ",0.404) Aphase";
                        DataType = "Factor";
                        break;
                    case 7: //最大负载率
                        //DataType = " RecordTime,IsNull(" + mL + "PowerRate" + mR + ",0.404) Aphase";
                        DataType = "PowerRate";
                        break;
                    case 8: //线损
                        //DataType = " RecordTime,IsNull(" + mL + "EnergyLoss" + mR + ",0.404) Aphase,IsNull(" + mL + "Power" + mR + ",0.404) Bphase";
                        DataType = "EnergyLoss";
                        break;
                    case 9: //谐波
                        //DataType = " RecordTime,IsNull(" + mL + "Harmonic" + mR + ",0.404) Aphase";
                        DataType = "Harmonic";
                        break;
                    case 10: //负载
                        //DataType = " RecordTime,IsNull(" + mL + "Power" + mR + ",0.404) Aphase";
                        DataType = "Power";
                        break;
                    case 11: //最高温度
                        //DataType = " RecordTime,IsNull(" + mL + "MaxTemperature" + mR + ",0.404) Aphase";
                        DataType = "MaxTemperature";
                        break;
                    case 12: //用电量
                        //DataType = " RecordTime,IsNull(" + mL + "UsePower" + mR + ",0.404) Aphase";
                        DataType = "UsePower ";
                        break;
                    case 13: //需量
                        //DataType = " RecordTime,IsNull(" + mL + "NeedPower" + mR + ",0.404) Aphase";
                        DataType = "NeedPower ";
                        break;
                }
                string strsql = "select a.RecordTime,a." + DataType + " Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from " + tabname + " a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a." + DataType + " is not null";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                }
                if (!did.Equals("") && !did.Equals(0))
                {
                    strsql += " and a.did=" + did;
                }
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and a.cid=" + cid;
                }
                strsql = addCidsLimit(cidsType, strsql, pid);
                if (!string.IsNullOrEmpty(userType))
                {
                    strsql += " and b.userType='" + userType + "' ";
                }
                if (!string.IsNullOrEmpty(areaType))
                {
                    strsql += " and b.areaType='" + areaType + "' ";
                }
                if (!string.IsNullOrEmpty(itemType))
                {
                    strsql += " and b.itemType='" + itemType + "' ";
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                if (cid.Equals("") || cid.Equals(0))
                {
                    strsql += "   ORDER BY a.CID,RecordTime";
                    strsqlm += " ORDER BY a.CID,RecordTime";
                    strsqly += "  ORDER BY a.CID,RecordTime";
                }

                if (datatypeid == 2)
                {
                    string sqlU = "select c.单位 as unit from " + tabname + " a,t_DM_CircuitInfo b,t_CM_PointsInfo c where 1 = 1 and a.CID=c.CID and a.PID=c.PID and a.CID = b.cid and a." + DataType + " is not null";
                    sqlU += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                    sqlU += " and c.DataTypeID IN (3,56)";
                    if (!pid.Equals(""))
                    {
                        sqlU += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    if (!did.Equals("") && !did.Equals(0))
                    {
                        sqlU += " and a.did=" + did;
                    }
                    if (!cid.Equals("") && !cid.Equals(0))
                    {
                        sqlU += " and a.cid=" + cid;
                    }
                    var mV = bll.ExecuteStoreQuery<antisUnit>(sqlU).FirstOrDefault();
                    if (mV != null)
                        Unit = mV.unit;
                }

                List<PowerData_SSQX> list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                string xAxis = "", yAxis = "", series1 = "", series2 = "", CName = "", yData = "";

                List<int> litCid = new List<int>();
               
                list = list.OrderBy(p => p.RecordTime).ToList();
                foreach(var t in litTime)
                {
                    xAxis += t + ",";
                }
                foreach (PowerData_SSQX mod in list)
                {
                    if (mod.Aphase < 0)
                        continue;

                    //if (xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")) == false)
                    //{
                    //    xAxis += mod.RecordTime.ToString("MM-dd HH:mm") + ",";
                    //    litTime.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                    //}
                    if (litCid.Contains(mod.CID) == false)
                    {
                        //限制最多10个回路显示
                        if (litCid.Count() > 10)
                            break;

                        CName += "\"" + mod.CName + "\",";
                        litCid.Add(mod.CID);

                        //if (yData.Equals("") == false)
                        //{
                        //    yData = yData.TrimEnd(',') + "\",\"";
                        //}
                    }

                    //yData += mod.Aphase + ",";                    
                }

                Hashtable hashYData = new Hashtable();
                foreach (string modTime in litTime)
                {
                    foreach (int modCid in litCid)
                    {
                        List<PowerData_SSQX> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }
                    }
                }

                for (int i = 0; i < litCid.Count; i++)
                {
                    if (i < (litCid.Count - 1))
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                    }
                }

                result = "{\"CName\":[" + CName.TrimEnd(',') + "],\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"yData\":[\"" + yData.TrimEnd(',') + "\"],\"Unit\":\"" + Unit + "\"}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }

        public class antisUnit
        {
            public string unit { get; set; }
        }
        /// <summary>
        ///  //用电量实时曲线  当天
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="did"></param>
        /// <param name="cid">回路ID</param>
        /// <param name="totaltype">时间类型：最近一天、最近一周、最近一月</param>
        /// <param name="datatypeid">数据类型：功率、电流。。。。</param>
        /// <param name="datestart">开始时间</param>
        /// <param name="dateend">结束时间</param>
        /// <param name="aline"></param>
        /// <param name="eline"></param>
        /// <returns></returns>
        public string getPowerQualityData_SSQXS(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline, string userType, string areaType, string itemType, int gradeType, int cidsType = 1)
        {
            string result = "";
            try
            {
                string tablename = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 1:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 2:
                        tablename = "Monthly";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                }
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                string mL = "", mR = "";
                ////按设备和配电房统计时，选出最大值
                //if (cid.Equals("") || cid.Equals(0))
                //{
                //    mL = "max(";
                //    mR = ")";
                //}
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 1: //电流
                        //DataType = " RecordTime,IsNull(" + mL + "ACurrent" + mR + ",0.404) Aphase,IsNull(" + mL + "BCurrent" + mR + ",0.404) Bphase,IsNull(" + mL + "CCurrent" + mR + ",0.404) Cphase";
                        DataType = "ACurrent";
                        break;
                    case 2: //电压
                        //DataType = " RecordTime,IsNull(" + mL + "AVoltage" + mR + ",0.404) Aphase,IsNull(" + mL + "BVoltage" + mR + ",0.404) Bphase,IsNull(" + mL + "CVoltage" + mR + ",0.404) Cphase";
                        DataType = "AVoltage";
                        break;
                    case 3: //功率因数
                        //DataType = " RecordTime,IsNull(" + mL + "AFactor" + mR + ",0.404) Aphase,IsNull(" + mL + "BFactor" + mR + ",0.404) Bphase,IsNull(" + mL + "CFactor" + mR + ",0.404) Cphase";
                        DataType = "Factor";
                        break;
                    case 4: //电流三相不平衡
                        //DataType = " RecordTime,IsNull(" + mL + "UnBalanceIa" + mR + ",0.404) Aphase";
                        DataType = "UnBalanceIa";
                        break;
                    case 5: //电压三相不平衡
                        //DataType = " RecordTime,IsNull(" + mL + "UnBalanceUa" + mR + ",0.404) Aphase";
                        DataType = "UnBalanceUa";
                        break;
                    case 6: //最大总相功率因数
                        //DataType = " RecordTime,IsNull(" + mL + "Factor" + mR + ",0.404) Aphase";
                        DataType = "Factor";
                        break;
                    case 7: //最大负载率
                        //DataType = " RecordTime,IsNull(" + mL + "PowerRate" + mR + ",0.404) Aphase";
                        DataType = "PowerRate";
                        break;
                    case 8: //线损
                        //DataType = " RecordTime,IsNull(" + mL + "EnergyLoss" + mR + ",0.404) Aphase,IsNull(" + mL + "Power" + mR + ",0.404) Bphase";
                        DataType = "EnergyLoss";
                        break;
                    case 9: //谐波
                        //DataType = " RecordTime,IsNull(" + mL + "Harmonic" + mR + ",0.404) Aphase";
                        DataType = "Harmonic";
                        break;
                    case 10: //负载
                        //DataType = " RecordTime,IsNull(" + mL + "Power" + mR + ",0.404) Aphase";
                        DataType = "Power";
                        break;
                    case 11: //最高温度
                        //DataType = " RecordTime,IsNull(" + mL + "MaxTemperature" + mR + ",0.404) Aphase";
                        DataType = "MaxTemperature";
                        break;
                    case 12: //用电量
                        //DataType = " RecordTime,IsNull(" + mL + "UsePower" + mR + ",0.404) Aphase";
                        DataType = "UsePower ";
                        break;
                    case 13: //需量
                        //DataType = " RecordTime,IsNull(" + mL + "NeedPower" + mR + ",0.404) Aphase";
                        DataType = "NeedPower ";
                        break;
                }
                string strsql = "select a.RecordTime,a." + DataType + " Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType,LEFT(a.RecordTime,10) as RQ  from " + tabname + " a,t_DM_CircuitInfo b where 1=1 and a.CID = b.cid and a." + DataType + " is not null";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                }
                if (!did.Equals("") && !did.Equals(0))
                {
                    strsql += " and a.did=" + did;
                }
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and a.cid=" + cid;
                }
                strsql = addCidsLimit(cidsType, strsql, pid);
                if (!string.IsNullOrEmpty(userType))
                {
                    strsql += " and b.userType='" + userType + "' ";
                }
                if (!string.IsNullOrEmpty(areaType))
                {
                    strsql += " and b.areaType='" + areaType + "' ";
                }
                if (!string.IsNullOrEmpty(itemType))
                {
                    strsql += " and b.itemType='" + itemType + "' ";
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = strsql + "and a.RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and a.RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    strsql += " and a.RecordTime >='" + datestart + "' and a.RecordTime <='" + dateend + "'";
                }
                //if (cid.Equals("") || cid.Equals(0))
                //{
                //    strsql += "   ORDER BY a.CID,RecordTime";
                //    strsqlm += " ORDER BY a.CID,RecordTime";
                //    strsqly += "  ORDER BY a.CID,RecordTime";
                //}


                strsql = "select MAX(Aphase)as MAXS,MIN(Aphase)as MINS,AVG(Aphase)as AVGS, RQ,CName from (" + strsql + ") as newTable  group by RQ,CName";

                List<PowerData_SSQXS> list = bll.ExecuteStoreQuery<PowerData_SSQXS>(strsql).ToList();
                string xAxis = "", yAxis = "", series1 = "", series2 = "", CName = "", yData = "";

                List<int> litCid = new List<int>();
                List<string> litTime = new List<string>();
                //list1.IndexOf()

                foreach (PowerData_SSQXS mod in list)
                {
                    mod.RQ = ChangeStringToTime(mod.RQ);
                    mod.MAXS =decimal.Parse( mod.MAXS.ToString("f3"));
                    mod.MINS = decimal.Parse(mod.MINS.ToString("f3"));
                    mod.AVGS = decimal.Parse(mod.AVGS.ToString("f3"));

                    if (mod.Aphase < 0)
                        continue;

                    if (xAxis.Contains(mod.RecordTime.ToString("MM-dd HH:mm")) == false)
                    {
                        xAxis += mod.RecordTime.ToString("MM-dd HH:mm") + ",";
                        litTime.Add(mod.RecordTime.ToString("MM-dd HH:mm"));
                    }
                    if (litCid.Contains(mod.CID) == false)
                    {
                        //限制最多10个回路显示
                        if (litCid.Count() > 10)
                            break;

                        CName += "\"" + mod.CName + "\",";
                        litCid.Add(mod.CID);

                        //if (yData.Equals("") == false)
                        //{
                        //    yData = yData.TrimEnd(',') + "\",\"";
                        //}
                    }

                    //yData += mod.Aphase + ",";                    
                }

                Hashtable hashYData = new Hashtable();
                foreach (string modTime in litTime)
                {
                    foreach (int modCid in litCid)
                    {
                        List<PowerData_SSQXS> ListTemp = list.Where(m => m.RecordTime.ToString("MM-dd HH:mm").Equals(modTime) && m.CID == modCid).ToList();
                        string sVal = "";
                        if (ListTemp.Count > 0)
                        {
                            sVal = ListTemp[0].Aphase.ToString();
                        }
                        //
                        if (hashYData.Contains(modCid))
                        {
                            hashYData[modCid] += "," + sVal;
                        }
                        else
                        {
                            hashYData.Add(modCid, sVal);
                        }
                    }
                }

                for (int i = 0; i < litCid.Count; i++)
                {
                    if (i < (litCid.Count - 1))
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',') + "\",\"";
                    }
                    else
                    {
                        yData += hashYData[litCid[i]].ToString().TrimEnd(',');
                    }
                }

                result = Common.List2Json(list, list.Count, 1);
                //result = "{\"CName\":[" + CName.TrimEnd(',') + "],\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"yData\":[\"" + yData.TrimEnd(',') + "\"]}";

            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "";
            }
            return result;
        }

        public string ChangeStringToTime(string strTime)
        {
            if (strTime != "" && strTime != null)
            {
                //strTime = strTime.Trim(' ');
                string year = strTime.Substring(6, 4);
                string month = strTime.Substring(0, 2);
                string day = strTime.Substring(3, 2);
                return year + "-" + month + "-" + day;
            }
            else
            {
                return "";
            }
        }


        /// <param name="typecids">回路组类型：1.总用电趋势回路组;2.昨天总用电回路组;3.昨天用电分项排名回路组</param>
        ///0：自动抄表回路组
        ///1：总用电趋势回路组
        ///2：昨天总用电回路组
        ///3：昨天用电分项排名回路组
        private string addCidsLimit(int cid_type, string strsql, int pid)
        {
            List<t_EE_PowerReportConfig> config = bll.ExecuteStoreQuery<t_EE_PowerReportConfig>("SELECT * FROM t_EE_PowerReportConfig WHERE pid=" + pid + " AND cid_type_id=" + cid_type).ToList();
            if (config != null && config.Count > 0 && config.First().cid != null && config.First().cid != "")
                strsql += " AND b.CID IN (" + config.First().cid + ") ";
            else
                strsql += " AND b.CID IN (0)";
            return strsql;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="pid">站室ID</param>
        /// <param name="did">设备ID</param>
        /// <param name="totaltype">统计类型：Daily,Monthly,Yearly</param>       
        /// <param name="datatypeid">数据类型</param>
        /// <param name="datestart">自定义统计：起始时间</param>
        /// <param name="dateend">结束时间</param>
        /// <returns></returns>
        //曲线数值
        public string PowerQualityData(int pid, int did, int cid, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline)
        {
            string result = "";
            try
            {
                string tablename = "";
                switch (totaltype)
                {
                    case 0:
                        tablename = "RealTime";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 1:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 2:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                    case 3:
                        int DayCount = (Convert.ToDateTime(dateend) - Convert.ToDateTime(datestart)).Days;
                        if (DayCount > 7)
                            tablename = "Daily";
                        else
                        {
                            tablename = "RealTime";
                            dateend = Convert.ToDateTime(dateend).ToString("yyyy-MM-dd 23:59:59");
                            datestart = Convert.ToDateTime(datestart).ToString("yyyy-MM-dd  00:00:00");
                        }
                        break;
                    case 4:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                        datestart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                        break;
                }
                if (datatypeid == 12 || datatypeid == 13)
                    tablename = "Daily";
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                string mL = "", mR = "";
                //按设备和配电房统计时，选出最大值
                if (cid.Equals("") || cid.Equals(0))
                {
                    mL = "max(";
                    mR = ")";
                }
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 1: //电流
                        DataType = " RecordTime,IsNull(" + mL + "ACurrent" + mR + ",0.404) Aphase,IsNull(" + mL + "BCurrent" + mR + ",0.404) Bphase,IsNull(" + mL + "CCurrent" + mR + ",0.404) Cphase";
                        break;
                    case 2: //电压
                        DataType = " RecordTime,IsNull(" + mL + "AVoltage" + mR + ",0.404) Aphase,IsNull(" + mL + "BVoltage" + mR + ",0.404) Bphase,IsNull(" + mL + "CVoltage" + mR + ",0.404) Cphase";
                        break;
                    case 3: //功率因数
                        DataType = " RecordTime,IsNull(" + mL + "AFactor" + mR + ",0.404) Aphase,IsNull(" + mL + "BFactor" + mR + ",0.404) Bphase,IsNull(" + mL + "CFactor" + mR + ",0.404) Cphase";
                        break;
                    case 4: //电流三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceIa" + mR + ",0.404) Aphase";
                        break;
                    case 5: //电压三相不平衡
                        DataType = " RecordTime,IsNull(" + mL + "UnBalanceUa" + mR + ",0.404) Aphase";
                        break;
                    case 6: //最大总相功率因数
                        DataType = " RecordTime,IsNull(" + mL + "Factor" + mR + ",0.404) Aphase";
                        break;
                    case 7: //最大负载率
                        DataType = " RecordTime,IsNull(" + mL + "PowerRate" + mR + ",0.404) Aphase";
                        break;
                    case 8: //线损
                        DataType = " RecordTime,IsNull(" + mL + "EnergyLoss" + mR + ",0.404) Aphase,IsNull(" + mL + "Power" + mR + ",0.404) Bphase";
                        break;
                    case 9: //谐波
                        DataType = " RecordTime,IsNull(" + mL + "Harmonic" + mR + ",0.404) Aphase";
                        break;
                    case 10: //负载
                        DataType = " RecordTime,IsNull(" + mL + "Power" + mR + ",0.404) Aphase";
                        break;
                    case 11: //最高温度
                        DataType = " RecordTime,IsNull(" + mL + "MaxTemperature" + mR + ",0.404) Aphase";
                        break;
                    case 12: //用电量
                        DataType = " RecordTime,IsNull(" + mL + "UsePower" + mR + ",0.404) Aphase";
                        break;
                    case 13: //需量
                        DataType = " RecordTime,IsNull(" + mL + "NeedPower" + mR + ",0.404) Aphase";
                        break;
                }
                string strsql = "select " + DataType + " from " + tabname + " where 1=1 ";
                string strsqlm = "", strsqly = "";
                if (!pid.Equals(""))
                {
                    strsql += " and pid=" + pid;
                }
                if (!did.Equals("") && !did.Equals(0))
                {
                    strsql += " and did=" + did;
                }
                if (!cid.Equals("") && !cid.Equals(0))
                {
                    strsql += " and cid=" + cid;
                }
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(dateend))
                {
                    strsqlm = strsql + "and RecordTime >='" + Convert.ToDateTime(datestart).AddMonths(-1) + "' and RecordTime <='" + Convert.ToDateTime(dateend).AddMonths(-1) + "'";
                    strsqly = strsql + "and RecordTime >='" + Convert.ToDateTime(datestart).AddYears(-1) + "' and RecordTime <='" + Convert.ToDateTime(dateend).AddYears(-1) + "'";
                    strsql += " and RecordTime >='" + datestart + "' and RecordTime <='" + dateend + "'";
                }
                if (cid.Equals("") || cid.Equals(0))
                {
                    strsql += "  group by RecordTime ORDER BY RecordTime";
                    strsqlm += " group by RecordTime ORDER BY RecordTime";
                    strsqly += "  group by RecordTime ORDER BY RecordTime";
                }
                List<PowerData> list = bll.ExecuteStoreQuery<PowerData>(strsql).ToList();
                string xAxis = "", DataA = "", DataB = "", DataC = "";
                decimal Max = 999999, Min = 0, Average = 0, AlarmTotal = 0;
                decimal Sum = 0, Sumy = 0, Summ = 0;
                List<decimal> Values = new List<decimal>();
                foreach (PowerData mod in list)
                {
                    xAxis += DateFormat(mod.RecordTime, totaltype) + ",";
                    if (datatypeid < 4)
                    {
                        DataA += ValueFormat(mod.Aphase) + ",";
                        DataB += ValueFormat(mod.Bphase) + ",";
                        DataC += ValueFormat(mod.Cphase) + ",";
                        Values.Add(mod.Aphase);
                        Values.Add(mod.Bphase);
                        Values.Add(mod.Cphase);
                    }
                    else if (datatypeid == 8)
                    {
                        DataA += ValueFormat(mod.Aphase) + ",";
                        DataB += ValueFormat(mod.Bphase) + ",";
                        Values.Add(mod.Aphase);
                        Values.Add(mod.Bphase);
                    }
                    else
                    {
                        DataA += ValueFormat(mod.Aphase) + ",";
                        Values.Add(mod.Aphase);

                    }

                    if (datatypeid == 3 && (mod.Aphase < 0.9M || mod.Bphase < 0.9M || mod.Cphase < 0.9M))
                    {
                        AlarmTotal += 1;
                    }

                    if (datatypeid == 12)
                        Sum += mod.Aphase;
                }
                Values = Values.Where(v => v != 0.404m).ToList();
                if (Values.Count > 0)
                {
                    Max = Values.Max();
                    Min = Values.Min();
                    Average = Values.Average();
                }
                else
                {
                    Max = 10;
                    Min = 0;
                    Average = 0;
                }
                //报警线作成
                string AlarmData = "";
                //额定值
                string ElarmData = "";

                string Astrsql = "SELECT TOP 1 * FROM t_CM_PointsInfo where PID = " + pid + " and DID = " + did + " and DataTypeID = 2 order by ABCID";
                List<t_CM_PointsInfo> Alist = bll.ExecuteStoreQuery<t_CM_PointsInfo>(Astrsql).ToList();
                if (Alist.Count > 0)
                {
                    AlarmData = Alist[0].报警上限1 + "";
                    ElarmData = Alist[0].码值上限 + "";
                }

                string yData = "";
                if (!DataA.Equals(""))
                    yData += "\"" + DataA.TrimEnd(',') + "\",";
                if (!DataB.Equals(""))
                    yData += "\"" + DataB.TrimEnd(',') + "\",";
                if (!DataC.Equals(""))
                    yData += "\"" + DataC.TrimEnd(',') + "\",";


                double Capacity = 0;
                string HappenTime = "";
                if (datatypeid == 13)//需量分析
                {
                    List<t_DM_DeviceInfo> devicelist = bll.t_DM_DeviceInfo.Where(s => s.DID == did).ToList();
                    if (devicelist.Count > 0)
                        Capacity = Convert.ToDouble(devicelist[0].Z);

                    List<PowerData> dlist = list.Where(x => x.Aphase == Max).ToList();
                    if (dlist.Count > 0)
                        HappenTime = dlist[0].RecordTime.ToString("yyyy-MM-dd hh:mm:ss");
                }


                string Datam = "", Datay = "";
                List<decimal> Valuem = new List<decimal>();
                List<decimal> Valuey = new List<decimal>();
                if (datatypeid == 12)//用电分析
                {
                    List<PowerData> listm = bll.ExecuteStoreQuery<PowerData>(strsqlm).ToList(); //上月同期
                    if (listm.Count > 0)
                        foreach (var item in listm)
                        {
                            Sumy += item.Aphase;
                            Datam += ValueFormat(item.Aphase) + ",";
                            Valuem.Add(item.Aphase);
                        }
                    List<PowerData> listy = bll.ExecuteStoreQuery<PowerData>(strsqly).ToList();//去年同期
                    if (listy.Count > 0)
                        foreach (var item in listy)
                        {
                            Summ += item.Aphase;
                            Datay += ValueFormat(item.Aphase) + ",";
                            Valuem.Add(item.Aphase);
                        }
                }
                decimal TongBi = Math.Round((Summ - Sum) / Summ, 2);
                decimal HuanBi = Math.Round((Sumy - Sum) / Sumy, 2);

                result = "{\"xAxis\":\"" + xAxis.TrimEnd(',') + "\",\"yData\":[" + yData.TrimEnd(',') + "],\"Max\":\"" + Max + "\",\"Min\":\"" + Min + "\",\"Average\":\"" + Average + "\",\"AlarmTotal\":\"" + AlarmTotal + "\",\"AValue\":\"" + AlarmData + "\",\"EValue\":\"" + ElarmData + "\",\"Capacity\":\"" + Capacity + "\",\"HappenTime\":\"" + HappenTime + "\",\"Datam\":\"" + Datam + "\",\"Datay\":\"" + Datay + "\",\"Sum\":\"" + Sum + "\",\"Summ\":\"" + Summ + "\",\"Sumy\":\"" + Sumy + "\",\"TongBi\":\"" + TongBi + "\",\"HuanBi\":\"" + HuanBi + "\"}";
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return result;
        }
        public class PowerData_SSQX
        {
            public DateTime RecordTime { get; set; }
            public decimal Aphase { get; set; }
            public int CID { get; set; }
            public string CName { get; set; }
            public string UserType { get; set; }
            public string AreaType { get; set; }
            public string ItemType { get; set; }
        }

        public class PowerData_SSQXS
        {
            public DateTime RecordTime { get; set; }
            public decimal Aphase { get; set; }
            public int CID { get; set; }
            public string CName { get; set; }
            public string UserType { get; set; }
            public string AreaType { get; set; }
            public string ItemType { get; set; }
            public decimal MAXS { get; set; }
            public decimal MINS { get; set; }
            public decimal AVGS { get; set; }
            public string RQ { get; set; }

        }
        public class PowerData
        {
            public DateTime RecordTime { get; set; }
            public decimal Aphase { get; set; }
            public decimal Bphase { get; set; }
            public decimal Cphase { get; set; }
            public string CName { get; set; }
        }
        //日期格式化
        private string DateFormat(DateTime date, int totaltype)
        {
            string Value = "";
            if (totaltype == 0)
            {
                Value = date.ToString("HH:mm");
            }
            else
            {
                Value = date.ToString("MM-dd HH:mm");
            }
            return Value;
        }
        //数值格式化,过滤null和一些异常数值
        private string ValueFormat(decimal value)
        {
            string Value = "";
            if (value == 0.404m)
            {
                Value = "-";
            }
            else
            {
                Value = Math.Round(value, 1).ToString();
            }
            return Value;
        }
        //电能分析，散点图，柱状图取值
        public string PowerQualityAnalysis(int pid, int did, int totaltype, int datatypeid, string datestart, string dateend)
        {
            string result = "";
            try
            {
                string tablename = "";
                int DayCount = 0;
                switch (totaltype)
                {
                    case 0:
                        tablename = "RealTime";
                        DayCount = 1;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 1:
                        tablename = "Daily";
                        DayCount = 7;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 2:
                        tablename = "Daily";
                        DayCount = 30;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 3:
                        tablename = "Daily";
                        break;
                    case 4:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                }
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                decimal LineValue = 0;//越限值
                string xAxis = "", Data = "", Total = "";
                switch (datatypeid)   //0.404为错误码，表示该字段值为空
                {
                    case 4: //电流三相不平衡
                        DataType = " RecordTime,IsNull(UnBalanceIa,0.404) Aphase";
                        LineValue = 30;
                        break;
                    case 5: //电压三相不平衡
                        DataType = " RecordTime,IsNull(UnBalanceUa,0.404) Aphase";
                        LineValue = 30;
                        break;
                    case 7: //最大负载率
                        DataType = " RecordTime,IsNull(PowerRate,0.404) Aphase";
                        LineValue = 0;
                        break;
                    case 10: //负载
                        DataType = " RecordTime,IsNull(Power,0.404) Aphase";
                        LineValue = 0;
                        break;
                }
                string strsql = "select " + DataType + " from " + tabname + " where 1=1 ";
                if (!pid.Equals(""))
                {
                    strsql += " and pid=" + pid;
                }
                if (did != 0)
                {
                    strsql += " and did=" + did;
                }
                if (!string.IsNullOrEmpty(datestart))
                {
                    strsql += " and RecordTime >='" + datestart + "'";
                }
                if (!string.IsNullOrEmpty(dateend))
                {
                    strsql += " and RecordTime <='" + dateend + "'";
                }
                List<PowerData> list = bll.ExecuteStoreQuery<PowerData>(strsql).ToList();
                for (int i = DayCount; i >= 0; i--)
                {
                    string Date = "00";
                    decimal DayMax = 0;
                    xAxis += Convert.ToDateTime(dateend).AddDays(-i).ToString("MM-dd") + ",";
                    List<PowerData> Daylist = list.Where(r => r.RecordTime >= Convert.ToDateTime(dateend).AddDays(-i - 1) && r.RecordTime <= Convert.ToDateTime(dateend).AddDays(-i)).ToList();
                    List<PowerData> Tatallist = Daylist.Where(r => r.Aphase > LineValue).ToList();
                    if (Daylist.Count > 0)
                    {
                        foreach (PowerData mod in Daylist)
                        {
                            if (mod.Aphase > DayMax && mod.Aphase != 0.404m)
                            {
                                Date = Convert.ToDateTime(mod.RecordTime).ToString("HH");
                                DayMax = mod.Aphase;
                            }
                        }
                        Data += (DayCount - i) + "," + Date + "," + DayMax + "^";
                        Total += Tatallist.Count + ",";
                    }
                    else
                    {
                        Data += (DayCount - i) + "," + "00" + "," + "-" + "^";
                        Total += Tatallist.Count + ",";
                    }

                }
                result = xAxis.TrimEnd(',') + "$" + Data.TrimEnd('^') + "$" + Total.TrimEnd(',');
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return result;
        }
        //线损分析柱状图取值
        public string LineLossAnalysis(int pid, int totaltype, string datestart, string dateend)
        {
            string result = "";
            try
            {
                string tablename = "";
                int DayCount = 0;
                switch (totaltype)
                {
                    case 0:
                        tablename = "RealTime";
                        DayCount = 1;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");
                        datestart = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 1:
                        tablename = "Daily";
                        DayCount = 7;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 2:
                        tablename = "Daily";
                        DayCount = 30;
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                    case 3:
                        tablename = "Daily";
                        DayCount = (Convert.ToDateTime(dateend) - Convert.ToDateTime(datestart)).Days;
                        break;
                    case 4:
                        tablename = "Daily";
                        dateend = DateTime.Now.ToString("yyyy-MM-dd  23:59:59");
                        datestart = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd  00:00:00");
                        break;
                }
                string tabname = "t_EE_PowerQuality" + tablename;//t_EE_PowerQuality为通用名称，totaltype为统计类型
                string DataType = "";
                double LineValue = 0, LineLoss = 0, LineLoad = 0;//越限值,线损值，负载值
                string xAxis = "", LossTotal = "", LoadTotal = "";//x轴，线损值数组，负载值数值
                DataType = "*";
                string strsql = "select " + DataType + " from " + tabname + " where 1=1 ";
                if (!pid.Equals(""))
                {
                    strsql += " and pid=" + pid;  //测试完成后pid修改为变量
                }
                if (!string.IsNullOrEmpty(datestart))
                {
                    strsql += " and RecordTime >='" + datestart + "'";
                }
                if (!string.IsNullOrEmpty(dateend))
                {
                    strsql += " and RecordTime <='" + dateend + "'";
                }
                //配电房变压器
                List<t_DM_DeviceInfo> Devicelist = bll.t_DM_DeviceInfo.Where(d => d.PID == pid && d.DTID == 3).ToList();
                List<t_EE_PowerQualityMonthly> list = bll.ExecuteStoreQuery<t_EE_PowerQualityMonthly>(strsql).ToList();
                Random ran = new Random();
                ;
                foreach (t_DM_DeviceInfo Device in Devicelist)
                {
                    LineLoss = 0;
                    LineLoad = 0;
                    xAxis += Device.DeviceName + ",";
                    List<t_EE_PowerQualityMonthly> alist = list.Where(f => f.DID == Device.DID).OrderByDescending(m => m.RecordTime).ToList();
                    if (alist.Count > 0)
                    {
                        LineLoss = (double)alist[0].EnergyLoss;
                        LineLoad = (double)alist[0].Power;
                    }
                    LossTotal += LineLoss + ",";
                    LoadTotal += LineLoad + ",";
                }

                result = xAxis.TrimEnd(',') + "$" + LossTotal.TrimEnd(',') + "$" + LoadTotal.TrimEnd(',');
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return result;
        }
        //取报警值
        public string GetAlarmValue(int pid, int did, int datatypeid)
        {
            string result = "";
            string strsql = "SELECT TOP 1 * FROM t_CM_PointsInfo where PID = " + pid + " and DID = " + did + " and DataTypeID = " + datatypeid + " order by 报警上限1";
            List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(strsql).ToList();
            if (list.Count > 0)
            {
                result = list[0].TagName + "|" + list[0].报警上限1;
            }
            return result;
        }
        //按配电房统计
        public string TotalPDR(int pid, string did, int totaltype, int datatypeid, string datestart, string dateend, string aline, string eline)
        {
            string result = "";
            string[] eachDID = did.TrimEnd(',').Split(',');
            int first = 0;
            int ds = eachDID.Length;
            if (!eachDID.Equals(""))
            {
                List<double> Alist = new List<double>();
                List<double> Blist = new List<double>();
                List<double> Clist = new List<double>();
                double Mmax = 100, Mmin = 0;
                string X = "", Aa = "", Bb = "", Cc = "", Max = "", Min = "", Average = "", AlarmTotal = "", AlarmData = "";
                for (int y = 0; y < eachDID.Length; y++)
                {
                    int tDID = Convert.ToInt32(eachDID[y]);
                    string[] DDate = PowerQualityData(pid, tDID, 0, totaltype, datatypeid, datestart, dateend, aline, eline).Split('$');
                    if (DDate[0] != "")
                    {
                        string[] A = DDate[1].Split(',');
                        string[] B = DDate[2].Split(',');
                        string[] C = DDate[3].Split(',');
                        for (int w = 0; w < A.Length; w++)
                        {
                            if (first == 0)
                            {
                                X = DDate[0];
                                Average = DDate[6];
                                AlarmTotal = DDate[7];
                                AlarmData = DDate[8];

                                if (datatypeid < 4)
                                {
                                    Alist.Add(Convert.ToDouble(A[w]));
                                    Blist.Add(Convert.ToDouble(B[w]));
                                    Clist.Add(Convert.ToDouble(C[w]));
                                }
                                else if (datatypeid == 8)
                                {
                                    Alist.Add(Convert.ToDouble(A[w]));
                                    Blist.Add(Convert.ToDouble(B[w]));
                                }
                                else
                                {
                                    Alist.Add(Convert.ToDouble(A[w]));
                                }
                            }
                            else
                            {
                                if (datatypeid < 4)
                                {
                                    Alist[w] += Convert.ToDouble(A[w]);
                                    Blist[w] += Convert.ToDouble(B[w]);
                                    Clist[w] += Convert.ToDouble(C[w]);
                                }
                                else if (datatypeid == 8)
                                {
                                    Alist[w] += Convert.ToDouble(A[w]);
                                    Blist[w] += Convert.ToDouble(B[w]);
                                }
                                else
                                {
                                    Alist[w] += Convert.ToDouble(A[w]);
                                }
                            }
                        }
                        first++;
                    }
                }
                if (Alist.Count > 0)
                {
                    for (int a = 0; a < Alist.Count; a++)
                    {
                        if (datatypeid == 7)
                            Aa += Alist[a] / ds + ",";
                        else
                            Aa += Alist[a] + ",";
                    }
                    Mmax = Alist.Max();
                    Mmin = Alist.Min();
                }
                if (Blist.Count > 0)
                {
                    for (int a = 0; a < Blist.Count; a++)
                    {
                        if (datatypeid == 7)
                            Bb += Blist[a] / ds + ",";
                        else
                            Bb += Blist[a] + ",";
                    }
                    if (Blist.Max() > Mmax)
                        Mmax = Blist.Max();
                    if (Blist.Min() < Mmin)
                        Mmin = Blist.Min();
                }
                if (Clist.Count > 0)
                {
                    for (int a = 0; a < Alist.Count; a++)
                    {
                        if (datatypeid == 7)
                            Cc += Clist[a] / ds + ",";
                        else
                            Cc += Clist[a] + ",";
                    }
                    if (Clist.Max() > Mmax)
                        Mmax = Clist.Max();
                    if (Clist.Min() < Mmin)
                        Mmin = Clist.Min();
                }
                if (datatypeid == 7)
                {
                    Max = (Mmax / ds).ToString();
                    Min = (Mmin / ds).ToString();
                }
                else
                {
                    Max = Mmax.ToString();
                    Min = Mmin.ToString();
                }
                //报警线作成
                AlarmData = "";
                if (aline != "0")
                {
                    //if (datatypeid < 3)
                    //{
                    //    string Astrsql = "SELECT TOP 1 * FROM t_CM_PointsInfo where PID = " + pid + " and DID = " + did + " and DataTypeID = " + (datatypeid + 1) + " order by 报警上限1";
                    //    List<t_CM_PointsInfo> Alist = bll.ExecuteStoreQuery<t_CM_PointsInfo>(Astrsql).ToList();
                    //    if (Alist.Count > 0)
                    //    {
                    //        for (int i = 0; i < list.Count; i++)
                    //            AlarmData += Alist[0].报警上限1 + ",";
                    //        if (Alist[0].报警上限1 > Max)
                    //            Max = (double)Alist[0].报警上限1;
                    //    }
                    //}
                    if (datatypeid == 1)
                    {
                        for (int i = 0; i < Alist.Count; i++)
                            AlarmData += 33 + ",";
                    }
                    else if (datatypeid == 2)
                    {
                        for (int i = 0; i < Alist.Count; i++)
                            AlarmData += 220 + ",";
                    }
                    else if (datatypeid == 3)
                    {
                        for (int i = 0; i < Alist.Count; i++)
                            AlarmData += 0.9 + ",";
                    }
                    else if (datatypeid == 4)
                    {
                        for (int i = 0; i < Alist.Count; i++)
                            AlarmData += 30 + ",";
                    }
                    else
                    {
                        int v = (int)(Mmax * 1.03);
                        for (int i = 0; i < Alist.Count; i++)
                            AlarmData += v + ",";
                    }
                }
                result = X + "$" + Aa.TrimEnd(',') + "$" + Bb.TrimEnd(',') + "$" + Cc.TrimEnd(',') + "$" + Max + "$" + Min + "$" + Average + "$" + AlarmTotal + "$" + AlarmData;
            }
            return result;
        }
        //统计配电房变压器容量
        public string PDRDeviceDetail(int pid)
        {
            string Rec = "";
            double R = 0;
            List<t_DM_DeviceInfo> List = bll.t_DM_DeviceInfo.Where(s => s.PID == pid).ToList();
            foreach (t_DM_DeviceInfo d in List)
            {
                R += Convert.ToDouble(d.Z);
            }
            Rec = R.ToString();
            return Rec;
        }
    }
}
