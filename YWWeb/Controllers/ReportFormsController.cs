using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace YWWeb.Controllers
{
    public class ReportFormsController : Controller
    {
        //
        // GET: /ReportForms/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ElectricityConsumptionRepor()
        {
            return View();
        }
        public ActionResult ElectricityMonthConsumptionRepor()
        {
            return View();
        }
        public ActionResult ElectricityYearConsumptionRepor()
        {
            return View();
        }
        public ActionResult LowVoltageDataRepor()
        {
            return View();
        }
        public ActionResult HighVoltageDataRepor()
        {
            return View();
        }
        public ActionResult DistributionRoomOutLineReport()
        {
            return View();
        }
        public ActionResult BuildingEnergyConReport()
        {
            return View();
        }
        #region 用电量报表
        /// <summary>
        /// 用电量报表
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="month"></param>
        /// <returns></returns>
        public JsonResult getPowerQualityData(int pid, string Time, int type, string itemtype)
        {
            //List<PowerData_SSQX> list = new List<PowerData_SSQX>();
            List<DevC> data = new List<DevC>();
            List<DateTime> times = new List<DateTime>();
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    string tableName = "";
                    string CIDS = "";
                    if (type == 1)
                    {
                        //日
                        tableName = "t_EE_PowerQualityDaily";
                    }
                    else if (type == 2)
                    {
                        //月
                        tableName = "t_EE_PowerQualityMonthly";
                    }
                    else if (type == 3)
                    {
                        //年
                        tableName = "t_EE_PowerQualityYearly";
                    }
                    CIDS = GetcidByPID(type, pid);
                    string strsql = "select a.RecordTime,a.UsePower Aphase,a.CID,b.DID,b.CName,b.UserType,b.AreaType,b.ItemType,c.DeviceName,c.OrderBy from  " + tableName + "  a,t_DM_CircuitInfo b,t_DM_DeviceInfo c where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and b.DID=c.DID and a.UsePower is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid";
                    }
                    if (!string.IsNullOrEmpty(itemtype) && itemtype != "全部")
                    {
                        strsql += " and b.ItemType='" + itemtype + "'";
                    }
                    if (!string.IsNullOrEmpty(Time))
                    {

                        if (type == 1)
                        {

                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int day = Convert.ToDateTime(Time).Day;
                            for (int i = 1; i <= 24; i++)
                            {
                                //if (i == 23)
                                //{
                                //    times.Add(new DateTime(year, month, day).AddDays(1).AddHours(i));
                                //}
                                //else
                                //{
                                times.Add(new DateTime(year, month, day).AddHours(i));
                                //}
                            }
                            strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                        }
                        else if (type == 2)
                        {


                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int days = DateTime.DaysInMonth(year, month);
                            for (int i = 0; i < days; i++)
                            {
                                times.Add(new DateTime(year, month, 1).AddDays(i));
                            }
                            strsql += " and  Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "";
                        }
                        else if (type == 3)
                        {
                            for (int i = 0; i < 12; i++)
                            {
                                times.Add(new DateTime(int.Parse(Time), 1, 1).AddMonths(i));
                            }
                            //int year = Convert.ToDateTime(Time).Year;
                            strsql += " and  Year(a.RecordTime)='" + Time + "'";
                        }
                    }
                    strsql += "   ORDER BY a.CID,RecordTime";
                    var list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                    foreach (var item in list.GroupBy(p => p.DeviceName))
                    {
                        DevC model = new DevC();
                        model.DeviceName = item.Key;
                        foreach (var it in item.GroupBy(p => p.CName))
                        {
                            PowerView mo = new PowerView();
                            mo.Cname = it.Key;
                            for (int i = 0; i < times.Count; i++)
                            {
                                if (type == 1)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day && p.RecordTime.Hour == times[i].Hour).ToList();

                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                                else if (type == 2)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                                else if (type == 3)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                            }
                            model.list_data.Add(mo);
                        }
                        data.Add(model);
                    }
                    //var Cname = list.Select(p => new { p.CID, p.CName }).Distinct();

                    return Json(data);

                }
            }
            catch (Exception ex)
            {
                return Json(ex.ToString());
            }

        }


        public class PowerView
        {
            public PowerView()
            {
                Value = new List<string>();
            }
            public string Cname { get; set; }
            public List<string> Value { get; set; }
        }
        public class DevC
        {
            public DevC()
            {
                list_data = new List<PowerView>();
            }
            public string DeviceName { get; set; }
            public List<PowerView> list_data { get; set; }
        }



        private string GetcidByPID(int type, int pid)
        {
            string cid = "0";
            string typename = string.Empty;
            using (var bll = new pdermsWebEntities())
            {
                if (type == 1)
                {
                    //日
                    typename = "日电量报表";
                }
                else if (type == 2)
                {
                    //月
                    typename = "月电量报表";
                }
                else if (type == 3)
                {
                    //年
                    typename = "年电量报表";
                }
                else if (type == 4)
                {
                    typename = "低压进线回路日报表";
                }
                else if (type == 5)
                {
                    typename = "高压进线回路日报表";
                }
                t_EE_PowerConfigInfo model = bll.t_EE_PowerConfigInfo.Where(p => p.cid_type_name == typename).FirstOrDefault();
                if (model != null)
                {
                    var info = bll.t_EE_PowerReportConfig.Where(p => p.cid_type_id == model.cid_type_id && p.pid == pid).FirstOrDefault();
                    if (info != null)
                    {
                        cid = info.cid;
                    }
                }
            }
            return cid;
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
            public int DID { get; set; }
            public string DeviceName { get; set; }

            public int OrderBy { get; set; }
        }


        public ActionResult ExportData(int pid, string Time, int type, string itemtype)
        {
            List<DevC> data = new List<DevC>();
            List<DateTime> times = new List<DateTime>();
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    string tableName = "";
                    string CIDS = "";
                    if (type == 1)
                    {
                        //日
                        tableName = "t_EE_PowerQualityDaily";
                    }
                    else if (type == 2)
                    {
                        //月
                        tableName = "t_EE_PowerQualityMonthly";
                    }
                    else if (type == 3)
                    {
                        //年
                        tableName = "t_EE_PowerQualityYearly";
                    }
                    CIDS = GetcidByPID(type, pid);
                    string strsql = "select a.RecordTime,a.UsePower Aphase,a.CID,b.DID,b.CName,b.UserType,b.AreaType,b.ItemType,c.DeviceName,c.OrderBy from  " + tableName + "  a,t_DM_CircuitInfo b,t_DM_DeviceInfo c where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and b.DID=c.DID and a.UsePower is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    if (!string.IsNullOrEmpty(itemtype) && itemtype != "全部")
                    {
                        strsql += " and b.ItemType=" + itemtype + "";
                    }
                    if (!string.IsNullOrEmpty(Time))
                    {

                        if (type == 1)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int day = Convert.ToDateTime(Time).Day;
                            for (int i = 1; i <= 24; i++)
                            {
                                times.Add(new DateTime(year, month, day).AddHours(i));
                            }
                            strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                        }
                        else if (type == 2)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int days = DateTime.DaysInMonth(year, month);
                            for (int i = 0; i < days; i++)
                            {
                                times.Add(new DateTime(year, month, 1).AddDays(i));
                            }
                            strsql += " and  Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "";
                        }
                        else if (type == 3)
                        {
                            //int year = Convert.ToDateTime(Time).Year;
                            for (int i = 0; i < 12; i++)
                            {
                                times.Add(new DateTime(int.Parse(Time), 1, 1).AddMonths(i));
                            }
                            strsql += " and  Year(a.RecordTime)='" + Time + "'";
                        }
                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    var list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                    foreach (var item in list.OrderBy(p => p.OrderBy).GroupBy(p => p.DeviceName))
                    {
                        DevC model = new DevC();
                        model.DeviceName = item.Key;
                        foreach (var it in item.OrderBy(p => p.CID).GroupBy(p => p.CName))
                        {
                            PowerView mo = new PowerView();
                            mo.Cname = it.Key;
                            for (int i = 0; i < times.Count; i++)
                            {
                                if (type == 1)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day && p.RecordTime.Hour == times[i].Hour).ToList();
                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                                else if (type == 2)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                                else if (type == 3)
                                {
                                    var s = it.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        mo.Value.Add(Math.Round(s.Sum(p => p.Aphase), 2) + "");
                                    else
                                        mo.Value.Add("");
                                }
                            }
                            model.list_data.Add(mo);
                        }
                        data.Add(model);
                    }
                    return ExportToExcel(data, type, times, list);
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public ActionResult ExportToExcel(List<DevC> list, int type, List<DateTime> times, List<PowerData_SSQX> list_sm)
        {
            //var lstTitle = list.Select(p => new { p.CID, p.CName }).Distinct().ToList();
            //var listTime = list.Select(p => p.RecordTime).Distinct().ToList();
            //var data = list.GroupBy(p => p.RecordTime).ToList();
            var sbHtml = new StringBuilder();
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td>柜号</td>");
            sbHtml.Append("<td>回路名称</td>");
            foreach (var item in times)
            {
                string ss = "";
                if (type == 1)
                {
                    ss = item.ToString("HH:mm");

                }
                else if (type == 2)
                {
                    ss = item.Day + "";
                }
                else if (type == 3)
                {
                    ss = item.Month + "月";
                }
                sbHtml.AppendFormat("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>{0}</td>", ss);
            }
            sbHtml.Append("<td>回路合计</td>");
            sbHtml.Append("</tr>");
            for (int i = 0; i < list.Count; i++)
            {

                decimal cc = list[i].list_data.Count;

                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td rowspan=" + cc + ">{0}</td>", list[i].DeviceName);
                foreach (var item in list[i].list_data)
                {
                    decimal ss = 0;
                    sbHtml.AppendFormat("<td>{0}</td>", item.Cname);
                    foreach (var it in item.Value)
                    {
                        sbHtml.AppendFormat("<td>{0}</td>", it);
                        if (!string.IsNullOrEmpty(it))
                            ss += Convert.ToDecimal(it);
                    }
                    sbHtml.AppendFormat("<td>{0}</td>", ss + "");
                    sbHtml.Append("</tr>");
                }
            }

            sbHtml.Append("<tr>");
            sbHtml.AppendFormat("<td colspan='2' style='text-align:center;'>分时合计</td>");
            decimal sv = 0;
            for (int i = 0; i < times.Count; i++)
            {
                if (type == 1)
                {
                    var s = list_sm.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day && p.RecordTime.Hour == times[i].Hour).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.Aphase), 2) + "");
                    sv += s.Sum(p => p.Aphase);
                }
                else if (type == 2)
                {
                    var s = list_sm.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month && p.RecordTime.Day == times[i].Day).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.Aphase), 2) + "");
                    sv += s.Sum(p => p.Aphase);
                }
                else if (type == 3)
                {
                    var s = list_sm.Where(p => p.RecordTime.Year == times[i].Year && p.RecordTime.Month == times[i].Month).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.Aphase), 2) + "");
                    sv += s.Sum(p => p.Aphase);
                }
            }
            sbHtml.AppendFormat("<td>{0}</td>", Math.Round(sv, 2) + "");
            sbHtml.Append("</tr>");
            sbHtml.Append("</table>");
            string sss = sbHtml.ToString();
            //第一种:使用FileContentResult
            byte[] fileContents = Encoding.UTF8.GetBytes(sbHtml.ToString());
            string fileName = "";
            if (type == 1)
            {
                //日
                fileName = "日报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            else if (type == 2)
            {
                //月
                fileName = "月报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            else if (type == 3)
            {
                //年
                fileName = "年报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            return File(fileContents, "application/ms-excel", fileName + ".xls");
        }
        #endregion

        #region 低压进线回路
        public JsonResult getLowVData(int pid, int type, string Time)
        {
            List<V> list = new List<V>();
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    string CIDS = "";

                    CIDS = GetcidByPID(type, pid);
                    string strsql = "select * from   t_EE_PowerQualityDaily   a,t_DM_CircuitInfo b where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and a.Power is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    if (!string.IsNullOrEmpty(Time))
                    {
                        int year = Convert.ToDateTime(Time).Year;
                        int month = Convert.ToDateTime(Time).Month;
                        int day = Convert.ToDateTime(Time).Day;
                        strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    list = bll.ExecuteStoreQuery<V>(strsql).ToList();
                    var Cname = list.Select(p => new { p.CID, p.CName }).Distinct();

                    return Json(new { list = list.GroupBy(p => p.RecordTime), Rtime = list.Select(p => p.RecordTime).Distinct().OrderBy(p => p), Cname = Cname });

                }
            }
            catch (Exception ex)
            {
                return Json(ex.ToString());
            }

        }
        public class V : t_EE_PowerQualityMonthly
        {
            public string CName { get; set; }
        }
        public ActionResult ExportCVData(int pid, int type, string Time)
        {
            List<V> list = new List<V>();
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    string CIDS = "";

                    CIDS = GetcidByPID(type, pid);
                    string strsql = "select * from   t_EE_PowerQualityDaily   a,t_DM_CircuitInfo b where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and a.Power is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }

                    if (!string.IsNullOrEmpty(Time))
                    {
                        int year = Convert.ToDateTime(Time).Year;
                        int month = Convert.ToDateTime(Time).Month;
                        int day = Convert.ToDateTime(Time).Day;
                        strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    list = bll.ExecuteStoreQuery<V>(strsql).ToList();
                    return ExportCVToExcel(list, type);
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public ActionResult ExportCVToExcel(List<V> list, int type)
        {
            var lstTitle = list.Select(p => new { p.CID, p.CName }).Distinct().ToList();
            var listTime = list.Select(p => p.RecordTime).Distinct().ToList();
            var data = list.GroupBy(p => p.RecordTime).ToList();
            var sbHtml = new StringBuilder();
            string[] obj = { "电流(A)", "电压(V)", "功率" };
            string[] obj1 = { "IA", "IB", "IC", "UAB", "UBC", "UCA", "P" };
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td colspan='2' style='font-size:14px;text-align:center;background-color: #DCE0E2; font-weight:bold;'>回路名称</td>");
            foreach (var item in lstTitle)
            {
                sbHtml.AppendFormat("<td style='font-size:14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25' colspan='7'>{0}</td>", item.CName);
            }
            sbHtml.Append("</tr>");
            sbHtml.Append("<tr>");
            sbHtml.AppendFormat(" <td rowspan='2'  style='background-color:#051b39;color:white'>序号</td><td rowspan='2' style='background-color:#051b39;color:white'>{0}</td>", "时间");
            foreach (var item in lstTitle)
            {
                for (int i = 0; i < obj.Length; i++)
                {
                    if (i != 2)
                    {
                        sbHtml.AppendFormat("<td colspan='3'  style='background-color:#051b39;color:white '>{0}</td>", obj[i]);

                    }
                    else
                    {
                        sbHtml.AppendFormat("<td style='background-color:#051b39;color:white '>{0}</td>", obj[i]);
                    }
                }
            }
            sbHtml.Append("</tr>");
            sbHtml.Append("<tr>");
            foreach (var item in lstTitle)
            {
                for (int i = 0; i < obj1.Length; i++)
                {


                    sbHtml.AppendFormat("<td style='background-color:#909193;color:white '>{0}</td>", obj1[i]);

                }
            }
            for (int i = 0; i < listTime.Count(); i++)
            {
                string ss = "";
                DateTime d = Convert.ToDateTime(listTime[i]);
                ss = d.ToString("HH:mm");
                ss = ss == "00:00" ? "24:" : ss;


                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td>{0}</td>", i + 1);
                sbHtml.Append("<td>" + ss + "</td>");
                foreach (var j in data[i])
                {
                    sbHtml.AppendFormat("<td>{0}</td>", j.ACurrent);
                    sbHtml.AppendFormat("<td>{0}</td>", j.BCurrent);
                    sbHtml.AppendFormat("<td>{0}</td>", j.CCurrent);
                    sbHtml.AppendFormat("<td>{0}</td>", j.AVoltage);
                    sbHtml.AppendFormat("<td>{0}</td>", j.BVoltage);
                    sbHtml.AppendFormat("<td>{0}</td>", j.CVoltage);
                    sbHtml.AppendFormat("<td>{0}</td>", j.Power);
                }

                sbHtml.Append("</tr>");
            }
            sbHtml.Append("</table>");
            string sss = sbHtml.ToString();
            //第一种:使用FileContentResult
            byte[] fileContents = Encoding.UTF8.GetBytes(sbHtml.ToString());
            string fileName = "";
            if (type == 4)
            {
                //日
                fileName = "低压进线回路日报表" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            else if (type == 5)
            {
                //月
                fileName = "高压进线回路日报表" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            return File(fileContents, "application/ms-excel", fileName + ".xls");
        }
        #endregion

        #region 能源统计报表
        public ActionResult GetItemFrom(string itemids, string areaids, int uid, string time, string lables, int type)
        {
            List<RetnView> list_item = new List<RetnView>();
            List<RetnView> list_area = new List<RetnView>();
            List<DateTime> times = new List<DateTime>();
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    if (type == 1)
                    {
                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);
                        int year = Convert.ToDateTime(time).Year;
                        int month = Convert.ToDateTime(time).Month;
                        int day = Convert.ToDateTime(time).Day;
                        for (int i = 1; i <= 24; i++)
                        {
                            times.Add(new DateTime(year, month, day).AddHours(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityDaily a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(10),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM-dd") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";

                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityDaily a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(10),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM-dd") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }
                    }
                    else if (type == 2)
                    {
                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);
                        int year = Convert.ToDateTime(time).Year;
                        int month = Convert.ToDateTime(time).Month;
                        int days = DateTime.DaysInMonth(year, month);
                        for (int i = 0; i < days; i++)
                        {
                            times.Add(new DateTime(year, month, 1).AddDays(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityMonthly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(7),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";

                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityMonthly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(7),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";

                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }

                    }
                    else if (type == 3)
                    {


                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);

                        for (int i = 0; i < 12; i++)
                        {
                            times.Add(new DateTime(int.Parse(time), 1, 1).AddMonths(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityYearly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(4),RecordTime, 120)='" + time + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";

                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityYearly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(4),RecordTime, 120)='" + time + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";

                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }


                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(new { list_item, list_area }, JsonRequestBehavior.AllowGet);
        }

        public class Ev : t_EE_PowerQualityDaily
        {
            public string Label { get; set; }
        }
        public class EnView
        {
            public string Name { get; set; }
            public string addCid { get; set; }
            public int child_id { get; set; }
        }

        public class RetnView
        {
            public RetnView()
            {
                Value = new List<string>();
            }
            public string name { get; set; }
            public string Label { get; set; }
            public List<string> Value { get; set; }
        }
        public Dictionary<int, string> GetCId(string stringCid)
        {

            Dictionary<int, string> data = new Dictionary<int, string>();
            try
            {
                string cids = string.Empty;
                string pids = string.Empty;
                if (!string.IsNullOrEmpty(stringCid))
                {
                    if (!string.IsNullOrEmpty(stringCid.Trim()))
                    {
                        var s = stringCid.Split(',');
                        foreach (var i in s)
                        {
                            var x = i.Split('-');
                            List<string> cidList = new List<string>();
                            if (data.Keys.Contains(Convert.ToInt32(x[0])))
                            {
                                data[Convert.ToInt32(x[0])] = data[Convert.ToInt32(x[0])] + "," + x[1];
                            }
                            else
                            {
                                data.Add(Convert.ToInt32(x[0]), x[1]);
                            }
                        }
                    }
                }
                return data;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        private string FindNode(int uid, int depid, string Name)
        {
            var bll = new pdermsWebEntities();
            string sql = "select a.Name,b.child_id,b.parent_id from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id = b.child_id where b.child_id =" + depid;
            var m = bll.ExecuteStoreQuery<xxx>(sql).FirstOrDefault();
            if (m != null)
            {
                if (m.parent_id != 0)
                {
                    Name += m.Name + ">";
                    Name = FindNode(uid, m.parent_id, Name);
                }
                else
                {
                    Name += m.Name;
                }

            }
            return Name;
        }

        private string getStrOrderBy(string str)
        {
            string s = "";
            if (!string.IsNullOrEmpty(str))
            {
                List<string> list = new List<string>();
                list = str.Split('>').ToList();
                list.Reverse();
                foreach (var item in list)
                {
                    s += item + " > ";
                }
                s = s.Trim().TrimEnd('>');
            }
            return s;
        }
        public class xxx
        {
            public string Name { get; set; }
            public int child_id { get; set; }
            public int parent_id { get; set; }
        }


        public ActionResult GetLabelList(int uid)
        {
            try
            {
                var bll = new pdermsWebEntities();
                var unit=  bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault();
                if (unit != null)
                {
                    string sql = "select * from t_DM_CircuitInfo WHERE Label is not NULL and Label!=''";
                    if(!string.IsNullOrEmpty(unit.PDRList))
                    {
                        sql += " AND PID IN(" + unit.PDRList + ")";
                    }
                    var list = bll.ExecuteStoreQuery<t_DM_CircuitInfo>(sql).ToList();
                    List<string> LableList = new List<string>();
                    string LableStr = "";
                    foreach (var item in list)
                    {
                        if (!string.IsNullOrEmpty(item.Label) && item.Label.Trim() != "")
                            LableStr += item.Label + ",";
                    }
                    if (LableStr != "")
                        LableList = LableStr.Trim(',').Split(',').ToList().Distinct().ToList();

                    var m = from n in LableList
                            select new
                    {
                        Label = n
                    };
                    return Json(m, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("No Data", JsonRequestBehavior.AllowGet);
                }
            }catch(Exception ex)
            {
                throw ex;
            }
        }


        public ActionResult GetExtItemFrom(string itemids, string areaids, int uid, string time, string lables, int type)
        {
            List<RetnView> list_item = new List<RetnView>();
            List<RetnView> list_area = new List<RetnView>();
            List<DateTime> times = new List<DateTime>();
            List<Ev> listDataItem = new List<Ev>();
            List<Ev> listDataArea = new List<Ev>();
            string UnitName = "";
            try
            {
                using (var bll = new pdermsWebEntities())
                {
                    var unit = bll.t_CM_Unit.Where(p => p.UnitID == uid).FirstOrDefault();
                    if (unit != null)
                         UnitName = unit.UnitName;
                    if (type == 1)
                    {
                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);
                        int year = Convert.ToDateTime(time).Year;
                        int month = Convert.ToDateTime(time).Month;
                        int day = Convert.ToDateTime(time).Day;
                        for (int i = 1; i <= 24; i++)
                        {
                            times.Add(new DateTime(year, month, day).AddHours(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityDaily a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(10),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM-dd") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataItem.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);

                                
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityDaily a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(10),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM-dd") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var  listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataArea.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }


                    }
                    else if (type == 2)
                    {
                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);
                        int year = Convert.ToDateTime(time).Year;
                        int month = Convert.ToDateTime(time).Month;
                        int days = DateTime.DaysInMonth(year, month);
                        for (int i = 0; i < days; i++)
                        {
                            times.Add(new DateTime(year, month, 1).AddDays(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityMonthly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(7),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataItem.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityMonthly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(7),RecordTime, 120)='" + Convert.ToDateTime(time).ToString("yyyy-MM") + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataArea.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }

                    }
                    else if (type == 3)
                    {


                        string sql = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=1 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(itemids))
                            sql += " AND b.child_id IN(" + itemids + ")";
                        var ItemData = bll.ExecuteStoreQuery<EnView>(sql);

                        for (int i = 0; i < 12; i++)
                        {
                            times.Add(new DateTime(int.Parse(time), 1, 1).AddMonths(i));
                        }
                        foreach (var item in ItemData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityYearly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(4),RecordTime, 120)='" + time + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += " and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataItem.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_item.Add(model);
                            }
                        }


                        string sql_area = "select a.Name,b.child_id,b.addCid from t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id=b.child_id where a.item_type=2 and unit_id=" + uid;
                        if (!string.IsNullOrEmpty(areaids))
                            sql_area += " AND b.child_id IN(" + areaids + ")";
                        var AreaData = bll.ExecuteStoreQuery<EnView>(sql_area);
                        foreach (var item in AreaData)
                        {
                            if (item.addCid != null && !string.IsNullOrEmpty(item.addCid))
                            {
                                Dictionary<int, string> cpids = GetCId(item.addCid);
                                string sqlD = "select a.*,b.Label from t_EE_PowerQualityYearly a join t_DM_CircuitInfo b on (a.CID=b.CID and a.PID=b.PID) where 1=1 and UsePower!=0 and UsePower is not null";
                                if (!string.IsNullOrEmpty(time))
                                    sqlD += " and CONVERT(varchar(4),RecordTime, 120)='" + time + "'";
                                int index = 0;
                                foreach (var cp in cpids)
                                {
                                    if (index == 0)
                                        sqlD += "  and ((a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";
                                    else
                                        sqlD += " or (a.PID=" + cp.Key + " AND a.CID IN(" + cp.Value + "))";

                                    if (index + 1 == cpids.Count)
                                        sqlD += ")";
                                    index++;
                                }
                                if (!string.IsNullOrEmpty(lables))
                                {
                                    var lalist = lables.Split(',').ToList();
                                    for (int i = 0; i < lalist.Count; i++)
                                    {
                                        if (i == 0)
                                        {
                                            sqlD += " and ((b.Label='" + lalist[i] + "')";
                                        }
                                        else
                                        {
                                            sqlD += " or (b.Label='" + lalist[i] + "')";
                                        }
                                        if (i == lalist.Count - 1)
                                            sqlD += ")";
                                    }
                                }
                                var listData = bll.ExecuteStoreQuery<Ev>(sqlD).ToList();
                                listDataArea.AddRange(listData);
                                var labless = listData.Select(p => p.Label).Distinct().ToList();
                                string ll = "";
                                foreach (var xxx in labless)
                                {
                                    if (!string.IsNullOrEmpty(xxx))
                                        ll += xxx + "、";
                                }
                                if (ll != "")
                                    ll = ll.TrimEnd('、');
                                RetnView model = new RetnView();
                                model.name = getStrOrderBy(FindNode(uid, item.child_id, ""));
                                model.Label = ll;
                                for (int i = 0; i < times.Count; i++)
                                {
                                    var s = listData.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                                    if (s.Count != 0)
                                        model.Value.Add(Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                                    else
                                        model.Value.Add("");
                                }
                                list_area.Add(model);
                            }
                        }
                    }
                }
               return  ExportEneryToExcel(list_item, times, type, listDataItem, list_area, listDataArea, UnitName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //return Json(new { list_item, list_area }, JsonRequestBehavior.AllowGet);
        }



        public ActionResult ExportEneryToExcel(List<RetnView> list_item, List<DateTime> times, int type,List<Ev> list_sm,List<RetnView> list_area,List<Ev> list_ar,string UnitName)
        {
            //var lstTitle = list.Select(p => new { p.CID, p.CName }).Distinct().ToList();
            //var listTime = list.Select(p => p.RecordTime).Distinct().ToList();
            //var data = list.GroupBy(p => p.RecordTime).ToList();
            var sbHtml = new StringBuilder();
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            string timeText = "";
            if (type == 1)
            {
                timeText = times[1].ToString("yyyy-MM-dd");
            }
            else if(type==2)
            {
                timeText= times[1].ToString("yyyy-MM");
            }
            else if (type==3)
            {
                timeText = Convert.ToDateTime(times[1]).Year + "";
            }

            sbHtml.AppendFormat("<tr><td style='text-align:center;font-weight:bold;font-size:18px;border-bottom:0px;' colspan='" + (4 + times.Count) + "'>{0}<br>{1}</td></tr>", timeText + "建筑能耗分项报表", UnitName);
            
            sbHtml.Append("<tr>");
            sbHtml.Append("<td>ID</td>");
            sbHtml.Append("<td>名称</td>");
            sbHtml.Append("<td>标签</td>");
            foreach (var item in times)
            {
                string ss = "";
                if (type == 1)
                {
                    ss = item.ToString("HH:mm");

                }
                else if (type == 2)
                {
                    ss = item.Day + "";
                }
                else if (type == 3)
                {
                    ss = item.Month + "月";
                }
                sbHtml.AppendFormat("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>{0}</td>", ss);
            }
            sbHtml.Append("<td>合计</td>");
            sbHtml.Append("</tr>");
            for (int i = 0; i < list_item.Count; i++)
            {

                //decimal cc = list[i].list_data.Count;

                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td>{0}</td>", i + 1);
                sbHtml.AppendFormat("<td>{0}</td>", list_item[i].name);

                sbHtml.AppendFormat("<td>{0}</td>", list_item[i].Label);
                foreach (var item in list_item[i].Value)
                {
                    var Item = ((item == null || item == "") ? "--" : item);
                    sbHtml.AppendFormat("<td style='text-align:center;'>{0}</td>", Item);
                }
                sbHtml.AppendFormat("<td>{0}</td>", list_item[i].Value.Where(p => p != "" && p != null).Sum(p => Convert.ToDecimal(p)));
                sbHtml.Append("</tr>");
            }

            sbHtml.Append("<tr>");
            sbHtml.AppendFormat("<td colspan='3' style='text-align:center;'>分时合计</td>");
            decimal sv = 0;
            for (int i = 0; i < times.Count; i++)
            {
                if (type == 1)
                {
                    var s = list_sm.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    sv += s.Sum(p => p.UsePower.Value);
                }
                else if (type == 2)
                {
                    var s = list_sm.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    sv += s.Sum(p => p.UsePower.Value);
                }
                else if (type == 3)
                {
                    var s = list_sm.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    sv += s.Sum(p => p.UsePower.Value);
                }
            }
            sbHtml.AppendFormat("<td>{0}</td>", Math.Round(sv, 2) + "");
            sbHtml.Append("</tr>");
            sbHtml.Append("</table>");
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            sbHtml.AppendFormat("<tr><td style='text-align:center;font-weight:bold;font-size:18px;border-bottom:0px;' colspan='" + (4 + times.Count) + "'>{0}<br>{1}</td></tr>", timeText + "建筑能耗区域报表", UnitName);
            sbHtml.Append("<tr>");
            sbHtml.Append("<td>ID</td>");
            sbHtml.Append("<td>名称</td>");
            sbHtml.Append("<td>标签</td>");
            foreach (var item in times)
            {
                string ss = "";
                if (type == 1)
                {
                    ss = item.ToString("HH:mm");

                }
                else if (type == 2)
                {
                    ss = item.Day + "";
                }
                else if (type == 3)
                {
                    ss = item.Month + "月";
                }
                sbHtml.AppendFormat("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>{0}</td>", ss);
            }
            sbHtml.Append("<td>合计</td>");
            sbHtml.Append("</tr>");
            for (int i = 0; i < list_area.Count; i++)
            {
                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td>{0}</td>", i + 1);
                sbHtml.AppendFormat("<td>{0}</td>", list_area[i].name);

                sbHtml.AppendFormat("<td>{0}</td>", list_area[i].Label);
                foreach (var item in list_area[i].Value)
                {
                    var Item = ((item == null || item == "") ? "--" : item);
                    sbHtml.AppendFormat("<td style='text-align:center;'>{0}</td>", Item);
                }
                sbHtml.AppendFormat("<td>{0}</td>", list_area[i].Value.Where(p=>p!=""&&p!=null).Sum(p => Convert.ToDecimal(p)));
                sbHtml.Append("</tr>");
            }

            sbHtml.Append("<tr>");
            sbHtml.AppendFormat("<td colspan='3' style='text-align:center;'>分时合计</td>");
            decimal svv = 0;
            for (int i = 0; i < times.Count; i++)
            {
                if (type == 1)
                {
                    var s = list_ar.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day && p.RecordTime.Value.Hour == times[i].Hour).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    svv += s.Sum(p => p.UsePower.Value);
                }
                else if (type == 2)
                {
                    var s = list_ar.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month && p.RecordTime.Value.Day == times[i].Day).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    svv += s.Sum(p => p.UsePower.Value);
                }
                else if (type == 3)
                {
                    var s = list_ar.Where(p => p.RecordTime.Value.Year == times[i].Year && p.RecordTime.Value.Month == times[i].Month).ToList();
                    sbHtml.AppendFormat("<td>{0}</td>", Math.Round(s.Sum(p => p.UsePower.Value), 2) + "");
                    svv += s.Sum(p => p.UsePower.Value);
                }
            }
            sbHtml.AppendFormat("<td>{0}</td>", Math.Round(svv, 2) + "");
            sbHtml.Append("</tr>");
            sbHtml.Append("</table>");


            string sss = sbHtml.ToString();
            //第一种:使用FileContentResult
            byte[] fileContents = Encoding.UTF8.GetBytes(sbHtml.ToString());
            string fileName = "";
            if (type == 1)
            {
                //日
                fileName = "日报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            else if (type == 2)
            {
                //月
                fileName = "月报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            else if (type == 3)
            {
                //年
                fileName = "年报表数据" + DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            return File(fileContents, "application/ms-excel", fileName + ".xls");
        }
        #endregion

    }
}
