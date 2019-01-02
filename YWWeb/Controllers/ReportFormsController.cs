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
        #region 用电量报表
        /// <summary>
        /// 用电量报表
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="month"></param>
        /// <returns></returns>
        public JsonResult getPowerQualityData(int pid, string Time, int type)
        {
            List<PowerData_SSQX> list = new List<PowerData_SSQX>();
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
                    string strsql = "select a.RecordTime,a.UsePower Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from  " + tableName + "  a,t_DM_CircuitInfo b where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and a.UsePower is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    if (!string.IsNullOrEmpty(Time))
                    {

                        if (type == 1)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int day = Convert.ToDateTime(Time).Day;
                            strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                        }
                        else if (type == 2)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            strsql += " and  Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "";
                        }
                        else if (type == 3)
                        {
                            //int year = Convert.ToDateTime(Time).Year;
                            strsql += " and  Year(a.RecordTime)='" + Time + "'";
                        }
                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                    var Cname = list.Select(p => new { p.CID, p.CName }).Distinct();

                    return Json(new { list = list.GroupBy(p => p.RecordTime), Rtime = list.Select(p => p.RecordTime).Distinct(), Cname = Cname });

                }
            }
            catch (Exception ex)
            {
                return Json(ex.ToString());
            }

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
        }


        public ActionResult ExportData(int pid, string Time, int type)
        {
            List<PowerData_SSQX> list = new List<PowerData_SSQX>();
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
                    string strsql = "select a.RecordTime,a.Power Aphase,a.CID,b.CName,b.UserType,b.AreaType,b.ItemType from  " + tableName + "  a,t_DM_CircuitInfo b where 1=1 and a.CID IN(" + CIDS + ") and a.CID = b.cid and a.Power is not null";

                    if (!pid.Equals(""))
                    {
                        strsql += " and a.pid=" + pid + " and a.pid=b.pid"; ;
                    }
                    if (!string.IsNullOrEmpty(Time))
                    {

                        if (type == 1)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            int day = Convert.ToDateTime(Time).Day;
                            strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day + 1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                        }
                        else if (type == 2)
                        {
                            int year = Convert.ToDateTime(Time).Year;
                            int month = Convert.ToDateTime(Time).Month;
                            strsql += " and  Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "";
                        }
                        else if (type == 3)
                        {
                            //int year = Convert.ToDateTime(Time).Year;
                            strsql += " and  Year(a.RecordTime)='" + Time + "'";
                        }
                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    list = bll.ExecuteStoreQuery<PowerData_SSQX>(strsql).ToList();
                    return ExportToExcel(list, type);
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public ActionResult ExportToExcel(List<PowerData_SSQX> list, int type)
        {
            var lstTitle = list.Select(p => new { p.CID, p.CName }).Distinct().ToList();
            var listTime = list.Select(p => p.RecordTime).Distinct().ToList();
            var data = list.GroupBy(p => p.RecordTime).ToList();
            var sbHtml = new StringBuilder();
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td>序号</td>");
            sbHtml.Append("<td>日期</td>");
            foreach (var item in lstTitle)
            {
                sbHtml.AppendFormat("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>{0}</td>", item.CID + "号回路" + item.CName);
            }
            sbHtml.Append("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>合计</td>");
            sbHtml.Append("</tr>");
            for (int i = 0; i < listTime.Count(); i++)
            {
                string ss = "";
                if (type == 1)
                {
                    ss = listTime[i].ToString("HH:mm");
                    ss = ss == "00:00" ? "24:" : ss;
                }
                else if (type == 2)
                {
                    ss = listTime[i].ToString("yyyy-MM-dd");
                }
                else if (type == 3)
                {
                    ss = listTime[i].ToString("yyyy-MM");
                }
                decimal sum = 0;
                var itt = 1;
                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td>{0}</td>", i + 1);
                sbHtml.AppendFormat("<td>{0}</td>", ss);
                foreach (var j in data[i])
                {
                    sum += j.Aphase;
                    sbHtml.AppendFormat("<td>{0}</td>", j.Aphase);
                    itt++;
                }
                for (var ittt = itt; ittt <= lstTitle.Count(); ittt++)
                {
                    sbHtml.AppendFormat("<td>{0}</td>", "0");
                }
                sbHtml.AppendFormat("<td>{0}</td>", sum);
                sbHtml.Append("</tr>");
            }
            sbHtml.Append("<tr><td></td><td>最大值</td>");
            foreach (var item in lstTitle)
            {
                var SumcV = list.Where(p => p.CID == item.CID && p.CName == item.CName).Max(p => p.Aphase);

                sbHtml.AppendFormat("<td>{0}</td>", SumcV);
            }
            var group = list.GroupBy(p => p.RecordTime);
            decimal Max = 0;
            foreach (var item in group)
            {
                if (Max < item.Sum(p => p.Aphase))
                {
                    Max = item.Sum(p => p.Aphase);
                }
            }
            sbHtml.AppendFormat("<td>{0}</td>", Max);
            sbHtml.Append("</tr>");
            sbHtml.Append("<tr><td></td><td>小计</td>");
            foreach (var item in lstTitle)
            {
                var SumV = list.Where(p => p.CID == item.CID && p.CName == item.CName).Sum(p => p.Aphase);
                sbHtml.AppendFormat("<td>{0}</td>", SumV);
            }
            sbHtml.AppendFormat("<td>{0}</td>", list.Sum(p => p.Aphase));
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
                        strsql += " and  (Day(a.RecordTime)=" + day + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)!=0 or Day(a.RecordTime)=" + (day+1) + " and Month(a.RecordTime)=" + month + " and Year(a.RecordTime)=" + year + "and DATEPART(hh,RecordTime)=0)";

                    }
                    strsql += "   ORDER BY a.CID,RecordTime";

                    list = bll.ExecuteStoreQuery<V>(strsql).ToList();
                    var Cname = list.Select(p => new { p.CID, p.CName }).Distinct();

                    return Json(new { list = list.GroupBy(p => p.RecordTime),Rtime = list.Select(p => p.RecordTime).Distinct().OrderBy(p=>p), Cname = Cname });

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
        public ActionResult ExportCVData(int pid, int type,string Time)
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
                sbHtml.AppendFormat("<td style='font-size:14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25' colspan='7'>{0}</td>", item.CID + "号回路" + item.CName);
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
                sbHtml.Append("<td>"+ss+"</td>");
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

    }
}
